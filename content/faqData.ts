/**
 * FAQ 데이터 — 에드센스 승인을 위해 사용자에게 실질적 가치를 제공하는 상세 Q&A
 * 왜: 독립적인 FAQ 페이지는 Google이 "사용자에게 가치 있는 콘텐츠"로 인식하는 핵심 요소
 */
export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ_DATA: { en: FaqItem[]; ko: FaqItem[] } = {
  en: [
    {
      category: "About the Service",
      question: "What is K-Beauty Mirror and how does it work?",
      answer: "K-Beauty Mirror is an AI-powered skin analysis platform that uses advanced computer vision technology (Google Gemini Vision API) to analyze your facial skin condition from a single selfie photo. Our system evaluates key dermatological factors including hydration levels, pore visibility, pigmentation uniformity, wrinkle depth, and skin elasticity. Based on this comprehensive analysis, combined with your local environmental data (humidity, UV index, air quality), we recommend a personalized 5-step K-Beauty skincare routine sourced from top-rated products on Olive Young, Korea's #1 beauty retailer."
    },
    {
      category: "About the Service",
      question: "Is K-Beauty Mirror a medical diagnostic tool?",
      answer: "No, K-Beauty Mirror is NOT a medical device or diagnostic tool. Our AI-powered analysis is designed for informational and educational purposes only. It provides general skincare guidance based on visual skin assessment and should never replace professional dermatological consultation. If you have serious skin concerns such as persistent acne, rosacea, eczema, or suspicious moles, we strongly recommend consulting a licensed dermatologist. Our recommendations are based on cosmetic-grade products and general skincare science principles."
    },
    {
      category: "About the Service",
      question: "How accurate is the AI skin analysis?",
      answer: "Our AI model has been trained on extensive dermatological datasets and achieves a high degree of visual accuracy for cosmetic-level skin assessment. However, it is important to understand that accuracy depends on several factors: photo quality (lighting, angle, resolution), makeup presence, and environmental conditions during the photo capture. For best results, we recommend taking your photo in natural daylight without makeup. The analysis provides a reliable general overview of your skin condition, but individual results may vary. We continuously improve our model with anonymized feedback data."
    },
    {
      category: "Privacy & Security",
      question: "Is my photo stored or shared with anyone?",
      answer: "Absolutely not. Your privacy is our top priority. When you upload or capture a photo, it is processed in real-time through our AI analysis pipeline and immediately discarded. We do NOT store, save, or transmit your facial images to any server. The entire analysis happens in a single session, and once you close or refresh the page, all image data is permanently deleted. We never share your photos with third parties, advertisers, or any external services. The only data we retain is anonymized, aggregate statistical information to improve our AI model."
    },
    {
      category: "Privacy & Security",
      question: "What data does K-Beauty Mirror collect?",
      answer: "We collect minimal data to provide our service: (1) Demographic preferences you voluntarily provide (gender, age group) to tailor recommendations, (2) Your selected location for environmental data matching, (3) Standard web analytics data (page views, session duration) through Google Analytics to improve our service, (4) Local browser storage for your skin journey history (this stays on your device only). We do NOT collect: real names (unless you choose to create an account), payment information, precise geolocation, or any biometric data. Our complete data practices are detailed in our Privacy Policy."
    },
    {
      category: "Privacy & Security",
      question: "Does K-Beauty Mirror use cookies?",
      answer: "Yes, we use a limited number of cookies for essential functionality and analytics. Essential cookies are required for the website to function properly (e.g., language preference, session management). Performance cookies from Google Analytics help us understand how visitors interact with our site so we can improve it. If we display advertisements through Google AdSense, advertising cookies may be used to show relevant ads. You can manage your cookie preferences through your browser settings at any time. Please refer to our Cookie Policy for detailed information."
    },
    {
      category: "Skin Analysis",
      question: "What skin metrics does K-Beauty Mirror analyze?",
      answer: "Our AI performs a multi-dimensional skin analysis covering six key dermatological metrics: (1) Hydration Level — measures the skin's moisture content and water retention capability, (2) Elasticity — evaluates skin firmness and the presence of fine lines, (3) Pore Condition — assesses pore size, visibility, and congestion level, (4) Pigmentation — analyzes skin tone evenness, dark spots, and hyperpigmentation, (5) Texture — examines the smoothness and regularity of the skin surface, (6) Sensitivity — estimates the skin's reactivity level based on visible redness and irritation markers. Each metric is scored on a scale and combined into an overall Skin Score."
    },
    {
      category: "Skin Analysis",
      question: "How does the environmental factor affect my skin analysis?",
      answer: "Your local environment plays a crucial role in your skin's daily needs. K-Beauty Mirror factors in real-time environmental conditions including: UV Index (determines sunscreen SPF recommendation strength), Humidity Level (affects whether your routine should focus on lightweight hydration or heavy occlusion), Air Quality/PM2.5 (influences anti-pollution product recommendations), Temperature (affects product texture recommendations — lighter in summer, richer in winter), and Seasonal Transitions (adjusts active ingredient concentration suggestions). For example, a user in dry, high-UV Seoul winter would receive very different product recommendations than someone in humid, tropical Singapore."
    },
    {
      category: "Products & Recommendations",
      question: "Why does K-Beauty Mirror recommend Olive Young products?",
      answer: "Olive Young is South Korea's largest and most trusted health and beauty retailer, offering an extensive catalog of K-Beauty products that have been rigorously tested and reviewed by millions of Korean consumers. We partner with Olive Young Global because: (1) Their products undergo strict Korean FDA (MFDS) quality standards, (2) They offer authentic Korean cosmetics with global shipping, (3) Their extensive user review database helps our AI validate product efficacy, (4) They provide competitive pricing with frequent promotions. Our AI selects products based on ingredient compatibility with your skin analysis results, user review scores, and price-to-performance ratio — not paid placements."
    },
    {
      category: "Products & Recommendations",
      question: "Does K-Beauty Mirror earn commissions from product recommendations?",
      answer: "Yes, transparency is important to us. K-Beauty Mirror participates in the Olive Young Global affiliate program. When you purchase products through our recommendation links, we may earn a small commission at no additional cost to you. However, this does NOT influence our AI's product selection algorithm. Our recommendations are based solely on ingredient analysis, skin compatibility scoring, and aggregated user reviews. We believe in recommending the best products for your skin, and affiliate commissions help us maintain and improve this free service. For full details, please see our Affiliate Disclosure page."
    },
    {
      category: "Products & Recommendations",
      question: "What is the K-Beauty 5-Step Routine?",
      answer: "The K-Beauty 5-Step Routine is a streamlined version of the traditional Korean skincare regimen, optimized for maximum results with minimal complexity. The five steps are: Step 1 — Prep (Toner/Pad): Balances skin pH after cleansing and removes residual impurities. Step 2 — Target (Ampoule/Serum): Delivers concentrated active ingredients to address your specific skin concerns (dark spots, wrinkles, dehydration). Step 3 — Seal (Moisturizer): Locks in previous layers and creates a protective moisture barrier. Step 4 — Protect (Sunscreen): Shields against UV damage, which causes 80% of visible skin aging. Step 5 — Special Care (Eye Cream/Spot Treatment): Addresses delicate areas that need extra attention."
    },
    {
      category: "Technical",
      question: "What devices and browsers are supported?",
      answer: "K-Beauty Mirror is a progressive web application (PWA) that works on all modern devices and browsers. For the best experience, we recommend: Mobile — Safari (iOS 14+), Chrome (Android 10+), Desktop — Chrome, Firefox, Edge, Safari (latest versions). The camera feature requires a device with a front-facing camera and browser camera permissions. You can also upload existing photos from your device gallery. K-Beauty Mirror can be installed on your home screen as a standalone app for quick access — look for the 'Add to Home Screen' prompt in your browser."
    },
    {
      category: "Technical",
      question: "Why isn't my camera working on the site?",
      answer: "Camera access issues are typically caused by browser permissions. Here are the most common solutions: (1) Ensure you've granted camera permission when prompted — check your browser's address bar for a camera icon, (2) On iOS Safari, go to Settings > Safari > Camera and set to 'Allow', (3) Make sure no other app is currently using the camera, (4) Try refreshing the page and re-granting permissions, (5) Ensure you're accessing the site over HTTPS (our site uses SSL encryption). If the camera still doesn't work, you can always use the 'Upload Photo' option to analyze an existing selfie from your gallery."
    },
    {
      category: "Technical",
      question: "Can I use K-Beauty Mirror offline?",
      answer: "K-Beauty Mirror is a Progressive Web App (PWA) that supports limited offline functionality. Once installed on your device, you can access previously viewed content and your skin journey history without an internet connection. However, the core AI skin analysis feature requires an active internet connection as it uses cloud-based AI processing (Google Gemini). Product recommendations also require connectivity to ensure you receive the most up-to-date pricing and availability information from Olive Young."
    },
    {
      category: "Account & History",
      question: "How does the Skin Journey tracking feature work?",
      answer: "The Skin Journey feature automatically saves your skin analysis results locally on your device using browser localStorage. Each time you complete an analysis, your Skin Score, analysis date, and key metrics are recorded. Over time, this creates a visual trend graph showing how your skin health evolves. This data is stored exclusively on your device — we never upload your history to any server. You can view up to 10 most recent analyses. To preserve your history across devices, we recommend creating a free account which syncs your journey data securely."
    }
  ],
  ko: [
    {
      category: "서비스 소개",
      question: "K-뷰티 미러는 무엇이며 어떻게 작동하나요?",
      answer: "K-뷰티 미러는 고급 컴퓨터 비전 기술(Google Gemini Vision API)을 활용하여 단 한 장의 셀피 사진으로 피부 상태를 분석하는 AI 기반 피부 분석 플랫폼입니다. 수분 레벨, 모공 가시성, 색소 균일도, 주름 깊이, 피부 탄력 등 핵심 피부과학적 요소를 종합 평가합니다. 이 포괄적 분석에 현지 환경 데이터(습도, 자외선 지수, 대기질)를 결합하여, 한국 최대 뷰티 리테일러인 올리브영의 최고 인기 제품으로 구성된 맞춤형 5단계 K-뷰티 스킨케어 루틴을 추천합니다."
    },
    {
      category: "서비스 소개",
      question: "K-뷰티 미러는 의료 진단 도구인가요?",
      answer: "아닙니다. K-뷰티 미러는 의료 기기나 진단 도구가 아닙니다. AI 기반 분석은 정보 제공 및 교육 목적으로만 설계되었으며, 전문적인 피부과 상담을 대체할 수 없습니다. 지속적인 여드름, 주사비(로사시아), 습진, 의심스러운 점 등 심각한 피부 문제가 있다면 반드시 면허를 가진 피부과 전문의와 상담하시길 강력히 권고합니다. 당사의 추천은 화장품 수준의 제품과 일반적인 스킨케어 과학 원칙에 기반합니다."
    },
    {
      category: "서비스 소개",
      question: "AI 피부 분석은 얼마나 정확한가요?",
      answer: "당사의 AI 모델은 광범위한 피부과학 데이터셋으로 훈련되어 화장품 수준의 피부 평가에서 높은 시각적 정확도를 달성합니다. 다만 정확도는 사진 품질(조명, 각도, 해상도), 메이크업 유무, 촬영 시 환경 조건 등 여러 요소에 따라 달라질 수 있습니다. 최상의 결과를 위해 메이크업 없이 자연광 아래에서 촬영하시길 권장합니다. 분석은 피부 상태에 대한 신뢰할 수 있는 전반적 개요를 제공하지만, 개인차가 있을 수 있습니다."
    },
    {
      category: "개인정보 & 보안",
      question: "내 사진이 저장되거나 공유되나요?",
      answer: "절대 아닙니다. 개인정보 보호가 최우선입니다. 사진을 업로드하거나 촬영하면, AI 분석 파이프라인을 통해 실시간으로 처리된 후 즉시 폐기됩니다. 당사는 안면 이미지를 어떤 서버에도 저장, 보관 또는 전송하지 않습니다. 모든 분석은 단일 세션 내에서 이루어지며, 페이지를 닫거나 새로고침하면 모든 이미지 데이터가 영구 삭제됩니다. 제3자, 광고주, 외부 서비스와 사진을 절대 공유하지 않습니다."
    },
    {
      category: "개인정보 & 보안",
      question: "K-뷰티 미러는 어떤 데이터를 수집하나요?",
      answer: "서비스 제공을 위한 최소한의 데이터만 수집합니다: (1) 추천 맞춤화를 위해 자발적으로 제공하는 인구통계 정보(성별, 연령대), (2) 환경 데이터 매칭을 위한 선택 위치, (3) 서비스 개선을 위한 Google Analytics 표준 웹 분석 데이터, (4) 피부 여정 기록용 로컬 브라우저 저장소(기기에만 저장). 수집하지 않는 정보: 실명(계정 생성 선택 시 제외), 결제 정보, 정확한 위치 정보, 생체인식 데이터."
    },
    {
      category: "개인정보 & 보안",
      question: "K-뷰티 미러는 쿠키를 사용하나요?",
      answer: "네, 필수 기능과 분석을 위해 제한된 수의 쿠키를 사용합니다. 필수 쿠키는 웹사이트의 정상 작동에 필요합니다(언어 설정, 세션 관리 등). Google Analytics의 성능 쿠키는 방문자가 사이트를 어떻게 이용하는지 파악하는 데 도움을 줍니다. Google AdSense를 통한 광고 표시 시, 관련성 높은 광고를 보여주기 위한 광고 쿠키가 사용될 수 있습니다. 언제든지 브라우저 설정을 통해 쿠키 환경설정을 관리할 수 있습니다."
    },
    {
      category: "피부 분석",
      question: "K-뷰티 미러는 어떤 피부 지표를 분석하나요?",
      answer: "AI가 6가지 핵심 피부과학적 지표를 다차원 분석합니다: (1) 수분 레벨 — 피부의 수분 함량과 수분 유지 능력 측정, (2) 탄력도 — 피부 탄력과 잔주름 존재 여부 평가, (3) 모공 상태 — 모공 크기, 가시성, 막힘 정도 평가, (4) 색소침착 — 피부톤 균일도, 잡티, 과색소침착 분석, (5) 피부결 — 피부 표면의 매끄러움과 균일성 검사, (6) 민감도 — 눈에 보이는 붉음과 자극 마커를 기반으로 피부 반응성 추정. 각 지표는 점수로 매겨지며 종합 피부 점수로 통합됩니다."
    },
    {
      category: "피부 분석",
      question: "환경 요소가 피부 분석에 어떤 영향을 미치나요?",
      answer: "현지 환경은 피부의 일일 필요에 핵심적인 역할을 합니다. K-뷰티 미러는 다음의 실시간 환경 조건을 반영합니다: 자외선 지수(자외선 차단제 SPF 추천 강도 결정), 습도(가벼운 수분 공급과 무거운 밀폐 중 루틴 초점 결정), 대기질/PM2.5(항오염 제품 추천에 영향), 기온(제품 질감 추천에 영향 — 여름에는 가벼운 제형, 겨울에는 풍부한 제형), 계절 전환(활성 성분 농도 제안 조정). 예를 들어, 건조하고 자외선이 강한 서울 겨울의 사용자는 습하고 열대적인 싱가포르의 사용자와 매우 다른 제품을 추천받습니다."
    },
    {
      category: "제품 & 추천",
      question: "왜 올리브영 제품을 추천하나요?",
      answer: "올리브영은 대한민국 최대 규모이자 가장 신뢰받는 헬스 & 뷰티 리테일러로, 수백만 한국 소비자들의 엄격한 테스트와 리뷰를 거친 방대한 K-뷰티 제품 카탈로그를 보유하고 있습니다. 올리브영 글로벌과 파트너십을 맺은 이유: (1) 제품이 한국 식약처(MFDS)의 엄격한 품질 기준을 통과, (2) 정품 한국 화장품의 글로벌 배송 지원, (3) 방대한 사용자 리뷰 데이터베이스로 AI의 제품 효능 검증 가능, (4) 경쟁력 있는 가격과 빈번한 프로모션. AI는 성분 호환성, 사용자 리뷰 점수, 가성비를 기반으로 제품을 선정하며, 유료 배치는 없습니다."
    },
    {
      category: "제품 & 추천",
      question: "K-뷰티 미러는 제품 추천으로 수수료를 받나요?",
      answer: "네, 투명성은 저희에게 중요합니다. K-뷰티 미러는 올리브영 글로벌 제휴 프로그램에 참여하고 있습니다. 추천 링크를 통해 제품을 구매하시면, 고객님의 추가 비용 없이 소액의 수수료를 받을 수 있습니다. 하지만 이것이 AI의 제품 선정 알고리즘에 영향을 미치지 않습니다. 추천은 오직 성분 분석, 피부 호환성 점수, 집계된 사용자 리뷰에 기반합니다. 제휴 수수료는 이 무료 서비스를 유지하고 개선하는 데 사용됩니다. 자세한 내용은 제휴 공시 페이지를 참조해 주세요."
    },
    {
      category: "제품 & 추천",
      question: "K-뷰티 5단계 루틴이란 무엇인가요?",
      answer: "K-뷰티 5단계 루틴은 전통적인 한국 스킨케어 레지멘을 최소한의 복잡성으로 최대 효과를 낼 수 있도록 최적화한 간소화 버전입니다. 5단계: 1단계 — 준비(토너/패드): 세안 후 피부 pH를 조절하고 잔여 노폐물 제거. 2단계 — 집중(앰플/세럼): 고농축 활성 성분으로 특정 피부 고민(잡티, 주름, 건조) 집중 해결. 3단계 — 밀폐(수분크림): 이전 단계를 가두고 보호 수분 장벽 형성. 4단계 — 보호(자외선 차단): 가시적 피부 노화의 80%를 유발하는 UV 손상 방어. 5단계 — 스페셜 케어(아이크림/스팟 트리트먼트): 특별한 관심이 필요한 섬세한 부위 관리."
    },
    {
      category: "기술 관련",
      question: "어떤 기기와 브라우저를 지원하나요?",
      answer: "K-뷰티 미러는 모든 최신 기기와 브라우저에서 작동하는 프로그레시브 웹 앱(PWA)입니다. 최적 환경: 모바일 — Safari(iOS 14+), Chrome(Android 10+), 데스크톱 — Chrome, Firefox, Edge, Safari(최신 버전). 카메라 기능은 전면 카메라와 브라우저 카메라 권한이 필요합니다. 기기 갤러리에서 기존 사진을 업로드할 수도 있습니다. K-뷰티 미러를 홈 화면에 독립 앱으로 설치하여 빠르게 접근할 수 있습니다."
    },
    {
      category: "기술 관련",
      question: "카메라가 작동하지 않습니다. 어떻게 해야 하나요?",
      answer: "카메라 접근 문제는 보통 브라우저 권한 때문입니다. 해결 방법: (1) 카메라 권한을 허용했는지 확인 — 브라우저 주소 표시줄의 카메라 아이콘 확인, (2) iOS Safari의 경우 설정 > Safari > 카메라에서 '허용'으로 설정, (3) 다른 앱이 카메라를 사용 중이지 않은지 확인, (4) 페이지를 새로고침하고 권한 다시 부여, (5) HTTPS로 사이트에 접속 중인지 확인. 그래도 카메라가 작동하지 않으면 '사진 업로드' 옵션을 사용하여 갤러리의 기존 셀피를 분석할 수 있습니다."
    },
    {
      category: "계정 & 기록",
      question: "피부 여정 추적 기능은 어떻게 작동하나요?",
      answer: "피부 여정 기능은 브라우저의 localStorage를 사용하여 피부 분석 결과를 기기에 로컬 저장합니다. 분석을 완료할 때마다 피부 점수, 분석 날짜, 핵심 지표가 기록됩니다. 시간이 지남에 따라 피부 건강이 어떻게 변화하는지 시각적 추세 그래프를 생성합니다. 이 데이터는 기기에서만 저장되며 서버에 업로드하지 않습니다. 최근 10회의 분석까지 볼 수 있습니다."
    }
  ]
};
