import React, { useState } from 'react';
import { Issue } from '../types';
import { Maximize2 } from 'lucide-react';

interface AnalysisOverlayProps {
  imageSrc: string;
  issues: Issue[];
}

export const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({ imageSrc, issues }) => {
  const [activeIssue, setActiveIssue] = useState<number | null>(null);

  return (
    <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-slate-100 shadow-md mb-6 group">
      <img 
        src={imageSrc} 
        alt="Analyzed Face" 
        className="w-full h-full object-cover"
      />
      
      {/* Overlays */}
      {issues.map((issue, index) => {
        if (!issue.box_2d) return null;
        const [ymin, xmin, ymax, xmax] = issue.box_2d;
        
        // Convert 0-1000 scale to percentages
        const top = ymin / 10;
        const left = xmin / 10;
        const height = (ymax - ymin) / 10;
        const width = (xmax - xmin) / 10;

        return (
          <div
            key={index}
            className={`absolute border-2 transition-all duration-300 cursor-pointer ${
              activeIssue === index 
                ? 'border-rose-400 bg-rose-500/20 z-20 shadow-[0_0_15px_rgba(244,63,94,0.5)]' 
                : 'border-white/50 hover:border-white hover:bg-white/10 z-10'
            }`}
            style={{ top: `${top}%`, left: `${left}%`, height: `${height}%`, width: `${width}%` }}
            onClick={() => setActiveIssue(index === activeIssue ? null : index)}
          >
            {/* Label Tag */}
            <div className={`absolute -top-7 left-0 whitespace-nowrap px-2 py-0.5 rounded-md text-xs font-bold transition-opacity ${
              activeIssue === index 
                ? 'bg-rose-500 text-white opacity-100' 
                : 'bg-black/60 text-white opacity-0 group-hover:opacity-100'
            }`}>
              {issue.label}
            </div>
          </div>
        );
      })}

      {/* Detail Card for Active Issue */}
      {activeIssue !== null && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-rose-100 shadow-lg z-30 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{issues[activeIssue].label}</h4>
              <p className="text-xs text-slate-600 mt-1">{issues[activeIssue].description}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIssue(null); }}
              className="text-slate-400 hover:text-slate-600"
            >
              <Maximize2 size={14} className="rotate-45" />
            </button>
          </div>
        </div>
      )}
      
      {/* Hint overlay if nothing selected */}
      {activeIssue === null && issues.length > 0 && (
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
          <span className="bg-black/40 text-white text-[10px] px-3 py-1.5 rounded-full backdrop-blur-sm">
            Tap highlighted areas for details
          </span>
        </div>
      )}
    </div>
  );
};