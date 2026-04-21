import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CakeSectionProps {
  onComplete: () => void;
}

interface Candle {
  id: number;
  lit: boolean;
  message: string;
}

const CakeSection = ({ onComplete }: CakeSectionProps) => {
  const [candles, setCandles] = useState<Candle[]>([
    { id: 1, lit: true, message: "谢谢你第1年选择做我的女孩" },
    { id: 2, lit: true, message: "谢谢你第2年选择做我的妻子" },
    { id: 3, lit: true, message: "谢谢你第3年选择成为妈妈" },
    { id: 4, lit: true, message: "谢谢你第4年依然选择爱我" },
    { id: 5, lit: true, message: "谢谢你第5年陪我走过风雨" },
  ]);
  const [currentMessage, setCurrentMessage] = useState<string>("许个愿，吹灭蜡烛吧");
  const [showMessage, setShowMessage] = useState(true);
  const [allBlown, setAllBlown] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const blowCandle = (id: number) => {
    const candle = candles.find(c => c.id === id);
    if (!candle || !candle.lit) return;

    setCandles(prev => prev.map(c => 
      c.id === id ? { ...c, lit: false } : c
    ));

    setCurrentMessage(candle.message);
    setShowMessage(false);
    setTimeout(() => setShowMessage(true), 100);

    // Check if all candles are blown
    const remainingLit = candles.filter(c => c.id !== id && c.lit).length;
    if (remainingLit === 0) {
      setTimeout(() => {
        setCurrentMessage("所有愿望都与你有关 ✨");
        setAllBlown(true);
      }, 1000);
    }
  };

  const handleCakeClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
    }
  };

  // Auto-proceed if all candles blown after 3 seconds
  useEffect(() => {
    if (allBlown) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [allBlown, onComplete]);

  const CandleSVG = ({ candle, onBlow }: { candle: Candle; onBlow: () => void }) => (
    <div className="relative flex flex-col items-center">
      {/* Flame */}
      {candle.lit && (
        <div 
          className="absolute -top-8 cursor-pointer animate-flicker"
          onClick={onBlow}
        >
          <svg width="24" height="32" viewBox="0 0 24 32" className="drop-shadow-lg">
            <defs>
              <linearGradient id={`flame-${candle.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFF8DC" />
              </linearGradient>
            </defs>
            <ellipse 
              cx="12" 
              cy="20" 
              rx="8" 
              ry="12" 
              fill={`url(#flame-${candle.id})`}
              className="animate-pulse"
            />
          </svg>
        </div>
      )}
      
      {/* Smoke effect when blown */}
      {!candle.lit && (
        <div className="absolute -top-6 pointer-events-none">
          <div className="w-2 h-8 bg-gray-300/30 rounded-full animate-[smoke_1.5s_ease-out_forwards]" />
        </div>
      )}
      
      {/* Candle Body */}
      <div 
        className={`w-3.5 h-10 sm:w-4 sm:h-12 rounded-t-lg cursor-pointer transition-all duration-300 shadow-sm ${
          candle.lit 
            ? 'bg-gradient-to-b from-[#F4AFA8] to-[#E8B4B8]' 
            : 'bg-gradient-to-b from-[#E8D5D5] to-[#D4C4B0] opacity-60'
        }`}
        onClick={onBlow}
      >
        {/* Candle stripes */}
        <div className="h-full w-full flex flex-col justify-evenly px-0.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-px w-full bg-white/40 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-16 px-4 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8F5] via-[#F9E0D9]/50 to-[#FFF8F5]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#F4AFA8]/10 rounded-full blur-2xl" />
      <div className="absolute bottom-40 right-10 w-32 h-32 bg-[#E8B4B8]/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#4A4A4A] mb-3">
            先许个愿吧
          </h2>
          <p className="text-[#7A7A7A] text-sm sm:text-base">
            点击蜡烛，或者对着手机吹一口气
          </p>
        </div>

        {/* Message Display */}
        <div className="h-14 mb-4 flex items-center justify-center">
          <div 
            className={`bg-white/95 rounded-2xl px-6 py-3 shadow-lg transition-all duration-500 ${
              showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-[#F4AFA8] font-script text-lg sm:text-xl text-center">
              {currentMessage}
            </p>
          </div>
        </div>

        {/* Cake Container */}
        <div 
          className="relative mx-auto w-56 sm:w-72 cursor-pointer mt-2"
          onClick={handleCakeClick}
        >
          {/* Candles */}
          <div className="relative flex justify-center gap-3 sm:gap-4 mb-6 px-10">
            {candles.map((candle) => (
              <CandleSVG 
                key={candle.id} 
                candle={candle} 
                onBlow={() => blowCandle(candle.id)}
              />
            ))}
          </div>

          {/* Cake Image */}
          <img 
            src="/images/birthday-cake.jpg" 
            alt="Birthday Cake"
            loading="eager"
            decoding="async"
            className="w-full h-auto rounded-2xl drop-shadow-2xl animate-float"
          />

          {/* Sparkles around cake */}
          <Sparkles className="absolute -top-2 -right-4 w-6 h-6 text-[#D4A574] animate-twinkle" />
          <Sparkles className="absolute top-1/3 -left-6 w-5 h-5 text-[#F4AFA8] animate-twinkle" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute bottom-8 -right-2 w-4 h-4 text-[#E8B4B8] animate-twinkle" style={{ animationDelay: '1s' }} />
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {candles.map((candle) => (
            <div 
              key={candle.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                candle.lit ? 'bg-[#F4AFA8]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        {allBlown && (
          <div className="mt-10 text-center animate-fade-in-up">
            <button
              onClick={onComplete}
              className="group bg-[#F4AFA8] hover:bg-[#E89A94] text-white px-8 py-4 rounded-full font-medium text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
            >
              <span>开启今日特权</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Hint */}
        <p className="text-center text-xs text-[#7A7A7A]/60 mt-6">
          小提示：连续点击蛋糕5次有惊喜哦
        </p>
      </div>

      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in-up">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl">
            <div className="text-4xl mb-4">💕</div>
            <h3 className="text-xl font-display font-bold text-[#4A4A4A] mb-2">
              五年婚姻的隐藏彩蛋
            </h3>
            <p className="text-[#7A7A7A] text-sm mb-4">
              从"我愿意"到现在，每一天都感谢你的选择
            </p>
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#F4AFA8] to-[#E8B4B8] rounded-2xl flex items-center justify-center">
              <span className="text-5xl">💍</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CakeSection;
