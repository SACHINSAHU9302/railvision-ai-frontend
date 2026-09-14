'use client';

import * as React from 'react';
import { Station, Platform, ImportantPoint } from '@/types/station';
import { Accessibility, ArrowUpRight, MapPin, Train } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StationLayoutMapProps {
  station: Station;
  selectedPlatform?: number | null;
  onSelectPlatform?: (platformNumber: number) => void;
  className?: string;
}

export function StationLayoutMap({
  station,
  selectedPlatform,
  onSelectPlatform,
  className,
}: StationLayoutMapProps) {
  const [hoveredPoint, setHoveredPoint] = React.useState<ImportantPoint | null>(null);

  return (
    <div className={cn('flex flex-col space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Station Concourse &amp; Platform Schematic
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Interactive terminal layout • Click a platform or point to highlight
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 dark:bg-blue-500 inline-block" />
            <span>Active Platform</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Foot-Over-Bridge</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Concourse Entry</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 overflow-x-auto shadow-inner">
        <svg
          viewBox="0 0 800 420"
          className="w-full min-w-[640px] h-[340px] select-none"
        >
          {/* Background Grid Pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="800" height="420" fill="url(#grid)" />

          {/* West Concourse Entrance / Paharganj */}
          <rect x="20" y="40" width="80" height="340" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="60" y="200" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(-90 60 200)">
            MAIN CONCOURSE / ENTRY
          </text>

          {/* East Concourse / Ajmeri Gate or Terminal 2 */}
          <rect x="700" y="40" width="80" height="340" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          <text x="740" y="200" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(90 740 200)">
            OUTSTATION / SECOND ENTRY
          </text>

          {/* Central Foot-Over-Bridges (FOB 1 & FOB 2) */}
          <line x1="100" y1="120" x2="700" y2="120" stroke="#f59e0b" strokeWidth="6" strokeDasharray="8 4" strokeLinecap="round" />
          <text x="400" y="112" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
            NORTH FOOT-OVER-BRIDGE (FOB-1 with Lifts)
          </text>

          <line x1="100" y1="300" x2="700" y2="300" stroke="#f59e0b" strokeWidth="6" strokeDasharray="8 4" strokeLinecap="round" />
          <text x="400" y="322" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
            CENTRAL FOOT-OVER-BRIDGE (FOB-2 with Escalators)
          </text>

          {/* Platforms */}
          {station.platforms.map((platform, idx) => {
            const yPos = 60 + idx * 75;
            const isSelected = selectedPlatform === platform.number;

            return (
              <g
                key={platform.id}
                onClick={() => onSelectPlatform?.(platform.number)}
                className="cursor-pointer group"
              >
                {/* Track Line */}
                <line x1="100" y1={yPos + 18} x2="700" y2={yPos + 18} stroke="#334155" strokeWidth="3" />
                <line x1="100" y1={yPos + 26} x2="700" y2={yPos + 26} stroke="#334155" strokeWidth="3" />

                {/* Platform Island Box */}
                <rect
                  x="130"
                  y={yPos}
                  width="540"
                  height="34"
                  rx="6"
                  fill={isSelected ? '#1d4ed8' : '#0f172a'}
                  stroke={isSelected ? '#60a5fa' : '#334155'}
                  strokeWidth={isSelected ? '2' : '1'}
                  className="transition-colors group-hover:stroke-blue-400"
                />

                {/* Platform Number Badge */}
                <rect
                  x="140"
                  y={yPos + 7}
                  width="28"
                  height="20"
                  rx="4"
                  fill={isSelected ? '#ffffff' : '#2563eb'}
                />
                <text
                  x="154"
                  y={yPos + 21}
                  fill={isSelected ? '#1d4ed8' : '#ffffff'}
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {platform.number}
                </text>

                {/* Platform Label / Direction */}
                <text
                  x="180"
                  y={yPos + 21}
                  fill={isSelected ? '#ffffff' : '#e2e8f0'}
                  fontSize="11"
                  fontWeight="600"
                >
                  Platform {platform.number}: {platform.direction}
                </text>

                {/* Current Train if any */}
                {platform.currentTrain && (
                  <text
                    x="520"
                    y={yPos + 21}
                    fill={isSelected ? '#93c5fd' : '#94a3b8'}
                    fontSize="10"
                    textAnchor="end"
                  >
                    🚂 {platform.currentTrain}
                  </text>
                )}

                {/* Accessibility indicators on platform */}
                {platform.isAccessible && (
                  <circle cx="650" cy={yPos + 17} r="7" fill="#10b981" />
                )}
              </g>
            );
          })}

          {/* Important Points Markers */}
          {station.importantPoints.map((pt) => {
            const px = (pt.coordinates.x / 100) * 800;
            const py = (pt.coordinates.y / 100) * 420;

            return (
              <g
                key={pt.id}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={px}
                  cy={py}
                  r="9"
                  fill={pt.type === 'gate' ? '#10b981' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <circle
                  cx={px}
                  cy={py}
                  r="14"
                  fill="none"
                  stroke={pt.type === 'gate' ? '#10b981' : '#f59e0b'}
                  strokeWidth="1"
                  opacity="0.4"
                  className="animate-ping"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover details badge */}
        {hoveredPoint && (
          <div className="absolute top-4 left-4 p-3 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-xs shadow-xl backdrop-blur-xs max-w-xs animate-in fade-in">
            <p className="font-semibold text-blue-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{hoveredPoint.name}</span>
            </p>
            <p className="text-[11px] text-slate-300 mt-1">{hoveredPoint.locationDescription}</p>
            <p className="text-[10px] text-slate-400 mt-1">Near Platform {hoveredPoint.platformNear}</p>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
        Tip: Elevators and wheelchair ramps connect via Central Foot-Over-Bridge landings on both ends.
      </p>
    </div>
  );
}
