import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { Category } from '../types';

interface CategoryDetailProps {
  category: Category;
  isAdmin?: boolean;
  hasDeclinedArtifacts?: boolean;
  onOpenArtifacts: () => void;
  onOpenQuestions: () => void;
  onUpdateCategoryBanner?: (catId: string, bannerUrl: string) => void;
}

export const CategoryDetail: React.FC<CategoryDetailProps> = ({
  category,
  isAdmin = false,
  hasDeclinedArtifacts = false,
  onOpenArtifacts,
  onOpenQuestions,
  onUpdateCategoryBanner,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateCategoryBanner) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdateCategoryBanner(category.id, reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-white px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-14 items-start">
        {/* Left Column: Graphic Banner + 2 Sub-category Navigation Buttons */}
        <div className="md:col-span-6 lg:col-span-6 flex flex-col items-center sm:items-start">
          {/* Graphic Banner: Stylized illustration OR custom uploaded banner image */}
          <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-sm border border-sky-100 bg-sky-200 relative select-none flex items-center justify-center">
            {category.bannerImageUrl ? (
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
                {/* Cloud 1 (Left) */}
                <g fill="#FFFFFF" opacity="0.95" transform="translate(40, 80)">
                  <ellipse cx="60" cy="40" rx="40" ry="22" />
                  <ellipse cx="40" cy="45" rx="25" ry="18" />
                  <ellipse cx="85" cy="45" rx="30" ry="18" />
                  <rect x="25" y="45" width="85" height="18" rx="8" />
                </g>

                {/* Cloud 2 (Right/Center) */}
                <g fill="#FFFFFF" opacity="0.98" transform="translate(240, 60)">
                  <ellipse cx="90" cy="45" rx="55" ry="32" />
                  <ellipse cx="50" cy="55" rx="35" ry="22" />
                  <ellipse cx="130" cy="55" rx="40" ry="22" />
                  <rect x="30" y="55" width="130" height="22" rx="10" />
                </g>

                {/* Tiny distant detail (bird / kite) */}
                <path d="M 45 170 Q 48 166 52 170 Q 56 166 60 170" fill="none" stroke="#64748B" strokeWidth="1.2" />

                {/* Green Rolling Hills Layers */}
                {/* Hill 1: Background Soft Hill */}
                <path
                  d="M 0 240 Q 150 180 340 240 Q 480 280 600 220 L 600 360 L 0 360 Z"
                  fill="url(#hillGrad1)"
                />

                {/* Hill 2: Middle Hill */}
                <path
                  d="M 0 270 Q 180 210 380 260 Q 520 290 600 240 L 600 360 L 0 360 Z"
                  fill="url(#hillGrad2)"
                  opacity="0.9"
                />

                {/* Hill 3: Foreground Vibrant Hill */}
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

          {/* Sub-category Navigation Buttons Below Graphic Banner */}
          <div className="flex items-center gap-10 sm:gap-14 mt-6 sm:mt-8">
            {/* 1. Artifacts Folder Icon */}
            <button
              onClick={onOpenArtifacts}
              className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 active:scale-95 text-center"
              title="Open Artifacts"
            >
              {/* Stylized Yellow Folder Graphic */}
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
              <span className="font-bebas text-xl sm:text-2xl text-black tracking-wider mt-2 group-hover:text-amber-600 transition-colors inline-flex items-center justify-center gap-1.5">
                {hasDeclinedArtifacts && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0 inline-block shadow-xs"
                    title="Artifacts"
                  />
                )}
                <span>Artifacts</span>
              </span>
            </button>

            {/* 2. Questions Icon: Notebook with pencil graphic */}
            <button
              onClick={onOpenQuestions}
              className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105 active:scale-95 text-center"
              title="Open Questions"
            >
              {/* Stylized Notebook + Pencil Graphic */}
              <div className="w-18 h-14 sm:w-20 sm:h-16 relative flex items-center justify-center filter drop-shadow-sm group-hover:drop-shadow-md">
                <svg viewBox="0 0 80 64" className="w-full h-full">
                  {/* Notebook Body */}
                  <rect
                    x="16"
                    y="8"
                    width="44"
                    height="50"
                    rx="4"
                    fill="#FFFFFF"
                    stroke="#1D4ED8"
                    strokeWidth="2.5"
                  />
                  {/* Notebook header tab / spiral bar */}
                  <rect x="16" y="8" width="44" height="10" rx="2" fill="#3B82F6" />
                  {/* Notebook ruled lines */}
                  <line x1="22" y1="26" x2="54" y2="26" stroke="#93C5FD" strokeWidth="1.5" />
                  <line x1="22" y1="34" x2="54" y2="34" stroke="#93C5FD" strokeWidth="1.5" />
                  <line x1="22" y1="42" x2="54" y2="42" stroke="#93C5FD" strokeWidth="1.5" />
                  <line x1="22" y1="50" x2="54" y2="50" stroke="#93C5FD" strokeWidth="1.5" />

                  {/* Red Question Mark Icon "??" on notebook cover */}
                  <text
                    x="38"
                    y="38"
                    fontFamily="Arial, sans-serif"
                    fontSize="18"
                    fontWeight="bold"
                    fill="#EF4444"
                    textAnchor="middle"
                  >
                    ??
                  </text>

                  {/* Yellow Pencil tilted on top right */}
                  <g transform="translate(48, 4) rotate(42)">
                    {/* Pencil Eraser */}
                    <rect x="0" y="0" width="7" height="6" fill="#F43F5E" stroke="#000000" strokeWidth="1.2" />
                    {/* Metal Ferrule */}
                    <rect x="0" y="6" width="7" height="4" fill="#94A3B8" stroke="#000000" strokeWidth="1.2" />
                    {/* Wooden Pencil Shaft */}
                    <rect x="0" y="10" width="7" height="24" fill="#F59E0B" stroke="#000000" strokeWidth="1.2" />
                    {/* Pencil Tip */}
                    <polygon points="0,34 7,34 3.5,42" fill="#FEF08A" stroke="#000000" strokeWidth="1.2" />
                    {/* Graphite point */}
                    <polygon points="2,38 5,38 3.5,42" fill="#1E293B" />
                  </g>
                </svg>
              </div>
              <span className="font-bebas text-xl sm:text-2xl text-black tracking-wider mt-2 group-hover:text-blue-600 transition-colors">
                Questions
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Title + Description */}
        <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-start pt-2">
          {/* Header Title: Category Name */}
          <h2 className="font-bebas text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-black font-extrabold leading-none mb-4 sm:mb-6">
            {category.name.replace(/^(ex\.|ex)\s*/i, '')}
          </h2>

          {/* Description Paragraph */}
          <p className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl text-zinc-900 leading-relaxed font-normal">
            {category.fullDescription.replace(/^(ex\.|ex)\s*/i, '')}
          </p>
        </div>
      </div>
    </div>
  );
};
