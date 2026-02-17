import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, ChevronRight, RefreshCw, MapPin, Sparkles, AlertCircle, Globe, UserCheck, Gift, ShoppingBag, ArrowLeft, Share2, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { AppView, LOCATIONS, AnalysisResult, Language, UserDemographics, User } from './types';
import { analyzeSkin } from './services/geminiService';
import { Button } from './components/Button';
import { ProductCard } from './components/ProductCard';
import { SkinRadarChart } from './components/RadarChart';
import { LoginView } from './components/LoginView';
import { CameraCapture } from './components/CameraCapture';
import { AnalysisOverlay } from './components/AnalysisOverlay';
import { DemographicsSelector } from './components/DemographicsSelector';
import { RewardCard } from './components/RewardCard';
import { GoogleAd } from './components/GoogleAd';
import { ShareCard } from './components/ShareCard';
import { SkinJourney } from './components/SkinJourney';
import { saveHistory, getHistory } from './services/historyService';
import { SKIN_GUIDE } from './content/skinGuide';
import { TERMS_TEXT } from './content/legal';
import { BlogList } from './pages/BlogList';
import { BlogPost } from './pages/BlogPost';
import { LegalPage } from './pages/LegalPage';
import { Footer } from './components/Footer';

const REFERRAL_LINK = "https://global.oliveyoung.com/member/join?reco_id=71161220260209121639";

const TEXTS = {
  en: {
    title: "K-Beauty Mirror",
    subtitle1: "AI Skin Scan.",
    subtitle2: "Your Perfect K-Beauty Prescription.",
    desc: "Our AI reads your unique facial profile to prescribe the ultimate K-Beauty regimen tailored to your skin and environment.",
    bonus: "Includes 10% OFF Welcome Gift",
    env: "Current Environment",
    start: "Start Analysis",
    upload: "Upload Photo",
    analyzing: "Analyzing Skin Profile...",
    analyzingDesc: "Designing your personalized 5-Step K-Beauty Routine...",
    report: "Your Skin Report",
    shop: "Shop Full 5-Step Routine",
    via: "via Olive Young Global",
    localTip: "Local Care Tip",
    curated: "Your 5-Step Routine",
    picksFor: "Complete regimen for",
    skinType: "Skin Type",
    tone: "Tone",
    sensitivity: "Sensitivity",
    skinScore: "Skin Score",
    skinAge: "Skin Age",
    privacy: "Your photos are processed securely and never stored.",
    error: "Failed to analyze image. Please try again with a clearer photo.",
    whyTitle: "Why K-Beauty Mirror?",
    whyDesc: "Personalized skincare requires more than just a guess. K-Beauty Mirror uses advanced AI to combine your skin's visual data with local environmental factors like humidity and UV index to suggest the perfect 5-step routine.",
    howTitle: "How Our AI Works",
    howStep1: "1. Visual Analysis: Our model scans for texture, hydration levels, and sensitivity.",
    howStep2: "2. Environmental Sync: We fetch real-time weather and air quality data for your location.",
    howStep3: "3. Curated Match: We match your unique profile with top-rated, proven K-Beauty products.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Is my photo stored?",
    faqA1: "No, your photo is processed in real-time and immediately deleted.",
    faqQ2: "Are the products sponsored?",
    faqA2: "Our AI prioritizes efficacy and user reviews from Olive Young's vast database.",
    share: "Share Result",
  },
  ko: {
    title: "K-뷰티 미러",
    subtitle1: "당신의 얼굴을 읽고,",
    subtitle2: "가장 완벽한 K-뷰티를 처방합니다.",
    desc: "최첨단 AI 안면 스캔을 통해 당신의 피부 상태와 환경에 딱 맞는 최적의 K-뷰티 루틴을 설계해 드립니다.",
    bonus: "첫 구매 10% 할인 혜택 포함",
    env: "현재 위치 및 환경",
    start: "분석 시작하기",
    upload: "사진 업로드",
    analyzing: "피부 프로필 분석 중...",
    analyzingDesc: "당신만을 위한 5단계 K-뷰티 루틴을 설계 중입니다...",
    report: "피부 분석 리포트",
    shop: "5단계 루틴 전체 구매하기",
    via: "올리브영",
    localTip: "환경 맞춤 케어 팁",
    curated: "나만의 5단계 루틴",
    picksFor: "완벽한 케어 루틴 for",
    skinType: "피부 타입",
    tone: "피부톤",
    sensitivity: "민감도",
    skinScore: "피부 점수",
    skinAge: "피부 나이",
    privacy: "사진은 안전하게 처리되며 저장되지 않습니다.",
    error: "이미지 분석에 실패했습니다. 더 선명한 사진으로 다시 시도해주세요.",
    whyTitle: "왜 K-뷰티 미러인가요?",
    whyDesc: "맞춤형 스킨케어는 단순한 추측보다 정확한 데이터가 필요합니다. K-뷰티 미러는 고도화된 AI를 통해 당신의 피부 데이터와 습도, 자외선 지수 등 현지 환경 요소를 결합하여 가장 완벽한 5단계 루틴을 제안합니다.",
    howTitle: "AI 분석 원리",
    howStep1: "1. 시각적 분석: AI 모델이 피부 결, 수분 상태, 민감도를 정밀 스캔합니다.",
    howStep2: "2. 환경 동기화: 현재 위치의 날씨 및 공기질 데이터를 실시간으로 반영합니다.",
    howStep3: "3. 최적의 매칭: 올리브영의 방대한 데이터베이스를 바탕으로 당신에게 꼭 맞는 제품을 선별합니다.",
    faqTitle: "자주 묻는 질문(FAQ)",
    faqQ1: "내 사진이 저장되나요?",
    faqA1: "아니요, 사진은 실시간 분석 후 즉시 파기되어 안전합니다.",
    faqQ2: "추천 제품은 광고인가요?",
    faqA2: "아니요, AI는 오직 성분과 올리브영의 실제 사용자 리뷰를 기준으로 추천합니다.",
    share: "결과 공유하기",
  }
};

