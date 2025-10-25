"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ========================================
// Types
// ========================================
// interface Particle {
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   color: { r: number; g: number; b: number };
//   size: number;
//   life: number;
//   targetX?: number;
//   targetY?: number;
//   initialSize: number;
//   initialLife: number;
// }

interface LoadingDot {
  x: number;
  y: number;
  showAt: number;
}

type AnimationState =
  | "walking"
  | "falling"
  | "spilled"
  | "held"
  | "exploding"
  | "fadeout";

type SpriteFrame = 0 | 1 | 2 | 3;

// ========================================
// Constants
// ========================================
const ANIMATION_CONFIG = {
  // Canvas
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  CANVAS_CENTER_X: 400,

  // Character
  CHAR_START_X: 100,
  TRAVEL_DISTANCE: 480,

  // Text
  BASELINE_Y: 300,
  TEXT_HEIGHT: 80,
  TEXT_START_X: 206.25,
  DOT_SPACING_X: 12.5,
  DOT_SPACING_Y: 10,
  DOT_SIZE: 8,

  // Timing (frames)
  SPRITE_FRAME_DURATION: 6,
  FALL_DURATION: 10,
  FALL_WAIT: 6,
  SCATTER_DURATION: 5,
  GATHER_DURATION: 110,
  HELD_DURATION: 30,
  FLICKER_START: 10,
  FLICKER_END: 20,
  EXPLODE_DURATION: 90,
  FADEOUT_START: 80,
  FADEOUT_DURATION: 600,

  // Particles
  PARTICLE_COUNT: 60,
  PARTICLE_MIN_SIZE: 2,
  PARTICLE_MAX_SIZE: 6,
  PARTICLE_MIN_SPEED: 8,
  PARTICLE_MAX_SPEED: 15,
  GRAVITY: 0.3,
  BOUNCE_DAMPING: 0.4,
  VELOCITY_DAMPING: 0.98,
  ATTRACTION_FORCE: 0.015,
  GATHER_DAMPING: 0.8,
  FLICKER_SIZE_BOOST: 2,
  FLICKER_LIFE_BOOST: 0.5,

  // Colors
  COLORS: {
    CYAN: { r: 0, g: 246, b: 255 },
    PINK: { r: 255, g: 108, b: 251 },
  },
} as const;

const LETTER_PATTERNS: Record<string, number[][]> = {
  L: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
  ],
  O: [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 0],
    [1, 4],
    [2, 0],
    [2, 4],
    [3, 1],
    [3, 2],
    [3, 3],
  ],
  A: [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 2],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
  ],
  D: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 0],
    [1, 4],
    [2, 0],
    [2, 4],
    [3, 1],
    [3, 2],
    [3, 3],
  ],
  I: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ],
  N: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 1],
    [2, 2],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
  ],
  G: [
    [1, 0],
    [2, 0],
    [3, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 4],
    [2, 4],
    [3, 4],
    [3, 2],
    [3, 3],
    [2, 2],
  ],
} as const;

const WORD = ["L", "O", "A", "D", "I", "N", "G"] as const;
const LETTER_WIDTHS = [4, 4, 4, 4, 1, 4, 4] as const;

// ========================================
// Helper Functions
// ========================================
function generateLoadingDots(): LoadingDot[] {
  const dots: LoadingDot[] = [];
  let xOffset = 0;

  const totalGridWidth =
    LETTER_WIDTHS.reduce((sum, width) => sum + width + 1, 0) - 1;

  WORD.forEach((letter, letterIndex) => {
    const pattern = LETTER_PATTERNS[letter];
    pattern.forEach(([x, y]) => {
      const dotX =
        ANIMATION_CONFIG.TEXT_START_X +
        (xOffset + x) * ANIMATION_CONFIG.DOT_SPACING_X;
      const dotY =
        ANIMATION_CONFIG.BASELINE_Y -
        ANIMATION_CONFIG.TEXT_HEIGHT +
        y * ANIMATION_CONFIG.DOT_SPACING_Y;

      const progressRatio = (xOffset + x) / totalGridWidth;
      const showAtValue = Math.min(
        ANIMATION_CONFIG.TRAVEL_DISTANCE,
        Math.floor(progressRatio * ANIMATION_CONFIG.TRAVEL_DISTANCE)
      );

      dots.push({ x: dotX, y: dotY, showAt: showAtValue });
    });
    xOffset += LETTER_WIDTHS[letterIndex] + 1;
  });

  return dots;
}

// function createParticles(charX: number): Particle[] {
//   const particles: Particle[] = [];
//   const colors = [ANIMATION_CONFIG.COLORS.CYAN, ANIMATION_CONFIG.COLORS.PINK];

