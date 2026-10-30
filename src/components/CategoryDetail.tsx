import React, { useRef } from 'react';
import { Camera, ExternalLink, BookOpen } from 'lucide-react';
import { Category, Artifact, EraMode } from '../types';
import { compressImageFile } from '../utils/imageCompressor';
import { formatToYouTubeEmbed } from '../utils/youtube';

interface CategoryDetailProps {
  category: Category;
  featuredArtifact?: Artifact;
  isAdmin?: boolean;
  hasDeclinedArtifacts?: boolean;
  activeEra?: EraMode;
  onOpenArtifacts: () => void;
  onOpenQuestions: () => void;
  onOpenThenAndNow?: () => void;
  onToggleEra?: () => void;
  onOpenFuture?: () => void;
  onUpdateCategoryBanner?: (catId: string, bannerUrl: string) => void;
}

// 1. Artifacts Folder Icon
const ArtifactsFolderIcon: React.FC<{ hasDeclinedArtifacts?: boolean }> = ({ hasDeclinedArtifacts }) => (
  <div className="w-18 h-14 sm:w-20 sm:h-16 relative flex items-center justify-center filter drop-shadow-sm group-hover:drop-shadow-md">
    <svg viewBox="0 0 80 64" className="w-full h-full">
      {/* Folder Back flap */}
      <path
        d="M 6 12 C 6 8 9 5 13 5 L 32 5 C 35 5 37 8 39 12 L 43 16 L 70 16 C 74 16 77 19 77 23 L 77 54 C 77 58 74 61 70 61 L 10 61 C 6 61 3 58 3 54 L 3 16 C 3 14 4 12 6 12 Z"
        fill="#FDE047"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Folder Tab Insert */}
      <rect x="12" y="10" width="56" height="30" rx="3" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
      {/* Folder Front Leaf */}
      <path
        d="M 4 23 L 76 23 C 78 23 80 25 79 28 L 74 57 C 73 60 70 62 67 62 L 7 62 C 4 62 1 60 1 57 L 1 27 C 1 25 2 23 4 23 Z"
        fill="#FACC15"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// 2. Questions Notebook + Pencil Icon
const QuestionsNotebookIcon: React.FC = () => (
  <div className="w-18 h-14 sm:w-20 sm:h-16 relative flex items-center justify-center filter drop-shadow-sm group-hover:drop-shadow-md">
    <svg viewBox="0 0 80 64" className="w-full h-full">
      {/* Notebook Body */}
      <rect x="16" y="8" width="44" height="50" rx="4" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="2.5" />
      {/* Notebook header tab / spiral bar */}
      <rect x="16" y="8" width="44" height="10" rx="2" fill="#3B82F6" />
      {/* Ruled lines */}
      <line x1="22" y1="26" x2="54" y2="26" stroke="#93C5FD" strokeWidth="1.5" />
      <line x1="22" y1="34" x2="54" y2="34" stroke="#93C5FD" strokeWidth="1.5" />
      <line x1="22" y1="42" x2="54" y2="42" stroke="#93C5FD" strokeWidth="1.5" />
      <line x1="22" y1="50" x2="54" y2="50" stroke="#93C5FD" strokeWidth="1.5" />
      {/* Question mark "??" */}
      <text x="38" y="38" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#EF4444" textAnchor="middle">
        ??
      </text>
      {/* Pencil */}
      <g transform="translate(48, 4) rotate(42)">
        <rect x="0" y="0" width="7" height="6" fill="#F43F5E" stroke="#000000" strokeWidth="1.2" />
        <rect x="0" y="6" width="7" height="4" fill="#94A3B8" stroke="#000000" strokeWidth="1.2" />
        <rect x="0" y="10" width="7" height="24" fill="#F59E0B" stroke="#000000" strokeWidth="1.2" />
        <polygon points="0,34 7,34 3.5,42" fill="#FEF08A" stroke="#000000" strokeWidth="1.2" />
        <polygon points="2,38 5,38 3.5,42" fill="#1E293B" />
      </g>
    </svg>
  </div>
);

