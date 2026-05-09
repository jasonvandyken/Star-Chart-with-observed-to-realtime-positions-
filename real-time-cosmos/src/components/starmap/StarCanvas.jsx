import React, { useRef, useEffect, useState, useCallback } from 'react';
import { STARS, CONSTELLATIONS, celestialToXY, spectralToColor, magToSize, getPredictedPosition } from '@/lib/starCatalog';

const DRAG_SENSITIVITY = 0.003;
const ZOOM_SENSITIVITY = 1.1;
const MIN_SCALE = 80;
const MAX_SCALE = 2000;

export default function StarCanvas({ showPredicted, selectedStar, onSelectStar, showConstellations, showLabels }) {
  const canvasRef = useRef(null);
  const [centerRA, setCenterRA] = useState(14); // hours
  const [centerDec, setCenterDec] = useState(30); // degrees
  const [scale, setScale] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // Background gradient
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h));
    grad.addColorStop(0, '#0a0e1a');
    grad.addColorStop(0.5, '#060a14');
    grad.addColorStop(1, '#020408');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Background dust/nebula glow
    for (let i = 0; i < 3; i++) {
      const gx = cx + Math.sin(i * 2.1) * w * 0.3;
      const gy = cy + Math.cos(i * 1.7) * h * 0.2;
      const nebula = ctx.createRadialGradient(gx, gy, 0, gx, gy, 200);
      nebula.addColorStop(0, 'rgba(40, 20, 80, 0.04)');
      nebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);
    }

    // Draw faint background stars
    ctx.save();
    for (let i = 0; i < 400; i++) {
      const bx = ((i * 7919 + 1234) % w);
      const by = ((i * 6271 + 5678) % h);
      const br = 0.3 + (i % 3) * 0.3;
      const alpha = 0.15 + (i % 5) * 0.08;
      ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // RA/Dec grid
    ctx.save();
    ctx.strokeStyle = 'rgba(60, 80, 140, 0.12)';
    ctx.lineWidth = 0.5;
    for (let ra = 0; ra < 24; ra += 2) {
      for (let dec = -80; dec <= 80; dec += 2) {
        const p = celestialToXY(ra, dec, centerRA, centerDec, scale);
        const p2 = celestialToXY(ra, dec + 2, centerRA, centerDec, scale);
        if (p && p2) {
          ctx.beginPath();
          ctx.moveTo(cx + p.x, cy + p.y);
          ctx.lineTo(cx + p2.x, cy + p2.y);
          ctx.stroke();
        }
      }
    }
    for (let dec = -60; dec <= 60; dec += 30) {
      for (let ra = 0; ra < 24; ra += 0.5) {
        const p = celestialToXY(ra, dec, centerRA, centerDec, scale);
        const p2 = celestialToXY(ra + 0.5, dec, centerRA, centerDec, scale);
        if (p && p2) {
          ctx.beginPath();
          ctx.moveTo(cx + p.x, cy + p.y);
          ctx.lineTo(cx + p2.x, cy + p2.y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // Constellation lines
    if (showConstellations) {
      ctx.save();
      ctx.strokeStyle = 'rgba(100, 140, 220, 0.2)';
      ctx.lineWidth = 1;
      Object.values(CONSTELLATIONS).forEach(constellation => {
        constellation.lines.forEach(([from, to]) => {
          const starFrom = STARS.find(s => s.name === from);
          const starTo = STARS.find(s => s.name === to);
          if (starFrom && starTo) {
            const pf = celestialToXY(starFrom.ra, starFrom.dec, centerRA, centerDec, scale);
            const pt = celestialToXY(starTo.ra, starTo.dec, centerRA, centerDec, scale);
            if (pf && pt) {
              ctx.beginPath();
              ctx.moveTo(cx + pf.x, cy + pf.y);
              ctx.lineTo(cx + pt.x, cy + pt.y);
              ctx.stroke();
            }
          }
        });
      });
      ctx.restore();
    }

    // Stars
    STARS.forEach(star => {
      const pos = celestialToXY(star.ra, star.dec, centerRA, centerDec, scale);
      if (!pos) return;

      const sx = cx + pos.x;
      const sy = cy + pos.y;
      if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) return;

      const size = magToSize(star.mag);
      const color = spectralToColor(star.spectral);
      const isSelected = selectedStar?.name === star.name;

      // Star glow
      const glowSize = size * 4;
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowSize);
      glow.addColorStop(0, color + '40');
      glow.addColorStop(0.4, color + '15');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sx, sy, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Star core
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();

      // Selection ring
      if (isSelected) {
        ctx.strokeStyle = '#6C9EFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sx, sy, size + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#6C9EFF40';
        ctx.beginPath();
        ctx.arc(sx, sy, size + 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Predicted position
      if (showPredicted) {
        const predicted = getPredictedPosition(star);
        const predPos = celestialToXY(predicted.ra, predicted.dec, centerRA, centerDec, scale);
        if (predPos) {
          const px = cx + predPos.x;
          const py = cy + predPos.y;
          const dist = Math.sqrt((px - sx) ** 2 + (py - sy) ** 2);

          // Draw connection line only if shift is visible
          if (dist > 1.5) {
            ctx.save();
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = '#ff6b9d60';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(px, py);
            ctx.stroke();
            ctx.restore();
          }

          // Always draw the predicted marker
          const predGlow = ctx.createRadialGradient(px, py, 0, px, py, size * 3);
          predGlow.addColorStop(0, '#ff6b9d50');
          predGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = predGlow;
          ctx.beginPath();
          ctx.arc(px, py, size * 3, 0, Math.PI * 2);
          ctx.fill();

          // Diamond shape for predicted
          ctx.fillStyle = '#ff6b9dcc';
          ctx.strokeStyle = '#ff6b9d';
          ctx.lineWidth = 1;
          ctx.beginPath();
          const ds = Math.max(3, size * 0.7);
          ctx.moveTo(px, py - ds);
          ctx.lineTo(px + ds, py);
          ctx.lineTo(px, py + ds);
          ctx.lineTo(px - ds, py);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Tag: angular shift label near midpoint of the line
          const predicted2 = getPredictedPosition(star);
          const shiftArcsec = predicted2.totalShift_arcsec;
          const shiftLabel = shiftArcsec >= 3600
            ? `${(shiftArcsec / 3600).toFixed(1)}°`
            : shiftArcsec >= 60
            ? `${(shiftArcsec / 60).toFixed(1)}'`
            : `${shiftArcsec.toFixed(1)}"`;

          const midX = (sx + px) / 2;
          const midY = (sy + py) / 2;
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(255, 107, 157, 0.75)';
          ctx.fillText(shiftLabel, midX + 4, midY - 3);
        }
      }

      // Direction arrow based on proper motion
      const pmTotal = Math.sqrt(star.pmRA ** 2 + star.pmDec ** 2);
      if (pmTotal > 0) {
        // pmRA is East (+x), pmDec is North (-y on canvas)
        const angle = Math.atan2(-star.pmDec, star.pmRA);
        const arrowLen = size + 10;
        const ax = sx + Math.cos(angle) * (size + 4);
        const ay = sy + Math.sin(angle) * (size + 4);
        const ex = sx + Math.cos(angle) * (size + 4 + arrowLen);
        const ey = sy + Math.sin(angle) * (size + 4 + arrowLen);

        ctx.save();
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
        ctx.fillStyle = 'rgba(100, 200, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Arrowhead
        const headLen = 4;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - headLen * Math.cos(angle - 0.4), ey - headLen * Math.sin(angle - 0.4));
        ctx.lineTo(ex - headLen * Math.cos(angle + 0.4), ey - headLen * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Labels
      if (showLabels && star.mag < 2.5) {
        ctx.fillStyle = 'rgba(180, 200, 240, 0.7)';
        ctx.font = '10px "Space Grotesk", sans-serif';
        ctx.fillText(star.name, sx + size + 4, sy - size - 2);
        ctx.fillStyle = 'rgba(120, 160, 210, 0.5)';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(`${star.dist.toLocaleString()} ly`, sx + size + 4, sy - size + 9);
      }
    });

    // Crosshair at center
    ctx.strokeStyle = 'rgba(100, 140, 220, 0.15)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy);
    ctx.lineTo(cx + 20, cy);
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx, cy + 20);
    ctx.stroke();

  }, [centerRA, centerDec, scale, showPredicted, selectedStar, showConstellations, showLabels]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
      canvas.style.width = parent.clientWidth + 'px';
      canvas.style.height = parent.clientHeight + 'px';
      const ctx = canvas.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      draw();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  // Mouse handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    setCenterRA(prev => {
      let newRA = prev + dx * DRAG_SENSITIVITY * (300 / scale);
      if (newRA > 24) newRA -= 24;
      if (newRA < 0) newRA += 24;
      return newRA;
    });
    setCenterDec(prev => Math.max(-85, Math.min(85, prev - dy * DRAG_SENSITIVITY * (300 / scale) * 50)));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    setScale(prev => {
      const factor = e.deltaY < 0 ? ZOOM_SENSITIVITY : 1 / ZOOM_SENSITIVITY;
      return Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev * factor));
    });
  };

  const handleClick = (e) => {
    if (isDragging) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    let closest = null;
    let closestDist = 20;
    STARS.forEach(star => {
      const pos = celestialToXY(star.ra, star.dec, centerRA, centerDec, scale);
      if (!pos) return;
      const sx = cx + pos.x;
      const sy = cy + pos.y;
      const d = Math.sqrt((mx - sx) ** 2 + (my - sy) ** 2);
      if (d < closestDist) {
        closestDist = d;
        closest = star;
      }
    });
    onSelectStar(closest);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastPos.current.x;
    const dy = e.touches[0].clientY - lastPos.current.y;
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setCenterRA(prev => {
      let newRA = prev + dx * DRAG_SENSITIVITY * (300 / scale);
      if (newRA > 24) newRA -= 24;
      if (newRA < 0) newRA += 24;
      return newRA;
    });
    setCenterDec(prev => Math.max(-85, Math.min(85, prev - dy * DRAG_SENSITIVITY * (300 / scale) * 50)));
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
}