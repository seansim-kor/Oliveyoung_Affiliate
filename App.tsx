import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, ChevronRight, RefreshCw, MapPin, Sparkles, AlertCircle, Globe, UserCheck, Gift, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppView, LOCATIONS, AnalysisResult, Language, UserDemographics } from './types';
import { analyzeSkin } from './services/geminiService';
import { Button } from './components/Button';
import { ProductCard } from './components/ProductCard';
import { SkinRadarChart } from './components/RadarChart';
import { CameraCapture } from './components/CameraCapture';
import { AnalysisOverlay } from './components/AnalysisOverlay';
import { DemographicsSelector } from './components/DemographicsSelector';
import { RewardCard } from './components/RewardCard';
import { GoogleAd } from './components/GoogleAd';
import { SKIN_GUIDE } from './content/skinGuide';
import { TERMS_TEXT } from './content/legal';
import { BlogList } from './pages/BlogList';
import { BlogPost } from './pages/BlogPost';

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
    faqA2: "Our AI prioritizes efficacy and user reviews from Olive Young's vast database."
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
    faqA2: "아니요, AI는 오직 성분과 올리브영의 실제 사용자 리뷰를 기준으로 추천합니다."
  }
};

const MainTool: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedLocation, setSelectedLocation] = useState<string>(LOCATIONS[1].name); // Default NY
  const [storeRegion, setStoreRegion] = useState<'KR' | 'Global'>('Global');

  const [demographics, setDemographics] = useState<UserDemographics>({ gender: 'Female', ageGroup: '20s' });

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLegal, setShowLegal] = useState<'none' | 'terms' | 'privacy'>('none');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = TEXTS[language];

  // Geolocation & Region Detection on Mount
  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (userTimezone === 'Asia/Seoul') {
      setStoreRegion('KR');
      setLanguage('ko');
      setSelectedLocation(LOCATIONS.find(l => l.id === 'seoul')?.name || LOCATIONS[0].name);
    } else {
      setStoreRegion('Global');
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("Location access granted", position.coords);
      }, (err) => {
        console.log("Location access denied or error", err);
      });
    }
  }, []);

  const handleStartFlow = () => {
    setView(AppView.DEMOGRAPHICS);
  };

  const handleDemographicsComplete = (data: UserDemographics) => {
    setDemographics(data);
    setView(AppView.CAMERA);
  };

  const handleAnalysis = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setCapturedImage(imageUrl);

    setView(AppView.ANALYZING);
    setAnalyzing(true);
    setError(null);

    try {
      const analysisData = await analyzeSkin(file, selectedLocation, language, demographics);
      setResult(analysisData);
      setView(AppView.RESULTS);
    } catch (err: any) {
      console.error(err);
      // Show more specific error if it's about the API key
      if (err.message && err.message.includes("API Key")) {
        setError(`Environment Configuration Error: ${err.message}`);
      } else {
        setError(err.message || t.error);
      }
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

  const handleCameraCapture = (file: File) => {
    handleAnalysis(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const startCamera = () => {
    setView(AppView.CAMERA);
  };

  const closeCamera = () => {
    setView(AppView.LANDING);
  };

  const resetApp = () => {
    setResult(null);
    setCapturedImage(null);
    setView(AppView.LANDING);
    setError(null);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ko' : 'en');
  };

  const handleStickyBuy = () => {
    if (storeRegion === 'Global') {
      window.open(REFERRAL_LINK, '_blank');
    } else {
      window.open("https://www.oliveyoung.co.kr", '_blank');
    }
  };

  // Calculate Totals for Bundle
  const calculateTotals = () => {
    if (!result || !result.products) return { original: 0, discounted: 0, savings: 0 };
    const original = result.products.reduce((acc, curr) => acc + (curr?.priceUsd || 0), 0);
    const discounted = Math.floor(original * 0.9);
    return { original, discounted, savings: original - discounted };
  };

  const totals = calculateTotals();

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />

      {view === AppView.CAMERA && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setView(AppView.DEMOGRAPHICS)}
          onUpload={triggerFileUpload}
        />
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
          {/* Animated Mesh Gradient Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-orange-500/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-rose-500/30 rounded-full blur-[120px] animate-bounce" style={{ animationDuration: '8s' }}></div>
            <div className="absolute -bottom-[10%] left-[20%] w-[80%] h-[80%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }}></div>
          </div>

          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0) rotate(0); }
              50% { transform: translateY(-10px) rotate(2deg); }
            }
            .animate-float { animation: float 4s ease-in-out infinite; }
            .neon-text {
              text-shadow: 0 0 10px rgba(244, 63, 94, 0.5), 0 0 20px rgba(244, 63, 94, 0.3);
            }
            .glass-card {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
          `}</style>

          <header className="p-6 flex justify-between items-center z-20">
            <div className="font-black text-2xl tracking-tighter flex items-center gap-2 group cursor-default">
              <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-2xl flex items-center justify-center text-white rotate-3 group-hover:rotate-12 transition-transform shadow-lg shadow-rose-500/20">
                <Sparkles size={20} fill="white" />
              </div>
              <span className="text-white neon-text underline decoration-rose-500/50 decoration-4 underline-offset-4 font-black">
                {t.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/blog"
                className="text-[10px] font-black uppercase tracking-widest px-4 py-2 glass-card hover:bg-white/10 rounded-full text-white transition-all active:scale-95 flex items-center gap-2"
              >
                <Sparkles size={12} className="text-orange-400" />
                BLOG
              </Link>
              <button
                onClick={toggleLanguage}
                className="text-[10px] font-black uppercase tracking-widest px-4 py-2 glass-card hover:bg-white/10 rounded-full text-white transition-all active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <Globe size={12} className="text-rose-400" />
                  {language === 'en' ? 'KO' : 'EN'}
                </span>
              </button>
            </div>
          </header>

          <main className="flex-grow flex flex-col px-8 relative z-10 pt-4">
            {/* Hero Visual Container */}
            <div className="relative mb-10 mt-4 group">
              <div className="w-full aspect-square rounded-[3rem] overflow-hidden relative shadow-2xl ring-1 ring-white/20">
                <img
                  src="https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?q=80&w=800&auto=format&fit=crop"
                  alt="K-Beauty AI Mirror Analysis"
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[3s] bg-slate-900"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>

                {/* Floating Insight Cards */}
                <div className="absolute top-6 left-6 animate-float" style={{ animationDelay: '0s' }}>
                  <div className="glass-card px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Hydration Level: 95%</span>
                  </div>
                </div>

                <div className="absolute top-20 right-6 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="glass-card px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl">
                    <Sparkles size={12} className="text-amber-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Skin Tone: Even</span>
                  </div>
                </div>

                <div className="absolute bottom-16 left-8 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="bg-rose-500/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl shadow-rose-500/20">
                    <UserCheck size={12} className="text-white" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">500k+ Scans 완료</span>
                  </div>
                </div>

                <div className="absolute bottom-24 right-8 animate-float" style={{ animationDelay: '1.5s' }}>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-xl shadow-xl border border-white/20">
                    🍑
                  </div>
                </div>
              </div>

              {/* Decorative Rings */}
              <div className="absolute inset-0 border-[16px] border-white/5 rounded-[3.5rem] -m-4 pointer-events-none"></div>
            </div>

            <div className="space-y-4 mb-10">
              <h1 className="text-3xl font-black text-white leading-tight tracking-tighter uppercase">
                {language === 'ko' ? (
                  <>당신의 얼굴을 읽고, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">가장 완벽한 K-뷰티를 처방합니다.</span></>
                ) : (
                  <>AI Skin Scan. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Your Perfect Prescription.</span></>
                )}
              </h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed pr-6 opacity-90">
                {t.desc}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 glass-card border-rose-500/30 text-rose-200 rounded-2xl text-xs flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="shrink-0 text-rose-500" />
                {error}
              </div>
            )}

            <div className="mt-auto mb-10 space-y-6">
              {/* Location Selector (Moved Above) */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-3 p-3 glass-card rounded-2xl w-full">
                  <MapPin size={16} className="text-rose-500" />
                  <select
                    className="bg-transparent text-white text-xs font-bold focus:outline-none appearance-none cursor-pointer uppercase tracking-wider text-center"
                    style={{ textAlignLast: 'center' }}
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    {LOCATIONS.map(loc => (
                      <option key={loc.id} value={loc.name} className="bg-slate-900">{loc.name}</option>
                    ))}
                  </select>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
                  {t.privacy}
                </p>
              </div>

              {/* Primary CTA: Camera */}
              <button
                onClick={handleStartFlow}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-orange-500 to-rose-600 p-[2px] rounded-3xl transition-transform active:scale-95 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
              >
                <div className="bg-slate-950 group-hover:bg-transparent transition-colors rounded-[calc(1.5rem-2px)] py-5 px-6 flex items-center justify-center gap-3">
                  <Camera size={22} className="text-white" />
                  <span className="text-white text-lg font-black uppercase tracking-tight">{t.start}</span>
                  <ChevronRight size={20} className="text-white/50 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Secondary CTA: Upload */}
              <button
                onClick={triggerFileUpload}
                className="w-full py-5 px-6 glass-card hover:bg-white/10 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 text-white/80 font-bold uppercase tracking-wide text-sm"
              >
                <Upload size={18} className="text-rose-400" />
                {t.upload}
              </button>



            </div>
          </main>

          {/* SEO/GEO CONTENT SECTIONS */}
          <div className="px-6 pb-24 space-y-16 relative z-10 border-t border-white/5 pt-16 mt-8 bg-slate-950/50 backdrop-blur-3xl">
            {/* 전문가 가이드 섹션 (AdSense 고품질 콘텐츠 요구사항 대응) */}
            <section className="space-y-12">
              <header>
                <h2 className="text-2xl font-black text-white mb-2 leading-tight tracking-tighter uppercase">{SKIN_GUIDE[language].title}</h2>
                <p className="text-slate-400 text-sm italic font-medium opacity-80">{SKIN_GUIDE[language].intro}</p>
              </header>

              {/* About Us / Mission Section */}
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-3">
                  <UserCheck size={20} className="text-rose-500" />
                  {language === 'ko' ? '서비스 소개 및 비전' : 'About K-Beauty Mirror'}
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed font-medium">
                  {language === 'ko'
                    ? "K-뷰티 미러는 최신 AI 멀티모달 기술과 한국의 전문 스킨케어 지식을 결합한 혁신적인 플랫폼입니다. 우리의 목표는 전 세계 모든 사용자가 기후와 환경에 상관없이 자신만의 완벽한 피부 솔루션을 찾을 수 있도록 돕는 것입니다. 데이터에 기반한 투명한 성분 분석과 검증된 올리브영 랭킹 제품만을 추천하여, 당신의 피부 건강을 진심으로 보살핍니다."
                    : "K-Beauty Mirror is an innovative platform that combines the latest AI multimodal technology with expert Korean skincare knowledge. Our goal is to help users worldwide find their perfect skin solution, regardless of climate and environment. We provide data-driven ingredient analysis and recommend only verified Olive Young bestsellers to truly care for your skin health."}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                  <Sparkles size={20} className="text-orange-400" />
                  {SKIN_GUIDE[language].philosophyTitle}
                </h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">{SKIN_GUIDE[language].philosophyDesc}</p>
                <div className="grid gap-6">
                  {SKIN_GUIDE[language].steps.map((step, i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-colors">
                      <h4 className="font-black text-white text-sm mb-2 uppercase tracking-tight group-hover:text-rose-400 transition-colors">{step.name}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed font-medium">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">{SKIN_GUIDE[language].typesTitle}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {SKIN_GUIDE[language].types.map((type, i) => (
                    <div key={i} className="p-5 bg-white/5 rounded-3xl border border-white/10">
                      <h4 className="font-black text-rose-500 text-sm mb-2 uppercase tracking-tighter">{type.name}</h4>
                      <p className="text-slate-400 text-[10px] leading-snug font-medium uppercase opacity-80">{type.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">{SKIN_GUIDE[language].ingredientsTitle}</h3>
                <div className="space-y-6">
                  {SKIN_GUIDE[language].ingredients.map((ing, i) => (
                    <div key={i} className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center shrink-0 shadow-inner">
                        <Sparkles size={18} className="text-rose-400" />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-sm uppercase tracking-tight">{ing.name}</h4>
                        <p className="text-slate-400 text-xs font-medium opacity-80">{ing.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-2xl">
              <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                <AlertCircle size={22} className="text-slate-500" />
                {t.faqTitle}
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-black text-slate-200 text-sm mb-2 uppercase tracking-tight">Q: {t.faqQ1}</h3>
                  <p className="text-slate-400 text-sm italic font-medium opacity-80">A: {t.faqA1}</p>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <h3 className="font-black text-slate-200 text-sm mb-2 uppercase tracking-tight">Q: {t.faqQ2}</h3>
                  <p className="text-slate-400 text-sm italic font-medium opacity-80">A: {t.faqA2}</p>
                </div>
              </div>
            </section>

            {/* AdSense Placement - Only show on landing where content is high */}
            <GoogleAd />
          </div>

          {/* Footer Section */}
          <footer className="px-8 py-16 bg-slate-950 border-t border-white/5 mt-auto z-10 relative">
            <div className="max-w-md mx-auto text-center flex flex-col items-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-xl flex items-center justify-center text-white text-xs font-black rotate-6 shadow-lg shadow-rose-500/20">K</div>
                <span className="font-black text-lg tracking-tighter uppercase text-white neon-text">K-Beauty Mirror</span>
              </div>
              <p className="text-[10px] text-slate-500 mb-10 leading-relaxed font-bold uppercase tracking-widest opacity-60">
                © 2025 K-Beauty Mirror. Powered by Advanced AI Dermatology Insights. <br />Recommendations are for informational purposes.
              </p>
              <div className="flex flex-wrap justify-center gap-6 border-t border-white/5 pt-10 w-full">
                <button onClick={() => setShowLegal('terms')} className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em]">Terms</button>
                <button onClick={() => setShowLegal('privacy')} className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em]">Privacy</button>
                <a href="mailto:support@k-beauty-mirror.site" className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em]">Contact</a>
              </div>
            </div>
          </footer>
        </article>
      )}

      {view === AppView.ANALYZING && (
        <section className="min-h-screen flex flex-col items-center justify-center max-w-md mx-auto bg-white p-6 text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute w-full h-full border-4 border-rose-100 rounded-full animate-ping opacity-25"></div>
            <Sparkles className="text-rose-500 animate-pulse" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.analyzing}</h2>
          <p className="text-slate-500 max-w-xs mx-auto">
            {t.analyzingDesc}
          </p>
          <div className="mt-8 w-64 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 w-1/2 animate-[shimmer_1s_infinite_linear]" style={{ width: '100%', transform: 'translateX(-100%)', animation: 'indeterminate 1.5s infinite linear' }}></div>
          </div>
          <style>{`
            @keyframes indeterminate {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </section>
      )}

      {view === AppView.RESULTS && result && (
        <article className="min-h-screen flex flex-col max-w-md mx-auto bg-rose-50/50">
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
            <div className="font-bold text-lg text-slate-800">{t.report}</div>
            <button onClick={resetApp} className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>

          <main className="flex-grow p-6 space-y-6 pb-32 overflow-y-auto">
            {/* Analysis Overlay Image */}
            {capturedImage && (
              <AnalysisOverlay imageSrc={capturedImage} issues={result.issues} faceBox={result.faceBox} />
            )}

            {/* Enhanced Summary Card */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl shadow-slate-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500 blur-[60px] opacity-30 rounded-full"></div>

              <div className="relative z-10">
                {/* Hero Stats */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-rose-300 font-medium text-xs tracking-wider uppercase mb-1">{t.skinScore}</div>
                    <div className="text-5xl font-light tracking-tighter">{String(result.overallScore || 0)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 font-medium text-xs tracking-wider uppercase mb-1">{t.skinAge}</div>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-3xl font-bold">{String(result.estimatedAge || 0)}</span>
                      <span className="text-sm text-slate-400">est.</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium backdrop-blur-sm border border-white/10">
                    {result.skinType}
                  </span>
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-medium backdrop-blur-sm border border-white/10">
                    {result.skinTone}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                    <UserCheck size={14} />
                    {language === 'ko' ? `전문의 소견 (${demographics.gender}, ${demographics.ageGroup})` : `Clinical Opinion (${demographics.gender}, ${demographics.ageGroup})`}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {result.analysisSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* REWARD CARD HOOK (Golden Moment) */}
            {storeRegion === 'Global' && (
              <RewardCard referralLink={REFERRAL_LINK} />
            )}

            {/* Environmental Advice */}
            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex gap-4 items-start">
              <div className="p-2 bg-white rounded-full text-blue-500 shadow-sm shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{t.localTip}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{result.weatherAdvice}</p>
              </div>
            </div>

            {/* Chart */}
            {result.metrics && <SkinRadarChart metrics={result.metrics} />}

            {/* Recommendations Header */}
            <div className="pt-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t.curated}</h3>
              <p className="text-sm text-slate-500 mb-4">{t.picksFor} {demographics.ageGroup} {demographics.gender}.</p>

              <div className="space-y-4">
                {result.products?.map((product, idx) => (
                  <ProductCard
                    key={idx}
                    product={product}
                    index={idx}
                    storeRegion={storeRegion}
                    referralLink={REFERRAL_LINK}
                  />
                ))}
              </div>
            </div>

            {/* Total Routine Value Summary */}
            {storeRegion === 'Global' && (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mt-6">
                <h4 className="font-bold text-slate-900 mb-4 text-center">Complete Routine Value</h4>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>5-Step Bundle Value</span>
                    <span className="line-through">${totals.original}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-rose-500">
                    <span>Member Savings (10% OFF)</span>
                    <span>-${totals.savings}</span>
                  </div>
                  <div className="border-t border-slate-200 my-2 pt-2 flex justify-between text-lg font-bold text-slate-900">
                    <span>You Pay</span>
                    <span>${totals.discounted}</span>
                  </div>
                </div>
                <div className="text-[10px] text-center text-slate-400">
                  *Prices are estimates based on Olive Young Global
                </div>
              </div>
            )}
          </main>

          {/* Sticky Bottom CTA */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-slate-100 z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            {storeRegion === 'Global' && (
              <div className="absolute -top-10 left-0 right-0 flex justify-center pointer-events-none">
                <div className="bg-amber-100 text-amber-800 text-[10px] font-bold px-4 py-1.5 rounded-t-xl shadow-sm border-t border-x border-amber-200 flex items-center gap-1">
                  <Gift size={12} />
                  <span>5-Step Bundle Savings: ${totals.savings}</span>
                </div>
              </div>
            )}
            <Button onClick={handleStickyBuy} fullWidth variant="secondary" className="flex justify-between">
              <span className="flex items-center gap-2">
                <ShoppingBag size={18} />
                {storeRegion === 'Global' ? `Buy All 5 Items ($${totals.discounted})` : t.shop}
              </span>
              <div className="flex items-center gap-1 opacity-90">
                <ChevronRight size={18} />
              </div>
            </Button>
          </div>

          <GoogleAd className="mb-24" />
        </article>
      )}

      {/* Legal Modal Overlay */}
      {showLegal !== 'none' && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-8 flex flex-col">
          <div className="max-w-md mx-auto w-full">
            <header className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">
                {showLegal === 'terms' ? (language === 'ko' ? '이용약관' : 'Terms of Service') : (language === 'ko' ? '개인정보처리방침' : 'Privacy Policy')}
              </h2>
              <button onClick={() => setShowLegal('none')} className="p-2 bg-slate-100 rounded-full">
                <ChevronRight className="rotate-90" size={20} />
              </button>
            </header>
            <div className="prose prose-slate prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-slate-600 leading-relaxed text-xs">
                {showLegal === 'terms' ? TERMS_TEXT[language].terms : TERMS_TEXT[language].privacy}
              </pre>
            </div>
            <Button onClick={() => setShowLegal('none')} fullWidth className="mt-12 bg-slate-900">
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainTool />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:id" element={<BlogPost />} />
    </Routes>
  );
};

export default App;
