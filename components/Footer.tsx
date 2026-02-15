import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, FileText, Info, Globe, Sparkles } from 'lucide-react';

interface FooterProps {
    language: 'en' | 'ko';
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
    const isKo = language === 'ko';

    return (
        <footer className="bg-slate-950 text-slate-400 py-16 px-8 border-t border-white/5 relative z-10">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Brand Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white font-black tracking-tighter text-lg uppercase">
                        <Sparkles size={20} className="text-orange-400" />
                        K-Beauty Mirror
                    </div>
                    <p className="text-xs leading-relaxed opacity-70">
                        {isKo
                            ? "AI 기술과 한국의 뷰티 노하우를 결합하여 당신만을 위한 최적의 스킨케어를 제안합니다. 지금 바로 빛나는 피부를 경험하세요."
                            : "Bridging AI technology with Korean beauty wisdom to prescribe your perfect skin regimen. Experience your true glow today."}
                    </p>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                    <h4 className="text-white text-xs font-black uppercase tracking-widest">{isKo ? "바로가기" : "Quick Links"}</h4>
                    <ul className="grid grid-cols-1 gap-3 text-xs font-semibold">
                        <li><Link to="/" className="hover:text-rose-400 transition-colors uppercase tracking-tight">{isKo ? "홈" : "Home"}</Link></li>
                        <li><Link to="/blog" className="hover:text-rose-400 transition-colors uppercase tracking-tight">{isKo ? "블로그" : "Blog"}</Link></li>
                        <li><Link to="/about" className="hover:text-rose-400 transition-colors uppercase tracking-tight">{isKo ? "소개" : "About Us"}</Link></li>
                        <li><Link to="/contact" className="hover:text-rose-400 transition-colors uppercase tracking-tight">{isKo ? "문의" : "Contact"}</Link></li>
                    </ul>
                </div>

                {/* Support & Legal */}
                <div className="space-y-4">
                    <h4 className="text-white text-xs font-black uppercase tracking-widest">{isKo ? "법적 고지" : "Legal"}</h4>
                    <ul className="grid grid-cols-1 gap-3 text-xs font-semibold">
                        <li><Link to="/privacy" className="hover:text-rose-400 transition-colors flex items-center gap-2 uppercase tracking-tight"><Shield size={12} /> {isKo ? "개인정보처리방침" : "Privacy Policy"}</Link></li>
                        <li><Link to="/terms" className="hover:text-rose-400 transition-colors flex items-center gap-2 uppercase tracking-tight"><FileText size={12} /> {isKo ? "이용약관" : "Terms of Service"}</Link></li>
                        <li><Link to="/cookies" className="hover:text-rose-400 transition-colors flex items-center gap-2 uppercase tracking-tight"><Globe size={12} /> {isKo ? "쿠키 정책" : "Cookie Policy"}</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">
                    © 2026 K-Beauty Mirror. All rights reserved.
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <a href="mailto:simshome.store@gmail.com" className="hover:text-white transition-colors flex items-center gap-2">
                        <Mail size={14} /> simshome.store@gmail.com
                    </a>
                </div>
            </div>

            {/* Bottom SEO Disclaimer */}
            <div className="max-w-4xl mx-auto mt-8 text-[9px] leading-relaxed opacity-30 text-center">
                {isKo
                    ? "의학적 조언 대용이 될 수 없으며, 모든 추천 제품은 올리브영의 공개 데이터를 바탕으로 함을 밝힙니다."
                    : "Not a substitute for medical advice. All recommendations are based on publicly available data from Olive Young."}
            </div>
        </footer>
    );
};
