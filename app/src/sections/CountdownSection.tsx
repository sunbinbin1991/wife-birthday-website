import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

interface CountdownSectionProps {
  onComplete: () => void;
}

const CountdownSection = ({ onComplete }: CountdownSectionProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Target date: April 22, 2025
  const targetDate = new Date('2025-04-22T00:00:00');

  useEffect(() => {
    setIsVisible(true);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const FlipCard = ({ value, label }: { value: number; label: string }) => {
    const formattedValue = value.toString().padStart(2, '0');
    
    return (
      <div className="flex flex-col items-center mx-2 sm:mx-4">
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-lg px-4 py-3 sm:px-6 sm:py-4 min-w-[60px] sm:min-w-[80px] text-center">
            <span className="text-3xl sm:text-5xl font-display font-bold text-[#F4AFA8]">
              {formattedValue}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 rounded-2xl pointer-events-none" />
        </div>
        <span className="mt-2 text-xs sm:text-sm text-[#7A7A7A] font-body uppercase tracking-wider">
          {label}
        </span>
      </div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8F5]/30 via-[#FFF8F5]/50 to-[#FFF8F5]/80" />
      
      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute text-[#F4AFA8]/40 animate-twinkle`}
            style={{
              top: `${15 + i * 15}%`,
              left: `${10 + (i % 3) * 35}%`,
              animationDelay: `${i * 0.3}s`,
              width: `${16 + i * 4}px`,
              height: `${16 + i * 4}px`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#F4AFA8]" />
          <span className="font-script text-xl sm:text-2xl text-[#D4A574]">0422</span>
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#F4AFA8]" />
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-[#4A4A4A] mb-2 leading-tight">
          距离你降临这个世界的
        </h1>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-[#F4AFA8] mb-8">
          第 <span className="text-[#D4A574]">33</span> 年
        </h2>

        {/* Countdown Timer */}
        <div className="flex justify-center items-center mb-8">
          <FlipCard value={timeLeft.days} label="天" />
          <span className="text-2xl sm:text-4xl text-[#F4AFA8] font-bold -mt-6">:</span>
          <FlipCard value={timeLeft.hours} label="时" />
          <span className="text-2xl sm:text-4xl text-[#F4AFA8] font-bold -mt-6">:</span>
          <FlipCard value={timeLeft.minutes} label="分" />
          <span className="text-2xl sm:text-4xl text-[#F4AFA8] font-bold -mt-6">:</span>
          <FlipCard value={timeLeft.seconds} label="秒" />
        </div>

        {/* Subtitle */}
        <p className="font-script text-lg sm:text-2xl text-[#7A7A7A] mb-4 italic">
          "地球又转到了你第一次看见太阳的位置"
        </p>

        {/* Opening Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-6 py-4 sm:px-8 sm:py-5 shadow-lg max-w-md mx-auto mb-10">
          <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
            亲爱的老婆，今天没有早醒的宝宝，没有待洗的衣服<br />
            只有 <span className="text-[#F4AFA8] font-semibold">24小时</span> 属于你的快乐时光
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onComplete}
          className="group bg-[#F4AFA8] hover:bg-[#E89A94] text-white px-8 py-4 rounded-full font-medium text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
        >
          <span>开启属于你的24小时</span>
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FFF8F5] to-transparent" />
    </section>
  );
};

export default CountdownSection;
