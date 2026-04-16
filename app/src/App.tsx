import { useState, useEffect, useRef } from 'react';
import './App.css';
import CountdownSection from './sections/CountdownSection';
import CakeSection from './sections/CakeSection';
import PrivilegeSection from './sections/PrivilegeSection';
import MemorySection from './sections/MemorySection';
import BabySection from './sections/BabySection';
import PromiseSection from './sections/PromiseSection';
import WishSection from './sections/WishSection';
import { Music, Volume2, VolumeX } from 'lucide-react';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sections = [
    { id: 'countdown', component: CountdownSection },
    { id: 'cake', component: CakeSection },
    { id: 'privilege', component: PrivilegeSection },
    { id: 'memory', component: MemorySection },
    { id: 'baby', component: BabySection },
    { id: 'promise', component: PromiseSection },
    { id: 'wish', component: WishSection },
  ];

  // Update page title
  useEffect(() => {
    document.title = '🎂 紧急通知：今日公主生日';
  }, []);

  // Handle audio
  const enableAudio = () => {
    setAudioEnabled(true);
    setShowAudioPrompt(false);
    // Play background music
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // Set volume to 40%
      audioRef.current.play().catch(err => {
        console.log('Audio play failed:', err);
      });
    }
  };

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    if (audioRef.current) {
      if (newState) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const CurrentComponent = sections[currentSection].component;

  return (
    <div className="relative min-h-screen bg-[#FFF8F5]">
      {/* Audio Prompt */}
      {showAudioPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-fade-in-up">
            <div className="w-16 h-16 bg-[#F4AFA8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-[#F4AFA8]" />
            </div>
            <h3 className="text-xl font-display font-bold text-[#4A4A4A] mb-2">
              开启音乐体验
            </h3>
            <p className="text-[#7A7A7A] text-sm mb-6">
              建议开启背景音乐，获得更沉浸的生日体验
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAudioPrompt(false)}
                className="flex-1 px-4 py-3 rounded-full border-2 border-[#F4AFA8] text-[#F4AFA8] font-medium hover:bg-[#F4AFA8]/10 transition-colors"
              >
                暂不开启
              </button>
              <button
                onClick={enableAudio}
                className="flex-1 px-4 py-3 rounded-full bg-[#F4AFA8] text-white font-medium hover:bg-[#E89A94] transition-colors"
              >
                开启音乐
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Control */}
      {!showAudioPrompt && (
        <button
          onClick={toggleAudio}
          className="fixed top-4 right-4 z-40 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
        >
          {audioEnabled ? (
            <Volume2 className="w-5 h-5 text-[#F4AFA8]" />
          ) : (
            <VolumeX className="w-5 h-5 text-[#7A7A7A]" />
          )}
        </button>
      )}

      {/* Progress Indicator */}
      {!showAudioPrompt && (
        <div className="fixed top-4 left-4 z-40 flex items-center gap-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
            <span className="text-xs text-[#7A7A7A]">
              {currentSection + 1} / {sections.length}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative">
        <CurrentComponent onComplete={nextSection} />
      </main>

      {/* Navigation Dots */}
      {!showAudioPrompt && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden sm:flex flex-col gap-2">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSection 
                  ? 'bg-[#F4AFA8] h-6' 
                  : index < currentSection 
                    ? 'bg-[#F4AFA8]/50' 
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Hidden Audio Element - 献给爱丽丝 */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        crossOrigin="anonymous"
      >
        <source 
          src="https://www.kumeiwp.com/wj/31397/2022/04/03/362f22407c154ca3e7ddf51007053c76.mp3" 
          type="audio/mpeg" 
        />
        {/* Fallback: 使用另一个音频源 */}
        <source 
          src="https://www.gequbao.com/api/play/url?hash=54886" 
          type="audio/mpeg" 
        />
      </audio>
    </div>
  );
}

export default App;
