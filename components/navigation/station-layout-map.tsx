'use client';

import * as React from 'react';
import { Station, ImportantPoint } from '@/types/station';
import { Accessibility, MapPin, Train, Info } from 'lucide-react';
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
  const [hoveredPoint, setHoveredPoint] =
    React.useState<ImportantPoint | null>(null);

  const platforms = station.platforms || [];
  const importantPoints = station.importantPoints || [];

  return (
    <div className={cn('flex flex-col space-y-3', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Station Platform Layout
          </h4>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {station.name} • {station.code}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
            Active Platform
          </span>

          <span className="flex items-center gap-1">
            <Accessibility className="w-3.5 h-3.5 text-emerald-500" />
            Accessible
          </span>
        </div>
      </div>

      {/* SVG Map */}
      <div className="relative w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 overflow-x-auto shadow-inner">
        {platforms.length > 0 ? (
          <svg
            viewBox={`0 0 800 ${Math.max(
              180,
              platforms.length * 75 + 50
            )}`}
            className="w-full min-w-[500px] h-auto select-none"
          >
            {/* Grid */}
            <defs>
              <pattern
                id="station-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            <rect
              width="800"
              height={Math.max(180, platforms.length * 75 + 50)}
              fill="url(#station-grid)"
            />

            {/* Platforms from backend */}
            {platforms.map((platform, index) => {
              const yPos = 25 + index * 75;

              const isSelected =
                selectedPlatform === platform.number;

              return (
                <g
                  key={platform.id}
                  onClick={() =>
                    onSelectPlatform?.(platform.number)
                  }
                  className={
                    onSelectPlatform
                      ? 'cursor-pointer group'
                      : ''
                  }
                >
                  {/* Track */}
                  <line
                    x1="100"
                    y1={yPos + 18}
                    x2="700"
                    y2={yPos + 18}
                    stroke="#475569"
                    strokeWidth="3"
                  />

                  <line
                    x1="100"
                    y1={yPos + 26}
                    x2="700"
                    y2={yPos + 26}
                    stroke="#475569"
                    strokeWidth="3"
                  />

                  {/* Platform */}
                  <rect
                    x="120"
                    y={yPos}
                    width="560"
                    height="44"
                    rx="7"
                    fill={isSelected ? '#1d4ed8' : '#0f172a'}
                    stroke={
                      isSelected ? '#60a5fa' : '#334155'
                    }
                    strokeWidth={isSelected ? '2' : '1'}
                    className="transition-colors group-hover:stroke-blue-400"
                  />

                  {/* Platform Number */}
                  <rect
                    x="135"
                    y={yPos + 10}
                    width="35"
                    height="24"
                    rx="4"
                    fill="#2563eb"
                  />

                  <text
                    x="152"
                    y={yPos + 26}
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {platform.number}
                  </text>

                  {/* Platform Name */}
                  <text
                    x="185"
                    y={yPos + 26}
                    fill="#e2e8f0"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {platform.direction
                      ? platform.direction
                      : `Platform ${platform.number}`}
                  </text>

                  {/* Accessibility */}
                  {platform.isAccessible && (
                    <g>
                      <circle
                        cx="640"
                        cy={yPos + 22}
                        r="10"
                        fill="#059669"
                      />

                      <text
                        x="640"
                        y={yPos + 26}
                        fill="white"
                        fontSize="11"
                        textAnchor="middle"
                      >
                        ♿
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Facility markers only when valid coordinates exist */}
            {importantPoints.map((point) => {
              const x = point.coordinates?.x;
              const y = point.coordinates?.y;

              if (
                typeof x !== 'number' ||
                typeof y !== 'number' ||
                x <= 0 ||
                y <= 0
              ) {
                return null;
              }

              const px = (x / 100) * 800;
              const py =
                (y / 100) *
                Math.max(180, platforms.length * 75 + 50);

              return (
                <g
                  key={point.id}
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={px}
                    cy={py}
                    r="9"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  <circle
                    cx={px}
                    cy={py}
                    r="14"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                </g>
              );
            })}
          </svg>
        ) : (
          <div className="min-h-[220px] flex flex-col items-center justify-center text-center">
            <Train className="w-10 h-10 text-slate-500 mb-3" />

            <h3 className="text-sm font-semibold text-slate-200">
              Platform Layout Not Available
            </h3>

            <p className="text-xs text-slate-400 mt-2 max-w-sm">
              No platform records are currently available for
              this station. Add platforms through the Admin
              Dashboard to display them here.
            </p>
          </div>
        )}

        {/* Hover Details */}
        {hoveredPoint && (
          <div className="absolute top-4 left-4 p-3 rounded-lg bg-slate-900/95 border border-slate-700 text-white text-xs shadow-xl max-w-xs">
            <p className="font-semibold text-blue-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {hoveredPoint.name}
            </p>

            <p className="text-[11px] text-slate-300 mt-1">
              {hoveredPoint.locationDescription}
            </p>

            {hoveredPoint.platformNear > 0 && (
              <p className="text-[10px] text-slate-400 mt-1">
                Near Platform {hoveredPoint.platformNear}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Platform Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-[11px] text-slate-500">
            Total Platforms
          </p>

          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {station.platformsCount}
          </p>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-[11px] text-slate-500">
            Accessible Platforms
          </p>

          <p className="text-xl font-bold text-emerald-600 mt-1">
            {platforms.filter((p) => p.isAccessible).length}
          </p>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 col-span-2 sm:col-span-1">
          <p className="text-[11px] text-slate-500">
            Facilities
          </p>

          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {importantPoints.length}
          </p>
        </div>
      </div>

      {/* Information */}
      {platforms.length === 0 && (
        <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <Info className="w-4 h-4 shrink-0" />

          <p>
            Platform information will appear automatically
            when the administrator adds platform records.
          </p>
        </div>
      )}
    </div>
  );
}