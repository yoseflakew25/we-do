import Paragraph from './components/ui/Paragraph';
import Title from './components/ui/Title';
import { useTranslations } from 'next-intl';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const ForThrive = () => {
  const t = useTranslations('LandingPage.ForThrive');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Intersection Observer to trigger animations when component comes into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentElement = videoRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative py-12 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white to-transparent z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className={`transition-all duration-700 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-16 flex flex-col gap-2 items-center justify-center">
   
            <Title 
              text1={t('title.text1')} 
              text2={t('title.text2')} 
            />
            <Paragraph 
              text1={t('description')} 
            />
          </div>

          <div className="relative group">
            {/* Video Container with Modern Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:shadow-3xl">
              <video
                ref={videoRef}
                className="w-full h-auto max-h-[500px] object-cover"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                poster="https://storage.googleapis.com/akil-bucket/poster-image.jpg" // Add a poster image for better UX
                src="https://storage.googleapis.com/akil-bucket/Akil%20orignal-Horizontal%20v2.mp4"
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Video Controls */}
              <div className="absolute bottom-6 right-6 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={toggleMute}
                  className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-6 -left-6 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -z-10 bottom-6 -right-6 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
          </div>


        </div>
      </div>
    </section>
  );
};

export default ForThrive;