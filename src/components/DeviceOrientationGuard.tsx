import React, { useState, useEffect } from 'react';
import { Smartphone, Tablet, RotateCw } from 'lucide-react';

/**
 * Determines whether the current device is a mobile phone or tablet in landscape mode.
 * When in landscape, tablets and mobile phones are locked and the website is made unviewable.
 */
const computeRestriction = (): 'phone-landscape' | 'tablet-landscape' | null => {
  if (typeof window === 'undefined') return null;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isLandscape = width > height;

  // Portrait orientation is always allowed
  if (!isLandscape) {
    return null;
  }

  const minDimension = Math.min(width, height);
  const maxDimension = Math.max(width, height);
  const aspectRatio = width / Math.max(height, 1);

  const ua = navigator.userAgent.toLowerCase();
  const platform = (navigator.platform || '').toLowerCase();

  // 1. Touch detection
  const hasTouch =
    Boolean(
      (typeof navigator !== 'undefined' &&
        (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)) ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
      (window.matchMedia && window.matchMedia('(any-pointer: coarse)').matches)
    );

  // 2. iPad Detection (Safari, Chrome on iPadOS, WebViews, and touchscreen Macs)
  const isIPad =
    /ipad/i.test(ua) ||
    (platform === 'macintel' && hasTouch) ||
    (/(macintosh|mac os x)/i.test(ua) && hasTouch && !/iphone|ipod/i.test(ua));

  // 3. Android Tablet Detection (Android devices with large viewports or without "mobile" token)
  const isAndroidTablet =
    /android/i.test(ua) &&
    (!/mobile/i.test(ua) || minDimension >= 550 || maxDimension >= 960);

  // 4. Windows Tablet / Surface / 2-in-1 Tablet Detection
  const isWindowsTablet =
    /windows nt/i.test(ua) &&
    hasTouch &&
    minDimension <= 1200 &&
    maxDimension <= 1650;

  // 5. Explicit Tablet / E-Reader identifiers
  const isExplicitTabletUA =
    isIPad ||
    isAndroidTablet ||
    isWindowsTablet ||
    /tablet|playbook|silk|kindle|kfrwi|sm-t|gt-p|lenovo.*tab|pixel.*tablet/i.test(ua);

  // 6. Viewport Heuristics for Tablets:
  // Typical tablet viewport in landscape: minDimension (height) 480px-1150px,
  // maxDimension (width) 768px-1450px, and boxy aspect ratio (<= 1.72: 4:3 is 1.33, 3:2 is 1.5, 16:10 is 1.6).
  const isTabletDimensions =
    minDimension >= 480 &&
    minDimension <= 1150 &&
    maxDimension >= 768 &&
    maxDimension <= 1450 &&
    aspectRatio <= 1.72;

  // A device is classified as a Tablet if:
  // - It has an explicit tablet UA, OR
  // - It is a touch device with tablet dimensions (all physical iPads, Galaxy Tabs, Surface), OR
  // - It matches standard tablet dimensions & aspect ratio (DevTools iPad/tablet emulators and preview modes)
  const isTablet =
    isExplicitTabletUA ||
    (hasTouch && minDimension >= 500 && minDimension <= 1200 && maxDimension <= 1650) ||
    isTabletDimensions;

  // 7. Mobile Phone Detection:
  const isMobilePhone =
    !isTablet &&
    (minDimension < 520 ||
      /mobile|iphone|ipod|android.*mobile/i.test(ua) ||
      (hasTouch && minDimension < 600));

  // In Landscape mode:
  if (isMobilePhone) {
    return 'phone-landscape';
  }

  if (isTablet) {
    return 'tablet-landscape';
  }

  return null;
};

export const DeviceOrientationGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous initialization prevents flash of unrestricted content on mount
  const [restriction, setRestriction] = useState<'phone-landscape' | 'tablet-landscape' | null>(
    computeRestriction
  );

  useEffect(() => {
    const checkOrientation = () => {
      setRestriction(computeRestriction());
    };

    checkOrientation();

    // Prevent body scrolling when locked
    if (restriction) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Screen orientation API support
    const screenOrientation = window.screen?.orientation;
    if (screenOrientation && screenOrientation.addEventListener) {
      screenOrientation.addEventListener('change', checkOrientation);
    }

    const mqlPortrait = window.matchMedia('(orientation: portrait)');
    mqlPortrait.addEventListener?.('change', checkOrientation);

    const mqlLandscape = window.matchMedia('(orientation: landscape)');
    mqlLandscape.addEventListener?.('change', checkOrientation);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      if (screenOrientation && screenOrientation.removeEventListener) {
        screenOrientation.removeEventListener('change', checkOrientation);
      }
      mqlPortrait.removeEventListener?.('change', checkOrientation);
      mqlLandscape.removeEventListener?.('change', checkOrientation);
    };
  }, [restriction]);

  if (restriction) {
    const isTabletMode = restriction === 'tablet-landscape';
    const deviceName = isTabletMode ? 'tablet' : 'phone';
    const deviceTypeTitle = isTabletMode ? 'TABLET' : 'MOBILE';
    const devicePlural = isTabletMode ? 'Tablets' : 'Mobile phones';

    return (
      <div className="fixed inset-0 z-[9999] bg-[#0c0c0e] text-white flex items-center justify-center p-3 sm:p-6 text-center select-none overflow-hidden">
        {/* Landscape-optimized container: Horizontal flow fits short viewport heights perfectly */}
        <div className="max-w-xl w-full flex flex-row items-center justify-center gap-5 sm:gap-8 px-4 py-3 sm:px-6 sm:py-5 bg-zinc-950/80 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl animate-fadeIn">
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
