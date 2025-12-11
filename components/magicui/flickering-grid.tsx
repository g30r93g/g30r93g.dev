"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color,
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}) => {
  const { resolvedTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [randomGradient, setRandomGradient] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("rgb(0, 0, 0)");

  useEffect(() => {
    if (typeof window === "undefined") {
      setBackgroundColor(color || "rgb(0, 0, 0)");
      return;
    }

    if (color) {
      setBackgroundColor(color);
      return;
    }

    const root = document.documentElement;
    const computed =
      getComputedStyle(root).getPropertyValue("--color-background");
    setBackgroundColor(computed.trim() || "rgb(0, 0, 0)");
  }, [color, resolvedTheme]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.floor(width / (squareSize + gridGap));
      const rows = Math.floor(height / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "destination-out";

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const opacity = squares[i * rows + j];
          if (opacity <= 0) continue;
          ctx.globalAlpha = opacity;
          ctx.fillRect(
            i * (squareSize + gridGap) * dpr,
            j * (squareSize + gridGap) * dpr,
            squareSize * dpr,
            squareSize * dpr,
          );
        }
      }

      ctx.restore();
    },
    [backgroundColor, squareSize, gridGap],
  );

  useEffect(() => {
    const randomAngle = Math.floor(Math.random() * 360);
    const randomStop1 = Math.floor(Math.random() * 100);
    const randomStop2 = Math.floor(Math.random() * 100);
    const randomStop3 = Math.floor(Math.random() * 100);
    const randomStop4 = Math.floor(Math.random() * 100);

    setRandomGradient(
      `radial-gradient(circle at center, #9c40ff, transparent 40%), conic-gradient(from ${randomAngle}deg, #9c40ff ${randomStop1}%, #329bd5 ${randomStop2}%, #9c40ff ${randomStop3}%, #329bd5 ${randomStop4}%)`,
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };

    updateCanvasSize();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) return;

      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    intersectionObserver.observe(canvas);

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden", className)}
      {...props}
    >
      {randomGradient && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-70 blur-3xl"
          animate={{
            y: [0, -30, -50, -10, -35, 0],
            x: [0, 20, 5, -20, -40, 20, 0],
            scale: [1, 1.1, 0.85, 1.3, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform, opacity" }}
        >
          <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/4 -translate-y-1/4">
            <div
              className="pointer-events-none h-1/2 w-1/2 -translate-x-1/4 -translate-y-1/4 rounded-full"
              style={{
                background: randomGradient,
                filter: "blur(50px)",
              }}
            />
          </div>
        </motion.div>
      )}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
};
