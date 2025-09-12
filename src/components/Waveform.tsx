import { useEffect, useState, useRef } from "react";

interface WaveformProps {
  isPlaying: boolean;
  progress: number;
  onSeek?: (position: number) => void;
  height?: number;
  className?: string;
}

export const Waveform = ({ isPlaying, progress, onSeek, height = 60, className = "" }: WaveformProps) => {
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate realistic waveform data
  useEffect(() => {
    const generateWaveform = () => {
      const points = 200;
      const data = [];
      
      for (let i = 0; i < points; i++) {
        // Create a more natural waveform pattern
        const baseAmplitude = Math.sin(i * 0.1) * 0.5 + 0.5;
        const variation = Math.sin(i * 0.05) * 0.3;
        const noise = (Math.random() - 0.5) * 0.2;
        const amplitude = Math.max(0.1, Math.min(1, baseAmplitude + variation + noise));
        data.push(amplitude);
      }
      
      setWaveformData(data);
    };

    generateWaveform();
  }, []);

  // Draw waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const barWidth = width / waveformData.length;
    const centerY = height / 2;
    const maxBarHeight = height * 0.8;

    waveformData.forEach((amplitude, index) => {
      const barHeight = amplitude * maxBarHeight;
      const x = index * barWidth;
      const progressPercent = progress / 100;
      const currentPosition = index / waveformData.length;
      
      // Determine bar color based on progress
      const isPlayed = currentPosition <= progressPercent;
      
      if (isPlayed) {
        // Played portion - bright blue gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'hsl(197, 100%, 58%)'); // #1EAEDB
        gradient.addColorStop(1, 'hsl(197, 100%, 45%)');
        ctx.fillStyle = gradient;
      } else {
        // Unplayed portion - muted
        ctx.fillStyle = 'hsla(242, 100%, 95%, 0.2)'; // #F2FCE2 with opacity
      }

      // Draw waveform bar
      ctx.fillRect(x, centerY - barHeight / 2, Math.max(2, barWidth - 1), barHeight);
      
      // Add glow effect for currently playing area
      if (isPlaying && Math.abs(currentPosition - progressPercent) < 0.05) {
        ctx.shadowColor = 'hsl(197, 100%, 58%)';
        ctx.shadowBlur = 10;
        ctx.fillRect(x, centerY - barHeight / 2, Math.max(2, barWidth - 1), barHeight);
        ctx.shadowBlur = 0;
      }
    });

    // Draw progress indicator
    const progressX = (progress / 100) * width;
    ctx.strokeStyle = 'hsl(47, 100%, 88%)'; // #FEF7CD
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, height);
    ctx.stroke();

  }, [waveformData, progress, isPlaying]);

  // Handle click to seek
  const handleClick = (event: React.MouseEvent) => {
    if (!onSeek || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    onSeek(Math.max(0, Math.min(100, percentage)));
  };

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${height}px`;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [height]);

  return (
    <div 
      ref={containerRef}
      className={`relative cursor-pointer group ${className}`}
      onClick={handleClick}
      style={{ height }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full transition-all duration-200 group-hover:brightness-110"
      />
      
      {/* Hover indicator */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
};