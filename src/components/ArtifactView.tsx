import React from 'react';
import { ArrowRight, ArrowLeft, Layers } from 'lucide-react';
import { Artifact } from '../types';

interface ArtifactViewProps {
  artifact: Artifact;
  availableArtifacts: Artifact[];
  onSelectArtifact: (art: Artifact) => void;
  onBackToTopic?: () => void;
}

// Convert various YouTube URL formats (watch?v=, youtu.be/, etc.) into direct embed URL
function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}

export const ArtifactView: React.FC<ArtifactViewProps> = ({
  artifact,
  availableArtifacts,
  onSelectArtifact,
  onBackToTopic,
}) => {
  const embedUrl = getYouTubeEmbedUrl(artifact.videoUrl);
  const cleanTitle = artifact.title.replace(/^(ex\.|ex)\s*/i, '');
  const cleanDescription = artifact.description.replace(/^(ex\.|ex)\s*/i, '');
  const cleanNotes = artifact.notes ? artifact.notes.replace(/^(ex\.|ex)\s*/i, '') : '';

  // Determine indices for multiple artifacts in the current topic
  const currentIndex = availableArtifacts.findIndex((a) => a.id === artifact.id);
  const safeCurrentIndex = currentIndex !== -1 ? currentIndex : 0;
  const hasMultipleArtifacts = availableArtifacts.length > 1;
  const nextIndex = (safeCurrentIndex + 1) % (availableArtifacts.length || 1);
  const nextArtifact = availableArtifacts[nextIndex];
  const prevIndex = (safeCurrentIndex - 1 + availableArtifacts.length) % (availableArtifacts.length || 1);
  const prevArtifact = availableArtifacts[prevIndex];

  const handleNextArtifact = () => {
    if (nextArtifact) {
      onSelectArtifact(nextArtifact);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevArtifact = () => {
    if (prevArtifact) {
      onSelectArtifact(prevArtifact);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-white px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 max-w-7xl mx-auto flex flex-col justify-between">
      <div>
        {/* Top Artifact Switcher & Category Indicator if multiple artifacts exist */}
        {hasMultipleArtifacts && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                Artifacts in this topic ({safeCurrentIndex + 1}/{availableArtifacts.length}):
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {availableArtifacts.map((art, idx) => (
                <button
                  key={art.id}
                  onClick={() => {
                    onSelectArtifact(art);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                    art.id === artifact.id
                      ? 'bg-black text-white shadow-sm ring-1 ring-black'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
                  }`}
                >
                  <span className="opacity-60 mr-1.5">{idx + 1}.</span>
                  {art.title.replace(/^(ex\.|ex)\s*/i, '')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Title + Body Text + Notes */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            {/* Header Title */}
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-black font-extrabold leading-none mb-6">
              {cleanTitle}
            </h2>

            {/* Body Text & Historical Context */}
            <p className="text-base sm:text-lg md:text-xl text-zinc-900 leading-relaxed font-normal mb-8">
              {cleanDescription}
            </p>

            {/* Notes Section */}
            {cleanNotes && (
              <div className="pt-2 border-t border-zinc-100">
                <h4 className="text-lg sm:text-xl font-bold text-zinc-900 mb-1">
                  Notes:
                </h4>
                <p className="text-base sm:text-lg md:text-xl text-zinc-800 leading-relaxed font-normal">
                  {cleanNotes}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Media Showcase (Image Container + Direct YouTube Video) */}
          <div className="lg:col-span-6 flex flex-col space-y-6 sm:space-y-8">
            {/* Image Showcase: Flexible wrapping container preventing any cropping */}
            <div className="w-full rounded-xl overflow-hidden border border-zinc-200 shadow-sm bg-zinc-950/5 p-3 flex items-center justify-center min-h-[260px] max-h-[500px]">
              <img
                src={artifact.imageUrl}
                alt={cleanTitle}
                className="max-w-full max-h-[460px] w-auto h-auto object-contain rounded-lg shadow-inner"
              />
            </div>

            {/* Video Section: Direct YouTube embed, no thumbnail overlay */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-3">
                video links:
              </h3>

              {/* Direct Embedded Video Player Frame */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-300 shadow-md bg-black">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={artifact.videoTitle || cleanTitle}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                    No video link provided
                  </div>
                )}
              </div>
              {artifact.videoTitle && (
                <p className="text-xs sm:text-sm text-zinc-500 mt-2 font-medium">
                  {artifact.videoTitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR: If more than 1 artifact in topic, show NEXT ARTIFACT at bottom right */}
      {hasMultipleArtifacts && (
        <div className="mt-12 pt-6 pb-2 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left info pill: Progress within category */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium order-2 sm:order-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Topic Archive:</span>
            <span className="font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
              Artifact {safeCurrentIndex + 1} of {availableArtifacts.length}
            </span>
            <span className="hidden md:inline text-zinc-400">&bull; {cleanTitle}</span>
          </div>

          {/* Right action group: Previous & NEXT ARTIFACT laid out at bottom right */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end order-1 sm:order-2 ml-auto">
            {/* Previous Artifact Button */}
            {safeCurrentIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevArtifact}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                title={`Previous: ${prevArtifact.title.replace(/^(ex\.|ex)\s*/i, '')}`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
            )}

            {/* NEXT ARTIFACT BUTTON: Positioned at Bottom Right */}
            <button
              type="button"
              onClick={handleNextArtifact}
              className="group flex items-center gap-3 px-5 sm:px-6 py-3 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-black"
              title={`Next: ${nextArtifact.title.replace(/^(ex\.|ex)\s*/i, '')}`}
            >
              <div className="text-right">
                <span className="block text-[10px] uppercase tracking-wider text-zinc-400 font-semibold leading-tight">
                  {safeCurrentIndex + 1 === availableArtifacts.length ? 'Loop to Start' : 'Next in Topic'}
                </span>
                <span className="block text-xs sm:text-sm font-bold text-white max-w-[180px] sm:max-w-[240px] truncate leading-tight">
                  Next Artifact: {nextArtifact.title.replace(/^(ex\.|ex)\s*/i, '')}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
