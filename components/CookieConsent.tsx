import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

/**
 * 쿠키 동의 배너 — GDPR 및 Google AdSense 정책 준수
 * 왜: AdSense 사용 시 쿠키 사용에 대한 사용자 동의를 받아야 함
 * localStorage에 동의 상태를 저장하여 재방문 시 다시 표시하지 않음
 */
interface CookieConsentProps {
    language: 'en' | 'ko';
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ language }) => {
    const [isVisible, setIsVisible] = useState(false);
    const isKo = language === 'ko';

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // 1초 후에 표시 — 페이지 로딩 후 자연스럽게 나타남
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-lg mx-auto bg-slate-900 rounded-3xl p-6 shadow-2xl border border-white/10 backdrop-blur-xl">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-500/20 rounded-xl shrink-0">
                        <Cookie size={20} className="text-orange-400" />
                    </div>
                    <div className="flex-grow space-y-3">
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">
                            {isKo ? '쿠키 사용 안내' : 'Cookie Notice'}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {isKo
                                ? '당사는 최적의 사용자 경험과 서비스 분석을 위해 쿠키를 사용합니다. "동의"를 클릭하면 쿠키 사용에 동의하게 됩니다.'
                                : 'We use cookies for analytics and to enhance your experience. By clicking "Accept", you consent to our use of cookies.'}
                            {' '}
                            <Link to="/cookies" className="text-rose-400 underline hover:text-rose-300 transition-colors">
                                {isKo ? '쿠키 정책 보기' : 'Learn more'}
                            </Link>
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleAccept}
                                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-600 rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                            >
                                {isKo ? '동의' : 'Accept'}
                            </button>
                            <button
                                onClick={handleDecline}
                                className="px-6 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
                            >
                                {isKo ? '거부' : 'Decline'}
                            </button>
                        </div>
                    </div>
                    <button onClick={handleDecline} className="text-slate-500 hover:text-white transition-colors shrink-0">
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
