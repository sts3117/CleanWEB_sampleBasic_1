import React, { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Home, 
  Phone, 
  User, 
  ShieldCheck, 
  ThumbsUp, 
  ChevronRight, 
  TrendingUp, 
  AlertCircle,
  Check,
  Smartphone,
  ChevronDown,
  Lock,
  MessageSquare,
  HelpCircle,
  HelpCircle as QuestionIcon,
  ChevronUp,
  Award,
  Zap
} from "lucide-react";

// --- Types & Interfaces ---
interface LeadFormState {
  name: string;
  telecom: string;
  phoneFirst: string;
  phoneSecond: string;
  phoneThird: string;
  region: string;
  spaceType: string;
  pyeong: number;
  cleanType: "standard" | "premium"; // Premium clean selection upgrade
  agreed: boolean;
}

interface LiveStatusItem {
  id: string;
  time: string;
  name: string;
  region: string;
  spaceType: string;
  pyeong: number;
  status: "완료" | "상담대기" | "배정완료";
}

interface ReviewItem {
  id: string;
  category: "apartment" | "studio" | "villa";
  rating: number;
  title: string;
  content: string;
  author: string;
  spaceInfo: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function App() {
  // --- States ---
  // Form top state
  const [formTop, setFormTop] = useState<LeadFormState>({
    name: "",
    telecom: "010",
    phoneFirst: "010",
    phoneSecond: "",
    phoneThird: "",
    region: "서울",
    spaceType: "아파트",
    pyeong: 24,
    cleanType: "standard",
    agreed: true,
  });

  // Form bottom state
  const [formBottom, setFormBottom] = useState<LeadFormState>({
    name: "",
    telecom: "010",
    phoneFirst: "010",
    phoneSecond: "",
    phoneThird: "",
    region: "서울",
    spaceType: "아파트",
    pyeong: 24,
    cleanType: "standard",
    agreed: true,
  });

  // Review active filter tab
  const [activeReviewTab, setActiveReviewTab] = useState<"all" | "apartment" | "studio" | "villa">("all");

  // FAQ active target ID
  const [activeFaqId, setActiveFaqId] = useState<string | null>("faq-1");

  // Section visible details toggle (e.g. what's included details)
  const [showDetailCoverage, setShowDetailCoverage] = useState(false);

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedData, setSubmittedData] = useState<LeadFormState | null>(null);

  // Dynamic Countdown Timer (Calculates time left until midnight tonight)
  const [timeLeft, setTimeLeft] = useState({ hours: "00", minutes: "00", seconds: "00" });

  // Live status stream state
  const [liveStream, setLiveStream] = useState<LiveStatusItem[]>([
    { id: "1", time: "1분 전", name: "최*영", region: "서울 마포구", spaceType: "아파트", pyeong: 32, status: "완료" },
    { id: "2", time: "3분 전", name: "김*정", region: "경기 분당구", spaceType: "오피스텔", pyeong: 18, status: "상담대기" },
    { id: "3", time: "5분 전", name: "박*호", region: "인천 연수구", spaceType: "빌라", pyeong: 22, status: "배정완료" },
    { id: "4", time: "8분 전", name: "정*희", region: "경기 수원시", spaceType: "아파트", pyeong: 28, status: "완료" },
    { id: "5", time: "12분 전", name: "이*민", region: "서울 서초구", spaceType: "상가", pyeong: 45, status: "배정완료" },
    { id: "6", time: "16분 전", name: "윤*서", region: "서울 영등포", spaceType: "빌라", pyeong: 15, status: "완료" },
    { id: "7", time: "20분 전", name: "황*태", region: "인천 부평구", spaceType: "오피스텔", pyeong: 9, status: "상담대기" },
  ]);

  // Form reference for page scrolling
  const topFormRef = useRef<HTMLDivElement>(null);
  const bottomFormRef = useRef<HTMLDivElement>(null);

  // --- Static/Interactive Data ---
  const reviewsData: ReviewItem[] = [
    {
      id: "rev-1",
      category: "apartment",
      rating: 5,
      title: "문틀 기름때가 다 지워졌고, 구석구석 깨끗해요",
      content: "가장 골치 아팠던 주방 후드망기름때랑 거실 샷시 구석 문틀 찌든 때까지 고온 스팀살균 기계 들고 오셔서 진짜 흔적도 없이 말끔히 치워 주셨습니다. 35% 할인받아 진행하니까 대형 견적업체보다 거의 반값에 최고 이케어 품질로 마친 것 같네요.",
      author: "서울 마포구 한*희 님",
      spaceInfo: "28평형 입주예정"
    },
    {
      id: "rev-2",
      category: "studio",
      rating: 5,
      title: "정량 요금 시스템이라 신뢰가 팍팍 갑니다",
      content: "오피스텔로 이사 오면서 꼼꼼클린에 상담 넣었었는데 원래 제시해주셨던 정량요금 그대로 끝났어요! 현장에서 쓸데없는 배수구 스팀약품 비 더 달라고 실랑이하는 악덕업체들이랑은 차원이 다릅니다. 청소 후 편백나무 피톤치드 향도 엄청나게 상쾌하네요.",
      author: "경기 용인시 성*준 님",
      spaceInfo: "15평형 오피스텔 이사"
    },
    {
      id: "rev-3",
      category: "villa",
      rating: 5,
      title: "구형 빌라 베란다 곰팡이 완전히 박멸 성공!",
      content: "결로현상 때문에 베란다 사방에 시커멓게 핀 곰팡이랑 창틀 실리콘 묵은 때가 진짜 심했는데, 전용 향균 약품 코팅에 스팀소독까지 하니까 완전히 새 아파트 마감처럼 뽀얗게 태어났습니다. 다음 이사 때도 무조건 꼼꼼클린으로 선택할 겁니다.",
      author: "인천 연수구 임*희 님",
      spaceInfo: "20평형 구형빌라"
    },
    {
      id: "rev-4",
      category: "apartment",
      rating: 5,
      title: "하루에 단 한 집만 책임직영이라 든든해요",
      content: "보통 청소업체들 하루에 두 탕, 세 탕씩 뛰느라 마무리가 소홀하던데, 오신 팀 팀장님이 오늘 저희 집 하루만 책임 청소하는 날이라고 아주 꼼꼼히 체크해 주셨습니다. 주방 서랍 안쪽 레일까지 전부 분리해서 닦아 내시는 기술이 아주 훌륭했습니다.",
      author: "경기 분당구 윤*아 님",
      spaceInfo: "34평형 아파트 이사"
    },
    {
      id: "rev-5",
      category: "studio",
      rating: 5,
      title: "원룸이지만 디테일이 살아있는 친프리미엄 케어",
      content: "작은 공간이라서 대강 치우고 갈 줄 알았는데 붙박이 옷장 세부 칸막이부터 화장실 환풍기 먼지캡 필터까지 분해해서 친환경 에코 약제 살균 마감까지 끝내 주셨어요. 민감성 피부인데 가렵지 않아 최상으로 완벽히 통과했습니다.",
      author: "서울 관악구 박*지 님",
      spaceInfo: "9평형 원룸 이사"
    }
  ];

