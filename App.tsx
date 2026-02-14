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
  const [selectedLocation, setSelectedLocation] = useState<string>(LOCATIONS[1].name);
  const [storeRegion, setStoreRegion] = useState<'KR' | 'Global'>('Global');
  const [demographics, setDemographics] = useState<UserDemographics>({ gender: 'Female', ageGroup: '20s' });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLegal, setShowLegal] = useState<'none' | 'terms' | 'privacy'>('none');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = TEXTS[language];

  useEffect(() => {
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
      setError(err.message || t.error);
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

  const totals = (() => {
    if (!result || !result.products) return { original: 0, discounted: 0, savings: 0 };
    const original = result.products.reduce((acc, curr) => acc + (curr?.priceUsd || 0), 0);
    const discounted = Math.floor(original * 0.9);
    return { original, discounted, savings: original - discounted };
  })();

  return (
    <>
      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />

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
            </div>
          </header>

          <main className="flex-grow flex flex-col px-8 relative z-10 pt-4">
            <div className="relative mb-10 mt-4 group">
              <div className="w-full aspect-square rounded-[3rem] overflow-hidden relative shadow-2xl ring-4 ring-white/20">
                <img src="/hero-image.jpg" alt="Hero" className="w-full h-full object-cover scale-[1.19] object-[center_35%]" />
              </div>
            </div>

            <div className="space-y-4 mb-10 text-white">
              <h1 className="text-3xl font-black uppercase">{t.subtitle1} <br /> {t.subtitle2}</h1>
              <p className="text-slate-400 text-sm">{t.desc}</p>
            </div>

            <div className="mt-auto mb-10 space-y-4">
              <button onClick={handleStartFlow} className="w-full bg-gradient-to-r from-orange-500 to-rose-600 py-5 rounded-3xl text-white font-black uppercase">{t.start}</button>
              <button onClick={triggerFileUpload} className="w-full py-5 glass-card rounded-3xl text-white/80 font-bold uppercase">{t.upload}</button>
            </div>
          </main>

          <div className="px-6 pb-24 space-y-16 relative z-10 bg-slate-950/50">
            {/* Content blocks for SEO */}
            <section className="space-y-12">
              <h2 className="text-2xl font-black text-white uppercase">{SKIN_GUIDE[language].title}</h2>
              <p className="text-slate-400 text-sm italic">{SKIN_GUIDE[language].intro}</p>
              {/* ... Add other content items similarly ... */}
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
        <section className="min-h-screen flex flex-col items-center justify-center bg-white text-center">
          <h2 className="text-2xl font-bold">{t.analyzing}</h2>
          <p>{t.analyzingDesc}</p>
        </section>
      )}

      {view === AppView.RESULTS && result && (
        <article className="min-h-screen flex flex-col max-w-md mx-auto bg-rose-50/50 pb-32">
          <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md p-6 flex justify-between items-center border-b">
            <h2 className="font-bold">{t.report}</h2>
            <button onClick={resetApp} className="p-2 bg-slate-100 rounded-full"><RefreshCw size={18} /></button>
          </header>
          <main className="p-6 space-y-6">
            {capturedImage && <AnalysisOverlay imageSrc={capturedImage} issues={result.issues} faceBox={result.faceBox} />}
            <div className="bg-slate-900 text-white p-6 rounded-3xl">
              <div className="text-rose-300 text-xs uppercase">{t.skinScore}</div>
              <div className="text-5xl font-light">{result.overallScore}</div>
            </div>
            {result.products?.map((p, i) => <ProductCard key={i} product={p} index={i} storeRegion={storeRegion} referralLink={REFERRAL_LINK} />)}
          </main>
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t z-30">
            <Button onClick={handleStickyBuy} fullWidth variant="secondary">{t.shop}</Button>
          </div>
          <Footer language={language} />
        </article>
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
