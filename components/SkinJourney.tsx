import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { AnalysisResult, Language } from '../types';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';

interface SkinJourneyProps {
    history: AnalysisResult[];
    language?: Language;
    isLoggedIn?: boolean;
    onLoginClick?: () => void;
}

export const SkinJourney: React.FC<SkinJourneyProps> = ({ history, language = 'en', isLoggedIn = false, onLoginClick }) => {
    if (!isLoggedIn) {
        return (
            <div className="bg-slate-900 p-8 rounded-[2rem] text-center border border-white/5 relative overflow-hidden group cursor-pointer" onClick={onLoginClick}>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-rose-500 border border-white/10">
                        <Lock size={24} />
                    </div>
                </div>
                <h3 className="text-white font-black uppercase tracking-widest mb-2">{language === 'ko' ? "로그인이 필요합니다" : "Login Required"}</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-[200px] mx-auto">
                    {language === 'ko' ? "내 피부 변화를 추적하고 개인화된 리포트를 보관하려면 로그인해 주세요." : "Please login to track your skin journey and save personalized reports."}
                </p>
                <div className="mt-6">
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] border-b border-rose-500/30 pb-1">{language === 'ko' ? "지금 로그인하기" : "Login Now"}</span>
                </div>
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <div className="bg-slate-50 p-6 rounded-3xl text-center border border-slate-100">
                <div className="flex justify-center mb-3">
                    <AlertCircle className="text-slate-300" size={40} />
                </div>
                <p className="text-slate-500 font-medium">No skin history yet.</p>
                <p className="text-slate-400 text-xs mt-1">Start your first analysis to track your journey!</p>
            </div>
        );
    }

    // Format data for chart (reverse chronologically for display, but chart needs chronological)
    const chartData = [...history].reverse().map((item, idx) => {
        const dateObj = new Date(item.timestamp || Date.now());
        const dateStr = dateObj.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
            month: 'short',
            day: 'numeric'
        });
        const timeStr = dateObj.toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        return {
            date: history.length > 5 ? dateStr : `${dateStr} ${timeStr}`,
            fullDate: `${dateStr} ${timeStr}`,
            score: item.overallScore,
            age: item.estimatedAge,
            index: idx + 1
        };
    });

    const latest = history[0];
    const first = history[history.length - 1];
    const improvement = latest.overallScore - first.overallScore;

    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-rose-50 rounded-xl">
                        <TrendingUp className="text-rose-500" size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{language === 'ko' ? "내 피부 변화" : "My Skin Journey"}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{language === 'ko' ? `최근 ${history.length}회 분석` : `LAST ${history.length} SCANS`}</p>
                    </div>
                </div>
                {improvement !== 0 && (
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${improvement > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {improvement > 0 ? '+' : ''}{improvement} pts
                    </div>
                )}
            </div>

            <div className="h-[200px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#f43f5e"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-3">
                {history.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-100 shadow-sm">
                                {item.overallScore}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-700">{new Date(item.timestamp || Date.now()).toLocaleDateString()}</p>
                                <p className="text-[10px] text-slate-400 font-semibold">{item.skinType} • {item.estimatedAge} years</p>
                            </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                    </div>
                ))}
            </div>
        </div>
    );
};

function ChevronRight({ size, className }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}
