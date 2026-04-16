import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Check, Gift } from 'lucide-react';

interface PrivilegeSectionProps {
  onComplete: () => void;
}

interface Privilege {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  scratched: boolean;
}

const PrivilegeSection = ({ onComplete }: PrivilegeSectionProps) => {
  const [privileges, setPrivileges] = useState<Privilege[]>([
    { id: 1, title: "睡到自然醒券", subtitle: "我承包今天所有带娃", icon: "😴", scratched: false },
    { id: 2, title: "不洗碗券", subtitle: "24小时豁免权", icon: "🍽️", scratched: false },
    { id: 3, title: "独食券", subtitle: "蛋糕不用分给宝宝，全归你", icon: "🍰", scratched: false },
    { id: 4, title: "Spa时间券", subtitle: "晚上泡脚按摩预定", icon: "💆", scratched: false },
  ]);
  
  const [allScratched, setAllScratched] = useState(false);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const isDrawingRef = useRef(false);

  const initCanvas = useCallback((index: number) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Fill with scratch coating
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#D4A574');
    gradient.addColorStop(0.5, '#C9A227');
    gradient.addColorStop(1, '#D4A574');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add pattern
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for (let i = 0; i < rect.width; i += 20) {
      ctx.fillRect(i, 0, 2, rect.height);
    }
    for (let i = 0; i < rect.height; i += 20) {
      ctx.fillRect(0, i, rect.width, 2);
    }

    // Add text
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('刮开看看 ✨', rect.width / 2, rect.height / 2);
  }, []);

  useEffect(() => {
    canvasRefs.current.forEach((_, index) => {
      initCanvas(index);
    });
  }, [initCanvas]);

  const getMousePos = (canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left),
      y: (clientY - rect.top)
    };
  };

  const scratch = (canvas: HTMLCanvasElement, x: number, y: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch percentage
    checkScratchPercentage(canvas);
  };

  const checkScratchPercentage = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    let total = 0;

    // Sample every 10th pixel for performance
    for (let i = 3; i < pixels.length; i += 40) {
      total++;
      if (pixels[i] === 0) transparent++;
    }

    const percentage = (transparent / total) * 100;
    
    if (percentage > 40) {
      // Clear all
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Find which privilege this canvas belongs to
      const index = canvasRefs.current.indexOf(canvas);
      if (index !== -1) {
        setPrivileges(prev => {
          const newPrivileges = [...prev];
          newPrivileges[index] = { ...newPrivileges[index], scratched: true };
          return newPrivileges;
        });
      }
    }
  };

  const handleMouseDown = (_index: number) => {
    isDrawingRef.current = true;
  };

  const handleMouseMove = (index: number, e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    
    const pos = getMousePos(canvas, e.nativeEvent.clientX, e.nativeEvent.clientY);
    scratch(canvas, pos.x, pos.y);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleTouchMove = (index: number, e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    
    const touch = e.touches[0];
    const pos = getMousePos(canvas, touch.clientX, touch.clientY);
    scratch(canvas, pos.x, pos.y);
  };

  // Check if all scratched
  useEffect(() => {
    if (privileges.every(p => p.scratched)) {
      setAllScratched(true);
    }
  }, [privileges]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-16 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8F5] via-white to-[#FFF8F5]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-24 h-24 bg-[#F4AFA8]/10 rounded-full blur-2xl" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-[#E8B4B8]/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Gift className="w-6 h-6 text-[#F4AFA8]" />
            <span className="text-sm text-[#7A7A7A] uppercase tracking-wider">Birthday Privileges</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#4A4A4A] mb-3">
            今日特权清单
          </h2>
          <p className="text-[#7A7A7A] text-sm sm:text-base max-w-md mx-auto">
            这不是家务外包，是<span className="text-[#F4AFA8] font-semibold">生日快乐的基本法</span>
          </p>
        </div>

        {/* Privilege Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {privileges.map((privilege, index) => (
            <div 
              key={privilege.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${
                privilege.scratched ? 'ring-2 ring-[#F4AFA8]' : ''
              }`}
            >
              {/* Card Content (revealed when scratched) */}
              <div className="p-6 flex items-center gap-4">
                <div className="text-4xl">{privilege.icon}</div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg text-[#4A4A4A]">
                    {privilege.title}
                  </h3>
                  <p className="text-sm text-[#7A7A7A]">{privilege.subtitle}</p>
                </div>
                {privilege.scratched && (
                  <div className="w-8 h-8 bg-[#F4AFA8] rounded-full flex items-center justify-center animate-bounce-soft">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Scratch Canvas Overlay */}
              {!privilege.scratched && (
                <canvas
                  ref={el => { canvasRefs.current[index] = el; }}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                  onMouseDown={() => handleMouseDown(index)}
                  onMouseMove={(e) => handleMouseMove(index, e)}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={() => handleMouseDown(index)}
                  onTouchMove={(e) => handleTouchMove(index, e)}
                  onTouchEnd={handleMouseUp}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-8 flex justify-center items-center gap-2">
          <span className="text-sm text-[#7A7A7A]">
            已解锁: {privileges.filter(p => p.scratched).length} / {privileges.length}
          </span>
        </div>

        {/* Completion Message */}
        {allScratched && (
          <div className="mt-10 text-center animate-fade-in-up">
            <div className="bg-[#F4AFA8]/10 rounded-2xl p-6 max-w-md mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-[#F4AFA8] mx-auto mb-3" />
              <p className="text-[#4A4A4A] font-script text-xl">
                所有特权已激活！今天你就是女王 👑
              </p>
            </div>
            <button
              onClick={onComplete}
              className="bg-[#F4AFA8] hover:bg-[#E89A94] text-white px-8 py-4 rounded-full font-medium text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              拆开封存的回忆 →
            </button>
          </div>
        )}

        {/* Instructions */}
        {!allScratched && (
          <p className="text-center text-xs text-[#7A7A7A]/60 mt-6">
            用手指或鼠标涂抹刮开涂层
          </p>
        )}
      </div>
    </section>
  );
};

export default PrivilegeSection;
