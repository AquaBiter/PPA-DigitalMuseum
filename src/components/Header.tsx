import React from 'react';
import { Search, X, Home, Info, Settings } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onBack: () => void;
  canGoBack: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onBack,
  canGoBack,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full select-none">
      {/* Top Header Bar: Fixed black background */}
      <div className="bg-black text-white h-12 md:h-14 px-3 sm:px-6 flex items-center justify-between border-b border-zinc-900 shadow-md">
        {/* Left Section: Search Input + PPA Logo */}
        <div className="flex items-center gap-3 sm:gap-6 flex-1 max-w-xl">
          {/* Search Input Box with Magnifying Glass and X Clear Button */}
          <div className="relative w-44 sm:w-60 md:w-72">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-900">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search archive..."
              className="w-full bg-white text-zinc-950 text-xs sm:text-sm pl-8 pr-7 py-1 sm:py-1.5 rounded-sm border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium placeholder-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-zinc-700 hover:text-black cursor-pointer"
                title="Clear search"
                type="button"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* PPA PopPinoyArchives Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left cursor-pointer transition-transform active:scale-95"
            title="PopPinoyArchives Home"
          >
            <div className="flex items-baseline font-black font-bebas text-2xl sm:text-3xl tracking-tight leading-none">
              <span className="text-[#EF4444]">P</span>
              <span className="text-[#06B6D4]">P</span>
              <span className="text-[#F59E0B]">A</span>
            </div>
            <div className="hidden xs:flex flex-col text-[10px] sm:text-xs font-bold leading-tight tracking-wider">
              <div className="flex items-center">
                <span>
                  <strong className="text-[#EF4444]">P</strong>
                  <span className="text-white">op </span>
                  <strong className="text-[#06B6D4]">P</strong>
                  <span className="text-white">inoy </span>
                  <strong className="text-[#F59E0B]">A</strong>
                  <span className="text-white">rchives</span>
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Right Section: Home, Info, Settings Buttons */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Home Icon */}
          <button
            onClick={() => onNavigate('home')}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${
              currentView === 'home' ? 'ring-2 ring-cyan-400' : ''
            }`}
            title="Home"
            aria-label="Home"
          >
            <Home className="w-4 h-4 fill-black stroke-black" />
          </button>

          {/* Info / About Icon */}
          <button
            onClick={() => onNavigate('about')}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${
              currentView === 'about' ? 'ring-2 ring-cyan-400' : ''
            }`}
            title="About PopPinoyArchives"
            aria-label="About"
          >
            <Info className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Settings / Admin Icon */}
          <button
            onClick={() => onNavigate('admin')}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${
              currentView === 'admin' ? 'ring-2 ring-amber-400' : ''
            }`}
            title="Admin Settings & Management"
            aria-label="Admin Settings"
          >
            <Settings className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Sub-Header Back Arrow: curved back arrow visible on all sub-pages */}
      {canGoBack && (
        <div className="bg-transparent px-4 sm:px-8 pt-3 pb-1">
          <button
            onClick={onBack}
            className="group flex items-center gap-1.5 text-black hover:text-zinc-600 transition-colors cursor-pointer"
            title="Return to previous screen"
            aria-label="Go back"
          >
            {/* Exact curved back arrow matching reference */}
            <svg
              className="w-7 h-7 sm:w-9 sm:h-9 fill-current transform group-hover:-translate-x-1 transition-transform"
              viewBox="0 0 24 24"
            >
              <path d="M9 11l-4 4l4 4v-3h7c2.21 0 4-1.79 4-4s-1.79-4-4-4H9V5l-4 4l4 4V11z" fill="none" />
              {/* Thick curved return arrow */}
              <path
                d="M10 8V4L2 11l8 7v-4c4.42 0 8 1.79 8 7c0-6.63-4.37-12-10-12z"
                fill="currentColor"
              />
            </svg>
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-500 group-hover:text-black">
              Back
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