  const faqData: FAQItem[] = [
    {
      id: "faq-1",
      question: "현장에서 가격이 갑자기 급증하는 추가 요금 폭탄이 정말 없나요?",
      answer: "네, 맞습니다! 꼼꼼클린은 고객님이 제시한 실면적(평수)과 공간 구조 기반 정률정가제를 원칙으로 합니다. 예약 상담 완료 단가 외 일방적인 현장 트집 잡기용 장비 요금이나 약제 명목 세액 추가가 결코 발생하지 않아 신용적입니다."
    },
    {
      id: "faq-2",
      question: "외부 인력 파견회사나 초보자 파견이 아닌가요?",
      answer: "당사는 100% 본사 정식 신원보증 및 교육 커리큘럼을 무결하게 마친 '본사 직영 배정팀' 제도를 통해 책임 이행하고 있습니다. 하청에 하청을 무단으로 넘겨버리는 용역 파견과는 전혀 상이하며 실명제를 실시합니다."
    },
    {
      id: "faq-3",
      question: "청소 마감 단계에서 불만족스러우면 무상 보완 재청소가 가능한가요?",
      answer: "당연히 제공됩니다! 청소 완수 직후 고객님께서 함께 참여하는 정밀 합동 현장 검수를 진행합니다. 미심쩍은 부위에 대해서는 담당 마스터가 무조건 즉각적인 현장 정비를 지원하며, 만일 퇴거 후 당일 확인하지 않은 결함일지라도 3일간 본사 무상 책임 A/S를 제공합니다."
    },
    {
      id: "faq-4",
      question: "친환경 에코 세제 스팀소독은 별도 추가금이 붙나요?",
      answer: "아닙니다! 꼼꼼클린만의 '35% 특별 잔여일정 특전' 혜택 속에는 피부 저자극 에코-세제 도포 및 고밀도 펄스 미세 초고온 스팀 소독 분사가 기본 제공 사양으로 포함되어 있습니다."
    }
  ];

  // Filtered reviews dynamic extraction
  const filteredReviews = activeReviewTab === "all" 
    ? reviewsData 
    : reviewsData.filter(r => r.category === activeReviewTab);

  // --- Quote Calculation Helpers ---
  const calculatePricing = (spaceType: string, pyeong: number, cleanType: "standard" | "premium") => {
    let perPyeongBase = 15000; 
    switch (spaceType) {
      case "아파트":
        perPyeongBase = 13500;
        break;
      case "빌라":
        perPyeongBase = 14000;
        break;
      case "오피스텔":
        perPyeongBase = 15000;
        break;
      case "상가":
        perPyeongBase = 12000;
        break;
      case "그외":
        perPyeongBase = 14500;
        break;
    }

    if (cleanType === "premium") {
      perPyeongBase += 2500; // Premium deep sanitizing and disinfection addon
    }

    const originalPrice = pyeong * perPyeongBase;
    const discountRate = 0.35; // 35% Special discount
    const discountedPrice = Math.round((originalPrice * (1 - discountRate)) / 1000) * 1000; 

    return {
      original: originalPrice,
      discounted: discountedPrice,
      saving: originalPrice - discountedPrice,
    };
  };

  // --- Effects ---
  // Countdown Timer till midnight
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diffMs = endOfDay.getTime() - now.getTime();
      if (diffMs <= 0) {
        setTimeLeft({ hours: "24", minutes: "00", seconds: "00" });
        return;
      }