const MainTool: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedLocation, setSelectedLocation] = useState<string>(LOCATIONS[1].name);
  const [storeRegion, setStoreRegion] = useState<'KR' | 'Global'>('Global');
  const [demographics, setDemographics] = useState<UserDemographics>({ gender: 'Female', ageGroup: '20s' });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLegal, setShowLegal] = useState<'none' | 'terms' | 'privacy'>('none');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const t = TEXTS[language];

  useEffect(() => {
    // Auto-login logic
    const savedUser = localStorage.getItem('kbeauty_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (userTimezone === 'Asia/Seoul') {
      setStoreRegion('KR');
      setLanguage('ko');
      setSelectedLocation(LOCATIONS.find(l => l.id === 'seoul')?.name || LOCATIONS[0].name);
    } else {
      setStoreRegion('Global');
    }
  }, []);

  const handleStartFlow = () => setView(AppView.DEMOGRAPHICS);
  const handleDemographicsComplete = (data: UserDemographics) => {
    setDemographics(data);
    setView(AppView.CAMERA);
  };

  const handleLogin = (email: string, name: string, rememberMe: boolean) => {
    const newUser = { email, name, isLoggedIn: true };
    setUser(newUser);
    if (rememberMe) {
      localStorage.setItem('kbeauty_user', JSON.stringify(newUser));
    }
    setView(AppView.LANDING);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kbeauty_user');
  };

  const handleAnalysis = async (file: File) => {
    console.log("[DEBUG] Starting analysis...");
    const imageUrl = URL.createObjectURL(file);
    setCapturedImage(imageUrl);
    setView(AppView.ANALYZING);
    setAnalyzing(true);
    setError(null);
    try {
      console.log("[DEBUG] Calling analyzeSkin...");
      const analysisData = await analyzeSkin(file, selectedLocation, language, demographics);
      console.log("[DEBUG] Analysis complete, result:", analysisData);
      console.log("[DEBUG] Products count:", analysisData?.products?.length);

      const resultWithTimestamp = { ...analysisData, timestamp: Date.now() };
      console.log("[DEBUG] Setting result state...");
      setResult(resultWithTimestamp);
      saveHistory(resultWithTimestamp);

      console.log("[DEBUG] Setting view to RESULTS");
      setView(AppView.RESULTS);
      console.log("[DEBUG] View state updated to RESULTS");
    } catch (err: any) {
      console.error("[ERROR] Analysis Error:", err);
      setError(err.message || String(err));
      setView(AppView.LANDING);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleAnalysis(file);
    event.target.value = '';
  };

  const triggerFileUpload = () => fileInputRef.current?.click();
  const resetApp = () => {
    setResult(null);
    setCapturedImage(null);
    setView(AppView.LANDING);
    setError(null);
  };
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'ko' : 'en');
  const handleStickyBuy = () => window.open(storeRegion === 'Global' ? REFERRAL_LINK : "https://www.oliveyoung.co.kr", '_blank');

  const handleShare = async () => {
    if (shareCardRef.current) {
      try {
        const canvas = await html2canvas(shareCardRef.current, {
          useCORS: true,
          backgroundColor: '#0f172a', // slate-900
          scale: 2 // High res
        });

        const image = canvas.toDataURL("image/png");

        // Create download link
        const link = document.createElement('a');
        link.href = image;
        link.download = `k-beauty-mirror-result-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Optional: Web Share API if supported
        if (navigator.share) {
          const blob = await (await fetch(image)).blob();
          const file = new File([blob], "skin-analysis.png", { type: "image/png" });
          try {
            await navigator.share({
              title: 'K-Beauty Mirror Result',
              text: 'Check out my K-Beauty skin analysis!',
              files: [file]
            });
          } catch (e) {
            console.log('Share API canceled or failed', e);
          }
        }

      } catch (err) {
        console.error("Failed to generate share image", err);
        alert("Failed to create share image. Please try again.");
      }
    }
  };

  const totals = (() => {
    if (!result || !result.products) return { original: 0, discounted: 0, savings: 0 };
    const original = result.products.reduce((acc, curr) => acc + (curr?.priceUsd || 0), 0);
    const discounted = Math.floor(original * 0.9);
    return { original, discounted, savings: original - discounted };
  })();

  return (
    <>
      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />

      {/* Hidden Share Card for Capture */}
      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
        {result && <ShareCard ref={shareCardRef} result={result} />}
      </div>

      {view === AppView.CAMERA && (
        <CameraCapture onCapture={handleAnalysis} onClose={() => setView(AppView.DEMOGRAPHICS)} onUpload={triggerFileUpload} />
      )}

      {view === AppView.DEMOGRAPHICS && (
        <section className="min-h-screen flex flex-col max-w-md mx-auto bg-white p-6">
          <header className="flex justify-between items-center mb-4">
            <button onClick={() => setView(AppView.LANDING)} className="text-slate-400">Back</button>
          </header>
          <DemographicsSelector onComplete={handleDemographicsComplete} initialData={demographics} />
        </section>
      )}

      {view === AppView.LANDING && (
        <article className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-950 shadow-2xl overflow-hidden relative selection:bg-rose-500/30">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-orange-500/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-rose-500/30 rounded-full blur-[120px] animate-bounce" style={{ animationDuration: '8s' }}></div>
            <div className="absolute -bottom-[10%] left-[20%] w-[80%] h-[80%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }}></div>
          </div>

          <style>{`
            @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-10px) rotate(2deg); } }
            .animate-float { animation: float 4s ease-in-out infinite; }
            .glass-card { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }
          `}</style>

          <header className="p-6 flex justify-between items-center z-20">
            <div className="font-black text-2xl tracking-tighter flex items-center gap-2 group cursor-default">
              <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-2xl flex items-center justify-center text-white rotate-3">
                <Sparkles size={20} fill="white" />
              </div>
              <span className="text-white font-black">{t.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/blog" className="text-[10px] font-black uppercase tracking-widest px-4 py-2 glass-card rounded-full text-white">BLOG</Link>
              <button onClick={toggleLanguage} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 glass-card rounded-full text-white">{language === 'en' ? 'KO' : 'EN'}</button>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-white/20 transition-all"
                  title={user.name}
                >
                  <LogOut size={16} className="text-rose-500" />
                </button>
              ) : (
                <button
                  onClick={() => setView(AppView.LOGIN)}
                  className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-rose-500 rounded-full text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"
                >
                  {language === 'ko' ? "로그인" : "Login"}
                </button>
              )}
            </div>
          </header>

          <main className="flex-grow flex flex-col px-8 relative z-10 pt-4">
            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                <AlertCircle className="text-rose-500 shrink-0" size={18} />
                <p className="text-rose-200 text-xs font-medium">{error}</p>
              </div>
            )}

            <div className="relative mb-10 mt-4 group">
              <div className="w-full aspect-square rounded-[3rem] overflow-hidden relative shadow-2xl ring-4 ring-white/20">
                <img
                  src="/hero-image.jpg"
                  alt="K-Beauty AI Mirror Analysis"
                  className="w-full h-full object-cover scale-[1.19] object-[center_35%] group-hover:scale-[1.29] transition-transform duration-[3s] bg-slate-900"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 via-transparent to-purple-500/20 mix-blend-overlay"></div>

                {/* Overlay: Glow Ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/5 h-3/5 border-[3px] border-cyan-300/60 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.6)] animate-pulse z-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 border-[1px] border-white/40 rounded-full animate-spin-slow duration-[10s]"></div>

                {/* Floating Tags */}
                <div className="absolute bottom-8 left-6 animate-float">
                  <div className="glass-card px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl bg-black/30 backdrop-blur-md border border-white/20">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Hydration: 95%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10 text-white">
              <h1 className="text-3xl font-black uppercase">{t.subtitle1} <br /> {t.subtitle2}</h1>
              <p className="text-slate-400 text-sm">{t.desc}</p>
            </div>

            {/* Environment Selection */}
            <div className="mb-8 p-5 rounded-[2rem] glass-card border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-500/20 rounded-xl">
                  <MapPin size={18} className="text-rose-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">{language === 'ko' ? "내 주변 환경" : "MY ENVIRONMENT"}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedLocation}</p>
                </div>
              </div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.name} className="bg-slate-900 text-white">
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-auto mb-10 space-y-4">
              <button onClick={handleStartFlow} className="w-full bg-gradient-to-r from-orange-500 to-rose-600 py-5 rounded-3xl text-white font-black uppercase shadow-2xl shadow-rose-600/20 active:scale-95 transition-all">{t.start}</button>
              <button onClick={triggerFileUpload} className="w-full py-5 glass-card rounded-3xl text-white/80 font-bold uppercase active:scale-95 transition-all">{t.upload}</button>
            </div>
          </main>

          <div className="px-6 pb-24 space-y-16 relative z-10 bg-slate-950/50">
            {/* Content blocks for SEO */}
            <section className="space-y-12">
              <h2 className="text-2xl font-black text-white uppercase">{SKIN_GUIDE[language].title}</h2>
              <p className="text-slate-400 text-sm italic">{SKIN_GUIDE[language].intro}</p>

              <div className="space-y-10">
                {SKIN_GUIDE[language].steps.map((step, idx) => (
                  <div key={idx} className="relative pl-8 border-l border-white/10 group cursor-default">
                    <div className="absolute -left-[5px] top-1 w-[9px] h-[9px] rounded-full bg-rose-500 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-tight">{step.name}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {SKIN_GUIDE[language].ingredients.map((ing, idx) => (
                  <div key={idx} className="glass-card p-4 rounded-3xl border-white/5">
                    <h5 className="text-rose-400 text-[10px] font-black uppercase mb-1">{ing.name}</h5>
                    <p className="text-slate-500 text-[9px] leading-tight">{ing.desc}</p>
                  </div>
                ))}
              </div>
            </section>
            <GoogleAd />
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-12 opacity-50 px-8">
            <Link to="/about" className="text-[10px] font-bold uppercase text-white">About</Link>
            <Link to="/contact" className="text-[10px] font-bold uppercase text-white">Contact</Link>
            <Link to="/privacy" className="text-[10px] font-bold uppercase text-white">Privacy</Link>
            <Link to="/terms" className="text-[10px] font-bold uppercase text-white">Terms</Link>
          </div>
          <Footer language={language} />
        </article>
      )}

      {view === AppView.ANALYZING && (
        <section className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-center p-8 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-radial from-rose-500/10 via-transparent to-transparent animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-rose-500/20 rounded-full animate-ping"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-cyan-500/20 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-rose-600 rounded-3xl rotate-12 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white scale-125">
                <Sparkles size={48} fill="white" className="animate-bounce" />
              </div>
              <div className="absolute -inset-4 border-2 border-white/10 rounded-[2rem] animate-spin-slow"></div>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter animate-pulse">{t.analyzing}</h2>
              <div className="flex flex-col items-center gap-2">
                <p className="text-slate-400 text-sm font-medium max-w-[240px] leading-relaxed">{t.analyzingDesc}</p>
                <div className="flex gap-1 mt-2">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>

            <div className="glass-card px-6 py-3 rounded-2xl border-white/10">
              <span className="text-[10px] font-black text-rose-300 uppercase tracking-[0.3em]">Precision Scanning Active</span>
            </div>
          </div>
        </section>
      )}

      {view === AppView.RESULTS && result && (() => {
        console.log("[DEBUG] Rendering RESULTS view");
        console.log("[DEBUG] Current view:", view);
        console.log("[DEBUG] Result exists:", !!result);
        console.log("[DEBUG] Result.products:", result.products);

        if (!result.products || result.products.length === 0) {
          console.error("[ERROR] Result has no products!");
          return (
            <div className="min-h-screen flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-red-500 font-bold mb-4">분석 결과에 제품 정보가 없습니다.</p>
                <button onClick={resetApp} className="px-6 py-3 bg-rose-500 text-white rounded-lg">
                  다시 시도
                </button>
              </div>
            </div>
          );
        }

        return (
          <article className="min-h-screen flex flex-col max-w-md mx-auto bg-rose-50/50 pb-32">
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md p-6 flex justify-between items-center border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white">
                  <Sparkles size={16} fill="white" />
                </div>
                <h2 className="font-black uppercase tracking-tighter text-slate-900">{t.report}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleShare} className="p-2 hover:bg-rose-100 rounded-full transition-colors group" title="Share Result">
                  <Share2 size={18} className="text-slate-600 group-hover:text-rose-500 transition-colors" />
                </button>
                <button onClick={resetApp} className="p-2 hover:bg-rose-100 rounded-full transition-colors group" title="New Analysis">
                  <RefreshCw size={18} className="text-slate-600 group-hover:text-rose-500 transition-colors" />
                </button>
              </div>
            </header>

            <main className="p-6 space-y-8">
              {/* Visual Analysis Results */}
              {capturedImage && <AnalysisOverlay imageSrc={capturedImage} issues={result.issues} faceBox={result.faceBox} />}

              {/* Score & Age Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-rose-300 text-[10px] font-black uppercase tracking-widest mb-1">{t.skinScore}</div>
                    <div className="text-5xl font-light tabular-nums">{result.overallScore}</div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-500/20 rounded-full blur-2xl"></div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-rose-100 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-rose-500 text-[10px] font-black uppercase tracking-widest mb-1">{t.skinAge}</div>
                    <div className="text-5xl font-light text-slate-900 tabular-nums">{result.estimatedAge}</div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-100 rounded-full blur-2xl"></div>
                </div>
              </div>

              {/* Detailed Clinical Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-3xl border border-slate-100 text-center">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.skinType}</div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1">{result.skinType}</div>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-slate-100 text-center">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.tone}</div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1">{result.skinTone}</div>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-slate-100 text-center">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.sensitivity}</div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1">{result.sensitivityLevel}</div>
                </div>
              </div>

              {/* Radar Chart Analysis */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <UserCheck size={14} className="text-rose-500" />
                  {String(language) === 'ko' ? "피부 밸런스 분석" : "Skin Balance Metrics"}
                </h3>
                {(() => {
                  try {
                    return <SkinRadarChart metrics={result.metrics} />;
                  } catch (error) {
                    console.error("[ERROR] RadarChart rendering failed:", error);
                    return (
                      <div className="w-full h-[300px] bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex items-center justify-center">
                        <p className="text-sm text-slate-500">차트를 불러올 수 없습니다</p>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Skin Journey (History) */}
              <SkinJourney
                history={getHistory()}
                language={language}
                isLoggedIn={!!user}
                onLoginClick={() => setView(AppView.LOGIN)}
              />

              {/* Professional Summary */}
              <div className="bg-rose-500/5 rounded-[2.5rem] p-8 border border-rose-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{String(language) === 'ko' ? "전문가 정밀 진단" : "Professional Diagnosis"}</h4>
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{String(language) === 'ko' ? "AI 스킨 마스터" : "AI Skin Master"}</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed antialiased italic">
                  "{result.analysisSummary}"
                </p>
              </div>

              {/* Local Environment Advice */}
              {result.weatherAdvice && (
                <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex gap-4 items-start">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <MapPin size={20} className="text-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-emerald-900 uppercase tracking-tight">{t.localTip}</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed font-medium">{result.weatherAdvice}</p>
                  </div>
                </div>
              )}

              {/* Products Section */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t.curated}</h3>
                  <span className="text-[10px] font-bold text-white bg-slate-900 px-3 py-1 rounded-full">{result.products.length} {String(language) === 'ko' ? "단계" : "Steps"}</span>
                </div>
                <div className="space-y-4">
                  {result.products?.map((p, i) => <ProductCard key={i} product={p} index={i} storeRegion={storeRegion} referralLink={REFERRAL_LINK} />)}
                </div>
              </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/80 backdrop-blur-xl border-t border-rose-100 z-30">
              <Button onClick={handleStickyBuy} fullWidth variant="secondary" className="shadow-2xl shadow-rose-500/20">
                <div className="flex items-center justify-center gap-2">
                  <ShoppingBag size={20} />
                  <span>{t.shop}</span>
                </div>
              </Button>
            </div>
            <Footer language={language} />
          </article>
        );
      })()}
      {view === AppView.LOGIN && (
        <LoginView
          language={language}
          onBack={() => setView(AppView.LANDING)}
          onLogin={handleLogin}
        />
      )}
    </>
  );
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  useEffect(() => {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Seoul') setLanguage('ko');
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainTool />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/about" element={<LegalPage language={language} />} />
      <Route path="/contact" element={<LegalPage language={language} />} />
      <Route path="/privacy" element={<LegalPage language={language} />} />
      <Route path="/terms" element={<LegalPage language={language} />} />
      <Route path="/cookies" element={<LegalPage language={language} />} />
      <Route path="/legal/:type" element={<LegalPage language={language} />} />
    </Routes>
  );
};

export default App;
