import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { STARS, computeSBSDelay, getPredictedPosition } from '@/lib/starCatalog';
import { ArrowLeft, ChevronDown, ChevronUp, Star, Compass, Clock, Ruler, Telescope } from 'lucide-react';

const LY_TO_MILES = 5.879e12;
const ARCSEC_TO_DEG = 1 / 3600;

function directionLabel(pmRA, pmDec) {
  const angle = Math.atan2(pmDec, pmRA) * (180 / Math.PI);
  const dirs = ['East', 'Northeast', 'North', 'Northwest', 'West', 'Southwest', 'South', 'Southeast'];
  const index = Math.round((angle + 180) / 45) % 8;
  return dirs[index];
}

function formatMiles(miles) {
  if (miles >= 1e15) return `${(miles / 1e15).toFixed(2)} quadrillion miles`;
  if (miles >= 1e12) return `${(miles / 1e12).toFixed(2)} trillion miles`;
  if (miles >= 1e9) return `${(miles / 1e9).toFixed(2)} billion miles`;
  return `${miles.toLocaleString()} miles`;
}

function formatShift(arcsec) {
  if (arcsec >= 3600) return `${(arcsec / 3600).toFixed(2)}°`;
  if (arcsec >= 60) return `${(arcsec / 60).toFixed(2)} arcminutes`;
  return `${arcsec.toFixed(2)} arcseconds`;
}

function speedDescription(kmS) {
  if (kmS < 10) return 'very slow';
  if (kmS < 50) return 'slow';
  if (kmS < 150) return 'moderate';
  if (kmS < 400) return 'fast';
  return 'very fast';
}

