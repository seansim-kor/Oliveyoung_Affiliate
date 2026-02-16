import React, { forwardRef } from 'react';
import { AnalysisResult } from '../types';
import { Sparkles, Trophy, Calendar } from 'lucide-react';
import { SkinRadarChart } from './RadarChart';

interface ShareCardProps {
    result: AnalysisResult;
    userName?: string;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ result }, ref) => {
    return (
        <div ref={ref} className="w-[375px] h-[667px] bg-slate-900 text-white p-8 relative overflow-hidden flex flex-col items-center justify-between font-sans selection:bg-rose-500/30">

            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[50%] bg-rose-600/30 blur-[100px] rounded-full mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[50%] bg-blue-600/30 blur-[100px] rounded-full mix-blend-screen"></div>

            {/* Header */}
            <div className="flex items-center gap-2 z-10 mt-4">
                <div className="w-8 h-8 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
                    <Sparkles size={18} fill="white" />
                </div>
                <span className="font-black text-xl tracking-tighter">K-Beauty Mirror</span>
            </div>

            {/* Main Score */}
            <div className="relative z-10 text-center mt-6">
                <div className="text-rose-300 text-xs font-black uppercase tracking-[0.2em] mb-2">My Skin Score</div>
                <div className="text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] leading-none">
                    {result.overallScore}
                </div>

                <div className="flex items-center justify-center gap-6 mt-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex flex-col items-center min-w-[100px]">
                        <Trophy size={16} className="text-yellow-400 mb-1" />
                        <span className="text-[9px] uppercase text-white/60 font-bold">Skin Rank</span>
                        <span className="text-lg font-bold">{result.overallScore > 90 ? 'S Tier' : result.overallScore > 80 ? 'A Tier' : 'B Tier'}</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex flex-col items-center min-w-[100px]">
                        <Calendar size={16} className="text-blue-400 mb-1" />
                        <span className="text-[9px] uppercase text-white/60 font-bold">Skin Age</span>
                        <span className="text-lg font-bold">{result.estimatedAge}</span>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="w-full relative z-10 mt-4 bg-white/5 backdrop-blur-sm rounded-3xl p-2 border border-white/10">
                {/* We need to override the radar chart styles for dark mode context */}
                <div className="[&_text]:!fill-slate-400 [&_line]:!stroke-slate-700">
                    <SkinRadarChart metrics={result.metrics} />
                </div>
            </div>

            {/* Footer / CTA */}
            <div className="z-10 text-center mb-8 w-full">
                <div className="border-t border-white/10 my-4 w-1/2 mx-auto"></div>
                <p className="text-white/60 text-[10px] uppercase tracking-widest mb-2">Developed by AI</p>
                <div className="bg-white text-slate-900 font-black text-xs py-3 px-6 rounded-full inline-block shadow-xl">
                    k-beauty-mirror.shop
                </div>
            </div>

        </div>
    );
});

ShareCard.displayName = 'ShareCard';
