import React, { useState } from 'react';
import StarCanvas from '@/components/starmap/StarCanvas';
import StarInfoPanel from '@/components/starmap/StarInfoPanel';
import ControlBar from '@/components/starmap/ControlBar';
import { Star, BookOpen, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StarChart() {
  const [showPredicted, setShowPredicted] = useState(true);
  const [showConstellations, setShowConstellations] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedStar, setSelectedStar] = useState(null);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Title bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-2 pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-card/60 backdrop-blur-lg rounded-full border border-border/50 pointer-events-auto">
          <Star className="w-3.5 h-3.5 text-primary" />
          <h1 className="text-xs font-medium font-heading text-foreground tracking-wide">
            Real-Time Stellar Positions
          </h1>
          <div className="w-px h-3 bg-border/50 mx-1" />
          <Link to="/guide" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <BookOpen className="w-3 h-3" />
            Guide
          </Link>
          <div className="w-px h-3 bg-border/50 mx-1" />
          <Link to="/drift" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Activity className="w-3 h-3" />
            Drift
          </Link>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full h-full">
        <StarCanvas
          showPredicted={showPredicted}
          selectedStar={selectedStar}
          onSelectStar={setSelectedStar}
          showConstellations={showConstellations}
          showLabels={showLabels}
        />
      </div>

      {/* Controls */}
      <ControlBar
        showPredicted={showPredicted}
        setShowPredicted={setShowPredicted}
        showConstellations={showConstellations}
        setShowConstellations={setShowConstellations}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
      />

      {/* Star info */}
      {selectedStar && (
        <StarInfoPanel star={selectedStar} onClose={() => setSelectedStar(null)} />
      )}



      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/50 font-mono pointer-events-none select-none">
        drag to pan · scroll to zoom · click a star for details
      </div>
    </div>
  );
}