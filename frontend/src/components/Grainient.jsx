import React, { useEffect, useRef } from 'react';

export const Grainient = ({
  color1 = '#ff671f',
  color2 = '#ffffff',
  color3 = '#046a38',
  timeSpeed = 0.8, // faster animation timing
  warpFrequency = 5.4,
  warpSpeed = 4, // faster warp movement
  warpAmplitude = 60,
  noiseScale = 2,
  grainAmount = 0.1,
  contrast = 1.5,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId;
    let startTime = Date.now();

    // Resizable canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simple noise function
    const noise = (x, y, time) => {
      const n =
        Math.sin(x * 12.9898 + y * 78.233 + time * 0.5) * 43758.5453;
      return n - Math.floor(n);
    };

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;
      const elapsed = (Date.now() - startTime) / 1000;
      const time = elapsed * timeSpeed;

      // Create an animated linear gradient for explicit tri-color visibility
      const angle = time * 0.1;
      const x1 = width / 2 + Math.cos(angle) * width * 0.5;
      const y1 = height / 2 + Math.sin(angle) * height * 0.5;
      const x2 = width / 2 - Math.cos(angle) * width * 0.5;
      const y2 = height / 2 - Math.sin(angle) * height * 0.5;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0.0, color1);
      grad.addColorStop(0.25, color2);
      grad.addColorStop(0.45, color3);
      grad.addColorStop(0.70, color2);
      grad.addColorStop(1.0, color1);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Apply animated distortion
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Sample pixels for animation effect
      for (let i = 0; i < data.length; i += 8) {
        const pixelIdx = i / 4;
        const px = pixelIdx % width;
        const py = Math.floor(pixelIdx / width);

        // Warp effect that changes over time
        const warp =
          Math.sin((py / height) * warpFrequency + time * warpSpeed) +
          Math.cos((px / width) * warpFrequency - time * warpSpeed);

        // Apply animated noise
        const n = noise(px / noiseScale, py / noiseScale, time) * 2 - 1;
        const effect = (warp * 0.3 + n) * contrast * 15;

        data[i] = Math.max(0, Math.min(255, data[i] + effect));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + effect * 0.8));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + effect * 0.6));
      }

      ctx.putImageData(imageData, 0, 0);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [color1, color2, color3, timeSpeed, warpFrequency, warpSpeed, warpAmplitude, noiseScale, contrast]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
        zIndex: 0,
      }}
    />
  );
};
