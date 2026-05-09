import React from 'react';
import { X, Telescope, MapPin, Zap, Clock, ArrowRight } from 'lucide-react';
import { spectralToColor, getPredictedPosition, CONSTELLATIONS } from '@/lib/starCatalog';

export default function StarInfoPanel({ star, onClose }) {
  if (!star) return null;

  const predicted = getPredictedPosition(star);
  const color = spectralToColor(star.spectral);
  const constName = star.constellation ? CONSTELLATIONS[star.constellation]?.name : null;

  const formatRA = (ra) => {
    const h = Math.floor(ra);
    const m = Math.floor((ra - h) * 60);
    const s = ((ra - h) * 60 - m) * 60;
    return `${h}h ${m}m ${s.toFixed(1)}s`;
  };

  const formatDec = (dec) => {
    const sign = dec >= 0 ? '+' : '-';
    const abs = Math.abs(dec);
    const d = Math.floor(abs);
    const m = Math.floor((abs - d) * 60);
    return `${sign}${d}° ${m}'`;
  };

  return (
    <div className="absolute top-4 right-4 w-80 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-10">
      {/* Header */}
      <div className="relative px-5 pt-5 pb-4">
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `radial-gradient(circle, ${color}, transparent)`, boxShadow: `0 0 20px ${color}40` }}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-heading text-foreground">{star.name}</h3>
            {constName && <p className="text-xs text-muted-foreground">{constName}</p>}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-muted text-muted-foreground">
            {star.spectral}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-muted text-muted-foreground">
            mag {star.mag.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Observed Position */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Telescope className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Observed Position</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">RA</span>
            <p className="font-mono text-foreground">{formatRA(star.ra)}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Dec</span>
            <p className="font-mono text-foreground">{formatDec(star.dec)}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Distance</span>
            <p className="font-mono text-foreground">{star.dist.toLocaleString()} ly</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Light travel</span>
            <p className="font-mono text-foreground">{predicted.lightTravelTimeYrs.toLocaleString()} yrs</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* SBS Prediction */}
      <div className="px-5 py-3 bg-secondary/30">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-xs font-medium text-pink-400 uppercase tracking-wider">Predicted Real-Time Position</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">Predicted RA</span>
            <p className="font-mono text-foreground">{formatRA(predicted.ra)}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Predicted Dec</span>
            <p className="font-mono text-foreground">{formatDec(predicted.dec)}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Time Delay</span>
            <p className="font-mono text-foreground">{predicted.sbsDelayYears.toFixed(2)} yrs</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">Positional Shift</span>
            <p className="font-mono text-foreground">{predicted.totalShift_arcsec.toFixed(2)}"</p>
          </div>
        </div>
        <div className="mt-3 p-2.5 rounded-lg bg-card/50 border border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Clock className="w-3 h-3" />
            <span>Transverse velocity</span>
          </div>
          <p className="font-mono text-sm text-foreground">{predicted.vTransverse.toFixed(1)} km/s</p>
        </div>
      </div>
    </div>
  );
}