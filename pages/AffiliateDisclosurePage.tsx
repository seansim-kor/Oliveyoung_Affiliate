import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart, Shield } from 'lucide-react';
import { AFFILIATE_DISCLOSURE } from '../content/affiliateDisclosure';
import { Footer } from '../components/Footer';

/**
 * 제휴 공시(Affiliate Disclosure) 페이지
 * 왜: Google AdSense 심사 시 제휴 링크에 대한 투명한 공시가 없으면 "Thin Affiliate" 판정을 받음
 * FTC 규정에 따른 필수 공시 페이지
 */
interface AffiliateDisclosurePageProps {
    language: 'en' | 'ko';
}

export const AffiliateDisclosurePage: React.FC<AffiliateDisclosurePageProps> = ({ language }) => {
    const isKo = language === 'ko';
    const content = AFFILIATE_DISCLOSURE[language];

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = isKo
            ? '제휴 공시 | K-뷰티 미러'
            : 'Affiliate Disclosure | K-Beauty Mirror';
    }, [isKo]);

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-rose-500/30">
            <header className="p-6 flex items-center justify-between border-b border-rose-50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <Link to="/" className="p-2 hover:bg-rose-50 rounded-full transition-all active:scale-95">
                    <ArrowLeft size={24} className="text-slate-800" />
                </Link>
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-rose-500" />
                    <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">
                        {content.title}
                    </h1>
                </div>
                <div className="w-10"></div>
            </header>

            <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-16">
                {/* 히어로 */}
                <div className="text-center mb-16 space-y-6">
                    <div className="p-6 bg-white rounded-[2rem] shadow-2xl shadow-rose-200/50 ring-1 ring-rose-50 w-fit mx-auto">
                        <Heart size={48} className="text-rose-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                        {content.title}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {isKo ? `최종 수정일: ${content.lastUpdated}` : `Last Updated: ${content.lastUpdated}`}
                    </p>
                </div>

                {/* 투명성 배지 */}
                <div className="mb-12 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-start gap-4">
                    <Shield size={24} className="text-emerald-500 shrink-0 mt-1" />
                    <div>
                        <h3 className="text-sm font-black text-emerald-900 uppercase tracking-tight mb-1">
                            {isKo ? '투명성 보장' : 'Transparency Guaranteed'}
                        </h3>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                            {isKo
                                ? '이 페이지는 당사의 수익 구조를 완전히 공개하기 위해 작성되었습니다. 사용자의 신뢰가 가장 중요합니다.'
                                : 'This page fully discloses our revenue model. Your trust is our most important asset.'}
                        </p>
                    </div>
                </div>

                {/* 내용 섹션 */}
                <div className="space-y-12">
                    {content.sections.map((section, idx) => (
                        <div key={idx} className="space-y-3">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                                {section.heading}
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-base font-medium pl-5 border-l-2 border-slate-100">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-20 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-4 bg-gradient-to-r from-orange-500 to-rose-600 px-10 py-5 rounded-[2rem] text-white font-black uppercase tracking-tight shadow-xl shadow-rose-500/20 hover:scale-105 transition-transform"
                    >
                        {isKo ? 'AI 피부 분석 시작하기' : 'START YOUR AI SKIN SCAN'}
                    </Link>
                </div>
            </main>

            <Footer language={language} />
        </div>
    );
};