// 3. Then & Now Arrows Icon
const ThenAndNowArrowsIcon: React.FC = () => (
  <div className="w-18 h-14 sm:w-20 sm:h-16 relative flex items-center justify-center filter drop-shadow-sm group-hover:drop-shadow-md">
    <svg viewBox="0 0 80 64" className="w-full h-full">
      {/* Top Pink Arrow pointing Left */}
      <path
        d="M 34 11 L 12 25 L 34 39 L 34 32 L 68 32 L 68 18 L 34 18 Z"
        fill="#FF70A6"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Bottom Blue Arrow pointing Right */}
      <path
        d="M 46 53 L 68 39 L 46 25 L 46 32 L 12 32 L 12 46 L 46 46 Z"
        fill="#38BDF8"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// 4. Future Crystal Ball Icon matching user's reference image
const FutureCrystalBallIcon: React.FC<{ isActive?: boolean }> = ({ isActive }) => (
  <div className="w-18 h-14 sm:w-20 sm:h-16 relative flex items-center justify-center filter drop-shadow-sm group-hover:drop-shadow-md">
    <svg viewBox="0 0 80 64" className="w-full h-full">
      <defs>
        <radialGradient id="crystalGlowBall" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="25%" stopColor="#E0F2FE" stopOpacity="0.9" />
          <stop offset="65%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </radialGradient>
        <linearGradient id="woodPedestalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#451A03" />
          <stop offset="50%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#311302" />
        </linearGradient>
      </defs>

      {/* Ornate Wooden Base Feet */}
      <path
        d="M 20 57 C 20 53 25 52 40 52 C 55 52 60 53 60 57 C 60 61 55 62 40 62 C 25 62 20 61 20 57 Z"
        fill="#311302"
        stroke="#000000"
        strokeWidth="2.2"
      />
      {/* Central Pedestal Bracket */}
      <path
        d="M 27 52 C 29 44 32 42 32 40 L 48 40 C 48 42 51 44 53 52 Z"
        fill="url(#woodPedestalGrad)"
        stroke="#000000"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Upper Cradle Rim */}
      <ellipse
        cx="40"
        cy="40"
        rx="15"
        ry="4.5"
        fill="#78350F"
        stroke="#000000"
        strokeWidth="2.2"
      />

      {/* Translucent Crystal Glass Ball */}
      <circle
        cx="40"
        cy="23"
        r="19"
        fill="url(#crystalGlowBall)"
        stroke="#000000"
        strokeWidth="2.5"
      />

      {/* Curved Reflection Highlight */}
      <path
        d="M 26 18 C 29 11 35 7 42 7"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* 4-pointed White Sparkle Star on top-right */}
      <g transform="translate(48, 13)">
        <path
          d="M 0 -7 Q 1 -1 7 0 Q 1 1 0 7 Q -1 1 -7 0 Q -1 -1 0 -7 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
      </g>
    </svg>
    {isActive && (
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
    )}
  </div>
);

