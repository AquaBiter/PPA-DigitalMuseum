import React, { useState, useEffect } from 'react';
import { Smartphone, Tablet, RotateCw } from 'lucide-react';

export const DeviceOrientationGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restriction, setRestriction] = useState<'phone-landscape' | 'tablet-landscape' | null>(null);

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window === 'undefined') return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const minDimension = Math.min(width, height);
      const maxDimension = Math.max(width, height);
      const isLandscape = width > height;

      // Touch capability & user agent detection
      const ua = navigator.userAgent.toLowerCase();
      const hasTouch =
        (typeof navigator !== 'undefined' &&
          (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)) ||
        Boolean(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

      const isIPad =
        /ipad/i.test(ua) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      const isTabletUA =
        isIPad ||
        /tablet|playbook|silk/i.test(ua) ||
        (/android/i.test(ua) && !/mobile/i.test(ua));

      // Tablet Detection heuristics:
      // Matches iPad/Tablet UA, OR touch device with typical tablet viewport (minDimension between 600px and 1100px and maxDimension <= 1400px)
      const isTablet =
        isTabletUA ||
        (hasTouch &&
          minDimension >= 600 &&
          minDimension <= 1100 &&
          maxDimension <= 1400 &&
          !/windows nt/i.test(ua));

      // Mobile Phone Detection:
      const isMobilePhone =
        !isTablet &&
        ((!isTabletUA && minDimension < 600) ||
          (/mobile|iphone|ipod|android.*mobile/i.test(ua) && minDimension < 650));

      // Restrictions as requested:
      // 1. Mobile Phones: ONLY allowed in Portrait mode (restricted in Landscape)
      if (isMobilePhone && isLandscape) {
        setRestriction('phone-landscape');
        return;
      }

      // 2. Tablets: ONLY allowed in Portrait mode (restricted in Landscape, exactly like Mobile Mode)
      if (isTablet && isLandscape) {
        setRestriction('tablet-landscape');
        return;
      }

      // 3. Desktop / Portrait orientation: Unrestricted
      setRestriction(null);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    const mql = window.matchMedia('(orientation: portrait)');
    mql.addEventListener?.('change', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      mql.removeEventListener?.('change', checkOrientation);
    };
  }, []);

  if (restriction) {
    const isTabletMode = restriction === 'tablet-landscape';
    const deviceName = isTabletMode ? 'tablet' : 'phone';
    const deviceTypeTitle = isTabletMode ? 'TABLET' : 'MOBILE';
    const devicePlural = isTabletMode ? 'Tablets' : 'Mobile phones';

    return (
      <div className="fixed inset-0 z-[9999] bg-[#0c0c0e] text-white flex items-center justify-center p-3 sm:p-6 text-center select-none overflow-hidden">
        {/* Landscape-optimized container: Horizontal flow fits short viewport heights perfectly */}
        <div className="max-w-xl w-full flex flex-row items-center justify-center gap-5 sm:gap-8 px-4 py-3 sm:px-6 sm:py-5 bg-zinc-950/80 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl">
          {/* Animated Rotating Device Graphic */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shadow-xl relative">
              {isTabletMode ? (
                <Tablet className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 transform rotate-90 animate-pulse" />
              ) : (
                <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 transform rotate-90 animate-pulse" />
              )}
              <div className="absolute -top-1.5 -right-1.5 bg-white text-black p-1 sm:p-1.5 rounded-full shadow-md">
                <RotateCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
              </div>
            </div>
          </div>

          {/* Text & Guidance (Left-aligned in landscape side-by-side mode) */}
          <div className="flex flex-col items-start text-left max-w-sm min-w-0">
            {/* Museum Brand Mark */}
            <div className="flex items-center gap-1 font-bebas text-lg sm:text-xl mb-1">
              <span className="text-[#EF4444]">P</span>
              <span className="text-[#06B6D4]">P</span>
              <span className="text-[#F59E0B]">A</span>
              <span className="text-zinc-400 text-xs sm:text-sm font-sans font-semibold tracking-wider ml-1">
                PopPinoyArchives
              </span>
            </div>

            {/* Clear Restriction Heading */}
            <h2 className="font-bebas text-xl sm:text-2xl md:text-3xl tracking-wide text-white leading-tight mb-1">
              PORTRAIT MODE REQUIRED FOR {deviceTypeTitle}
            </h2>

            {/* Explanatory Message */}
            <p className="text-zinc-300 text-[11px] sm:text-xs leading-relaxed mb-2.5">
              {devicePlural} only support PopPinoyArchives in{' '}
              <strong className="text-white font-bold">Portrait mode</strong>. Please rotate your{' '}
              {deviceName} vertically to continue exploring.
            </p>

            {/* Instruction Badge */}
            <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-700/80 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-zinc-300 shadow-xs">
              <RotateCw className="w-3 h-3 text-amber-400 animate-spin shrink-0" />
              <span>Rotate device 90° vertically</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
