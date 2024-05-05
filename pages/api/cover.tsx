import { ImageResponse } from "@vercel/og";
import * as d3 from "d3-scale-chromatic";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

// constants
const height = 500;
const width = 1000;
const color = (i: number) => d3.interpolateSinebow(i);
const radius = 7;
const num = 100;

function ChartComponent({
  seed,
  background,
}: {
  seed: number;
  background: string;
}) {
  const peaks = seed;
  const sinHeight = (2 * height) / peaks;

  const exponential = (i: number, h: number) => {
    if (h == 0) return 0;
    const b = (Math.pow(h, 2) - Math.pow(width, 2)) / (2 * Math.abs(h));
    const v = (-1 * h) / Math.abs(h);

    return (
      v * (b + Math.sqrt(Math.pow(width, 2) + Math.pow(b, 2) - Math.pow(i, 2)))
    );
  };
  const sinusoid = (i: number, h: number) => {
    return (sinHeight * Math.cos((peaks * Math.PI * 2 * i) / width)) / 5;
  };

  const circles: Array<[number, number, number, string]> = [];

  for (let h = -1 * height; h < height; h = h + 2 * radius) {
    for (let i = 0; i < num; i++) {
      const x = width * ((i - num / 2) / (num / 2));

      const pointHeight = sinusoid(x, h) + exponential(x, h);

      circles.push([x, pointHeight, radius, color(Math.abs(h / height))]);
    }
  }

  const widthPadded = radius + width;
  const heightPadded = radius + height;

  const vBox = [
    -1 * widthPadded,
    -1 * heightPadded,
    2 * widthPadded,
    2 * heightPadded,
  ].join(" ");

  return (
    <div
      style={{
        display: "flex",
        fontSize: 40,
        color: "black",
        background,
        width: "100%",
        height: "100%",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg width={widthPadded} height={heightPadded} viewBox={vBox}>
        {circles.map((c, i) => (
          <circle key={i} cx={c[0]} cy={c[1]} r={c[2]} fill={c[3]}></circle>
        ))}
      </svg>
    </div>
  );
}

export default function (req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const seed = parseInt(searchParams.get("seed") ?? "2");
  const background = searchParams.get("background") ?? "black";

  return new ImageResponse(
    <ChartComponent seed={seed} background={background} />,
    {
      width: width + 100,
      height: height + 100 * (height / width),
    }
  );
}
