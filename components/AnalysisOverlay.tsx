import React, { useState } from 'react';
import { Issue } from '../types';
import { Maximize2 } from 'lucide-react';

interface AnalysisOverlayProps {
  imageSrc: string;
  issues: Issue[];
  faceBox?: number[]; // [ymin, xmin, ymax, xmax] 0-1000
}

export const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({ imageSrc, issues, faceBox }) => {
  const [activeIssue, setActiveIssue] = useState<number | null>(null);

  // Advanced Visual Framing Logic
  let viewportStyle = {};
  if (faceBox && faceBox.length === 4) {
    const [ymin, xmin, ymax, xmax] = faceBox;
    const faceWidth = xmax - xmin;
    const faceHeight = ymax - ymin;
    const centerX = (xmin + xmax) / 2;
    const centerY = (ymin + ymax) / 2;

    // We want the face to fill about 65% of the shortest dimension of our viewport
    // Zoom factor: 1000 is our base scale.
    const scale = Math.min(Math.max(1000 / Math.max(faceWidth, faceHeight) * 0.65, 1.2), 3.5);

    viewportStyle = {
      transform: `scale(${scale})`,
      transformOrigin: `${centerX / 10}% ${centerY / 10}%`,
    };
  }

  return (
    <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-950 shadow-2xl mb-8 group ring-1 ring-white/10 select-none">
      {/* Precision Content Layer */}
      <div className="w-full h-full relative transition-transform duration-1000 cubic-bezier(0.23, 1, 0.32, 1)" style={viewportStyle}>
        <img
          src={imageSrc}
          alt="Analyzed Face"
          className="w-full h-full object-cover"
        />

        {/* Markers */}
        {issues?.map((issue, index) => {
          if (!issue.box_2d) return null;
          const [ymin, xmin, ymax, xmax] = issue.box_2d;

          const top = ymin / 10;
          const left = xmin / 10;
          const height = (ymax - ymin) / 10;
          const width = (xmax - xmin) / 10;

          return (
            <div
              key={index}
              className={`absolute border-2 transition-all duration-300 cursor-pointer ${activeIssue === index
                ? 'border-rose-400 bg-rose-500/20 z-20 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-[1.02]'
                : 'border-white/40 hover:border-white hover:bg-white/10 z-10'
                }`}
              style={{ top: `${top}%`, left: `${left}%`, height: `${height}%`, width: `${width}%` }}
              onClick={() => setActiveIssue(index === activeIssue ? null : index)}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-rose-500 rounded-full animate-ping opacity-75"></div>

              <div className={`absolute -top-7 left-0 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-tighter transition-all ${activeIssue === index
                ? 'bg-rose-500 text-white opacity-100 translate-y-0 shadow-lg'
                : 'bg-black/80 text-white opacity-0 group-hover:opacity-100 translate-y-1 backdrop-blur-sm'
                }`}>
                {issue.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Card */}
      {activeIssue !== null && (
        <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-rose-100 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{issues[activeIssue].label}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{issues[activeIssue].description}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIssue(null); }}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Maximize2 size={16} className="text-slate-400 rotate-45" />
            </button>
          </div>
        </div>
      )}

      {activeIssue === null && issues.length > 0 && (
        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
          <span className="bg-slate-900/60 text-white text-[10px] font-bold px-4 py-2 rounded-full backdrop-blur-md border border-white/10 tracking-wide uppercase">
            Touch markers for clinical details
          </span>
        </div>
      )}
    </div>
  );
};
