import React from 'react';
import { AboutContent } from '../types';

interface AboutViewProps {
  content: AboutContent;
}

export const AboutView: React.FC<AboutViewProps> = ({ content }) => {
  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-white px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-12 max-w-5xl mx-auto">
      {/* Large PPA PopPinoyArchives colored logo matching reference image 16.png */}
      <div className="mb-10 sm:mb-12">
        <div className="flex items-baseline font-black font-bebas text-7xl sm:text-8xl md:text-9xl tracking-tight leading-none">
          <span className="text-[#EF4444]">P</span>
          <span className="text-[#06B6D4]">P</span>
          <span className="text-[#F59E0B]">A</span>
        </div>
        <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none mt-1">
          <span className="text-[#EF4444]">P</span>
          <span className="text-black">op </span>
          <span className="text-[#06B6D4]">P</span>
          <span className="text-black">inoy </span>
          <span className="text-[#F59E0B]">A</span>
          <span className="text-black">rchives</span>
        </div>
      </div>

      {/* Paragraph 1 */}
      <p className="text-lg sm:text-xl md:text-2xl text-zinc-900 leading-relaxed font-normal mb-8">
        {content.paragraph1}
      </p>

      {/* Paragraph 2 */}
      <p className="text-lg sm:text-xl md:text-2xl text-zinc-900 leading-relaxed font-normal mb-14">
        {content.paragraph2}
      </p>

      {/* Curatorial Decade Timeline */}
      <div className="pt-8 border-t border-zinc-200">
        <h3 className="font-bebas text-3xl sm:text-4xl text-black font-bold tracking-wide mb-6">
          {content.timelineTitle || 'The 2000–2010 Cultural Timeline'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.milestones.map((m) => {
            const isSpecialEra = m.year.includes('Present') || m.year.includes('Future');
            return (
              <div
                key={m.id || m.year}
                className={`p-5 rounded-2xl border transition-colors ${
                  m.year.includes('Future')
                    ? 'bg-purple-50/40 border-purple-200 hover:border-purple-400 sm:col-span-2 lg:col-span-1'
                    : m.year.includes('Present')
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                    : 'bg-zinc-50 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <div
                  className={`font-bebas text-2xl sm:text-3xl font-extrabold tracking-wider ${
                    m.year.includes('Future')
                      ? 'text-purple-800'
                      : m.year.includes('Present')
                      ? 'text-emerald-800'
                      : 'text-black'
                  }`}
                >
                  {m.year}
                </div>
                <h4 className="font-bold text-base text-zinc-900 mt-1 mb-2">
                  {m.title}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                  {m.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
