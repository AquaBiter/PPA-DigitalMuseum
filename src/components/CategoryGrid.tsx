import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Category } from '../types';
import { playInteractionSound } from '../utils/audioManager';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onSelectCategory,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tutorialCategory, setTutorialCategory] = useState<Category | null>(null);
  const [holdingCardId, setHoldingCardId] = useState<string | null>(null);

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef<boolean>(false);

  // Press & Hold handling: Holding the topic pops the glass background tutorial message
  const handlePressStart = (cat: Category) => {
    isLongPressTriggered.current = false;
    setHoldingCardId(cat.id);
    playInteractionSound('hold');

    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      setTutorialCategory(cat);
      setHoldingCardId(null);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }, 450);
  };

  const handlePressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setHoldingCardId(null);
  };

  const handleCardClick = (cat: Category) => {
    if (isLongPressTriggered.current) {
      isLongPressTriggered.current = false;
      return;
    }
    playInteractionSound('click');
    onSelectCategory(cat);
  };

  return (
    <section className="w-full bg-white pt-4 sm:pt-6 pb-5 sm:pb-6 relative">
      <div className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle Tutorial Hint Pill without shiny icon */}
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] sm:text-xs font-medium shadow-xs">
            <span>
              Tip: <strong className="text-zinc-900 font-bold">Hold any topic card</strong> to reveal the Virtual Museum guide & tutorial
            </span>
          </div>
        </div>

        {/* Topic Cards Grid: Spaced out on desktop mode with clean bottom clearance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 xl:gap-7 items-stretch relative">
          {categories.map((cat) => {
            const isHovered = hoveredId === cat.id;
            const isHolding = holdingCardId === cat.id;
            const isActive = isHovered || isHolding;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => {
                  setHoveredId(null);
                  handlePressEnd();
                }}
                onMouseDown={() => handlePressStart(cat)}
                onMouseUp={handlePressEnd}
                onTouchStart={() => handlePressStart(cat)}
                onTouchEnd={handlePressEnd}
                onTouchMove={handlePressEnd}
                onClick={() => handleCardClick(cat)}
                className={`relative bg-[#1E1E1E] text-white rounded-2xl overflow-hidden px-4 py-5 sm:px-5 sm:py-6 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between min-h-[300px] sm:min-h-[330px] md:min-h-[350px] lg:min-h-[390px] xl:min-h-[420px] border-2 select-none ${
                  isActive
                    ? 'lg:-translate-y-2.5 shadow-2xl border-zinc-400 bg-[#151515]'
                    : 'translate-y-0 shadow-md border-transparent hover:border-zinc-700'
                } ${isHolding ? 'scale-[0.98] ring-2 ring-amber-400/70' : ''}`}
                style={{
                  boxShadow: isActive
                    ? '0 20px 30px -10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 255, 255, 0.08)'
                    : undefined,
                }}
              >
                {/* Accent Top Glowing Stripe:
                    ONLY rendered when user hovers or holds the card (isActive).
                    Zero color rendered when cursor is not yet on the card! */}
                {isActive && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 pointer-events-none animate-fadeIn"
                    style={{
                      backgroundColor: cat.accentColor || '#06B6D4',
                    }}
                  />
                )}

                {/* Card Header & Content */}
                <div>
                  {/* Title & Guide Button: Optimized font size so ENVIRONMENTAL fits cleanly on tablet landscape and desktop */}
                  <div className="flex items-center justify-between gap-1.5 border-b border-zinc-800 pb-3 mb-3.5 min-w-0">
                    <h3
                      className="font-bebas text-2xl sm:text-2xl md:text-2xl lg:text-[1.4rem] xl:text-[1.85rem] tracking-tight text-white font-bold leading-none"
                      title={cat.name}
                    >
                      {cat.name}
                    </h3>

                    {/* Tutorial Guide Text Button (No Icon) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTutorialCategory(cat);
                      }}
                      className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white text-[11px] font-sans font-medium shrink-0 transition-colors cursor-pointer"
                      title={`Open ${cat.name} guide & tutorial`}
                      aria-label={`Open ${cat.name} guide & tutorial`}
                    >
                      Guide
                    </button>
                  </div>

                  {/* Summary Text: Tuned for readability across phone, tablet landscape, and desktop */}
                  <p className="text-xs sm:text-xs md:text-xs lg:text-xs xl:text-sm text-zinc-300 leading-relaxed font-normal line-clamp-5 xl:line-clamp-6">
                    {cat.summary}
                  </p>
                </div>

                {/* Bottom Footer Section */}
                <div className="pt-3.5 border-t border-zinc-800/80 min-h-[40px] flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-1.5 text-xs lg:text-xs xl:text-sm font-semibold tracking-wider text-zinc-300 group-hover:text-white">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>

                  <span className="text-[10px] text-zinc-400 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800 font-mono uppercase tracking-wider">
                    Hold for info
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FROSTED GLASS BACKGROUND TUTORIAL TEXTBOX MODAL (NO ICONS) */}
      {tutorialCategory && (
        <div
          onClick={() => setTutorialCategory(null)}
          className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-zinc-950/85 backdrop-blur-2xl border border-white/20 text-white rounded-3xl p-6 sm:p-8 shadow-2xl animate-scaleUp overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Top Accent Ambient Glow */}
            <div
              className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: tutorialCategory.accentColor || '#06B6D4' }}
            />


            {/* Header Badge (No icon) */}
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-zinc-200 mb-4">
              <span>Virtual Museum Topic Tutorial</span>
            </div>

            {/* Topic Title */}
            <h3 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide mb-2">
              {tutorialCategory.name} Archive
            </h3>

            {/* Summary */}
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal mb-5">
              {tutorialCategory.summary}
            </p>

            {/* Tutorial Walkthrough Cards (No icons) */}
            <div className="space-y-3 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                <strong className="text-white block font-semibold text-xs sm:text-sm mb-1">
                  1. Historical Artifacts:
                </strong>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  Browse genuine preserved gadgets, photos, and direct video broadcast archives.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                <strong className="text-white block font-semibold text-xs sm:text-sm mb-1">
                  2. Progressive Quiz:
                </strong>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  Answer topic questions in sequence. You must pass each question to unlock the next!
                </p>
              </div>
            </div>

            {/* Action Buttons (No icon) */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setTutorialCategory(null)}
                className="px-4 py-2.5 rounded-xl border border-white/20 text-xs sm:text-sm font-semibold text-zinc-300 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Close Guide
              </button>
              <button
                type="button"
                onClick={() => {
                  const cat = tutorialCategory;
                  setTutorialCategory(null);
                  onSelectCategory(cat);
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-black text-xs sm:text-sm font-bold hover:bg-zinc-200 shadow-md transition-colors cursor-pointer"
              >
                Enter Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