export const CategoryDetail: React.FC<CategoryDetailProps> = ({
  category,
  featuredArtifact,
  isAdmin = false,
  hasDeclinedArtifacts = false,
  activeEra = 'then',
  onOpenArtifacts,
  onOpenQuestions,
  onOpenThenAndNow,
  onToggleEra,
  onOpenFuture,
  onUpdateCategoryBanner,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateCategoryBanner) return;
    try {
      const compressed = await compressImageFile(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.78,
      });
      onUpdateCategoryBanner(category.id, compressed);
    } catch (err) {
      console.error('Failed to compress banner image:', err);
    } finally {
      e.target.value = '';
    }
  };

  // Embed URL for featured artifact in Future mode
  const featuredVideoUrl = featuredArtifact?.videoUrl || featuredArtifact?.videos?.[0]?.url || '';
  const embedUrl = featuredVideoUrl ? formatToYouTubeEmbed(featuredVideoUrl) : '';

  // -------------------------------------------------------------
  // VIEW MODE A: FUTURE 2030-2040 VIEW (Matching reference image 4f618cfb.png)
  // -------------------------------------------------------------
  if (activeEra === 'future') {
    return (
      <div className="w-full min-h-[calc(100vh-120px)] bg-white px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 max-w-7xl mx-auto animate-fadeIn">
        {/* Main Future Title matching image: Cultural Archive (Future 2030-2040) */}
        <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-black font-extrabold leading-none mb-6 sm:mb-8">
          {category.name.replace(/^(ex\.|ex)\s*/i, '')} Archive (Future 2030-2040)
        </h2>

        {/* 2-Column Split Layout matching image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Context / Explanation + Sources + Navigation Buttons */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Context / Explanation Paragraph */}
              <p className="text-base sm:text-lg lg:text-xl text-zinc-900 leading-relaxed font-normal mb-8">
                {category.fullDescription.replace(/^(ex\.|ex)\s*/i, '')}
              </p>

              {/* SOURCE / REFERENCE LINKS Section */}
              {category.referenceLinks && category.referenceLinks.filter((ref) => ref.url && ref.url.trim() !== '').length > 0 && (
                <div className="pt-4 border-t border-zinc-200/80 mb-8">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-600 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-zinc-700" />
                    <span>SOURCE / REFERENCE LINKS</span>
                  </h4>
                  <ul className="space-y-2.5 list-none p-0 m-0">
                    {category.referenceLinks
                      .filter((ref) => ref.url && ref.url.trim() !== '')
                      .map((ref, idx) => {
                        const cleanUrl = ref.url.trim();
                        const href = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')
                          ? cleanUrl
                          : `https://${cleanUrl}`;
                        const label = ref.title && ref.title.trim() !== '' ? ref.title.trim() : cleanUrl;

                        return (
                          <li key={ref.id || idx} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 mt-2 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline text-xs sm:text-sm font-semibold text-cyan-800 hover:text-black hover:underline transition-colors leading-relaxed [word-break:normal] [overflow-wrap:break-word] group"
                                title={`Open reference: ${label}`}
                              >
                                <span>{label}</span>
                                <ExternalLink className="inline-block w-3.5 h-3.5 ml-1.5 text-zinc-400 group-hover:text-black align-baseline shrink-0 transition-colors" />
                              </a>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </div>

            {/* Sub-navigation Buttons at Bottom-Left matching reference image */}
            <div className="flex items-center gap-8 sm:gap-10 pt-4">
              {/* THEN & NOW Button (Switches back to Then/Now era) */}
              {(onToggleEra || onOpenThenAndNow) && (
                <button
                  onClick={onToggleEra || onOpenThenAndNow}
                  className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 active:scale-95 text-center"
                  title="Switch to Then & Now"
                >
                  <ThenAndNowArrowsIcon />
                  <span className="font-bebas text-xl sm:text-2xl text-black tracking-wider mt-2 group-hover:text-cyan-600 transition-colors">
                    THEN & NOW
                  </span>
                </button>
              )}

              {/* QUESTIONS Button (Takes Future 2030-2040 Quiz) */}
              <button
                onClick={onOpenQuestions}
                className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 active:scale-95 text-center"
                title="Answer Future Questions"
              >
                <QuestionsNotebookIcon />
                <span className="font-bebas text-xl sm:text-2xl text-black tracking-wider mt-2 group-hover:text-blue-600 transition-colors">
                  QUESTIONS
                </span>
              </button>

              {/* FUTURE Button (Active Indicator) */}
              <button
                onClick={onOpenFuture}
                className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 active:scale-95 text-center"
                title="Future (2030–2040)"
              >
                <FutureCrystalBallIcon isActive={true} />
                <span className="font-bebas text-xl sm:text-2xl text-purple-700 font-bold tracking-wider mt-2 group-hover:text-purple-900 transition-colors">
                  FUTURE
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: ARTIFACT Title + Video Player + Explanation */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            {/* Header: ARTIFACT: [Title] */}
            <h3 className="font-bebas text-2xl sm:text-3xl lg:text-4xl text-black font-extrabold tracking-wide mb-3">
              ARTIFACT: {featuredArtifact?.title || 'Spatial Media and Interactive Holographic Streaming'}
            </h3>

            {/* Video Player */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md border border-zinc-200 bg-black relative mb-4">
              {embedUrl ? (
                <iframe
                  src={`${embedUrl}?rel=0&modestbranding=1`}
                  title={featuredArtifact?.title || 'Future Video'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                  Video preview available
                </div>
              )}
            </div>

            {/* Explanation text below video */}
            <div className="text-base sm:text-lg text-zinc-900 leading-relaxed font-normal">
              <span className="font-bold text-black">Explanation: </span>
              <span>{featuredArtifact?.description}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW MODE B: STANDARD CATEGORY VIEW (Then / Now)
  // -------------------------------------------------------------
  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-white px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-14 items-start">
        {/* Left Column: Graphic Banner + 4 Sub-category Navigation Buttons */}
        <div className="md:col-span-6 lg:col-span-6 flex flex-col items-center sm:items-start">
          {/* Graphic Banner: Stylized illustration OR custom uploaded banner image (or blank for 2026 as requested) */}
          <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-sm border border-zinc-200 bg-zinc-50 relative select-none flex items-center justify-center">
            {activeEra === 'now' ? (
              // Left blank for 2026 archive as requested
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-100/60">
                <span className="text-zinc-400 font-semibold text-xs sm:text-sm tracking-widest uppercase">
                  (Graphic Banner Left Blank for 2026 Archive)
                </span>
              </div>
            ) : category.bannerImageUrl ? (
              <img
                src={category.bannerImageUrl}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-full h-full object-cover"
                viewBox="0 0 600 360"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#BAE6FD" />
                    <stop offset="70%" stopColor="#E0F2FE" />
                    <stop offset="100%" stopColor="#F0F9FF" />
                  </linearGradient>
                  <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#A3E635" />
                    <stop offset="100%" stopColor="#65A30D" />
                  </linearGradient>
                  <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#BEF264" />
                    <stop offset="100%" stopColor="#84CC16" />
                  </linearGradient>
                  <linearGradient id="hillGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#65A30D" />
                    <stop offset="100%" stopColor="#4D7C0F" />
                  </linearGradient>
                </defs>

                {/* Sky Background */}
                <rect width="600" height="360" fill="url(#skyGrad)" />

                {/* Vector Clouds */}
                <g fill="#FFFFFF" opacity="0.95" transform="translate(40, 80)">
                  <ellipse cx="60" cy="40" rx="40" ry="22" />
                  <ellipse cx="40" cy="45" rx="25" ry="18" />
                  <ellipse cx="85" cy="45" rx="30" ry="18" />
                  <rect x="25" y="45" width="85" height="18" rx="8" />
                </g>

                <g fill="#FFFFFF" opacity="0.98" transform="translate(240, 60)">
                  <ellipse cx="90" cy="45" rx="55" ry="32" />
                  <ellipse cx="50" cy="55" rx="35" ry="22" />
                  <ellipse cx="130" cy="55" rx="40" ry="22" />
                  <rect x="30" y="55" width="130" height="22" rx="10" />
                </g>

                <path d="M 45 170 Q 48 166 52 170 Q 56 166 60 170" fill="none" stroke="#64748B" strokeWidth="1.2" />

                <path
                  d="M 0 240 Q 150 180 340 240 Q 480 280 600 220 L 600 360 L 0 360 Z"
                  fill="url(#hillGrad1)"
                />
                <path
                  d="M 0 270 Q 180 210 380 260 Q 520 290 600 240 L 600 360 L 0 360 Z"
                  fill="url(#hillGrad2)"
                  opacity="0.9"
                />
                <path
                  d="M 0 240 Q 120 310 240 270 Q 360 220 600 300 L 600 360 L 0 360 Z"
                  fill="url(#hillGrad3)"
                />
              </svg>
            )}
          </div>

          {/* Change Banner Graphic Option (Admin Only) */}
          {isAdmin && onUpdateCategoryBanner && (
            <div className="mt-2.5 flex items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-black bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-300 transition-colors cursor-pointer"
                title="Change banner graphic or illustration"
              >
                <Camera className="w-3.5 h-3.5 text-zinc-500" />
                <span>Change Banner Graphic</span>
              </button>
            </div>
          )}

          {/* 4 Sub-category Navigation Buttons Below Graphic Banner matching image a221223d.png */}
          <div className="flex flex-nowrap items-center gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 w-full overflow-x-auto no-scrollbar pb-2">
            {/* 1. Artifacts Folder Icon */}
            <button
              onClick={onOpenArtifacts}
              className="shrink-0 flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 active:scale-95 text-center"
              title="Open Artifacts"
            >
              <ArtifactsFolderIcon hasDeclinedArtifacts={hasDeclinedArtifacts} />
              <span className="font-bebas text-lg sm:text-xl md:text-2xl text-black tracking-wider mt-2 group-hover:text-amber-600 transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                {hasDeclinedArtifacts && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0 inline-block shadow-xs"
                    title="Artifacts"
                  />
                )}
                <span>ARTIFACTS</span>
              </span>
            </button>

            {/* 2. Questions Icon: Notebook with pencil graphic */}
            <button
              onClick={onOpenQuestions}
              className="shrink-0 flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 active:scale-95 text-center"
              title="Open Questions"
            >
              <QuestionsNotebookIcon />
              <span className="font-bebas text-lg sm:text-xl md:text-2xl text-black tracking-wider mt-2 group-hover:text-blue-600 transition-colors whitespace-nowrap">
                QUESTIONS
              </span>
            </button>

            {/* 3. Then & Now Button: Always stays THEN & NOW on single line */}
            {(onToggleEra || onOpenThenAndNow) && (
              <button
                onClick={onToggleEra || onOpenThenAndNow}
                className="shrink-0 flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 active:scale-95 text-center"
                title={activeEra === 'now' ? 'Switch back to Retro (2000–2010)' : 'Switch to Present Time (2026)'}
              >
                <ThenAndNowArrowsIcon />
                <span className="font-bebas text-lg sm:text-xl md:text-2xl text-black tracking-wider mt-2 group-hover:text-cyan-600 transition-colors whitespace-nowrap">
                  THEN & NOW
                </span>
              </button>
            )}

            {/* 4. Future Button matching image a221223d.png: Stays side-by-side with Then & Now */}
            {onOpenFuture && (
              <button
                onClick={onOpenFuture}
                className="shrink-0 flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 active:scale-95 text-center"
                title="Explore Future (2030–2040)"
              >
                <FutureCrystalBallIcon isActive={false} />
                <span className="font-bebas text-lg sm:text-xl md:text-2xl text-black tracking-wider mt-2 group-hover:text-purple-600 transition-colors whitespace-nowrap">
                  FUTURE
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Title + Description */}
        <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-start pt-2">
          {/* Era Indicator Badge */}
          <div className="mb-2">
            {activeEra === 'now' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold tracking-wider uppercase shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Present Time Archive (2026)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold tracking-wider uppercase shadow-2xs">
                Retro Archive (2000–2010)
              </span>
            )}
          </div>

          {/* Header Title: Category Name */}
          <h2 className="font-bebas text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-black font-extrabold leading-none mb-4 sm:mb-6">
            {category.name.replace(/^(ex\.|ex)\s*/i, '')}
          </h2>

          {/* Description Paragraph */}
          <p className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl text-zinc-900 leading-relaxed font-normal">
            {category.fullDescription.replace(/^(ex\.|ex)\s*/i, '')}
          </p>

          {/* Source / Reference Links at the bottom of the topic description */}
          {category.referenceLinks && category.referenceLinks.filter((ref) => ref.url && ref.url.trim() !== '').length > 0 && (
            <div className="mt-6 pt-5 border-t border-zinc-200/80">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-600 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-zinc-700" />
                <span>
                  Source / Reference {category.referenceLinks.filter((ref) => ref.url && ref.url.trim() !== '').length > 1 ? 'Links' : 'Link'}
                </span>
              </h4>
              <ul className="space-y-2 list-none p-0 m-0">
                {category.referenceLinks
                  .filter((ref) => ref.url && ref.url.trim() !== '')
                  .map((ref, idx) => {
                    const cleanUrl = ref.url.trim();
                    const href = cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')
                      ? cleanUrl
                      : `https://${cleanUrl}`;
                    const label = ref.title && ref.title.trim() !== '' ? ref.title.trim() : cleanUrl;

                    return (
                      <li key={ref.id || idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 mt-2 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline text-xs sm:text-sm font-semibold text-cyan-800 hover:text-black hover:underline transition-colors leading-relaxed [word-break:normal] [overflow-wrap:break-word] group"
                            title={`Open reference: ${label}`}
                          >
                            <span>{label}</span>
                            <ExternalLink className="inline-block w-3.5 h-3.5 ml-1.5 text-zinc-400 group-hover:text-black align-baseline shrink-0 transition-colors" />
                          </a>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
