import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface WebsiteIntroProps {
  onFinish: () => void;
}

export const WebsiteIntro: React.FC<WebsiteIntroProps> = ({ onFinish }) => {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight > window.innerWidth;
    }
    return false;
  });

  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Update orientation if resized before playback starts
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Candidate video paths
  // 1. Separate mp4 for landscape and portrait as requested
  const portraitCandidates = [
    '/video/intro/intro-portrait.mp4',
    '/video/intro/portrait.mp4',
    '/intro/intro-portrait.mp4',
    '/intro/portrait.mp4',
    '/video/intro/intro.mp4',
    '/intro/intro.mp4',
  ];

  const landscapeCandidates = [
    '/video/intro/intro-landscape.mp4',
    '/video/intro/landscape.mp4',
    '/intro/intro-landscape.mp4',
    '/intro/landscape.mp4',
    '/video/intro/intro.mp4',
    '/intro/intro.mp4',
  ];

  const [candidateIndex, setCandidateIndex] = useState(0);
  const currentList = isPortrait ? portraitCandidates : landscapeCandidates;
  const currentVideoSrc = currentList[candidateIndex] || currentList[0];

  // Play video with sound immediately once "ENTER NOW!" has been pressed
  useEffect(() => {
    if (!hasEntered) return;
    const video = videoRef.current;
    if (!video || hasVideoError) return;

    video.currentTime = 0;
    video.muted = false;
    video.volume = 1.0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Initial unmuted play rejected, retrying:', err);
        video.muted = true;
        video.play().then(() => {
          // Immediately unmute once rolling
          video.muted = false;
          video.volume = 1.0;
        }).catch(() => {});
      });
    }
  }, [hasEntered, currentVideoSrc, hasVideoError]);

  const handleVideoError = () => {
    // If current file candidate failed, try next candidate
    if (candidateIndex + 1 < currentList.length) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      // No custom mp4 video file exists yet in /public/video/intro/
      setHasVideoError(true);
    }
  };

  const handleEnterNow = () => {
    setHasEntered(true);
  };

  // 1. Landing Screen BEFORE Opening Video: "ENTER NOW!"
  if (!hasEntered) {
    return (
      <div className="fixed inset-0 z-[10000] w-screen h-screen bg-black overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
        {/* Subtle ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.12),transparent_65%)] pointer-events-none" />

        {/* "ENTER NOW!" Text Box Button */}
        <div className="relative z-10 flex flex-col items-center">
          <button
            type="button"
            onClick={handleEnterNow}
            className="group relative px-10 sm:px-14 py-4 sm:py-5 rounded-2xl bg-white text-black font-bebas text-3xl sm:text-4xl tracking-wider hover:bg-zinc-100 transition-all cursor-pointer shadow-[0_0_35px_rgba(255,255,255,0.35)] hover:shadow-[0_0_55px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-white"
          >
            <span>ENTER NOW!</span>
            <ArrowRight className="w-7 h-7 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Opening Video Playback Screen
  return (
    <div className="fixed inset-0 z-[10000] w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none animate-fadeIn">
      {/* If custom video is present, stretch to screen as requested */}
      {!hasVideoError ? (
        <>
          <video
            ref={videoRef}
            src={currentVideoSrc}
            autoPlay
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
            onEnded={onFinish}
            onError={handleVideoError}
            // CSS object-fill stretches the video to the screen if not the same size
            // pointer-events-none completely prevents Edge/Chrome from showing their native PiP & Video Enhance hover widget
            className="w-full h-full object-fill absolute inset-0 block pointer-events-none"
          />

          {/* Full-screen transparent overlay to block Edge/Chrome hover video tools */}
          <div
            className="absolute inset-0 z-20 w-full h-full bg-transparent cursor-pointer"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = false;
                videoRef.current.volume = 1.0;
                if (videoRef.current.paused) {
                  videoRef.current.play().catch(() => {});
                }
              }
            }}
          />
        </>
      ) : (
        /* Fallback 2000s Museum Splash if user hasn't added custom MP4 to /public/video/intro/ yet */
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white">
          {/* Subtle 2000s scanline overlay effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none" />

          {/* PPA Brand Header */}
          <div className="relative z-10 flex items-center gap-1 font-bebas text-4xl sm:text-6xl md:text-7xl mb-3 tracking-wide">
            <span className="text-[#EF4444]">P</span>
            <span className="text-[#06B6D4]">P</span>
            <span className="text-[#F59E0B]">A</span>
            <span className="text-white ml-2 font-sans font-bold text-2xl sm:text-4xl md:text-5xl tracking-normal">
              PopPinoyArchives
            </span>
          </div>

          <h1 className="relative z-10 font-bebas text-2xl sm:text-3xl md:text-4xl text-zinc-300 tracking-wider mb-2">
            Virtual Museum of 2000–2010 Philippine Popular Culture
          </h1>

          <p className="relative z-10 text-xs sm:text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
            Welcome to the archival collection. Preserve memories, discover genuine artifacts, and test your pop-culture knowledge.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onFinish}
              className="px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm sm:text-base hover:bg-zinc-200 transition-all cursor-pointer shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>Enter Virtual Museum</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Info pill about custom intro mp4 folder */}
          <div className="absolute bottom-6 text-[11px] text-zinc-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            Place <code className="text-amber-400 font-bold">intro-landscape.mp4</code> &amp;{' '}
            <code className="text-cyan-400 font-bold">intro-portrait.mp4</code> in{' '}
            <code className="text-white font-bold">/public/video/intro/</code>
          </div>
        </div>
      )}
    </div>
  );
};
