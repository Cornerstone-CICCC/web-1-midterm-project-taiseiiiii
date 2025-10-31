"use client";

import { useEffect, useRef } from "react";

interface TrailPosition {
  x: number;
  y: number;
}

interface CursorTrailProps {
  count?: number;
  speed?: number;
  size?: number;
  color?: string;
  maxOpacity?: number;
}

export default function CursorTrail({
  count = 3,
  speed = 0.15,
  size = 8,
  color = "var(--neon-cyan)",
  maxOpacity = 0.3,
}: CursorTrailProps) {
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const trailPositions = useRef<TrailPosition[]>(
    Array.from({ length: count }, () => ({ x: 0, y: 0 }))
  );

  useEffect(() => {
    // set a initial position out of view port
    trailPositions.current = Array.from({ length: count }, () => ({
      x: -100,
      y: -100,
    }));

    // track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // animation loop
    const animate = () => {
      // initial trail: tarck mouse
      trailPositions.current[0].x +=
        (mouseRef.current.x - trailPositions.current[0].x) * speed;
      trailPositions.current[0].y +=
        (mouseRef.current.y - trailPositions.current[0].y) * speed;

      // remain trail: track previous trail
      for (let i = 1; i < count; i++) {
        trailPositions.current[i].x +=
          (trailPositions.current[i - 1].x - trailPositions.current[i].x) *
          speed;
        trailPositions.current[i].y +=
          (trailPositions.current[i - 1].y - trailPositions.current[i].y) *
          speed;
      }

      // update each trail's position and transparent
      trailRefs.current.forEach((trail, i) => {
        if (trail) {
          trail.style.left = trailPositions.current[i].x + "px";
          trail.style.top = trailPositions.current[i].y + "px";
          trail.style.opacity = `${maxOpacity - (i * maxOpacity) / count}`;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [count, speed, maxOpacity]);

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          style={{
            position: "fixed",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}, transparent)`,
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 0,
            transition: "opacity 0.3s",
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
