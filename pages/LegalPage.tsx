import React, { useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Info, Mail, Globe, Sparkles } from 'lucide-react';
import { TERMS_TEXT } from '../content/legal';
import { Footer } from '../components/Footer';

interface LegalPageProps {
    language: 'en' | 'ko';
}

export const LegalPage: React.FC<LegalPageProps> = ({ language }) => {
    const { type: paramType } = useParams<{ type: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const isKo = language === 'ko';

    // Determine type from param or pathname
    const type = (paramType || location.pathname.split('/').pop() || 'about') as keyof typeof TERMS_TEXT['en'];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [type]);

    const getContent = () => {
        const textData = TERMS_TEXT[language];
        if (!textData[type]) return null;

        const config = {
            privacy: { title: isKo ? '개인정보처리방침' : 'Privacy Policy', icon: <Shield className="text-rose-500" /> },
            terms: { title: isKo ? '이용약관' : 'Terms of Service', icon: <FileText className="text-blue-500" /> },
            about: { title: isKo ? '서비스 소개' : 'About Us', icon: <Info className="text-orange-500" /> },
            contact: { title: isKo ? '문의하기' : 'Contact Us', icon: <Mail className="text-emerald-500" /> },
            cookies: { title: isKo ? '쿠키 정책' : 'Cookie Policy', icon: <Globe className="text-indigo-500" /> },
        };

        const pageConfig = config[type as keyof typeof config];
        if (!pageConfig) return null;

        return {
            ...pageConfig,
            text: textData[type]
        };
    };

    const content = getContent();

    if (!content) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center p-8">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl mx-auto flex items-center justify-center">
                        <Sparkles size={40} className="text-rose-300" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Page Not Found</h1>
                    <Link to="/" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    // Parse text into sections for better UI
    const sections = content.text.trim().split('\n\n');

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-rose-500/30">
            <header className="p-6 flex items-center justify-between border-b border-rose-50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-rose-50 rounded-full transition-all active:scale-95">
                    <ArrowLeft size={24} className="text-slate-800" />
                </button>
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-rose-500" />
                    <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">
                        {content.title}
                    </h1>
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            <main className="flex-grow max-w-3xl mx-auto w-full p-8 py-20">
                <div className="flex flex-col items-center mb-16 space-y-4">
                    <div className="p-6 bg-white rounded-[2rem] shadow-2xl shadow-rose-200/50 ring-1 ring-rose-50 animate-in zoom-in duration-700">
                        {React.cloneElement(content.icon as React.ReactElement, { size: 48 })}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter text-center max-w-md leading-tight">
                        {content.title}
                    </h2>
                </div>

                <div className="space-y-12">
                    {sections.map((section, idx) => {
                        const lines = section.split('\n');
                        const title = lines[0];
                        const body = lines.slice(1).join('\n');

                        return (
                            <div key={idx} className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                    <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                                    {title}
                                </h3>
                                <div className="text-slate-600 leading-relaxed text-base font-medium whitespace-pre-wrap pl-5 border-l-2 border-slate-50 italic">
                                    {body}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {type === 'contact' && (
                    <div className="mt-20 p-10 bg-slate-900/5 rounded-[3rem] border border-slate-100 shadow-inner">
                        <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3">
                            <Mail size={24} className="text-rose-500" />
                            {isKo ? '문의 메시지 전송' : 'Send a Message'}
                        </h3>
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-2">{isKo ? '성함' : 'Full Name'}</label>
                                    <input type="text" placeholder={isKo ? "홍길동" : "Alex Doe"} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-2">{isKo ? '이메일' : 'Email Address'}</label>
                                    <input type="email" placeholder="simshome.sotre@gmail.com" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-2">{isKo ? '내용' : 'Message'}</label>
                                <textarea rows={5} placeholder={isKo ? '궁금하신 내용을 입력해 주세요...' : 'How can we help you today?'} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm" />
                            </div>
                            <button className="w-full bg-slate-900 hover:bg-rose-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                                {isKo ? '문의하기' : 'Submit Inquiry'}
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer language={language} />
        </div>
    );
};
