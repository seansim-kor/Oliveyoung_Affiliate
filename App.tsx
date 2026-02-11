import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, ChevronRight, RefreshCw, MapPin, Sparkles, AlertCircle, Globe, UserCheck, Gift, ShoppingBag } from 'lucide-react';
import { AppView, LOCATIONS, AnalysisResult, Language, UserDemographics } from './types';
import { analyzeSkin } from './services/geminiService';
import { Button } from './components/Button';
import { ProductCard } from './components/ProductCard';
import { SkinRadarChart } from './components/RadarChart';
import { CameraCapture } from './components/CameraCapture';
import { AnalysisOverlay } from './components/AnalysisOverlay';
import { DemographicsSelector } from './components/DemographicsSelector';
import { RewardCard } from './components/RewardCard';

const REFERRAL_LINK = "https://global.oliveyoung.com/member/join?reco_id=71161220260209121639";

const TEXTS = {
  en: {
    title: "K-Beauty Mirror",
    subtitle1: "Discover your",
    subtitle2: "true skin potential",
    desc: "AI-powered skin analysis tailored to your environment. Get personalized K-Beauty routines in seconds.",
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
    subtitle1: "당신의",
    subtitle2: "진정한 피부 잠재력",
    desc: "당신의 환경에 맞춘 AI 기반 피부 분석. 몇 초 만에 맞춤형 K-뷰티 루틴을 제안받으세요.",
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

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedLocation, setSelectedLocation] = useState<string>(LOCATIONS[1].name); // Default NY
  const [storeRegion, setStoreRegion] = useState<'KR' | 'Global'>('Global');

  const [demographics, setDemographics] = useState<UserDemographics>({ gender: 'Female', ageGroup: '20s' });

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    if (!result) return { original: 0, discounted: 0, savings: 0 };
    const original = result.products.reduce((acc, curr) => acc + curr.priceUsd, 0);
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
        <article className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
          <header className="p-6 flex justify-between items-center z-10">
            <div className="font-bold text-xl tracking-tighter flex items-center gap-2" role="banner">
              <span className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white font-serif italic">K</span>
              {t.title}
            </div>
            <button
              onClick={toggleLanguage}
              className="text-xs font-medium px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 flex items-center gap-1 transition-colors"
              aria-label="Toggle Language"
            >
              <Globe size={12} />
              {language === 'en' ? '한국어' : 'English'}
            </button>
          </header>

          <main className="flex-grow flex flex-col px-6 relative z-10">
            <div className="mt-8 mb-8 space-y-4">
              <h1 className="text-4xl font-light text-slate-900 leading-tight">
                {t.subtitle1} <br />
                <span className="font-serif italic text-rose-500">{t.subtitle2}</span>
              </h1>
              <p className="text-slate-500 leading-relaxed">
                {t.desc}
              </p>
              {/* Early Bird Hook */}
              <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                <Gift size={14} className="text-amber-500" />
                <span className="text-xs font-bold text-amber-700">{t.bonus}</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-start gap-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">{t.env}</label>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                <MapPin size={18} className="text-rose-500" />
                <select
                  className="bg-transparent w-full text-slate-800 text-sm font-medium focus:outline-none"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                <Globe size={10} />
                Shopping Region: {storeRegion === 'KR' ? 'Korea (Local)' : 'International (Global)'}
              </div>
            </div>

            <div className="mt-auto mb-8 space-y-3">
              <Button onClick={handleStartFlow} fullWidth variant="secondary">
                <Camera size={20} />
                {t.start}
              </Button>
              <Button onClick={triggerFileUpload} fullWidth variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300">
                <Upload size={20} />
                {t.upload}
              </Button>
              <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed">
                {t.privacy}
              </p>
            </div>
          </main>

          {/* Background blobs */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-[-5%] left-[-10%] w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          {/* SEO/GEO CONTENT SECTIONS */}
          <div className="px-6 pb-20 space-y-12 relative z-10 border-t border-slate-100 pt-12 mt-8">
            {/* Why Us Section */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-rose-500" />
                {t.whyTitle}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t.whyDesc}
              </p>
            </section>

            {/* How It Works Section */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {t.howTitle}
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <p className="text-slate-600 text-sm">{t.howStep1}</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <p className="text-slate-600 text-sm">{t.howStep2}</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                  <p className="text-slate-600 text-sm">{t.howStep3}</p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-slate-50 p-6 rounded-3xl">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertCircle size={20} className="text-slate-400" />
                {t.faqTitle}
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm mb-2">Q: {t.faqQ1}</h3>
                  <p className="text-slate-600 text-sm italic">A: {t.faqA1}</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="font-bold text-slate-800 text-sm mb-2">Q: {t.faqQ2}</h3>
                  <p className="text-slate-600 text-sm italic">A: {t.faqA2}</p>
                </div>
              </div>
            </section>
          </div>
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
              <AnalysisOverlay imageSrc={capturedImage} issues={result.issues} />
            )}

            {/* Enhanced Summary Card */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl shadow-slate-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500 blur-[60px] opacity-30 rounded-full"></div>

              <div className="relative z-10">
                {/* Hero Stats */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-rose-300 font-medium text-xs tracking-wider uppercase mb-1">{t.skinScore}</div>
                    <div className="text-5xl font-light tracking-tighter">{result.overallScore}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 font-medium text-xs tracking-wider uppercase mb-1">{t.skinAge}</div>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-3xl font-bold">{result.estimatedAge}</span>
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
                  <div className="flex items-center gap-2 mb-2 text-rose-300 text-xs font-bold uppercase tracking-wide">
                    <UserCheck size={14} /> Analysis for {demographics.gender}, {demographics.ageGroup}
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
            <SkinRadarChart metrics={result.metrics} />

            {/* Recommendations Header */}
            <div className="pt-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t.curated}</h3>
              <p className="text-sm text-slate-500 mb-4">{t.picksFor} {demographics.ageGroup} {demographics.gender}.</p>

              <div className="space-y-4">
                {result.products.map((product, idx) => (
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
        </article>
      )}
    </>
  );
};

export default App;