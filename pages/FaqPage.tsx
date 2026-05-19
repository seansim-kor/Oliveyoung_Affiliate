import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { FAQ_DATA, FaqItem } from '../content/faqData';
import { Footer } from '../components/Footer';

/**
 * FAQ 페이지 — 에드센스 승인을 위한 핵심 콘텐츠 페이지
 * 왜 독립 페이지인가: Google은 사용자에게 실질적 가치를 제공하는 고유 콘텐츠를 요구함
 * 아코디언 방식으로 UX를 유지하면서도 풍부한 텍스트 콘텐츠를 제공
 */
interface FaqPageProps {
    language: 'en' | 'ko';
}

export const FaqPage: React.FC<FaqPageProps> = ({ language }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const isKo = language === 'ko';

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = isKo
            ? 'FAQ - 자주 묻는 질문 | K-뷰티 미러'
            : 'FAQ - Frequently Asked Questions | K-Beauty Mirror';
    }, [isKo]);

    const faqItems = FAQ_DATA[language];

    // 검색 필터링
    const filteredItems = searchQuery.trim()
        ? faqItems.filter(
            item =>
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : faqItems;

    // 카테고리별 그룹핑
    const categories = [...new Set(filteredItems.map(item => item.category))];

    const toggleItem = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-rose-500/30">
            {/* 상단 네비게이션 */}
            <header className="p-6 flex items-center justify-between border-b border-rose-50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <Link to="/" className="p-2 hover:bg-rose-50 rounded-full transition-all active:scale-95">
                    <ArrowLeft size={24} className="text-slate-800" />
                </Link>
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-rose-500" />
                    <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">
                        {isKo ? '자주 묻는 질문' : 'FAQ'}
                    </h1>
                </div>
                <div className="w-10"></div>
            </header>

            <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-16">
                {/* 히어로 섹션 */}
                <div className="text-center mb-16 space-y-6">
                    <div className="p-6 bg-white rounded-[2rem] shadow-2xl shadow-rose-200/50 ring-1 ring-rose-50 w-fit mx-auto">
                        <HelpCircle size={48} className="text-rose-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                        {isKo ? '자주 묻는 질문' : 'Frequently Asked Questions'}
                    </h2>
                    <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
                        {isKo
                            ? 'K-뷰티 미러에 대해 궁금한 점이 있으신가요? 아래에서 가장 많이 문의하시는 질문과 답변을 확인하세요.'
                            : 'Have questions about K-Beauty Mirror? Find answers to the most commonly asked questions below.'}
                    </p>
                </div>

                {/* 검색 바 */}
                <div className="relative mb-12">
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder={isKo ? '질문 검색...' : 'Search questions...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                </div>

                {/* FAQ 리스트 */}
                <div className="space-y-12">
                    {categories.map((category) => (
                        <section key={category}>
                            <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                                {category}
                            </h3>
                            <div className="space-y-3">
                                {filteredItems
                                    .filter(item => item.category === category)
                                    .map((item, idx) => {
                                        const globalIndex = faqItems.indexOf(item);
                                        const isOpen = openIndex === globalIndex;
                                        return (
                                            <div
                                                key={globalIndex}
                                                className={`border rounded-2xl transition-all duration-300 ${
                                                    isOpen
                                                        ? 'border-rose-200 bg-rose-50/30 shadow-sm'
                                                        : 'border-slate-100 hover:border-slate-200'
                                                }`}
                                            >
                                                <button
                                                    onClick={() => toggleItem(globalIndex)}
                                                    className="w-full flex items-center justify-between p-5 text-left"
                                                >
                                                    <span className="text-sm font-bold text-slate-800 pr-4 leading-relaxed">
                                                        {item.question}
                                                    </span>
                                                    {isOpen ? (
                                                        <ChevronUp size={18} className="text-rose-500 shrink-0" />
                                                    ) : (
                                                        <ChevronDown size={18} className="text-slate-400 shrink-0" />
                                                    )}
                                                </button>
                                                {isOpen && (
                                                    <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        </section>
                    ))}
                </div>

                {/* 추가 도움 섹션 */}
                <div className="mt-20 p-10 bg-slate-900 rounded-[3rem] text-center space-y-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                        {isKo ? '원하는 답을 찾지 못하셨나요?' : "Didn't find your answer?"}
                    </h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto">
                        {isKo
                            ? '언제든지 이메일로 문의해 주세요. 24시간 이내에 답변드리겠습니다.'
                            : 'Feel free to reach out to us via email. We typically respond within 24 hours.'}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/contact"
                            className="bg-gradient-to-r from-orange-500 to-rose-600 px-8 py-4 rounded-2xl text-white font-black uppercase tracking-tight shadow-xl hover:scale-105 transition-transform"
                        >
                            {isKo ? '문의하기' : 'Contact Us'}
                        </Link>
                        <Link
                            to="/"
                            className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl text-white font-bold uppercase tracking-tight hover:bg-white/20 transition-all"
                        >
                            {isKo ? 'AI 분석 시작' : 'Start AI Analysis'}
                        </Link>
                    </div>
                </div>
            </main>

            <Footer language={language} />
        </div>
    );
};
