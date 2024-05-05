import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/carousel.module.css";

export default function BootstrapCarousel({
  children,
}: {
  children: Array<{ title: string; item: JSX.Element }>;
}) {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} variant="dark">
      {children.map((c, index) => (
        <Carousel.Item key={index} className={styles.itemP} interval={4000}>
          {c.item}
          <Carousel.Caption>
            <div className={styles.caption}>
              <h1>
                <i>{c.title}</i>
              </h1>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
