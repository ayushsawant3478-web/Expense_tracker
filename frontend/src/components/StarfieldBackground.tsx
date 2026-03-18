import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  color: string;
}

const COLORS = [
  '167, 139, 250', // violet-400
  '139, 92, 246',  // violet-500
  '96, 165, 250',  // blue-400
  '248, 250, 252', // slate-50 (white-ish)
];

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const STAR_COUNT = 180;
    const SPEED = 2.5;
    let stars: Star[] = [];
    let animId: number;
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initStars();
    };

    const newStar = (randomZ = false): Star => ({
      x: (Math.random() - 0.5) * w * 2.5,
      y: (Math.random() - 0.5) * h * 2.5,
      z: randomZ ? Math.random() * w : w,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    const initStars = () => {
      stars = Array.from({ length: STAR_COUNT }, () => newStar(true));
    };

    const project = (x: number, y: number, z: number) => {
      const fov = w * 0.4;
      return {
        sx: (x / z) * fov + w / 2,
        sy: (y / z) * fov + h / 2,
        r: Math.max(0.1, (1 - z / w) * 2),
        opacity: Math.max(0, (1 - z / w) * 0.85),
      };
    };

    const draw = () => {
      // Faint trail fade — color matches bg-slate-950 (#020617)
      ctx.fillStyle = 'rgba(2, 6, 23, 0.22)';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const prevZ = s.z;
        s.z -= SPEED;

        if (s.z <= 0.1) {
          stars[i] = newStar();
          continue;
        }

        const curr = project(s.x, s.y, s.z);
        const prev = project(s.x, s.y, prevZ);

        // Recycle stars that have flown off-screen
        if (
          (curr.sx < -100 || curr.sx > w + 100 || curr.sy < -100 || curr.sy > h + 100) &&
          (prev.sx < -100 || prev.sx > w + 100 || prev.sy < -100 || prev.sy > h + 100)
        ) {
          stars[i] = newStar();
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(prev.sx, prev.sy);
        ctx.lineTo(curr.sx, curr.sy);
        ctx.strokeStyle = `rgba(${s.color}, ${curr.opacity})`;
        ctx.lineWidth = curr.r;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.6 }}
    />
  );
}
