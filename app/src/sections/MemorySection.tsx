import { useState, useRef } from 'react';
import { Heart, Calendar, ArrowRight } from 'lucide-react';

interface MemorySectionProps {
  onComplete: () => void;
}

interface Memory {
  year: number;
  title: string;
  description: string;
  emoji: string;
  color: string;
}

const MemorySection = ({ onComplete }: MemorySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [activeMemory, setActiveMemory] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const memories: Memory[] = [
    { 
      year: 2021, 
      title: "二人世界的第一个生日", 
      description: "那一年我们去了三亚看大海，许下了无数个一起看海的愿望",
      emoji: "🏖️",
      color: "#E8B4B8"
    },
    { 
      year: 2022, 
      title: "二人世界的第二个生日", 
      description: "那一年有圆滚滚的幸福，肚子里藏着我们的未来",
      emoji: "🤰",
      color: "#D4A574"
    },
    { 
      year: 2023, 
      title: "新手妈妈的第一个生日", 
      description: "那一年我们一同见证了小生命的诞生，迎来了我们的小宝贝，见证了太多第一次的喜悦",
      emoji: "👶",
      color: "#F4AFA8"
    },
    { 
      year: 2024, 
      title: "新手妈妈的第二个生日", 
      description: "那一年我们听到了最动听的声音，第一次被叫妈妈，第一次被叫爸爸...",
      emoji: "👨‍👩‍👦",
      color: "#E8B4B8"
    },
    { 
      year: 2025, 
      title: "去年的你", 
      description: "我们在迪士尼抓到了一只在逃公主...",
      emoji: "👸",
      color: "#D4A574"
    },
    { 
      year: 2026, 
      title: "今年的你", 
      description: "今年愿望里，我希望你自己排第一,做快乐的自己",
      emoji: "✨",
      color: "#D4A574"
    },
  ];

  const handleOpenGift = () => {
    setIsOpen(true);
    setTimeout(() => {
      setShowMemories(true);
    }, 800);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-16 px-4 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F9E0D9]/30 via-[#FFF8F5] to-[#F9E0D9]/30" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-1/4 w-20 h-20 bg-[#F4AFA8]/10 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-[#E8B4B8]/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-[#F4AFA8]" />
            <span className="text-sm text-[#7A7A7A] uppercase tracking-wider">5 Years of Love</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#4A4A4A] mb-3">
            五年时光，一盒珍藏
          </h2>
          <p className="text-[#7A7A7A] text-sm sm:text-base">
            点击礼盒，打开我们的回忆
          </p>
        </div>

        {/* Gift Box */}
        {!isOpen && (
          <div className="flex justify-center mb-10">
            <button
              onClick={handleOpenGift}
              className="group relative animate-bounce-soft"
            >
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/images/gift-box.png" 
                  alt="Gift Box"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#F4AFA8]/20 rounded-full blur-3xl -z-10 animate-pulse" />
              </div>
              <p className="mt-4 text-[#F4AFA8] font-script text-lg animate-pulse">
                点击打开 ✨
              </p>
            </button>
          </div>
        )}

        {/* Opened Gift - Memories Timeline */}
        {isOpen && (
          <div className="relative">
            {/* Central Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-[#F4AFA8] via-[#E8B4B8] to-[#D4A574]" />

            {/* Memories */}
            <div className="space-y-8 py-8">
              {memories.map((memory, index) => (
                <div 
                  key={memory.year}
                  className={`relative flex items-center ${
                    showMemories ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    flexDirection: index % 2 === 0 ? 'row' : 'row-reverse'
                  }}
                  onMouseEnter={() => setActiveMemory(index)}
                  onMouseLeave={() => setActiveMemory(null)}
                >
                  {/* Content Card */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div 
                      className={`bg-white rounded-2xl p-4 sm:p-5 shadow-lg transition-all duration-300 cursor-pointer ${
                        activeMemory === index ? 'scale-105 shadow-xl' : ''
                      }`}
                      style={{ 
                        borderLeft: index % 2 !== 0 ? `4px solid ${memory.color}` : undefined,
                        borderRight: index % 2 === 0 ? `4px solid ${memory.color}` : undefined,
                      }}
                    >
                      <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-2xl">{memory.emoji}</span>
                        <span className="font-display font-bold text-lg" style={{ color: memory.color }}>
                          {memory.year}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-[#4A4A4A] mb-1">
                        {memory.title}
                      </h3>
                      <p className="text-sm text-[#7A7A7A]">{memory.description}</p>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        activeMemory === index ? 'scale-125' : ''
                      }`}
                      style={{ backgroundColor: memory.color }}
                    >
                      <Heart className="w-5 h-5 text-white" fill="white" />
                    </div>
                  </div>

                  {/* Empty Space */}
                  <div className="w-5/12" />
                </div>
              ))}
            </div>

            {/* Continue Button */}
            {showMemories && (
              <div className="text-center mt-10 animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
                <button
                  onClick={onComplete}
                  className="group bg-[#F4AFA8] hover:bg-[#E89A94] text-white px-8 py-4 rounded-full font-medium text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
                >
                  <span>看看小寿星准备了什么</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Hearts */}
      {isOpen && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-[#F4AFA8]/20 animate-float"
              style={{
                top: `${10 + i * 10}%`,
                left: `${5 + (i % 4) * 25}%`,
                animationDelay: `${i * 0.3}s`,
                width: `${12 + i * 2}px`,
                height: `${12 + i * 2}px`,
              }}
              fill="currentColor"
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MemorySection;