function StarRow({ star }) {
  const [open, setOpen] = useState(false);
  const sbs = computeSBSDelay(star);
  const predicted = getPredictedPosition(star);
  const distMiles = star.dist * LY_TO_MILES;
  const shiftMiles = (predicted.totalShift_arcsec / 3600) * (Math.PI / 180) * distMiles;
  const dir = directionLabel(star.pmRA, star.pmDec);
  const speed = speedDescription(sbs.vTransverse);

  return (
    <div className="border border-border rounded-xl overflow-hidden mb-3">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/50 transition-colors text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-primary/10">
            <Star className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{star.name}</p>
            <p className="text-xs text-muted-foreground">{star.dist.toLocaleString()} light-years away · {star.constellation || 'Standalone'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-pink-400 font-mono">{formatShift(predicted.totalShift_arcsec)}</p>
            <p className="text-[10px] text-muted-foreground">position shift</p>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 bg-card/50 border-t border-border space-y-4">
          {/* Plain English summary */}
          <div className="bg-muted/60 rounded-lg p-3">
            <p className="text-sm text-foreground leading-relaxed">
              When you look at <strong>{star.name}</strong>, you're seeing light that left it{' '}
              <strong>{star.dist.toLocaleString()} years ago</strong>. The star is actually{' '}
              <strong>{formatMiles(shiftMiles)}</strong> away from where it appears in the sky — drifting{' '}
              <strong>{dir}</strong> at a <strong>{speed}</strong> speed of roughly{' '}
              <strong>{sbs.vTransverse.toFixed(0)} km/s</strong>{' '}
              ({(sbs.vTransverse * 2237).toFixed(0).toLocaleString()} mph).
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={<Clock className="w-3.5 h-3.5 text-primary" />}
              label="Light Travel Time"
              value={`${star.dist.toLocaleString()} yrs`}
              sub="Time light takes to reach us"
            />
            <StatCard
              icon={<Ruler className="w-3.5 h-3.5 text-yellow-400" />}
              label="Distance"
              value={`${star.dist.toLocaleString()} ly`}
              sub={formatMiles(distMiles)}
            />
            <StatCard
              icon={<Compass className="w-3.5 h-3.5 text-green-400" />}
              label="Moving Direction"
              value={dir}
              sub={`${sbs.vTransverse.toFixed(0)} km/s`}
            />
            <StatCard
              icon={<Telescope className="w-3.5 h-3.5 text-pink-400" />}
              label="Sky Position Shift"
              value={formatShift(predicted.totalShift_arcsec)}
              sub={formatMiles(shiftMiles) + ' actual gap'}
            />
          </div>

          {/* Proper motion detail */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground mb-1">East/West drift (RA)</p>
              <p className="font-mono text-foreground">{star.pmRA > 0 ? '+' : ''}{star.pmRA} mas/yr</p>
              <p className="text-muted-foreground">{star.pmRA > 0 ? 'Moving East' : 'Moving West'}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground mb-1">North/South drift (Dec)</p>
              <p className="font-mono text-foreground">{star.pmDec > 0 ? '+' : ''}{star.pmDec} mas/yr</p>
              <p className="text-muted-foreground">{star.pmDec > 0 ? 'Moving North' : 'Moving South'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-muted rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1.5">{icon}<p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p></div>
      <p className="text-sm font-semibold text-foreground leading-tight">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{sub}</p>}
    </div>
  );
}

export default function StarGuide() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/90 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Chart
        </Link>
        <div className="h-4 w-px bg-border" />
        <h1 className="text-sm font-semibold font-heading">Star Position Guide</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* What is this? */}
        <section>
          <h2 className="text-xl font-bold font-heading mb-3 text-foreground">What are we looking at?</h2>
          <div className="bg-card border border-border rounded-xl p-5 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Every star you see in the night sky is a <strong className="text-foreground">ghost image</strong> — 
              you're not seeing where the star <em>is</em>, you're seeing where it <em>was</em> when the light 
              you're currently observing first left it. That could be decades, hundreds, or thousands of years ago.
            </p>
            <p>
              This chart calculates 
              where each star <em>actually is right now</em> — its real-time position — based on how fast it's moving 
              and how long that light has been traveling toward us.
            </p>
            <p>
              The <strong className="text-pink-400">pink diamond ◆</strong> on the chart marks the star's estimated 
              real-time position. The <strong className="text-foreground">white dot</strong> is what your eye sees.
            </p>
          </div>
        </section>

        {/* The formula explained simply */}
        <section>
          <h2 className="text-xl font-bold font-heading mb-3 text-foreground">How we calculate real-time positions</h2>
          <div className="bg-card border border-border rounded-xl p-5 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Imagine shining a flashlight at a moving train. By the time the light reaches the camera, 
              the train has already moved on. Stars are the same — they're constantly drifting through space, 
              and their light takes years (sometimes thousands of years) to reach us.
            </p>
            <div className="bg-muted rounded-lg p-4 font-mono text-center text-sm">
              <span className="text-primary">Time we observe it</span>
              <span className="text-muted-foreground mx-2">=</span>
              <span className="text-accent">When it actually happened</span>
              <span className="text-muted-foreground mx-2">+</span>
              <span className="text-pink-400">Travel time of the light</span>
            </div>
            <p>
              The "travel time" accounts for both the raw distance to the star <em>and</em> the star's own sideways 
              motion through space. Put together, this tells us where the star has drifted to since the light we're seeing left it.
            </p>
          </div>
        </section>

        {/* Units explained */}
        <section>
          <h2 className="text-xl font-bold font-heading mb-3 text-foreground">What do the measurements mean?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { term: 'Light-year (ly)', plain: 'The distance light travels in one year — about 5.88 trillion miles. It\'s a distance, not a time.' },
              { term: 'Arcsecond (")', plain: 'A tiny unit of angle in the sky. There are 3,600 arcseconds in one degree. Think of it as the width of a coin seen from a mile away.' },
              { term: 'Proper Motion (mas/yr)', plain: 'How much a star appears to drift across the sky each year, measured in milli-arcseconds (thousandths of an arcsecond).' },
              { term: 'Transverse Velocity (km/s)', plain: 'How fast the star is moving sideways through space (not toward or away from us). Higher = bigger position gap.' },
            ].map(({ term, plain }) => (
              <div key={term} className="bg-card border border-border rounded-xl p-4">
                <p className="font-semibold text-foreground text-sm mb-1">{term}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{plain}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Star list */}
        <section>
          <h2 className="text-xl font-bold font-heading mb-1 text-foreground">Every star — the full breakdown</h2>
          <p className="text-sm text-muted-foreground mb-4">Click any star to expand its details in plain language.</p>
          {STARS.sort((a, b) => a.dist - b.dist).map(star => (
            <StarRow key={star.name} star={star} />
          ))}
        </section>
      </div>
    </div>
  );
}