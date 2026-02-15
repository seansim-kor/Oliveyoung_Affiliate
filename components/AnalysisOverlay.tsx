import React, { useState } from 'react';
import { Issue } from '../types';
import { Maximize2, Sparkles } from 'lucide-react';

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

    // Reduced zoom by about 10% (0.65 -> 0.58) to show more context
    const scale = Math.min(Math.max(1000 / Math.max(faceWidth, faceHeight) * 0.58, 1.1), 3.0);

    viewportStyle = {
      transform: `scale(${scale})`,
      transformOrigin: `${centerX / 10}% ${centerY / 10}%`,
    };
  }

  return (
    <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-950 shadow-2xl mb-8 group ring-1 ring-white/10 select-none">
      {/* Precision Content Layer */}
      <div className="w-full h-full relative transition-transform duration-1000 cubic-bezier(0.23, 1, 0.32, 1)" style={viewportStyle}>
        <img
          src={imageSrc}
          alt="Analyzed Face"
          className="w-full h-full object-cover opacity-90"
        />

        {/* 3D-like Scan Lines Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-1 bg-cyan-400 absolute top-0 animate-[scan_4s_linear_infinite]"></div>
        </div>

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
              className={`absolute border transition-all duration-500 cursor-pointer rounded-full flex items-center justify-center ${activeIssue === index
                ? 'border-rose-400 bg-rose-500/30 z-20 shadow-[0_0_30px_rgba(244,63,94,0.8),inset_0_0_20px_rgba(244,63,94,0.4)] scale-[1.1]'
                : 'border-white/60 bg-white/5 hover:border-white hover:bg-white/20 z-10'
                }`}
              style={{ top: `${top}%`, left: `${left}%`, height: `${height}%`, width: `${width}%` }}
              onClick={() => setActiveIssue(index === activeIssue ? null : index)}
            >
              {/* 3D Core Ring */}
              <div className="relative w-full h-full rounded-full transition-transform duration-700" style={{ perspective: '1000px' }}>
                <div className="absolute inset-0 border border-white/20 rounded-full animate-spin-slow opacity-50"></div>
                <div className="absolute inset-0 border border-white/10 rounded-full animate-reverse-spin opacity-30"></div>

                {/* Center Pulse Point */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_white]"></div>
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping absolute top-0 left-0"></div>
                </div>
              </div>

              {/* Tag Component */}
              <div className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all duration-500 flex items-center gap-2 ${activeIssue === index
                ? 'bg-rose-500 text-white opacity-100 -translate-y-2 shadow-xl border border-rose-300/50'
                : 'bg-black/80 text-white opacity-0 group-hover:opacity-100 translate-y-0 backdrop-blur-md border border-white/10'
                }`}>
                <Sparkles size={10} fill="white" />
                {issue.label}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-reverse-spin { animation: spin 8s linear infinite reverse; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Details Card */}
      {activeIssue !== null && (
        <div className="absolute bottom-8 left-8 right-8 bg-slate-900/90 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-rose-500 rounded-full"></div>
                <h4 className="font-black text-white text-base uppercase tracking-tight">{issues[activeIssue].label}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">{issues[activeIssue].description}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIssue(null); }}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all group/close"
            >
              <Maximize2 size={18} className="text-white rotate-45 group-hover:scale-110" />
            </button>
          </div>
        </div>
      )}

      {activeIssue === null && issues.length > 0 && (
        <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none px-12">
          <span className="bg-white/10 text-white text-[9px] font-black px-6 py-2.5 rounded-full backdrop-blur-md border border-white/10 tracking-[0.2em] uppercase shadow-2xl animate-pulse">
            INTERACTIVE SCANNER: SELECT MARKER
          </span>
        </div>
      )}
    </div>
  );
};
