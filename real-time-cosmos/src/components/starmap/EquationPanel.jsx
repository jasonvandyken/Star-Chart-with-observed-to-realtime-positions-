import React from 'react';
import { X } from 'lucide-react';

export default function EquationPanel({ onClose }) {
  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-10">
      <div className="relative px-5 pt-4 pb-3">
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 font-heading">SBS Time Delay Formula</h3>
        
        {/* Equation display */}
        <div className="bg-muted rounded-lg p-4 text-center mb-3">
          <div className="font-mono text-sm md:text-base text-foreground">
            <span className="text-primary">T<sub>observed</sub></span>
            <span className="text-muted-foreground mx-2">=</span>
            <span className="text-accent">T<sub>actual</sub></span>
            <span className="text-muted-foreground mx-2">+</span>
            <span className="text-pink-400">
              √(H² + D²)
            </span>
            <span className="text-muted-foreground mx-1">/</span>
            <span className="text-green-400">C<sub>s</sub></span>
          </div>
        </div>

        {/* Variables */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-start gap-2">
            <span className="font-mono text-pink-400 w-6 shrink-0">H</span>
            <span className="text-muted-foreground">Object motion (transverse displacement)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-mono text-pink-400 w-6 shrink-0">D</span>
            <span className="text-muted-foreground">Distance from the observer</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-mono text-green-400 w-6 shrink-0">C<sub>s</sub></span>
            <span className="text-muted-foreground">Signal velocity (speed of light)</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          This formula predicts where stars actually are <em>right now</em>, accounting for the time light takes to reach us and the star's own motion through space.
        </p>
      </div>
    </div>
  );
}