import { useState, useEffect, useRef } from 'react';
import { Check, Heart, Send, Calendar, Camera } from 'lucide-react';

interface PromiseSectionProps {
  onComplete: () => void;
}

interface Promise {
  id: number;
  text: string;
  checked: boolean;
}



const PromiseSection = ({ onComplete }: PromiseSectionProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [promises, setPromises] = useState<Promise[]>([
    { id: 1, text: "每月一次只属于我们的晚餐", checked: false },
    { id: 2, text: "每年一次带娃的旅行", checked: false },
    { id: 3, text: "每周四小时你的自由时间", checked: false },
    { id: 4, text: "每周一个拥抱和一句我爱你", checked: false },
    { id: 5, text: "永远把你放在第一位", checked: false },
  ]);
  const [signature, setSignature] = useState('');
  const [showSignature, setShowSignature] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const fullSignature = "爱你的丈夫，也是永远追你的男孩";



  useEffect(() => {
    if (isFlipped && !showSignature) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= fullSignature.length) {
          setSignature(fullSignature.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setShowSignature(true);
        }
      }, 80);

      return () => clearInterval(interval);
    }
  }, [isFlipped, showSignature]);

  useEffect(() => {
    setAllChecked(promises.every(p => p.checked));
  }, [promises]);

  const togglePromise = (id: number) => {
    setPromises(prev => prev.map(p => 
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  const handleOpenCard = () => {
    setIsFlipped(true);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-8 px-4 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8F5] via-[#F9E0D9]/20 to-[#FFF8F5]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-24 h-24 bg-[#F4AFA8]/10 rounded-full blur-2xl" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-[#E8B4B8]/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-[#F4AFA8]" />
            <span className="text-sm text-[#7A7A7A] uppercase tracking-wider">My Promise</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#4A4A4A] mb-2">
            未来一年的承诺
          </h2>
          <p className="text-[#7A7A7A] text-sm">
            不是实物礼物，而是未来的每一天
          </p>
        </div>

        {/* Promises List - Moved to top for easy access */}
        <div className="bg-white/95 rounded-2xl p-4 shadow-lg mb-4">
          <h3 className="text-sm font-semibold text-[#4A4A4A] mb-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-[#F4AFA8]" />
            点击勾选承诺
          </h3>
          <div className="space-y-2">
            {promises.map((promise) => (
              <div
                key={promise.id}
                onClick={() => togglePromise(promise.id)}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-300 ${
                  promise.checked 
                    ? 'bg-[#F4AFA8]/10 border-2 border-[#F4AFA8]' 
                    : 'bg-[#F9E0D9]/30 border-2 border-transparent hover:border-[#F4AFA8]/30'
                }`}
              >
                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                    promise.checked ? 'bg-[#F4AFA8]' : 'bg-gray-200'
                  }`}
                >
                  {promise.checked && <Check className="w-3 h-3 text-white" />}
                </div>
                <span 
                  className={`flex-1 text-sm transition-all duration-300 ${
                    promise.checked ? 'text-[#4A4A4A] line-through opacity-70' : 'text-[#4A4A4A]'
                  }`}
                >
                  {promise.text}
                </span>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-3 pt-3 border-t border-[#F9E0D9]">
            <div className="flex justify-between text-xs text-[#7A7A7A] mb-1">
              <span>已勾选承诺</span>
              <span>{promises.filter(p => p.checked).length} / {promises.length}</span>
            </div>
            <div className="h-1.5 bg-[#F9E0D9] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#F4AFA8] rounded-full transition-all duration-500"
                style={{ width: `${(promises.filter(p => p.checked).length / promises.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Heart Collage - 历年回忆 */}
        <div className="bg-white/95 rounded-2xl p-4 shadow-lg mb-4">
          <h3 className="text-sm font-semibold text-[#4A4A4A] mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#F4AFA8]" />
            历年回忆
          </h3>
          <div className="rounded-xl overflow-hidden">
            <img 
              src="/images/heart_collage.jpg" 
              alt="心形照片拼贴"
              loading="lazy"
              decoding="async"
              className="w-full object-cover"
            />
          </div>
        </div>

        {/* Card Container */}
        <div className="relative perspective-1000">
          {/* Card Front (Closed) */}
          <div 
            className={`relative transition-all duration-700 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-180 opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
              onClick={handleOpenCard}
            >
              <img 
                src="/images/love-card.jpg" 
                alt="Love Card"
                loading="lazy"
                decoding="async"
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="p-4 text-center">
                <p className="font-script text-lg text-[#F4AFA8] mb-2">
                  点击打开这封贺卡
                </p>
                <Heart className="w-5 h-5 text-[#F4AFA8] mx-auto animate-pulse" fill="#F4AFA8" />
              </div>
            </div>
          </div>

          {/* Card Back (Open) */}
          <div 
            className={`absolute inset-0 transition-all duration-700 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-0 opacity-100' : 'rotate-y-180 opacity-0 pointer-events-none'
            }`}
          >
            <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-6">
              {/* Card Header */}
              <div className="text-center mb-4">
                <Heart className="w-6 h-6 text-[#F4AFA8] mx-auto mb-2" fill="#F4AFA8" />
                <h3 className="font-display text-xl text-[#4A4A4A]">给最爱的你</h3>
              </div>

              {/* Date */}
              <div className="text-center mb-4">
                <span className="text-sm text-[#7A7A7A]">2026年4月22日</span>
              </div>

              {/* Message */}
              <div className="bg-[#F9E0D9]/30 rounded-xl p-4 mb-4">
                <p className="text-sm text-[#4A4A4A] leading-relaxed text-center">
                  这一年，我会用行动证明<br />
                  你永远是我的心上人
                </p>
              </div>

              {/* Signature */}
              <div className="text-center pt-3 border-t border-[#F9E0D9]">
                <p className="font-script text-lg text-[#F4AFA8] min-h-[1.5rem]">
                  {signature}
                  {!showSignature && <span className="animate-pulse">|</span>}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        {allChecked && (
          <div className="mt-6 text-center animate-fade-in-up">
            <button
              onClick={onComplete}
              className="group bg-[#F4AFA8] hover:bg-[#E89A94] text-white px-8 py-4 rounded-full font-medium text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
            >
              <span>去许愿池许个愿</span>
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* CSS for 3D flip */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
      `}</style>
    </section>
  );
};

export default PromiseSection;