//   for (let i = 0; i < ANIMATION_CONFIG.PARTICLE_COUNT; i++) {
//     const angle = Math.random() * Math.PI * 2;
//     const speed =
//       Math.random() *
//         (ANIMATION_CONFIG.PARTICLE_MAX_SPEED -
//           ANIMATION_CONFIG.PARTICLE_MIN_SPEED) +
//       ANIMATION_CONFIG.PARTICLE_MIN_SPEED;
//     const color = colors[i % 2];
//     const size =
//       Math.random() *
//         (ANIMATION_CONFIG.PARTICLE_MAX_SIZE -
//           ANIMATION_CONFIG.PARTICLE_MIN_SIZE) +
//       ANIMATION_CONFIG.PARTICLE_MIN_SIZE;

//     particles.push({
//       x: charX,
//       y: ANIMATION_CONFIG.BASELINE_Y,
//       vx: Math.cos(angle) * speed,
//       vy: Math.sin(angle) * speed - Math.random() * 5 - 3,
//       color,
//       size,
//       life: 1,
//       initialSize: size,
//       initialLife: 1,
//     });
//   }

//   return particles;
// }

const CHAR_FALL_OFFSET = 200;

// ========================================
// Main Component
// ========================================
export default function LoadingAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const [animationState, setAnimationState] =
    useState<AnimationState>("walking");
  const [spriteFrame, setSpriteFrame] = useState<SpriteFrame>(0);
  const [scale, setScale] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const characterXRef = useRef(0);
  // const particlesRef = useRef<Particle[]>([]);
  const stateTimerRef = useRef(0);
  const loadingDotsRef = useRef<LoadingDot[]>([]);

  // ========================================
  // Calculate animation content bounds for centering
  // ========================================
  const animationStartX = ANIMATION_CONFIG.CHAR_START_X;
  const animationEndX =
    ANIMATION_CONFIG.CHAR_START_X +
    ANIMATION_CONFIG.TRAVEL_DISTANCE +
    CHAR_FALL_OFFSET +
    100;

  const animationCenterX = (animationStartX + animationEndX) / 2;

  const canvasCenterX = ANIMATION_CONFIG.CANVAS_WIDTH / 2;

  const centerOffsetX = canvasCenterX - animationCenterX;
  const centerOffsetY = 0;

  // ========================================
  // Initialize loading dots (once)
  // ========================================
  useEffect(() => {
    loadingDotsRef.current = generateLoadingDots();
  }, []);

  // ========================================
  // Calculate responsive scale
  // ========================================
  useEffect(() => {
    const calculateScale = () => {
      const padding = window.innerWidth < 640 ? 32 : 16;
      const scaleX =
        (window.innerWidth - padding) / ANIMATION_CONFIG.CANVAS_WIDTH;
      const scaleY =
        (window.innerHeight - padding) / ANIMATION_CONFIG.CANVAS_HEIGHT;
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);

    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  // ========================================
  // Update particles for walking state
  // ========================================
  const updateWalkingState = useCallback((frame: number) => {
    setSpriteFrame(
      (Math.floor(frame / ANIMATION_CONFIG.SPRITE_FRAME_DURATION) %
        4) as SpriteFrame
    );
    characterXRef.current += 2.2;

    if (characterXRef.current > ANIMATION_CONFIG.TRAVEL_DISTANCE) {
      setAnimationState("falling");
      stateTimerRef.current = frame;
    }
  }, []);

  // ========================================
  // Update particles for falling state
  // ========================================
  const updateFallingState = useCallback((frame: number) => {
    const fallDuration = frame - stateTimerRef.current;

    if (fallDuration < ANIMATION_CONFIG.FALL_DURATION) {
      setSpriteFrame(2);
    } else {
      setSpriteFrame(3);

      if (fallDuration === ANIMATION_CONFIG.FALL_DURATION) {
        // const charX =
        //   ANIMATION_CONFIG.CHAR_START_X +
        //   characterXRef.current +
        //   CHAR_FALL_OFFSET;
        // particlesRef.current = createParticles(charX);
      }

      if (fallDuration > ANIMATION_CONFIG.FALL_WAIT) {
        setAnimationState("spilled");
        stateTimerRef.current = frame;
      }
    }
  }, []);

  // ========================================
  // Update particles for spilled state
  // ========================================
  const updateSpilledState = useCallback((frame: number) => {
    const spillTime = frame - stateTimerRef.current;
    // const centerX = ANIMATION_CONFIG.CANVAS_CENTER_X + 50;
    // const centerY =
    //   ANIMATION_CONFIG.BASELINE_Y - ANIMATION_CONFIG.TEXT_HEIGHT - 70;

    // if (spillTime < ANIMATION_CONFIG.SCATTER_DURATION) {
    //   // Scatter
    //   particlesRef.current.forEach((p) => {
    //     p.x += p.vx;
    //     p.y += p.vy;
    //     p.vy += ANIMATION_CONFIG.GRAVITY;
    //     p.vx *= ANIMATION_CONFIG.VELOCITY_DAMPING;

    //     if (p.y > ANIMATION_CONFIG.BASELINE_Y + 50) {
    //       p.y = ANIMATION_CONFIG.BASELINE_Y + 50;
    //       p.vy *= -ANIMATION_CONFIG.BOUNCE_DAMPING;
    //     }
    //   });
    // } else if (spillTime < ANIMATION_CONFIG.GATHER_DURATION) {
    //   // Gather
    //   particlesRef.current.forEach((p) => {
    //     if (!p.targetX || !p.targetY) {
    //       p.targetX = centerX + (Math.random() - 0.5) * 100;
    //       p.targetY = centerY + (Math.random() - 0.5) * 100;
    //     }

    //     const dx = p.targetX - p.x;
    //     const dy = p.targetY - p.y;

    //     p.vx += dx * ANIMATION_CONFIG.ATTRACTION_FORCE;
    //     p.vy += dy * ANIMATION_CONFIG.ATTRACTION_FORCE;
    //     p.vx *= ANIMATION_CONFIG.GATHER_DAMPING;
    //     p.vy *= ANIMATION_CONFIG.GATHER_DAMPING;
    //     p.x += p.vx;
    //     p.y += p.vy;
    //   });
    // } else {
    //   setAnimationState("held");
    //   stateTimerRef.current = frame;
    // }

    if (spillTime > ANIMATION_CONFIG.SCATTER_DURATION) {
      setAnimationState("fadeout");
    }
  }, []);

  // ========================================
  // Update particles for held state (with flicker) - コメントアウト
  // ========================================
  // const updateHeldState = useCallback((frame: number) => {
  //   const heldTime = frame - stateTimerRef.current;

  //   if (heldTime === 1) {
  //     particlesRef.current.forEach((p) => {
  //       p.vx = 0;
  //       p.vy = 0;
  //     });
  //   }

  //   // Calculate flicker effect
  //   let flicker = 0;
  //   if (
  //     heldTime >= ANIMATION_CONFIG.FLICKER_START &&
  //     heldTime <= ANIMATION_CONFIG.FLICKER_END
  //   ) {
  //     const t = heldTime - ANIMATION_CONFIG.FLICKER_START;
  //     const halfDuration =
  //       (ANIMATION_CONFIG.FLICKER_END - ANIMATION_CONFIG.FLICKER_START) / 2;

  //     if (t <= halfDuration) {
  //       flicker = t / halfDuration;
  //     } else {
  //       flicker = 1 - (t - halfDuration) / halfDuration;
  //     }
  //   }

  //   // Apply flicker to particles
  //   particlesRef.current.forEach((p) => {
  //     p.size = p.initialSize + flicker * ANIMATION_CONFIG.FLICKER_SIZE_BOOST;
  //     p.life = p.initialLife + flicker * ANIMATION_CONFIG.FLICKER_LIFE_BOOST;
  //   });

  //   if (heldTime > ANIMATION_CONFIG.HELD_DURATION) {
  //     setAnimationState("exploding");
  //     stateTimerRef.current = frame;
  //   }
  // }, []);

  // ========================================
  // Update particles for exploding state
  // ========================================
  // const updateExplodingState = useCallback((frame: number) => {
  //   const explodeTime = frame - stateTimerRef.current;

  //   if (explodeTime === 1) {
  //     particlesRef.current.forEach((p) => {
  //       p.life = 1;
  //       p.size = p.initialSize;
  //     });
  //   }

  //   if (explodeTime < ANIMATION_CONFIG.EXPLODE_DURATION) {
  //     const expandProgress = explodeTime / ANIMATION_CONFIG.EXPLODE_DURATION;
  //     const centerX = ANIMATION_CONFIG.CANVAS_CENTER_X + 50;
  //     const centerY =
  //       ANIMATION_CONFIG.BASELINE_Y - ANIMATION_CONFIG.TEXT_HEIGHT - 70;

  //     particlesRef.current.forEach((p) => {
  //       const angle = Math.atan2(p.y - centerY, p.x - centerX);
  //       const expandSpeed = expandProgress * 8;

  //       p.x += Math.cos(angle) * expandSpeed;
  //       p.y += Math.sin(angle) * expandSpeed;
  //       p.life = 1 - expandProgress;
  //       p.size = 2 + expandProgress * 2;
  //     });
  //   }

  //   if (explodeTime > ANIMATION_CONFIG.FADEOUT_START) {
  //     setAnimationState("fadeout");
  //   }
  // }, []);

  // ========================================
  // Draw canvas
  // ========================================
  const drawCanvas = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(
        0,
        0,
        ANIMATION_CONFIG.CANVAS_WIDTH,
        ANIMATION_CONFIG.CANVAS_HEIGHT
      );

      // Apply centering offset to canvas context
      ctx.save();
      ctx.translate(centerOffsetX, centerOffsetY);

      // Draw loading dots
      loadingDotsRef.current.forEach((dot) => {
        if (characterXRef.current > dot.showAt) {
          ctx.fillStyle = "rgba(0, 246, 255, 1)";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(0, 246, 255, 0.6)";
          ctx.fillRect(
            dot.x,
            dot.y,
            ANIMATION_CONFIG.DOT_SIZE,
            ANIMATION_CONFIG.DOT_SIZE
          );
          ctx.shadowBlur = 0;
        }
      });

      // if (
      //   ["spilled", "held", "exploding", "fadeout"].includes(animationState)
      // ) {
      //   particlesRef.current.forEach((p) => {
      //     ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.life})`;
      //     ctx.shadowBlur = 10;
      //     ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.5)`;
      //     ctx.beginPath();
      //     ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      //     ctx.fill();
      //     ctx.shadowBlur = 0;
      //   });
      // }

      ctx.restore();
    },
    [centerOffsetX, centerOffsetY]
  );

  // ========================================
  // Main animation loop
  // ========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = ANIMATION_CONFIG.CANVAS_WIDTH;
    canvas.height = ANIMATION_CONFIG.CANVAS_HEIGHT;

    const animate = () => {
      const frame = ++frameCountRef.current;

      // Update state based on animation state
      switch (animationState) {
        case "walking":
          updateWalkingState(frame);
          break;
        case "falling":
          updateFallingState(frame);
          break;
        case "spilled":
          updateSpilledState(frame);
          break;
        // case "held":
        //   updateHeldState(frame);
        //   break;
        // case "exploding":
        //   updateExplodingState(frame);
        //   break;
        case "fadeout":
          break;
      }

      // Draw
      drawCanvas(ctx);

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    animationState,
    updateWalkingState,
    updateFallingState,
    updateSpilledState,
    // updateHeldState,
    // updateExplodingState,
    drawCanvas,
  ]);

  useEffect(() => {
    if (animationState === "fadeout") {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, ANIMATION_CONFIG.FADEOUT_DURATION);

      return () => clearTimeout(timer);
    }
  }, [animationState]);

  if (!isVisible) return null;

  const characterTransform =
    animationState === "falling"
      ? "scale(3) translateY(-32px) rotate(45deg)"
      : ["spilled", "held", "exploding", "fadeout"].includes(animationState)
      ? "scale(3) translateY(-10px) rotate(0deg)"
      : "scale(3) translateY(-42px)";

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center transition-opacity duration-1000 ${
        animationState === "fadeout" ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(180deg, #070707 0%, #0a0a0a 100%)",
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Outer container for scaling */}
      <div
        className="relative"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Inner container for canvas size */}
        <div
          className="relative"
          style={{
            width: `${ANIMATION_CONFIG.CANVAS_WIDTH}px`,
            height: `${ANIMATION_CONFIG.CANVAS_HEIGHT}px`,
          }}
        >
          {/* Character */}
          <div
            className="absolute"
            style={{
              left: `${
                ANIMATION_CONFIG.CHAR_START_X +
                characterXRef.current +
                centerOffsetX
              }px`,
              top: `${ANIMATION_CONFIG.BASELINE_Y}px`,
              transform: characterTransform,
              transformOrigin: "bottom left",
              transition:
                animationState === "falling"
                  ? "transform 0.5s ease-out"
                  : "none",
            }}
            aria-hidden="true"
          >
            <div
              className={`relative w-13 h-20 ${
                ["spilled", "held", "exploding", "fadeout"].includes(
                  animationState
                )
                  ? "ml-3"
                  : ""
              }`}
              style={{
                backgroundImage: "url(/loading-sprite.png)",
                backgroundPosition: `${-spriteFrame * 64}px 0`,
                backgroundSize: "256px 64px",
                imageRendering: "pixelated",
              }}
            />
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
