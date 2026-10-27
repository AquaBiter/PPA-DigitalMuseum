import React from 'react';
import { Category } from '../types';
import { THEN_AND_NOW_DATA } from '../data/thenAndNowData';

interface ThenAndNowViewProps {
  category: Category;
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
  onBackToTopic?: () => void;
}

export const ThenAndNowView: React.FC<ThenAndNowViewProps> = ({
  category,
  categories,
  onSelectCategory,
}) => {
  // Find current data or fallback to cultural
  const currentKey = category.id.toLowerCase();
  const data = THEN_AND_NOW_DATA[currentKey] || THEN_AND_NOW_DATA['cultural'];

  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-white px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 max-w-5xl mx-auto">
      {/* Category archive quick selector tabs */}
      {categories && categories.length > 1 && onSelectCategory && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 pb-3 border-b border-zinc-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-1">
            Topic Archive:
          </span>
          {categories.map((cat) => {
            const isCurrent = cat.id === category.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Title matching reference image 2: e.g. "Cultural Archive (Then & Now)" */}
      <h1 className="font-bebas text-4xl sm:text-5xl md:text-6xl text-black font-bold tracking-tight mb-8 sm:mb-10">
        {data.title}
      </h1>

      {/* Section: Then (2000–2010) */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-[#EF4444] font-semibold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3">
          {data.thenTitle}
        </h2>
        <p className="text-zinc-900 leading-relaxed text-base sm:text-lg md:text-xl font-normal">
          {data.thenContent}
        </p>
      </div>

      {/* Section: Now (2026) */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-[#10B981] font-semibold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3">
          {data.nowTitle}
        </h2>
        <p className="text-zinc-900 leading-relaxed text-base sm:text-lg md:text-xl font-normal">
          {data.nowContent}
        </p>
      </div>
    </div>
  );
};
