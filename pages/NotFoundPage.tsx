import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft, BookOpen } from 'lucide-react';

/**
 * 404 페이지 — 존재하지 않는 경로 접근 시 표시
 * 왜: Google Bot이 깨진 링크를 발견하면 사이트 품질 점수가 떨어짐
 * 사용자를 유용한 페이지로 유도하는 것이 중요
 */
export const NotFoundPage: React.FC = () => {
    useEffect(() => {
        document.title = 'Page Not Found | K-Beauty Mirror';
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* 배경 효과 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-orange-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-[10%] right-[20%] w-[60%] h-[60%] bg-rose-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 text-center space-y-8 max-w-md">
                <div className="w-24 h-24 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-3xl flex items-center justify-center text-white mx-auto rotate-6 shadow-2xl shadow-rose-500/30">
                    <Sparkles size={48} fill="white" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-7xl font-black text-white tracking-tighter">404</h1>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">
                        Page Not Found
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        The page you are looking for doesn't exist or has been moved.
                        Let's get you back on track to discovering your perfect K-Beauty routine.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-600 px-8 py-4 rounded-2xl text-white font-black uppercase tracking-tight shadow-xl hover:scale-105 transition-transform"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-8 py-4 rounded-2xl text-white font-bold uppercase tracking-tight hover:bg-white/20 transition-all"
                    >
                        <BookOpen size={18} />
                        Read Blog
                    </Link>
                </div>

                {/* 유용한 링크 */}
                <div className="pt-8 border-t border-white/10">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Useful Links</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/faq" className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-medium">FAQ</Link>
                        <Link to="/about" className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-medium">About</Link>
                        <Link to="/contact" className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-medium">Contact</Link>
                        <Link to="/privacy" className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-medium">Privacy</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
