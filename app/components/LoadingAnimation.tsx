"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

// ========================================
// Types
// ========================================
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
// Base (geometry / colors) - safe to keep module-level
// ========================================
export const BASE_CONFIG = {
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

  // Timing (frames) — base timing values (will be multiplied by speed)
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

  // Particles (kept, unused in current)
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

// Letter patterns
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

const CHAR_FALL_OFFSET = 200;

// ========================================
// Helper - generate loading dots (uses geometry/travel constants only)
// ========================================
function generateLoadingDots(config: typeof BASE_CONFIG): LoadingDot[] {
  const dots: LoadingDot[] = [];
  let xOffset = 0;

  const totalGridWidth =
    LETTER_WIDTHS.reduce((sum, width) => sum + width + 1, 0) - 1;

  WORD.forEach((letter, letterIndex) => {
    const pattern = LETTER_PATTERNS[letter];
    pattern.forEach(([x, y]) => {
      const dotX = config.TEXT_START_X + (xOffset + x) * config.DOT_SPACING_X;
      const dotY =
        config.BASELINE_Y - config.TEXT_HEIGHT + y * config.DOT_SPACING_Y;

      const progressRatio = (xOffset + x) / totalGridWidth;
      const showAtValue = Math.min(
        config.TRAVEL_DISTANCE,
        Math.floor(progressRatio * config.TRAVEL_DISTANCE)
      );

      dots.push({ x: dotX, y: dotY, showAt: showAtValue });
    });
    xOffset += LETTER_WIDTHS[letterIndex] + 1;
  });

  return dots;
}

// ========================================
// Main Component
// ========================================
export default function LoadingAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const [animationState, setAnimationState] =
    useState<AnimationState>("walking");
  const [spriteFrame, setSpriteFrame] = useState<SpriteFrame>(0);
  const [scale, setScale] = useState(1);

  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const characterXRef = useRef(0);
  // const particlesRef = useRef<Particle[]>([]);
  const stateTimerRef = useRef(0);
  const loadingDotsRef = useRef<LoadingDot[]>([]);

  // Centering offsets (derived from BASE_CONFIG geometry)
  const animationStartX = BASE_CONFIG.CHAR_START_X;
  const animationEndX =
    BASE_CONFIG.CHAR_START_X +
    BASE_CONFIG.TRAVEL_DISTANCE +
    CHAR_FALL_OFFSET +
    100;
  const animationCenterX = (animationStartX + animationEndX) / 2;
  const canvasCenterX = BASE_CONFIG.CANVAS_WIDTH / 2;
  const centerOffsetX = canvasCenterX - animationCenterX;
  const centerOffsetY = 0;

  // ---------------------------
  // determine returning or not (safe in useEffect)
  // ---------------------------
  useEffect(() => {
    try {
      const visited = localStorage.getItem("hasVisited") === "true";
      if (visited) {
        // tweak multiplier to make animation ~2s shorter overall; adjust as you like
        setSpeedMultiplier(0.35);
      } else {
        setSpeedMultiplier(1.0);
      }
      localStorage.setItem("hasVisited", "true");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // localStorage might throw if disabled — fallback to 1.0
      setSpeedMultiplier(1.0);
    }
  }, []);

  // ---------------------------
  // Build per-render CONFIG that includes timing adjusted by speedMultiplier
  // ---------------------------
  const CONFIG = useMemo(() => {
    return {
      ...BASE_CONFIG,
      SPRITE_FRAME_DURATION: Math.max(
        3,
        Math.floor(BASE_CONFIG.SPRITE_FRAME_DURATION * speedMultiplier)
      ),
      FALL_DURATION: Math.max(
        1,
        Math.floor(BASE_CONFIG.FALL_DURATION * speedMultiplier)
      ),
      SCATTER_DURATION: Math.max(
        1,
        Math.floor(BASE_CONFIG.SCATTER_DURATION * speedMultiplier)
      ),
      GATHER_DURATION: Math.max(
        1,
        Math.floor(BASE_CONFIG.GATHER_DURATION * speedMultiplier)
      ),
      FADEOUT_DURATION: Math.max(
        50,
        Math.floor(BASE_CONFIG.FADEOUT_DURATION * speedMultiplier)
      ),
    } as const;
  }, [speedMultiplier]);

  // Initialize loading dots when CONFIG is ready
  useEffect(() => {
    loadingDotsRef.current = generateLoadingDots(BASE_CONFIG);
  }, []);

  // Responsive scale
  useEffect(() => {
    const calculateScale = () => {
      const padding = window.innerWidth < 640 ? 32 : 16;
      const scaleX = (window.innerWidth - padding) / BASE_CONFIG.CANVAS_WIDTH;
      const scaleY = (window.innerHeight - padding) / BASE_CONFIG.CANVAS_HEIGHT;
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  // =========== Update functions ===========
  const updateWalkingState = useCallback(
    (frame: number) => {
      setSpriteFrame(
        (Math.floor(frame / CONFIG.SPRITE_FRAME_DURATION) % 4) as SpriteFrame
      );

      // move character faster/slower by speedMultiplier
      characterXRef.current += 2.2 * (1 / speedMultiplier); // note: inverse so smaller multiplier -> faster movement

      if (characterXRef.current > CONFIG.TRAVEL_DISTANCE) {
        setAnimationState("falling");
        stateTimerRef.current = frame;
      }
    },
    [CONFIG.SPRITE_FRAME_DURATION, CONFIG.TRAVEL_DISTANCE, speedMultiplier]
  );

  const updateFallingState = useCallback(
    (frame: number) => {
      const fallDuration = frame - stateTimerRef.current;

      if (fallDuration < CONFIG.FALL_DURATION) {
        setSpriteFrame(2);
      } else {
        setSpriteFrame(3);

        if (fallDuration > CONFIG.FALL_WAIT) {
          setAnimationState("spilled");
          stateTimerRef.current = frame;
        }
      }
    },
    [CONFIG.FALL_DURATION, CONFIG.FALL_WAIT]
  );

  const updateSpilledState = useCallback(
    (frame: number) => {
      const spillTime = frame - stateTimerRef.current;
      if (spillTime > CONFIG.SCATTER_DURATION) {
        setAnimationState("fadeout");
      }
    },
    [CONFIG.SCATTER_DURATION]
  );

  // Draw canvas (uses BASE_CONFIG geometry/constants; timing not needed here)
  const drawCanvas = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, BASE_CONFIG.CANVAS_WIDTH, BASE_CONFIG.CANVAS_HEIGHT);

      ctx.save();
      ctx.translate(centerOffsetX, centerOffsetY);

      loadingDotsRef.current.forEach((dot) => {
        if (characterXRef.current > dot.showAt) {
          ctx.fillStyle = "rgba(0, 246, 255, 1)";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(0, 246, 255, 0.6)";
          ctx.fillRect(
            dot.x,
            dot.y,
            BASE_CONFIG.DOT_SIZE,
            BASE_CONFIG.DOT_SIZE
          );
          ctx.shadowBlur = 0;
        }
      });

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

    canvas.width = BASE_CONFIG.CANVAS_WIDTH;
    canvas.height = BASE_CONFIG.CANVAS_HEIGHT;

    const animate = () => {
      // Advance frames faster when speedMultiplier < 1:
      // We want smaller multiplier => faster animation, so add (1 / speedMultiplier)
      // but guard speedMultiplier > 0
      const increment = speedMultiplier > 0 ? 1 / speedMultiplier : 1;
      frameCountRef.current += increment;

      const frame = Math.floor(frameCountRef.current);

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
        case "fadeout":
          break;
      }

      drawCanvas(ctx);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

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
    drawCanvas,
    speedMultiplier,
  ]);

  // Fadeout -> hide after CONFIG.FADEOUT_DURATION (scale by speedMultiplier)
  useEffect(() => {
    if (animationState === "fadeout") {
      // use CONFIG.FADEOUT_DURATION, which already is scaled by speedMultiplier via useMemo
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, CONFIG.FADEOUT_DURATION);

      return () => clearTimeout(timer);
    }
  }, [animationState, CONFIG.FADEOUT_DURATION]);

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
      <div
        className="relative"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <div
          className="relative"
          style={{
            width: `${BASE_CONFIG.CANVAS_WIDTH}px`,
            height: `${BASE_CONFIG.CANVAS_HEIGHT}px`,
          }}
        >
          <div
            className="absolute"
            style={{
              left: `${
                BASE_CONFIG.CHAR_START_X + characterXRef.current + centerOffsetX
              }px`,
              top: `${BASE_CONFIG.BASELINE_Y}px`,
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
                backgroundImage:
                  speedMultiplier !== 1.0
                    ? "url(/slime-run.png)"
                    : "url(/loading-sprite.png)",
                backgroundPosition: `${-spriteFrame * 64}px 0`,
                backgroundSize: "256px 64px",
                imageRendering: "pixelated",
              }}
            />
          </div>

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
