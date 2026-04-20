import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Send, Heart, Share2, Check } from 'lucide-react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  particles: Particle[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const WishSection = () => {
  const [wish, setWish] = useState('');
  const [stars, setStars] = useState<Star[]>([]);
  const [, setFireworks] = useState<Firework[]>([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isWishing, setIsWishing] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [shareCopied, setShareCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Generate stars - reduced count for mobile performance
  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 30; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      });
    }
    setStars(newStars);
  }, []);

  // Animate stars
  useEffect(() => {
    const interval = setInterval(() => {
      setStars(prev => prev.map(star => ({
        ...star,
        opacity: star.opacity + star.twinkleSpeed > 1 
          ? 0.3 
          : star.opacity + star.twinkleSpeed < 0.3 
            ? 1 
            : star.opacity + star.twinkleSpeed
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Fireworks animation
  const createFirework = useCallback((x: number, y: number) => {
    const colors = ['#F4AFA8', '#E8B4B8', '#D4A574', '#FFD700', '#FF6B9D', '#C9A227'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const particles: Particle[] = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = Math.random() * 3 + 2;
      particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        alpha: 1,
        size: Math.random() * 3 + 1,
      });
    }
    
    return {
      id: Date.now(),
      x,
      y,
      color,
      particles,
    };
  }, []);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw fireworks
      setFireworks(prev => {
        const updated = prev.map(fw => ({
          ...fw,
          particles: fw.particles.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.05, // gravity
            alpha: p.alpha - 0.015,
          })).filter(p => p.alpha > 0),
        })).filter(fw => fw.particles.length > 0);
        
        // Draw each firework
        updated.forEach(fw => {
          fw.particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(fw.x + p.x, fw.y + p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = fw.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
          });
        });
        ctx.globalAlpha = 1;
        
        return updated;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: '🎂 紧急通知：今日公主生日',
      text: '来看看这份专属的生日惊喜！',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // 用户取消分享，不做处理
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch {
        // 复制失败
      }
    }
  };

  const handleWish = async () => {
    if (!wish.trim()) return;
    
    setIsWishing(true);
    
    // Submit to Formspree in background
    if (FORMSPREE_ENDPOINT && !FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
      try {
        await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: wish.trim() }),
        });
        setSubmitStatus('success');
      } catch {
        setSubmitStatus('error');
      }
    }
    
    // Launch fireworks
    const launchFireworks = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
          const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
          setFireworks(prev => [...prev, createFirework(x, y)]);
        }, i * 300);
      }
    };
    
    launchFireworks();
    
    // Show final message after fireworks
    setTimeout(() => {
      setShowFinalMessage(true);
    }, 2500);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/starlight-bg.jpg)' }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 text-center">
        {!showFinalMessage ? (
          <>
            {/* Title */}
            <div className="mb-8">
              <Sparkles className="w-8 h-8 text-[#F4AFA8] mx-auto mb-4 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
                许个愿吧
              </h2>
              <p className="text-white/70 text-sm sm:text-base">
                流星会带着你的愿望飞向星空
              </p>
            </div>

            {/* Wish Input */}
            <div className="bg-black/40 rounded-3xl p-6 sm:p-8">
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="写下你的愿望..."
                className="w-full bg-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-[#F4AFA8] mb-4"
                rows={3}
                disabled={isWishing}
              />
              <button
                onClick={handleWish}
                disabled={!wish.trim() || isWishing}
                className="w-full bg-[#F4AFA8] hover:bg-[#E89A94] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span>{isWishing ? '愿望发送中...' : '许愿'}</span>
              </button>
            </div>

            {/* Shooting Star */}
            <div className="absolute top-20 left-0 w-full h-1 overflow-hidden pointer-events-none">
              <div 
                className="w-20 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-[shooting-star_3s_linear_infinite]"
                style={{ animationDelay: '1s' }}
              />
            </div>
          </>
        ) : (
          /* Final Message */
          <div className="animate-fade-in-up">
            <div className="mb-8">
              <Heart className="w-16 h-16 text-[#F4AFA8] mx-auto mb-6 animate-pulse" fill="#F4AFA8" />
              <h1 className="text-4xl sm:text-6xl font-display font-bold text-white mb-4">
                0422
              </h1>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#F4AFA8] mb-4">
                生日快乐
              </h2>
              <p className="font-script text-xl sm:text-2xl text-white/90">
                我的女孩永远18
              </p>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 max-w-sm mx-auto">
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                所有愿望都会实现<br />
                因为我会陪你一起
              </p>
              {submitStatus === 'success' && (
                <p className="text-[#F4AFA8] text-xs mt-3">✨ 愿望已悄悄记下</p>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="mt-6 bg-white/20 hover:bg-white/40 text-white px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              {shareCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>链接已复制</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>分享这份祝福</span>
                </>
              )}
            </button>

            {/* Replay Button */}
            <button
              onClick={() => {
                setShowFinalMessage(false);
                setWish('');
                setIsWishing(false);
              }}
              className="mt-4 text-white/60 hover:text-white text-sm transition-colors"
            >
              再许一个愿望
            </button>
          </div>
        )}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
    </section>
  );
};

export default WishSection;
