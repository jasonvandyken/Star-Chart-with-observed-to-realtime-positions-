import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Grid3x3, Tag } from 'lucide-react';

export default function ControlBar({
  showPredicted,
  setShowPredicted,
  showConstellations,
  setShowConstellations,
  showLabels,
  setShowLabels,
}) {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
      <div className="bg-card/90 backdrop-blur-xl border border-border rounded-xl p-3 shadow-lg shadow-black/30 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse-glow" />
            <Label htmlFor="predicted" className="text-xs font-medium cursor-pointer select-none">
              Show Real-Time Positions
            </Label>
          </div>
          <Switch
            id="predicted"
            checked={showPredicted}
            onCheckedChange={setShowPredicted}
            className="scale-90"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Grid3x3 className="w-3 h-3 text-primary/60" />
            <Label htmlFor="constellations" className="text-xs font-medium cursor-pointer select-none">
              Constellations
            </Label>
          </div>
          <Switch
            id="constellations"
            checked={showConstellations}
            onCheckedChange={setShowConstellations}
            className="scale-90"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tag className="w-3 h-3 text-primary/60" />
            <Label htmlFor="labels" className="text-xs font-medium cursor-pointer select-none">
              Star Names
            </Label>
          </div>
          <Switch
            id="labels"
            checked={showLabels}
            onCheckedChange={setShowLabels}
            className="scale-90"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="bg-card/90 backdrop-blur-xl border border-border rounded-xl p-3 shadow-lg shadow-black/30">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Legend</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/80" />
            <span className="text-[11px] text-muted-foreground">Observed position (where we see it)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rotate-45 bg-pink-400/80" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            <span className="text-[11px] text-muted-foreground">Predicted real-time position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 border-t border-dashed border-pink-400/60" />
            <span className="text-[11px] text-muted-foreground">Position shift</span>
          </div>
        </div>
      </div>
    </div>
  );
}