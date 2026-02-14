import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Info, Mail, Globe } from 'lucide-react';
import { TERMS_TEXT } from '../content/legal';
import { Footer } from '../components/Footer';

interface LegalPageProps {
    language: 'en' | 'ko';
}

export const LegalPage: React.FC<LegalPageProps> = ({ language }) => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const isKo = language === 'ko';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [type]);

    const getContent = () => {
        switch (type) {
            case 'privacy':
                return {
                    title: isKo ? '개인정보처리방침' : 'Privacy Policy',
                    icon: <Shield className="text-rose-500" />,
                    text: TERMS_TEXT[language].privacy
                };
            case 'terms':
                return {
                    title: isKo ? '이용약관' : 'Terms of Service',
                    icon: <FileText className="text-blue-500" />,
                    text: TERMS_TEXT[language].terms
                };
            case 'about':
                return {
                    title: isKo ? '서비스 소개' : 'About Us',
                    icon: <Info className="text-orange-500" />,
                    text: TERMS_TEXT[language].about
                };
            case 'contact':
                return {
                    title: isKo ? '문의하기' : 'Contact Us',
                    icon: <Mail className="text-emerald-500" />,
                    text: TERMS_TEXT[language].contact
                };
            case 'cookies':
                return {
                    title: isKo ? '쿠키 정책' : 'Cookie Policy',
                    icon: <Globe className="text-indigo-500" />,
                    text: TERMS_TEXT[language].cookies
                };
            default:
                return null;
        }
    };

    const content = getContent();

    if (!content) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                    <Link to="/" className="text-rose-600 font-bold">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-rose-50 flex flex-col">
            <header className="p-6 flex items-center justify-between border-b border-rose-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-rose-50 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-slate-800" />
                </button>
                <h1 className="text-lg font-black uppercase tracking-tighter text-slate-900">
                    {content.title}
                </h1>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            <main className="flex-grow max-w-2xl mx-auto w-full p-8 py-16">
                <div className="flex justify-center mb-8">
                    <div className="p-4 bg-white rounded-3xl shadow-xl shadow-rose-200/50">
                        {React.cloneElement(content.icon as React.ReactElement, { size: 40 })}
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-rose-200/30 border border-white">
                    <div className="prose prose-rose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-sm antialiased">
                            {content.text}
                        </pre>
                    </div>
                </div>

                {type === 'contact' && (
                    <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white shadow-xl">
                        <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Send us a message</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-1">Email</label>
                                <input type="email" placeholder="your@email.com" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-1">Message</label>
                                <textarea rows={4} placeholder="How can we help?" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                            </div>
                            <button className="w-full bg-rose-500 hover:bg-rose-600 py-4 rounded-xl font-bold uppercase tracking-widest transition-colors">
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer language={language} />
        </div>
    );
};
