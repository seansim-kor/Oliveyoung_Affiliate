import React, { useState } from 'react';
import { Mail, Lock, Chrome, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { Language } from '../types';

interface LoginViewProps {
    language: Language;
    onBack: () => void;
    onLogin: (email: string, name: string, rememberMe: boolean) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ language, onBack, onLogin }) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    const t = {
        en: {
            title: mode === 'login' ? 'Welcome Back' : 'Create Account',
            subtitle: mode === 'login' ? 'Login to track your skin journey' : 'Join us for personalized K-beauty care',
            email: 'Email Address',
            password: 'Password',
            login: 'Login',
            signup: 'Sign Up',
            google: 'Continue with Google',
            switchLogin: 'Already have an account? Login',
            switchSignup: "Don't have an account? Sign Up",
            remember: 'Stay logged in',
        },
        ko: {
            title: mode === 'login' ? '다시 오신 것을 환영합니다' : '계정 만들기',
            subtitle: mode === 'login' ? '로그인하여 피부 변화를 추적하세요' : '개인 맞춤형 K-뷰티 케어를 시작하세요',
            email: '이메일 주소',
            password: '비밀번호',
            login: '로그인',
            signup: '회원가입',
            google: '구글로 계속하기',
            switchLogin: '이미 계정이 있으신가요? 로그인',
            switchSignup: '계정이 없으신가요? 회원가입',
            remember: '로그인 상태 유지',
        }
    }[language];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            // Mock login
            const name = email.split('@')[0];
            onLogin(email, name, rememberMe);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col p-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-rose-500/20 blur-[100px] pointer-events-none"></div>

            <button
                onClick={onBack}
                className="self-start p-3 bg-white/5 rounded-2xl text-white mb-8 hover:bg-white/10 transition-colors"
            >
                <ArrowLeft size={20} />
            </button>

            <div className="flex-grow flex flex-col justify-center max-w-sm mx-auto w-full space-y-8 relative z-10">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{t.title}</h1>
                    <p className="text-slate-400 text-sm">{t.subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">{t.email}</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-medium"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">{t.password}</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pl-1 pb-2">
                        <button
                            type="button"
                            onClick={() => setRememberMe(!rememberMe)}
                            className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${rememberMe ? 'bg-rose-500 border-rose-500' : 'bg-transparent border-white/20'}`}
                        >
                            {rememberMe && <CheckCircle2 size={14} className="text-white" />}
                        </button>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">{t.remember}</span>
                    </div>

                    <Button type="submit" fullWidth className="py-4 shadow-xl shadow-rose-500/20">
                        {mode === 'login' ? t.login : t.signup}
                    </Button>
                </form>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[.3em] font-black">
                        <span className="bg-slate-950 px-4 text-slate-500">OR</span>
                    </div>
                </div>

                <button
                    onClick={() => onLogin('google-user@gmail.com', 'Google User', rememberMe)}
                    className="w-full bg-white text-slate-900 font-black rounded-2xl py-4 flex items-center justify-center gap-3 hover:bg-slate-100 transition-all uppercase tracking-widest text-xs shadow-lg"
                >
                    <Chrome size={18} />
                    {t.google}
                </button>

                <button
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                    {mode === 'login' ? t.switchSignup : t.switchLogin}
                </button>
            </div>
        </div>
    );
};
