import { useState, useEffect, useRef } from 'react';
import { Heart, Volume2, VolumeX } from 'lucide-react';

interface BabySectionProps {
  onComplete: () => void;
  onBabyAudioPlay?: () => void;
  onBabyAudioEnd?: () => void;
}

const BabySection = ({ onComplete, onBabyAudioPlay, onBabyAudioEnd }: BabySectionProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const fullText = "妈妈生日快乐，我今天不惹你生气，爸爸说你今天最大！";
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setShowHearts(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const isWeChat = () => /MicroMessenger/i.test(navigator.userAgent);

  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    onBabyAudioPlay?.();
    setIsPlaying(true);
    
    const doPlay = () => {
      audio.play().then(() => {
        // success
      }).catch((err) => {
        console.log('Baby audio play failed:', err);
        // In WeChat, try creating a fresh audio element
        if (isWeChat()) {
          const freshAudio = new Audio('/baby_saying.mp3');
          freshAudio.play().then(() => {
            // Transfer control to the fresh audio
            freshAudio.onended = () => {
              setIsPlaying(false);
              onBabyAudioEnd?.();
            };
          }).catch(() => {
            setIsPlaying(false);
            onBabyAudioEnd?.();
            alert('请点击右上角「...」选择在浏览器中打开，以获得最佳体验');
          });
          return;
        }
        setIsPlaying(false);
        onBabyAudioEnd?.();
      });
    };
    
    if (isWeChat() && (window as any).WeixinJSBridge) {
      (window as any).WeixinJSBridge.invoke('getNetworkType', {}, doPlay);
    } else {
      doPlay();
    }
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onBabyAudioEnd?.();
    } else {
      playAudio();
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-16 px-4 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FFF8F5] to-white" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-[#F4AFA8]/10 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#E8B4B8]/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-[#F4AFA8]" fill="#F4AFA8" />
            <span className="text-sm text-[#7A7A7A] uppercase tracking-wider">From Little One</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#4A4A4A]">
            来自小阿宝的祝福
          </h2>
        </div>

        {/* Baby Image */}
        <div className="relative mb-8">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto">
            <img 
              src="/images/baby-blessing.jpg" 
              alt="Baby holding drawing"
              loading="eager"
              decoding="async"
              className="w-full h-full object-contain animate-float"
            />
          </div>
          
          {/* Floating Hearts - reduced for performance */}
          {showHearts && (
            <>
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className="absolute text-[#F4AFA8] animate-float"
                  style={{
                    top: `${-5 + i * 20}%`,
                    left: `${15 + (i % 3) * 30}%`,
                    animationDelay: `${i * 0.3}s`,
                    width: `${18}px`,
                    height: `${18}px`,
                  }}
                  fill="currentColor"
                />
              ))}
            </>
          )}
        </div>

        {/* Speech Bubble */}
        <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl max-w-lg mx-auto mb-4">
          {/* Triangle */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white" />
          
          {/* Audio Button */}
          <button
            onClick={toggleAudio}
            className="absolute top-4 right-4 w-10 h-10 bg-[#F4AFA8]/10 rounded-full flex items-center justify-center hover:bg-[#F4AFA8]/20 transition-colors"
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-[#F4AFA8]" />
            ) : (
              <VolumeX className="w-5 h-5 text-[#7A7A7A]" />
            )}
          </button>

          {/* Text */}
          <p className="text-lg sm:text-xl text-[#4A4A4A] font-body leading-relaxed text-left">
            {displayedText}
            <span className={`inline-block w-0.5 h-5 bg-[#F4AFA8] ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
          </p>

          {/* Signature */}
          <div className="mt-4 text-right">
            <span className="font-script text-[#F4AFA8] text-lg">—— 3岁的小宝贝</span>
          </div>
        </div>

        {/* Audio Play Button - appears after typing finishes */}
        {showHearts && (
          <div className="flex justify-center mb-4 animate-fade-in-up">
            <button
              onClick={toggleAudio}
              className="group bg-[#F4AFA8] hover:bg-[#E89A94] text-white px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>播放中...</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>🔊 点击听宝宝说</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Baby's Drawing */}
        <div className="bg-[#F9E0D9]/30 rounded-2xl p-6 max-w-sm mx-auto mb-8">
          <p className="text-sm text-[#7A7A7A] mb-3">宝宝的爱心画</p>
          <div className="bg-white rounded-xl p-4 shadow-inner">
            <img 
              src="/images/babyheart.jpg" 
              alt="宝宝的爱心画"
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Continue Button */}
        {displayedText.length === fullText.length && (
          <div className="animate-fade-in-up">
            <button
              onClick={onComplete}
              className="bg-[#F4AFA8] hover:bg-[#E89A94] text-white px-8 py-4 rounded-full font-medium text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              看看爸爸的告白 →
            </button>
          </div>
        )}
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        playsInline
        x5-playsinline="true"
        webkit-playsinline="true"
        onEnded={() => {
          setIsPlaying(false);
          onBabyAudioEnd?.();
        }}
      >
        <source src="/baby_saying.mp3" type="audio/mpeg" />
        <source src="/baby_saying.m4a" type="audio/mp4" />
        您的浏览器不支持播放该音频
      </audio>

      {/* Background Pattern - simplified for performance */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #F4AFA8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </section>
  );
};

export default BabySection;