      const totalSecs = Math.floor(diffMs / 1000);
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      setTimeLeft({
        hours: hrs < 10 ? `0${hrs}` : `${hrs}`,
        minutes: mins < 10 ? `0${mins}` : `${mins}`,
        seconds: secs < 10 ? `0${secs}` : `${secs}`,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live status stream simulation
  useEffect(() => {
    const firstNames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "신", "안", "황"];
    const lastNames = ["지*우", "민*아", "준*서", "혜*진", "도*윤", "서*영", "현*태", "예*은", "성*진", "수*민", "영*욱", "재*호"];
    const regions = [
      "서울 강남구", "서울 마포구", "서울 관악구", "서울 성동구", "서울 은평구", "서울 종로구",
      "경기 성남시", "경기 고양시", "경기 용인시", "경기 안양시", "경기 부천시", "경기 하남시",
      "인천 남동구", "인천 서구", "인천 연수구", "인천 미추홀구"
    ];
    const spaces = ["아파트", "빌라", "오피스텔", "상가", "그외"];
    const pyeongSizes = [12, 18, 24, 30, 32, 34, 42, 50];

    const interval = setInterval(() => {
      const randomName = firstNames[Math.floor(Math.random() * firstNames.length)] + "*" + lastNames[Math.floor(Math.random() * lastNames.length)].substring(2);
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      const randomSpace = spaces[Math.floor(Math.random() * spaces.length)];
      const randomPyeong = pyeongSizes[Math.floor(Math.random() * pyeongSizes.length)];
      const randomStatus = (["완료", "상담대기", "배정완료"] as const)[Math.floor(Math.random() * 3)];

      const newItem: LiveStatusItem = {
        id: String(Date.now()),
        time: "방금 전",
        name: randomName,
        region: randomRegion,
        spaceType: randomSpace,
        pyeong: randomPyeong,
        status: randomStatus
      };

      setLiveStream(prev => {
        const updated = prev.map(item => {
          if (item.time === "방금 전") return { ...item, time: "1분 전" };
          if (item.time === "1분 전") return { ...item, time: "3분 전" };
          if (item.time === "3분 전") return { ...item, time: "5분 전" };
          if (item.time === "5분 전") return { ...item, time: "10분 전" };
          if (item.time === "10분 전") return { ...item, time: "15분 전" };
          if (item.time === "15분 전") return { ...item, time: "25분 전" };
          return item;
        });
        return [newItem, ...updated.slice(0, 5)];
      });
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---
  const handleScrollToForm = () => {
    topFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormChange = (
    formType: "top" | "bottom", 
    field: keyof LeadFormState, 
    value: string | number | boolean
  ) => {
    if (formType === "top") {
      setFormTop(prev => ({ ...prev, [field]: value }));
    } else {
      setFormBottom(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFormSubmit = (e: FormEvent, formType: "top" | "bottom") => {
    e.preventDefault();
    const data = formType === "top" ? formTop : formBottom;

    if (!data.name.trim()) {
      alert("성함을 입력해 주세요!");
      return;
    }
    if (data.phoneSecond.length < 3 || data.phoneThird.length < 4) {
      alert("올바른 연락처 번호를 완전히 입력해 주세요!");
      return;
    }
    if (!data.agreed) {
      alert("개인정보 수집 및 이용 동의가 필요합니다.");
      return;
    }

    setSubmittedData(data);
    setShowSuccessModal(true);

    const storedLeads = JSON.parse(localStorage.getItem("leads_history") || "[]");
    localStorage.setItem("leads_history", JSON.stringify([...storedLeads, { ...data, timestamp: new Date() }]));

    const resetForm: LeadFormState = {
      name: "",
      telecom: "010",
      phoneFirst: "010",
      phoneSecond: "",
      phoneThird: "",
      region: data.region,
      spaceType: data.spaceType,
      pyeong: data.pyeong,
      cleanType: "standard",
      agreed: true
    };
    if (formType === "top") {
      setFormTop(resetForm);
    } else {
      setFormBottom(resetForm);
    }
  };

  const topQuote = calculatePricing(formTop.spaceType, formTop.pyeong, formTop.cleanType);
  const bottomQuote = calculatePricing(formBottom.spaceType, formBottom.pyeong, formBottom.cleanType);

  return (
    <div id="landing-root" className="min-h-screen bg-[#F0F9FB] font-sans text-slate-800 antialiased selection:bg-[#00B4D8]/20 selection:text-cyan-900 pb-16">
      
      {/* Dynamic Floating Conversational CTA */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 sm:px-6 md:hidden">
        <button 
          id="btn-floating-cta"
          onClick={handleScrollToForm}
          className="w-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] active:scale-98 text-white font-extrabold py-3.5 px-6 rounded-full shadow-2xl flex items-center justify-center gap-2.5 text-base transition-transform animate-bounce hover:opacity-95"
        >
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span>오늘만 35% 즉시 특별할인 예약하기</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* --- Premium Bento Sticky Header --- */}
      <header id="header-section" className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-[#E6EFF2] z-30 transition-all shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-white font-black px-3.5 py-1.5 rounded-xl text-sm tracking-tight shadow-md shadow-sky-100">
              PRO
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-[#0077B6]">
                  프로 홈케어
                </span>
                <span className="text-[10px] bg-sky-100 text-[#0077B6] px-1.5 py-0.5 rounded-full font-bold">본사직영</span>
              </div>
              <span className="text-[10px] block font-semibold text-[#00B4D8] tracking-wider -mt-0.5 uppercase">
                Premium Cleaning Group & Eco-Sanitation
              </span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-bold text-slate-500">
            <span onClick={handleScrollToForm} className="hover:text-[#0077B6] cursor-pointer transition-colors flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-sky-500" /> 특가신청
            </span>
            <span onClick={handleScrollToForm} className="hover:text-[#0077B6] cursor-pointer transition-colors">리얼생생수기</span>
            <span onClick={handleScrollToForm} className="hover:text-[#00B4D8] cursor-pointer transition-colors">무상 A/S보증</span>
            <span onClick={handleScrollToForm} className="hover:text-[#00B4D8] cursor-pointer transition-colors">자주묻는질문</span>
          </nav>

          <button 
            id="btn-header-cta"
            onClick={handleScrollToForm}
            className="bg-[#F0F9FB] hover:bg-[#E0F2FE] text-[#0077B6] font-extrabold px-4.5 py-2.5 rounded-xl text-xs tracking-tight transition-all border border-[#bce3eb] flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-[#0077B6] animate-pulse-slow" />
            <span>오늘 예약 특별가 상담 대기</span>
          </button>
        </div>
      </header>

      {/* --- Main Premium layout Container --- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 gap-6 flex flex-col">
        
        {/* Urgent Notification Banner */}
        <div className="p-3 bg-gradient-to-r from-blue-500 to-sky-400 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-wider animate-pulse">Hot Issue</span>
            <span>현재 실시간 예약 선착순 폭주로 일정이 대단히 빠르게 매진되고 있습니다.</span>
          </div>
          <button onClick={handleScrollToForm} className="underline text-[11px] opacity-90 hidden sm:block">신속 접수하기 &gt;</button>
        </div>

        {/* --- Upper Bento Grid (Hero, Timer & Form Card) --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Block: Hero presentation & LIVE feed (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6 justify-between h-full">
            
            {/* Bento 1-1: High-impact premium hero cards with dynamic badges */}
            <div className="bg-gradient-to-br from-[#005F91] via-[#0077B6] to-[#00B4D8] text-white p-8 rounded-3xl flex flex-col justify-between shadow-lg relative overflow-hidden flex-1 min-h-[380px]">
              
              {/* Abs elegant overlay circles */}
              <div className="absolute top-0 right-0 -translate-y-16 translate-x-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 translate-y-16 -translate-x-16 w-48 h-48 rounded-full bg-cyan-400/20 blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col">
                <div id="hero-badge" className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs text-yellow-250 font-bold max-w-max mb-6">
                  <Award className="w-4 h-4 text-yellow-300" />
                  <span>2026 대한민국 홈케어 소비자 만족 브랜드 1위</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
                  오늘 잔여 일정 단 하루! <br />
                  <span className="text-[#FFF59D] underline decoration-wavy decoration-[#FFF59D] decoration-2">
                    미친 파격 35% 할인
                  </span>
                </h1>
                
                <p className="text-sm sm:text-base text-sky-100 leading-relaxed font-semibold max-w-md">
                  정직원 책임 직영배정으로 마감합니다. 이사·입주 전용 대안이 없는 완벽한 에코살균 케어를 오늘만의 독점 혜택으로 지금 만끽하십시오.
                </p>
              </div>

              {/* Countdown Ticker Block */}
              <div className="relative z-10 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 inline-flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                <div>
                  <div className="text-[10px] text-sky-100 uppercase font-extrabold tracking-wider mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    실시간 이벤트 강제종료 타임라인
                  </div>
                  <div className="text-xs text-white opacity-80">마감 직후 정상 가액 환산 조치</div>
                </div>
                <div className="flex items-center gap-2 mt-1 sm:mt-0 ml-auto sm:ml-0 bg-black/25 px-4 py-2 rounded-xl text-base font-black font-mono tracking-widest text-yellow-300 border border-white/10 shadow-inner">
                  <span>오늘</span>
                  <span className="text-white font-medium text-xs">종료</span>
                  <span className="text-lg text-emerald-300 font-bold animate-pulse">
                    {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
                  </span>
                </div>
              </div>

            </div>

            {/* Bento 1-2: Realtime Customer Application Live feed */}
            <div className="bg-white rounded-3xl border border-[#E6EFF2] p-6 shadow-xs flex flex-col justify-between min-h-[260px]">
              <div>
                <div className="live-header flex items-center justify-between text-sm font-bold text-[#0077B6] mb-4 pb-2 border-b border-[#F0F9FB]">
                  <div className="flex items-center gap-2">
                    <div className="live-dot w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                    <span className="font-extrabold text-xs sm:text-sm">✨ 청소 할인견적 실시간 접수현황 LIVE ✨</span>
                  </div>
                  <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    자동 갱신 중
                  </span>
                </div>

                <div className="live-list space-y-2.5">
                  {liveStream.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`live-item flex items-center justify-between text-xs pb-2.5 border-b border-dashed border-[#F0F9FB] text-slate-600 transition-all ${
                        index === 0 ? "text-[#0077B6] font-extrabold animate-slideup" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[9px] bg-sky-50 text-[#0077B6] px-1.5 py-0.5 rounded-md font-bold shrink-0">{item.time}</span>
                        <span className="font-bold shrink-0">{item.name} 님</span>
                        <span className="text-slate-400 text-[11px] truncate">({item.region})</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-medium text-slate-400">{item.spaceType}({item.pyeong}평)</span>
                        <span className={`text-[9px] px-2 py-0.5 font-bold rounded-full border ${
                          item.status === "완료"
                            ? "bg-teal-50 text-teal-800 border-teal-100"
                            : item.status === "상담대기"
                            ? "bg-amber-50 text-amber-800 border-amber-100"
                            : "bg-blue-50 text-blue-800 border-blue-100"
                        }`}>
                          {item.status === "완료" ? "할인소지" : item.status === "배정완료" ? "직영매칭" : "상담대기"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <p className="text-[10px] text-slate-400 font-semibold text-center mt-3 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>개인정보 안심 보장 마스킹 조치 적용</span>
              </p>
            </div>

          </div>

          {/* Right Block: Premium design form (5 Columns) */}
          <div ref={topFormRef} className="lg:col-span-5 bg-white rounded-3xl border border-[#E6EFF2] p-6 sm:p-8 shadow-md flex flex-col justify-between h-full relative overflow-hidden">
            
            {/* Absolute discount floating tag */}
            <div className="absolute top-0 right-0 bg-[#0077B6] text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl tracking-widest">
              OFFER KEY
            </div>

            <div className="form-card flex flex-col gap-4">
              
              <div className="text-center pb-2 border-b border-slate-100">
                <span className="text-[10px] bg-[#e2f7fc] text-[#0077B6] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  간편 상담 접수처
                </span>
                <h2 className="form-title text-xl sm:text-2xl font-black text-[#0077B6] mt-2 mb-1">
                  할인 견적 상담 신청
                </h2>
                <p className="text-xs text-slate-400">
                  정보를 매칭하여 최상의 맞춤 요금을 산출합니다.
                </p>
              </div>

              <form onSubmit={(e) => handleFormSubmit(e, "top")} className="space-y-4">
                
                {/* Name */}
                <div className="field-group flex flex-col gap-1.5">
                  <label className="field-label text-xs font-extrabold text-slate-600 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#0077B6]" />
                    성함을 알려주세요! <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formTop.name}
                    onChange={(e) => handleFormChange("top", "name", e.target.value)}
                    placeholder="예: 홍길동"
                    className="input-text bg-[#F8FBFC] border border-[#E0EAEF] px-4 py-3 rounded-xl focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] focus:outline-hidden text-sm font-semibold transition-all w-full"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="field-group flex flex-col gap-1.5">
                  <label className="field-label text-xs font-extrabold text-slate-600 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#0077B6]" />
                    연락처를 설정해 주세요! <span className="text-rose-500">*</span>
                  </label>
                  <div className="phone-grid grid grid-cols-[80px_15px_1fr_15px_1fr] items-center text-center">
                    <select 
                      value={formTop.phoneFirst}
                      onChange={(e) => handleFormChange("top", "phoneFirst", e.target.value)}
                      className="input-text bg-[#F8FBFC] border border-[#E0EAEF] p-3 rounded-xl text-xs sm:text-sm font-bold focus:outline-hidden text-center cursor-pointer"
                    >
                      <option value="010">010</option>
                      <option value="011">011</option>
                      <option value="016">016</option>
                      <option value="017">017</option>
                      <option value="019">019</option>
                    </select>
                    <span className="text-slate-300 font-bold">-</span>
                    <input 
                      type="number" 
                      pattern="[0-9]*"
                      maxLength={4}
                      value={formTop.phoneSecond}
                      onChange={(e) => {
                        if (e.target.value.length <= 4) handleFormChange("top", "phoneSecond", e.target.value);
                      }}
                      placeholder="1234"
                      className="input-text bg-[#F8FBFC] border border-[#E0EAEF] p-3 rounded-xl text-xs sm:text-sm font-bold focus:outline-hidden text-center"
                      required
                    />
                    <span className="text-slate-300 font-bold">-</span>
                    <input 
                      type="number" 
                      pattern="[0-9]*"
                      maxLength={4}
                      value={formTop.phoneThird}
                      onChange={(e) => {
                        if (e.target.value.length <= 4) handleFormChange("top", "phoneThird", e.target.value);
                      }}
                      placeholder="5678"
                      className="input-text bg-[#F8FBFC] border border-[#E0EAEF] p-3 rounded-xl text-xs sm:text-sm font-bold focus:outline-hidden text-center"
                      required
                    />
                  </div>
                </div>

                {/* Clean Type Selector Toggle (Premium Quality Add On Integration!) */}
                <div className="field-group flex flex-col gap-1.5">
                  <label className="field-label text-xs font-extrabold text-slate-600 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#0077B6]" />
                    청소 강도 및 서비스 유형 선택
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleFormChange("top", "cleanType", "standard")}
                      className={`p-3 rounded-xl text-xs text-center font-bold border transition-all cursor-pointer ${
                        formTop.cleanType === "standard"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >
                      <div className="font-extrabold">기본 특가 분량</div>
                      <div className="text-[10px] opacity-75 mt-0.5">꼼꼼 입주/이사 케어</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormChange("top", "cleanType", "premium")}
                      className={`p-3 rounded-xl text-xs text-center font-bold border transition-all cursor-pointer ${
                        formTop.cleanType === "premium"
                          ? "bg-[#0077B6]/10 text-[#0077B6] border-[#0077B6] ring-1 ring-[#0077B6]"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >
                      <div className="font-extrabold flex items-center justify-center gap-1">
                        프리미엄 딥에코
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                      </div>
                      <div className="text-[10px] opacity-75 mt-0.5">고온 살균 + 향균 케어</div>
                    </button>
                  </div>
                </div>

                {/* Region Option Buttons Grid */}
                <div className="field-group flex flex-col gap-1.5">
                  <label className="field-label text-xs font-bold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0077B6]" />
                    청소 지역
                  </label>
                  <div className="option-grid grid grid-cols-3 gap-2">
                    {["서울", "경기", "인천"].map((reg) => {
                      const isSelected = formTop.region === reg;
                      return (
                        <button
                          type="button"
                          key={reg}
                          onClick={() => handleFormChange("top", "region", reg)}
                          className={`option-btn py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all text-center cursor-pointer ${
                            isSelected 
                              ? "bg-[#00B4D8] text-white border-[#00B4D8] font-black shadow-xs"
                              : "bg-[#F8FBFC] text-slate-500 border-[#E0EAEF] hover:bg-[#F0F9FB]"
                          }`}
                        >
                          {reg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Space Type Option Grid */}
                <div className="field-group flex flex-col gap-1.5">
                  <label className="field-label text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-[#0077B6]" />
                    공간 유형
                  </label>
                  <div className="option-grid-5 grid grid-cols-5 gap-1.5">
                    {["아파트", "빌라", "오피스텔", "상가", "그외"].map((space) => {
                      const isSelected = formTop.spaceType === space;
                      return (
                        <button
                          type="button"
                          key={space}
                          onClick={() => handleFormChange("top", "spaceType", space)}
                          className={`option-btn py-2.5 rounded-xl text-[10px] font-bold tracking-tight transition-all text-center cursor-pointer ${
                            isSelected 
                              ? "bg-[#00B4D8] text-white border-[#00B4D8] font-black shadow-xs"
                              : "bg-[#F8FBFC] text-slate-500 border-[#E0EAEF] hover:bg-[#F0F9FB]"
                          }`}
                        >
                          {space}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pyeong Slider Adjuster Block */}
                <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-150/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-slate-600 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
                      대상 평수 설정
                    </span>
                    <span className="text-xs font-black text-[#0077B6] bg-white px-2.5 py-1 rounded-md border border-sky-100 shadow-3xs">
                      {formTop.pyeong}평 ({Math.round(formTop.pyeong * 3.3)}㎡)
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min={5} 
                    max={80} 
                    value={formTop.pyeong}
                    onChange={(e) => handleFormChange("top", "pyeong", parseInt(e.target.value))}
                    className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-[#00B4D8]"
                  />
                  
                  {/* Cost Summary Box inside form */}
                  <div className="mt-3.5 pt-2 border-t border-dashed border-sky-100 grid grid-cols-2 text-center text-[10px]">
                    <div>
                      <span className="block text-slate-450 font-semibold mb-0.5">정상 소비자 비용</span>
                      <span className="text-slate-400 line-through font-mono font-bold">
                        {topQuote.original.toLocaleString()}원
                      </span>
                    </div>
                    <div className="border-l border-sky-100">
                      <span className="block text-[#0077B6] font-extrabold mb-0.5">35% 선착순 특별가</span>
                      <span className="text-sm font-extrabold text-[#0077B6] font-mono">
                        {topQuote.discounted.toLocaleString()}원~
                      </span>
                    </div>
                  </div>
                </div>

                {/* Service Detail Coverage Checklist Accordion */}
                <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setShowDetailCoverage(!showDetailCoverage)}
                    className="w-full bg-slate-50 px-3 py-2 flex items-center justify-between font-bold text-slate-600 hover:bg-slate-100"
                  >
                    <span>🔍 포함 청소 영역 디테일 보기</span>
                    {showDetailCoverage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showDetailCoverage && (
                    <div className="p-3 bg-white space-y-1.5 text-[11px] text-slate-500 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#0077B6]" />
                        <span><strong>주방:</strong> 가스레인지/가스오븐, 가스인입 밸브 주유 오염 및 거미줄 먼지 청정</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#0077B6]" />
                        <span><strong>욕실:</strong> 환풍구 분해 살균, 물때 제거, 하수구 약품 세립 정밀 케어</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#0077B6]" />
                        <span><strong>창틀/베란다:</strong> 흙먼지 진공세정, 배수구 부식 청정 소제</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Consent checkbox */}
                <div className="flex items-start gap-2.5 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <input 
                    type="checkbox" 
                    id="agree-top-cap" 
                    checked={formTop.agreed} 
                    onChange={(e) => handleFormChange("top", "agreed", e.target.checked)}
                    className="rounded-sm border-[#E0EAEF] text-[#00B4D8] focus:ring-[#00B4D8] cursor-pointer w-4 h-4 mt-0.5"
                    required
                  />
                  <div>
                    <label htmlFor="agree-top-cap" className="text-xs font-bold text-slate-650 cursor-pointer select-none">
                      개인정보 수집 및 이용동의 <span className="text-[#0077B6] font-bold">(필수)</span>
                    </label>
                    <p className="text-[10px] text-slate-400">신속 접수 해피콜 진행 및 특가 혜택 수립용 활용.</p>
                  </div>
                </div>

                {/* CTA Submit button */}
                <button 
                  type="submit"
                  className="submit-btn w-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white py-4.5 rounded-2xl font-black text-center text-sm shadow-md shadow-[#00B4D8]/25 hover:opacity-95 transition-all text-white cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4.5 h-4.5 text-yellow-300 animate-pulse-slow" />
                  <span>할인견적 실시간 알아보기</span>
                </button>

                <p className="text-center text-[10px] text-[#999] flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>위 정보는 엄격한 개인정보 보호 조약 속에 비밀 수렵 보장됩니다.</span>
                </p>

              </form>

            </div>
          </div>

        </section>

        {/* --- Middle Bento Section (3 Trust Card Bento Boxes) --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-7 border border-[#E6EFF2] shadow-xs flex flex-col justify-between hover:border-[#0077B6]/30 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-[#0077B6] mb-5">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-base text-slate-900 mb-2">원칙적인 정찰 요금제</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                이사나 청소 당일 현장에서 생소한 공구를 가져와 기습적으로 청구하는 부가금이 절대 없음을 맹세합니다.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-[#E6EFF2] shadow-xs flex flex-col justify-between hover:border-[#0077B6]/30 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-[#00B4D8] mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-base text-slate-900 mb-2">프리미엄 무상 피톤치드 세제</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                독한 저가 염소계 세제를 완전 배제하고, 아기나 반려동물이 쾌적하도록 무자극 향균 에코 공법 도포를 원격 진행합니다.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-[#E6EFF2] shadow-xs flex flex-col justify-between hover:border-[#0077B6]/30 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-base text-slate-900 mb-2">100% 무상 책임 A/S보증</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                검수 중 완벽하게 청소되지 못한 구역에 대해서는, 마감 후 3 영업일 안까지 무상 전담 보완을 기조로 보증합니다.
              </p>
            </div>
          </div>

        </section>

        {/* --- Customer Live Reviews Filter Dashboard (High Interactivity!) --- */}
        <section className="bg-[#FFFFFF] border border-[#E6EFF2] rounded-3xl p-6 sm:p-8 shadow-xs">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs text-[#0077B6] font-black tracking-widest uppercase block mb-1">CLIENT REVIEWS</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                직업 거주 형태별 리얼 검증 수기
              </h2>
            </div>
            
            {/* Interactive Review Filtering Controls */}
            <div className="flex flex-wrap gap-1.5 mt-4 md:mt-0 bg-slate-50 p-1 rounded-xl">
              {[
                { key: "all", label: "전체 후기" },
                { key: "apartment", label: "아파트" },
                { key: "studio", label: "오피스텔/원룸" },
                { key: "villa", label: "빌라/다세대" }
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => setActiveReviewTab(btn.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeReviewTab === btn.key 
                      ? "bg-[#0077B6] text-white shadow-xs" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Reviews grid view */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-1 text-sm text-yellow-400 mb-2">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <h5 className="font-extrabold text-sm text-slate-850 mb-1.5 line-clamp-1">
                    "{rev.title}"
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed italic line-clamp-4">
                    {rev.content}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-[#0077B6] font-bold">
                  <span>{rev.author}</span>
                  <span className="text-slate-400">{rev.spaceInfo}</span>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* --- FAQ Accordion Bento Box (High trust and quality!) --- */}
        <section className="bg-gradient-to-tr from-[#005F91] to-[#0077B6] text-white rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-xs text-yellow-200 font-extrabold tracking-wider uppercase flex justify-center items-center gap-1.5">
                <QuestionIcon className="w-4 h-4 text-yellow-300" />
                Frequently Asked Questions
              </span>
              <h3 className="text-lg sm:text-2xl font-black mt-1.5">
                청소 특가 상담 전 자주 소통되는 질의응답
              </h3>
            </div>

            <div className="space-y-3">
              {faqData.map((faq) => {
                const isOpen = activeFaqId === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className="bg-white/10 rounded-2xl border border-white/10 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <span>Q. {faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-sky-200 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-sky-200 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 sm:p-5 pt-0 text-xs text-sky-100 leading-relaxed border-t border-white/5 font-medium">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- Bottom Duplicate Conversion Form --- */}
        <section ref={bottomFormRef} className="bg-white rounded-3xl border border-[#E6EFF2] p-8 shadow-md max-w-2xl mx-auto my-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-sky-400"></div>

          <div className="text-center mb-6">
            <span className="text-[10px] bg-sky-50 text-[#0077B6] font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
              위 상담 기회를 아쉽게 놓치셨다면
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-[#0077B6] mt-2.5">
              마지막 여기서 빠르게 신청하세요!
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              상단 상담 처와 완전히 동일한 국가 보안 및 35% 즉시 공제 혜택이 적용됩니다.
            </p>
          </div>

          <form onSubmit={(e) => handleFormSubmit(e, "bottom")} className="space-y-4">
            
            {/* Name */}
            <div className="field-group flex flex-col gap-1.5">
              <label className="field-label text-xs font-bold text-slate-500 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#0077B6]" />
                성함을 알려주세요! <span className="text-rose-550 font-black">*</span>
              </label>
              <input 
                type="text" 
                value={formBottom.name}
                onChange={(e) => handleFormChange("bottom", "name", e.target.value)}
                placeholder="예: 홍길동"
                className="input-text bg-[#F8FBFC] border border-[#E0EAEF] px-4 py-3 rounded-xl focus:border-[#0077B6] focus:outline-hidden text-sm font-semibold transition-all w-full"
                required
              />
            </div>

            {/* Phone */}
            <div className="field-group flex flex-col gap-1.5">
              <label className="field-label text-xs font-bold text-slate-500 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#0077B6]" />
                연락처를 설정해 주세요! <span className="text-rose-550 font-black">*</span>
              </label>
              <div className="phone-grid grid grid-cols-[80px_15px_1fr_15px_1fr] items-center text-center">
                <select 
                  value={formBottom.phoneFirst}
                  onChange={(e) => handleFormChange("bottom", "phoneFirst", e.target.value)}
                  className="input-text bg-[#F8FBFC] border border-[#E0EAEF] p-3 rounded-xl text-sm font-bold focus:outline-hidden text-center cursor-pointer"
                >
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                  <option value="017">017</option>
                  <option value="019">019</option>
                </select>
                <span className="text-slate-300 font-bold">-</span>
                <input 
                  type="number" 
                  pattern="[0-9]*"
                  maxLength={4}
                  value={formBottom.phoneSecond}
                  onChange={(e) => {
                    if (e.target.value.length <= 4) handleFormChange("bottom", "phoneSecond", e.target.value);
                  }}
                  placeholder="1234"
                  className="input-text bg-[#F8FBFC] border border-[#E0EAEF] p-3 rounded-xl text-sm font-bold focus:outline-hidden text-center"
                  required
                />
                <span className="text-slate-300 font-bold">-</span>
                <input 
                  type="number" 
                  pattern="[0-9]*"
                  maxLength={4}
                  value={formBottom.phoneThird}
                  onChange={(e) => {
                    if (e.target.value.length <= 4) handleFormChange("bottom", "phoneThird", e.target.value);
                  }}
                  placeholder="5678"
                  className="input-text bg-[#F8FBFC] border border-[#E0EAEF] p-3 rounded-xl text-sm font-bold focus:outline-hidden text-center"
                  required
                />
              </div>
            </div>

            {/* Clean Type Selector Toggle */}
            <div className="field-group flex flex-col gap-1.5">
              <label className="field-label text-xs font-bold text-slate-500 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#0077B6]" />
                청소 강도 및 서비스 유형 선택
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFormChange("bottom", "cleanType", "standard")}
                  className={`p-3 rounded-xl text-xs text-center font-bold border transition-all cursor-pointer ${
                    formBottom.cleanType === "standard"
                      ? "bg-[#0077B6] text-white border-[#0077B6]"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  <div className="font-extrabold">기본 특가 분량</div>
                  <div className="text-[10px] opacity-75 mt-0.5">꼼꼼 입주/이사 케어</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleFormChange("bottom", "cleanType", "premium")}
                  className={`p-3 rounded-xl text-xs text-center font-bold border transition-all cursor-pointer ${
                    formBottom.cleanType === "premium"
                      ? "bg-[#0077B6]/10 text-[#0077B6] border-[#0077B6] ring-1 ring-[#0077B6]"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  <div className="font-extrabold">프리미엄 딥에코</div>
                  <div className="text-[10px] opacity-75 mt-0.5">고온 살균 + 향균 케어</div>
                </button>
              </div>
            </div>

            {/* Region Option Buttons Grid */}
            <div className="field-group flex flex-col gap-1.5">
              <label className="field-label text-xs font-bold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0077B6]" />
                청소 지역
              </label>
              <div className="option-grid grid grid-cols-3 gap-2">
                {["서울", "경기", "인천"].map((reg) => {
                  const isSelected = formBottom.region === reg;
                  return (
                    <button
                      type="button"
                      key={reg}
                      onClick={() => handleFormChange("bottom", "region", reg)}
                      className={`option-btn py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all text-center cursor-pointer ${
                        isSelected 
                          ? "bg-[#00B4D8] text-white border-[#00B4D8] font-black"
                          : "bg-[#F8FBFC] text-slate-500 border-[#E0EAEF] hover:bg-[#F0F9FB]"
                      }`}
                    >
                      {reg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Space Type Option Grid */}
            <div className="field-group flex flex-col gap-1.5">
              <label className="field-label text-xs font-bold text-slate-500 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-[#0077B6]" />
                공간 유형
              </label>
              <div className="option-grid-5 grid grid-cols-5 gap-1.5">
                {["아파트", "빌라", "오피스텔", "상가", "그외"].map((space) => {
                  const isSelected = formBottom.spaceType === space;
                  return (
                    <button
                      type="button"
                      key={space}
                      onClick={() => handleFormChange("bottom", "spaceType", space)}
                      className={`option-btn py-2.5 rounded-xl text-[10px] font-bold tracking-tight transition-all text-center cursor-pointer ${
                        isSelected 
                          ? "bg-[#00B4D8] text-white border-[#00B4D8] font-black"
                          : "bg-[#F8FBFC] text-slate-500 border-[#E0EAEF] hover:bg-[#F0F9FB]"
                      }`}
                    >
                      {space}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pyeong Slider Adjuster Block */}
            <div className="p-3.5 bg-sky-50/50 rounded-2xl border border-sky-150/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
                  대상 평수 조절
                </span>
                <span className="text-xs font-black text-[#0077B6] bg-white px-2 py-0.5 rounded-md border border-sky-100 shadow-3xs">
                  {formBottom.pyeong}평 ({Math.round(formBottom.pyeong * 3.3)}㎡)
                </span>
              </div>
              <input 
                type="range" 
                min={5} 
                max={80} 
                value={formBottom.pyeong}
                onChange={(e) => handleFormChange("bottom", "pyeong", parseInt(e.target.value))}
                className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-[#00B4D8]"
              />
              
              {/* Cost Summary Box inside form */}
              <div className="mt-3.5 pt-2 border-t border-dashed border-sky-100 grid grid-cols-2 text-center text-[10px]">
                <div>
                  <span className="block text-slate-450 font-semibold mb-0.5">정상 소비자 비용</span>
                  <span className="text-slate-400 line-through font-mono font-bold">
                    {bottomQuote.original.toLocaleString()}원
                  </span>
                </div>
                <div className="border-l border-sky-100">
                  <span className="block text-[#0077B6] font-bold">35% 선착순 특별가</span>
                  <span className="text-[#00B4D8] font-extrabold font-mono text-sm">
                    {bottomQuote.discounted.toLocaleString()}원~
                  </span>
                </div>
              </div>
            </div>

            {/* Consent checkbox */}
            <div className="flex items-center gap-2.5 mt-2">
              <input 
                type="checkbox" 
                id="agree-bottom-cap" 
                checked={formBottom.agreed} 
                onChange={(e) => handleFormChange("bottom", "agreed", e.target.checked)}
                className="rounded-sm border-[#E0EAEF] text-[#00B4D8] focus:ring-[#00B4D8] cursor-pointer w-4 h-4"
                required
              />
              <label htmlFor="agree-bottom-cap" className="text-xs font-bold text-slate-500 cursor-pointer select-none">
                개인정보 수집 및 이용동의 <span className="text-cyan-600">(필수)</span>
              </label>
            </div>

            {/* CTA Submit button */}
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white py-4 rounded-2xl font-black text-center text-sm shadow-md hover:opacity-95 transition-all text-white cursor-pointer"
            >
              <span>할인견적 알아보기</span>
            </button>

          </form>
        </section>

      </main>

      {/* --- Footer (Bento Style) --- */}
      <footer id="footer-section" className="bg-[#EBF3F5] rounded-3xl mx-4 sm:mx-8 p-8 max-w-6xl md:mx-auto border border-[#DEEAEB] text-[#555] text-xs mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <div className="footer-info space-y-2">
            <strong className="text-[#0077B6] font-black text-sm block">업체명 : 프로 홈케어</strong>
            <p className="font-semibold text-slate-700">대표번호 : 1800-1234 (연중무휴 친절 기술상담 센터)</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              개인정보 보호책임자 : 김클린 | 사업자등록번호 : 123-45-67890 <br />
              소재지 : 서울특별시 성동구 특가홈케어 전담사업단
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-[#0077B6] block text-xs">개인정보 수집 및 이용 동의 안내</span>
            <p className="leading-relaxed text-[10px] text-slate-400">
              수집목적 : 이사·입주·사무실 청소의 할인 기획 및 특가 산출, 원활한 유선 연락 보장. <br />
              수집항목 : 성함, 연락처, 공간유형 및 지역, 희망 평수 수준 <br />
              보유기간 : 목적 달성 혹은 상담 진행 이행 완료 단계 이후 지체없이 즉시 파기.
            </p>
          </div>

        </div>

        <div className="border-t border-[#DEEAEB] mt-6 pt-4 text-center text-[10px] text-slate-400 font-bold">
          Copyright 2025 ⓒ 프로 홈케어. All Rights Reserved.
        </div>
      </footer>

      {/* --- Deep Interactive Modal Success Dialog --- */}
      {showSuccessModal && submittedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-sky-100 animate-slideup max-h-[95vh] flex flex-col">
            
            <div className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] p-6 text-center text-white relative">
              <div className="w-14 h-14 bg-white/25 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-black text-lg">특별 할인 견적 예약 완료!</h3>
              <p className="text-[10px] opacity-90 mt-0.5 tracking-wider font-semibold">
                YOUR EXCLUSIVE 35% DISCOUNT SECURED
              </p>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="text-center border-b border-slate-100 pb-4">
                <p className="text-base font-bold text-slate-800">
                  <span className="text-[#0077B6] font-black">{submittedData.name}</span> 고객님, 등록이 완료되었습니다.
                </p>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  오늘의 잔여 일정 특별할인 <strong>35% 세이브 기수</strong>가 안전하게 보장 배정되었습니다. <br />
                  작성해 주신 번호 (<span className="text-[#0077B6] font-bold">{submittedData.phoneFirst}-{submittedData.phoneSecond}-{submittedData.phoneThird}</span>)로 배정 팀장이 곧 연락드립니다.
                </p>
              </div>

              {/* Estimate calculation layout */}
              <div className="bg-[#F0F9FB] p-4 rounded-2xl border border-[#E6EFF2]">
                <span className="block text-[10px] text-[#0077B6] tracking-wider font-extrabold mb-2 uppercase">의뢰 매세지</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">지정 서비스:</span>
                    <span className="font-bold text-[#0077B6]">
                      {submittedData.cleanType === "premium" ? "프리미엄 딥에코 살균 청소" : "스탠다드 책임 청소"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">배정 대상 지역:</span>
                    <span className="font-bold text-slate-800">{submittedData.region} 안심지부</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">주거 평수:</span>
                    <span className="font-bold text-slate-800">{submittedData.spaceType} ({submittedData.pyeong}평)</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-slate-200 mt-2">
                    <span className="text-slate-500">표준 정상 가액:</span>
                    <span className="font-mono text-slate-400 line-through text-xs">
                      {calculatePricing(submittedData.spaceType, submittedData.pyeong, submittedData.cleanType).original.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#0077B6] font-bold">35% 특별 당일가:</span>
                    <span className="font-mono text-[#0077B6] font-black text-sm">
                      {calculatePricing(submittedData.spaceType, submittedData.pyeong, submittedData.cleanType).discounted.toLocaleString()}원~
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#00B4D8] font-bold">
                    <span>금일 선점 혜택 절약분:</span>
                    <span>-{calculatePricing(submittedData.spaceType, submittedData.pyeong, submittedData.cleanType).saving.toLocaleString()}원 할인보장!</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-100 flex gap-2 text-xs">
                <AlertCircle className="w-5 h-5 text-[#0077B6] shrink-0 mt-0.5" />
                <p className="text-slate-600 leading-normal">
                  <span className="font-bold text-[#0077B6]">상담 절차 안내:</span> 전문 팀 마스터가 배수량 및 베란다 곰팡이 유무 등을 <strong>5분 내 무상 체크 해피콜</strong>로 조율을 이어가겠습니다.
                </p>
              </div>

            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#0077B6] text-white font-extrabold text-xs py-3 rounded-xl cursor-pointer hover:bg-[#005f91]"
              >
                혜택 적용 및 안심 닫기
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
