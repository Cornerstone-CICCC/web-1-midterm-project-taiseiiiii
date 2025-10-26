"use client";

import { useEffect, useRef, useState } from "react";

interface PixelPetProps {
  spriteUrl?: string;
  size?: number;
  bounceSpeed?: number;
  bounceHeight?: number;
  spriteFrameWidth?: number;
  spriteFrameHeight?: number;
  frameCount?: number;
  frameSpeed?: number;
  isFixed?: boolean;
  position?: {
    right?: string;
    bottom?: string;
  };
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

export default function PixelPet({
  spriteUrl = "/slime-bounce.png",
  size = 90,
  bounceSpeed = 0.002,
  bounceHeight = 12,
  spriteFrameWidth = 64,
  spriteFrameHeight = 64,
  frameCount = 2,
  frameSpeed = 500,
  isFixed = true,
  position = { right: "20px", bottom: "20px" },
}: PixelPetProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [bounceOffset, setBounceOffset] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frameCount);
    }, frameSpeed);

    return () => clearInterval(interval);
  }, [frameCount, frameSpeed]);

  useEffect(() => {
    const animate = () => {
      timeRef.current += bounceSpeed;
      const offset = Math.sin(timeRef.current) * bounceHeight;
      setBounceOffset(offset);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bounceSpeed, bounceHeight]);

  const handleClick = () => {
    if (isJumping) return;

    setIsJumping(true);

    const jumpDuration = 600;
    const startTime = performance.now();

    const jumpAnimate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / jumpDuration;

      if (progress < 1) {
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const jumpHeight = Math.sin(easeOut * Math.PI) * 30;
        setBounceOffset(-jumpHeight);
        requestAnimationFrame(jumpAnimate);
      } else {
        setIsJumping(false);
      }
    };

    requestAnimationFrame(jumpAnimate);

    createParticles();
  };

  const createParticles = () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const colors = ["#00f6ff", "#ff6cfb", "#7ED321", "#F5A623"];
    const newParticles: Particle[] = [];

    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      const speed = Math.random() * 2 + 1;

      newParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: Math.random() * 3 + 2,
        color: colors[i % colors.length],
      });
    }

    particlesRef.current = newParticles;

    // パーティクルアニメーション
    const animateParticles = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let hasAliveParticles = false;

      particlesRef.current.forEach((p) => {
        if (p.life > 0) {
          hasAliveParticles = true;

          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.025;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      });

      if (hasAliveParticles) {
        requestAnimationFrame(animateParticles);
      }
    };

    animateParticles();
  };

  return (
    <div
      className={`z-[500] ${isFixed ? "fixed" : "relative"}`}
      style={{
        ...(isFixed && {
          right: position.right,
          bottom: position.bottom,
        }),
        width: `${size}px`,
        height: `${size}px`,
      }}
      title="Pixel Pet - Click to interact!"
    >
      <div
        ref={containerRef}
        className="relative cursor-pointer select-none w-full h-full"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Pixel Pet - Click to interact"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{ zIndex: 10 }}
          aria-hidden="true"
        />
        <div
          className="relative w-full h-full rounded-xl overflow-hidden transition-all duration-200 hover:scale-110"
          style={{
            transform: `translateY(${bounceOffset}px)`,
          }}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              imageRendering: "pixelated",
            }}
          >
            <div
              style={{
                width: `${size * 0.75}px`,
                height: `${size * 0.75}px`,
                backgroundImage: `url(${spriteUrl})`,
                backgroundPosition: `-${currentFrame * spriteFrameWidth}px 0`,
                backgroundSize: `${
                  spriteFrameWidth * frameCount
                }px ${spriteFrameHeight}px`,
                backgroundRepeat: "no-repeat",
                imageRendering: "pixelated",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
