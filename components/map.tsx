import * as d3 from "d3";
import { Chance } from "chance";
import { useEffect, useRef, useState } from "react";

type Link = {
  head: number;
  tail: number;
  color?: string;
};
type Props = {
  n: number;
  seed: number;
  sideLength: number;
  showControls?: boolean;
  subway?: boolean;
};

type Node = {
  x: number;
  y: number;
  r: number;
};

type Graph = Array<Set<number>>;

function colorGraph(source: number, graph: Graph): Array<string> {
  const queue: Array<[number, number]> = [[source, 0]];

  const dist = Array.from<undefined | number>({
    length: graph.length,
  }).fill(undefined);

  dist[source] = 0;

  let maxDistance = 0;

  while (queue.length > 0) {
    const [curr, distance] = queue.shift()!;

    maxDistance = Math.max(maxDistance, distance);

    for (const n of graph[curr]) {
      if (dist[n] == undefined) {
        dist[n] = distance + 1;
        queue.push([n, distance + 1]);
      }
    }
  }

  const colorInterpolator = d3
    .scaleSequential(d3.interpolateRgbBasis(["green", "yellow", "red"]))
    .domain([0, maxDistance]);

  return dist.map((r) =>
    r == undefined ? colorInterpolator(maxDistance) : colorInterpolator(r)
  );
}

function randomSubway(seed: number, nodes: number, origin = 0): Array<Link> {
  const upperBound = nodes * nodes - 1;

  const chance = new Chance(seed);

  let start = origin;
  const ret: Array<Link> = [];

  while (start < upperBound) {
    const [oldRow, oldCol] = [Math.floor(start / nodes), start % nodes];

    const newRow = Math.max(
      0,
      Math.min(nodes - 1, oldRow + chance.integer({ min: -4, max: 10 }))
    );
    const newCol = Math.max(
      0,
      Math.min(nodes - 1, oldCol + chance.integer({ min: -4, max: 10 }))
    );

    const newStart = newRow * nodes + newCol;

    ret.push({
      head: start,
      tail: newStart,
    });

    start = newStart;
  }

  return ret;
}

function Map(props: Props) {
  const [numberOfNodes, setNumberOfNodes] = useState(props.n);
  const [seed, setSeed] = useState(props.seed);

  const nodes: Array<Node> = [];
  const links: Array<Link> = [];

  const radius = props.sideLength / numberOfNodes + 1;
  const spacing = props.sideLength / numberOfNodes;

  const rowColToIndex = (row: number, col: number): number => {
    return row * numberOfNodes + col;
  };

  for (let row = 0; row < numberOfNodes; row++) {
    for (let col = 0; col < numberOfNodes; col++) {
      nodes.push({
        y: row * spacing,
        x: col * spacing,
        r: radius,
      });

      if (row - 1 >= 0) {
        links.push({
          head: rowColToIndex(row - 1, col),
          tail: rowColToIndex(row, col),
        });
      }

      if (col - 1 >= 0) {
        links.push({
          head: rowColToIndex(row, col - 1),
          tail: rowColToIndex(row, col),
        });
      }
    }
  }

  const edgeList = Array.from({ length: nodes.length }).map(
    () => new Set<number>()
  );

  const subwayLinks: Array<Link> = props.subway
    ? randomSubway(seed, numberOfNodes)
    : [];

  const allEdges = subwayLinks.concat(links);

  for (const link of allEdges) {
    edgeList[link.head].add(link.tail);
    edgeList[link.tail].add(link.head);
  }

  const nodeColors = colorGraph(0, edgeList);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx != null) {
      ctx.clearRect(0, 0, props.sideLength, props.sideLength);
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        const color = nodeColors[i];

        ctx.beginPath();
        ctx.fillStyle = color;

        ctx.fillRect(node.x, node.y, node.r, node.r);
        ctx.stroke();
      }

      const centering = radius / 2;
      for (let i = 0; i < subwayLinks.length; i += 1) {
        const link = subwayLinks[i];

        ctx.beginPath();
        ctx.moveTo(
          nodes[link.head].x + centering,
          nodes[link.head].y + centering
        );
        ctx.lineTo(
          nodes[link.tail].x + centering,
          nodes[link.tail].y + centering
        );
        ctx.lineWidth = 4;
        ctx.strokeStyle = "red";
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.arc(
          nodes[link.tail].x + centering,
          nodes[link.tail].y + centering,
          radius / 4,
          0,
          360
        );
        ctx.stroke();
      }
    }
  }, [numberOfNodes, seed, props.sideLength]);

  const buttonStyles =
    "px-4 py-2 text-sm font-medium text-white bg-black border border-gray-200 hover:bg-gray-100 hover:text-sky-400";

  return (
    <div>
      {props.showControls && (
        <>
          <div className="flex place-content-center w-full">
            <button
              type="button"
              className={
                "flex flex-row items-center justify-start " + buttonStyles
              }
              onClick={() => setSeed(Math.random() * 1000)}
            >
              RANDOMIZE SUBWAY
            </button>
          </div>
          <div
            className="flex items-center justify-center w-full py-2"
            role="group"
          >
            <button
              type="button"
              className={
                "flex flex-row items-center justify-end " + buttonStyles
              }
              onClick={() => setNumberOfNodes((n) => Math.max(5, n - 1))}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                className="w-4 h-4 mr-2 fill-current"
                viewBox="-10 -10 120 120"
              >
                <polygon
                  fill="white"
                  stroke="white"
                  strokeWidth={20}
                  strokeLinejoin="round"
                  points="0,50 100,0 100,100"
                />
              </svg>
              DECR
            </button>
            <button
              type="button"
              className={
                "flex flex-row items-center justify-start " + buttonStyles
              }
              onClick={() => setNumberOfNodes((n) => n + 1)}
            >
              INCR
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                className="w-4 h-4 ml-2 fill-current"
                viewBox="-10 -10 120 120"
              >
                <polygon
                  fill="white"
                  stroke="white"
                  strokeWidth={20}
                  strokeLinejoin="round"
                  points="100,50 0,100 0,0"
                />
              </svg>
            </button>
          </div>
        </>
      )}
      <canvas
        ref={canvasRef}
        width={props.sideLength}
        height={props.sideLength}
        style={{ border: "1px solid #000000" }}
      ></canvas>
    </div>
  );
}

export default Map;
