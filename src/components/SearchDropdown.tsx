import React from 'react';
import { Search, FolderOpen, HelpCircle, Layers } from 'lucide-react';
import { Category, Artifact, QuizQuestion, ViewMode } from '../types';

interface SearchDropdownProps {
  searchQuery: string;
  categories: Category[];
  artifacts: Artifact[];
  questions: QuizQuestion[];
  onSelectCategory: (cat: Category) => void;
  onSelectArtifact: (art: Artifact) => void;
  onSelectQuestion: (q: QuizQuestion) => void;
  onClose: () => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  searchQuery,
  categories,
  artifacts,
  questions,
  onSelectCategory,
  onSelectArtifact,
  onSelectQuestion,
  onClose,
}) => {
  if (!searchQuery.trim()) return null;

  const query = searchQuery.toLowerCase().trim();

  const matchedCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.summary.toLowerCase().includes(query) ||
      c.fullDescription.toLowerCase().includes(query)
  );

  const matchedArtifacts = artifacts.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query) ||
      a.notes.toLowerCase().includes(query)
  );

  const matchedQuestions = questions.filter(
    (q) =>
      q.questionText.toLowerCase().includes(query) ||
      q.explanation.toLowerCase().includes(query) ||
      q.choices.some((c) => c.text.toLowerCase().includes(query))
  );

  const totalMatches =
    matchedCategories.length + matchedArtifacts.length + matchedQuestions.length;

  return (
    <div className="fixed top-14 left-4 sm:left-6 z-50 w-80 sm:w-96 max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-zinc-200 select-none">
      <div className="p-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50 rounded-t-xl">
        <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-zinc-500" /> Search Results ({totalMatches})
        </span>
        <button
          onClick={onClose}
          className="text-xs text-zinc-500 hover:text-black font-semibold cursor-pointer"
        >
          Close
        </button>
      </div>

      {totalMatches === 0 ? (
        <div className="p-6 text-center text-zinc-500 text-xs">
          No items found matching "{searchQuery}". Try "Nokia", "Social", "Text", or "OPM".
        </div>
      ) : (
        <div className="p-2 divide-y divide-zinc-100">
          {/* Categories */}
          {matchedCategories.length > 0 && (
            <div className="py-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 block mb-1">
                Topics & Categories
              </span>
              {matchedCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat);
                    onClose();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <Layers className="w-4 h-4 text-cyan-600 shrink-0" />
                  <div>
                    <div className="font-bebas text-lg text-black leading-none">
                      {cat.name}
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate max-w-[280px]">
                      {cat.summary}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Artifacts */}
          {matchedArtifacts.length > 0 && (
            <div className="py-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 block mb-1">
                Artifacts
              </span>
              {matchedArtifacts.map((art) => (
                <button
                  key={art.id}
                  onClick={() => {
                    onSelectArtifact(art);
                    onClose();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <div className="font-bebas text-lg text-black leading-none">
                      {art.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate max-w-[280px]">
                      {art.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Questions */}
          {matchedQuestions.length > 0 && (
            <div className="py-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-2 block mb-1">
                Questions
              </span>
              {matchedQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    onSelectQuestion(q);
                    onClose();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-black line-clamp-1">
                      {q.questionText}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Interactive Quiz
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
