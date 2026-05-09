import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { STARS, computeSBSDelay, getPredictedPosition, spectralToColor } from '@/lib/starCatalog';
import { ArrowLeft, ChevronDown, Star } from 'lucide-react';

const LY_TO_MILES = 5.879e12;

function formatMiles(miles) {
  if (miles >= 1e15) return `${(miles / 1e15).toFixed(2)} quadrillion mi`;
  if (miles >= 1e12) return `${(miles / 1e12).toFixed(2)} trillion mi`;
  if (miles >= 1e9) return `${(miles / 1e9).toFixed(2)} billion mi`;
  return `${Math.round(miles).toLocaleString()} mi`;
}

function formatShift(arcsec) {
  if (arcsec >= 3600) return `${(arcsec / 3600).toFixed(2)}°`;
  if (arcsec >= 60) return `${(arcsec / 60).toFixed(2)}'`;
  return `${arcsec.toFixed(2)}"`;
}

// Generates trail points going BACK in time from observed position
function getTrailPoints(star, steps = 8) {
  const points = [];
  const intervals = [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1.0];
  for (let i = 0; i < steps; i++) {
    const t = intervals[i];
    const deltaRA = (star.pmRA / 1000 / 3600) * star.dist * t;
    const deltaDec = (star.pmDec / 1000 / 3600) * star.dist * t;
    points.push({
      ra: star.ra - deltaRA / 15,
      dec: star.dec - deltaDec,
      age: t,
    });
  }
  return points;
}

