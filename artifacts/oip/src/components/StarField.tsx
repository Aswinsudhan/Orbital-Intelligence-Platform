import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

const COLORS = ["#ffffff", "#cce8ff", "#e8e8ff", "#ffe8cc", "#ccffee"];

export function StarField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / width - 0.5) * 2,
        y: (e.clientY / height - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMouse);

    // Create stars with depth layers (z = 0..1, closer = larger)
    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random(),
      size: 0,
      opacity: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.015 + 0.005,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    stars.forEach((s) => {
      s.size = s.z * 2.2 + 0.4;
    });

    const shootingStars: ShootingStar[] = [];
    let lastShoot = 0;

    const spawnShootingStar = () => {
      const angle = (Math.random() * 30 + 20) * (Math.PI / 180);
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 120 + 60,
        angle,
        speed: Math.random() * 6 + 4,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 40 + 30,
      });
    };

    let frameCount = 0;
    const twinkleOffsets = stars.map(() => Math.random() * Math.PI * 2);

    const draw = (now: number) => {
      animRef.current = requestAnimationFrame(draw);
      frameCount++;

      // Spawn shooting star every ~4s
      if (now - lastShoot > 4000 + Math.random() * 3000) {
        spawnShootingStar();
        lastShoot = now;
      }

      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw stars
      stars.forEach((star, i) => {
        const parallax = star.z * 18;
        const px = star.x + mx * parallax;
        const py = star.y + my * parallax;

        // Twinkle
        const twinkle = Math.sin(frameCount * star.speed * 3 + twinkleOffsets[i]) * 0.25 + 0.75;
        const alpha = Math.min(1, star.opacity * twinkle);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = star.color;

        if (star.size > 1.4) {
          // Add glow for larger stars
          const grd = ctx.createRadialGradient(px, py, 0, px, py, star.size * 3);
          grd.addColorStop(0, star.color);
          grd.addColorStop(1, "transparent");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(px, py, star.size * 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = star.color;
        }

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life++;
        s.opacity = 1 - s.life / s.maxLife;

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(200,230,255,${s.opacity})`);

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = s.opacity;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.restore();
      }
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