function DriftCanvas({ star }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.7);
    bg.addColorStop(0, '#0d1120');
    bg.addColorStop(1, '#050810');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Faint grid
    ctx.strokeStyle = 'rgba(60,80,140,0.1)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const predicted = getPredictedPosition(star);
    const trail = getTrailPoints(star, 8);
    const sbs = computeSBSDelay(star);
    const color = spectralToColor(star.spectral);

    // Scale: map RA/Dec offsets to pixels
    // Predicted is at +deltaRA/Dec from observed. We want both to fit with margin.
    const predDeltaRA = (predicted.ra - star.ra) * 15 * 3600; // arcsec
    const predDeltaDec = (predicted.dec - star.dec) * 3600; // arcsec
    const maxRange = Math.max(
      Math.abs(predDeltaRA), Math.abs(predDeltaDec),
      1
    ) * 1.5;
    const scale = (Math.min(W, H) * 0.38) / maxRange;

    // Observed at center
    const obsX = cx;
    const obsY = cy;

    // Predicted position
    const predX = cx + predDeltaRA * scale;
    const predY = cy - predDeltaDec * scale;

    // Draw historical trail (past positions going back)
    trail.forEach((pt, i) => {
      const tDeltaRA = (pt.ra - star.ra) * 15 * 3600;
      const tDeltaDec = (pt.dec - star.dec) * 3600;
      const tx = cx + tDeltaRA * scale;
      const ty = cy - tDeltaDec * scale;

      if (i > 0) {
        const prev = trail[i - 1];
        const pDeltaRA = (prev.ra - star.ra) * 15 * 3600;
        const pDeltaDec = (prev.dec - star.dec) * 3600;
        const px2 = cx + pDeltaRA * scale;
        const py2 = cy - pDeltaDec * scale;

        ctx.save();
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = `rgba(100, 140, 220, ${0.08 + (1 - pt.age) * 0.15})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px2, py2);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.restore();
      }

      const alpha = 0.12 + (1 - pt.age) * 0.2;
      const r = Math.max(1.5, 3 * (1 - pt.age * 0.6));
      ctx.fillStyle = `rgba(100, 160, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(tx, ty, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Line from observed to predicted
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255, 107, 157, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(obsX, obsY);
    ctx.lineTo(predX, predY);
    ctx.stroke();
    ctx.restore();

    // Draw observed star
    const glowObs = ctx.createRadialGradient(obsX, obsY, 0, obsX, obsY, 24);
    glowObs.addColorStop(0, color + '50');
    glowObs.addColorStop(1, 'transparent');
    ctx.fillStyle = glowObs;
    ctx.beginPath(); ctx.arc(obsX, obsY, 24, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(obsX, obsY, 5, 0, Math.PI * 2); ctx.fill();

    // Observed label
    ctx.fillStyle = 'rgba(180,200,240,0.8)';
    ctx.font = 'bold 11px "Space Grotesk", sans-serif';
    ctx.fillText('Observed', obsX + 8, obsY - 8);
    ctx.fillStyle = 'rgba(120,160,210,0.5)';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('(where we see it)', obsX + 8, obsY + 4);

    // Draw predicted diamond
    const glowPred = ctx.createRadialGradient(predX, predY, 0, predX, predY, 20);
    glowPred.addColorStop(0, '#ff6b9d60');
    glowPred.addColorStop(1, 'transparent');
    ctx.fillStyle = glowPred;
    ctx.beginPath(); ctx.arc(predX, predY, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff6b9dcc';
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(predX, predY - 7);
    ctx.lineTo(predX + 7, predY);
    ctx.lineTo(predX, predY + 7);
    ctx.lineTo(predX - 7, predY);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Predicted label
    ctx.fillStyle = 'rgba(255, 107, 157, 0.9)';
    ctx.font = 'bold 11px "Space Grotesk", sans-serif';
    ctx.fillText('Real-Time', predX + 10, predY - 8);
    ctx.fillStyle = 'rgba(255, 107, 157, 0.55)';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('(actual now)', predX + 10, predY + 4);

    // Distance label on line midpoint
    const midX = (obsX + predX) / 2;
    const midY = (obsY + predY) / 2;
    const shiftMiles = (predicted.totalShift_arcsec / 3600) * (Math.PI / 180) * star.dist * LY_TO_MILES;
    ctx.fillStyle = 'rgba(255, 107, 157, 0.85)';
    ctx.font = '9px "JetBrains Mono", monospace';
    const label = formatShift(predicted.totalShift_arcsec) + ' · ' + formatMiles(shiftMiles);
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(10,14,26,0.7)';
    ctx.fillRect(midX - tw / 2 - 3, midY - 12, tw + 6, 14);
    ctx.fillStyle = 'rgba(255, 107, 157, 0.85)';
    ctx.fillText(label, midX - tw / 2, midY - 1);

    // North arrow
    ctx.save();
    ctx.strokeStyle = 'rgba(100,140,220,0.3)';
    ctx.fillStyle = 'rgba(100,140,220,0.5)';
    ctx.lineWidth = 1;
    ctx.font = '9px "Space Grotesk"';
    ctx.fillText('N ↑', W - 28, 22);
    ctx.fillText('E →', W - 28, 34);
    ctx.restore();

  }, [star]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={320}
      className="w-full rounded-xl"
      style={{ maxHeight: 320 }}
    />
  );
}

function StarDriftCard({ star }) {
  const [open, setOpen] = useState(false);
  const predicted = getPredictedPosition(star);
  const sbs = computeSBSDelay(star);
  const distMiles = star.dist * LY_TO_MILES;
  const shiftMiles = (predicted.totalShift_arcsec / 3600) * (Math.PI / 180) * distMiles;
  const color = spectralToColor(star.spectral);

  return (
    <div className="border border-border rounded-xl overflow-hidden mb-4 bg-card">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}80` }} />
          <div>
            <p className="font-semibold text-sm text-foreground">{star.name}</p>
            <p className="text-xs text-muted-foreground">{star.constellation || 'Standalone'} · {star.dist.toLocaleString()} ly · {star.spectral}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-pink-400 font-mono">{formatShift(predicted.totalShift_arcsec)}</p>
            <p className="text-[10px] text-muted-foreground">{formatMiles(shiftMiles)}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Canvas */}
          <DriftCanvas star={star} />

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Distance from Earth</p>
              <p className="font-semibold text-foreground">{star.dist.toLocaleString()} ly</p>
              <p className="text-muted-foreground">{formatMiles(distMiles)}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Light travel time</p>
              <p className="font-semibold text-foreground">{star.dist.toLocaleString()} years</p>
              <p className="text-muted-foreground">Since light left it</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Position gap (angle)</p>
              <p className="font-semibold text-pink-400">{formatShift(predicted.totalShift_arcsec)}</p>
              <p className="text-muted-foreground">Observed vs real-time</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Position gap (distance)</p>
              <p className="font-semibold text-pink-400">{formatMiles(shiftMiles)}</p>
              <p className="text-muted-foreground">Estimated actual gap</p>
            </div>
          </div>

          {/* Drift detail */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Observed position (J2000)</p>
              <p className="font-mono text-foreground">RA: {star.ra.toFixed(4)} hrs</p>
              <p className="font-mono text-foreground">Dec: {star.dec.toFixed(4)}°</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Estimated real-time position</p>
              <p className="font-mono text-pink-400">RA: {predicted.ra.toFixed(4)} hrs</p>
              <p className="font-mono text-pink-400">Dec: {predicted.dec.toFixed(4)}°</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Proper motion (drift/yr)</p>
              <p className="font-mono text-foreground">RA: {star.pmRA > 0 ? '+' : ''}{star.pmRA} mas/yr</p>
              <p className="font-mono text-foreground">Dec: {star.pmDec > 0 ? '+' : ''}{star.pmDec} mas/yr</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground mb-1">Transverse speed</p>
              <p className="font-semibold text-foreground">{sbs.vTransverse.toFixed(1)} km/s</p>
              <p className="text-muted-foreground">{(sbs.vTransverse * 2237.14).toFixed(0)} mph</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StarDrift() {
  const [sortBy, setSortBy] = useState('dist');
  const sorted = [...STARS].sort((a, b) => {
    if (sortBy === 'dist') return a.dist - b.dist;
    if (sortBy === 'shift') {
      return getPredictedPosition(b).totalShift_arcsec - getPredictedPosition(a).totalShift_arcsec;
    }
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/90 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Chart
        </Link>
        <div className="h-4 w-px bg-border" />
        <Star className="w-3.5 h-3.5 text-primary" />
        <h1 className="text-sm font-semibold font-heading">Historical Star Drift</h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">Sort by:</span>
          {[['dist', 'Distance'], ['shift', 'Largest Shift'], ['name', 'Name']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSortBy(val)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${sortBy === val ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Intro */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6 text-sm text-muted-foreground leading-relaxed">
          Each card shows a star's <strong className="text-foreground">observed position</strong> (white dot — where we see it) 
          vs its <strong className="text-pink-400">estimated real-time position ◆</strong> (where it actually is now), 
          with its historical drift trail fading behind it. The dashed line and distance label show how far apart these two points are in both angle and miles.
        </div>

        {sorted.map(star => (
          <StarDriftCard key={star.name} star={star} />
        ))}
      </div>
    </div>
  );
}