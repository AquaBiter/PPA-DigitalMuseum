import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Camera, Lock, Check, Volume2, VolumeX } from 'lucide-react';
import { QuizQuestion, Artifact, Category } from '../types';
import { playInteractionSound, toggleQuizMusicMute, getIsQuizMuted } from '../utils/audioManager';

interface QuestionViewProps {
  question?: QuizQuestion;
  category: Category;
  artifact?: Artifact;
  availableQuestions: QuizQuestion[];
  isAdmin?: boolean;
  onSelectQuestion: (q: QuizQuestion) => void;
  onUpdateQuestion?: (updated: QuizQuestion) => void;
  onNavigateToAdmin?: () => void;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  category,
  artifact,
  availableQuestions,
  isAdmin = false,
  onSelectQuestion,
  onUpdateQuestion,
  onNavigateToAdmin,
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistent record of passed questions for this topic
  const [passedQuestionIds, setPassedQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`ppa_passed_q_${category.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep passed questions in sync if category changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`ppa_passed_q_${category.id}`);
      setPassedQuestionIds(saved ? JSON.parse(saved) : []);
    } catch {
      setPassedQuestionIds([]);
    }
    setSelectedChoiceId(null);
    setLockedNotice(null);
  }, [category.id]);

  const [isMuted, setIsMuted] = useState<boolean>(() => getIsQuizMuted());

  const handleToggleMute = () => {
    const newState = toggleQuizMusicMute();
    setIsMuted(newState);
    playInteractionSound('click');
  };

  const handleSelectChoice = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
    setLockedNotice(null);

    // If answer is correct, immediately mark this question as passed!
    if (question && choiceId === question.correctChoiceId) {
      playInteractionSound('correct');
      if (!passedQuestionIds.includes(question.id)) {
        const updated = [...passedQuestionIds, question.id];
        setPassedQuestionIds(updated);
        try {
          localStorage.setItem(`ppa_passed_q_${category.id}`, JSON.stringify(updated));
        } catch {}
      }
    } else {
      playInteractionSound('wrong');
    }
  };

  const resetQuestion = () => {
    playInteractionSound('click');
    setSelectedChoiceId(null);
    setLockedNotice(null);
  };

  // Restart Topic Quiz: Reset all passed questions so Question 1 is selected and all subsequent questions are locked out!
  const handleRestartTopicQuiz = () => {
    playInteractionSound('restart');
    setPassedQuestionIds([]);
    try {
      localStorage.removeItem(`ppa_passed_q_${category.id}`);
    } catch {}
    if (availableQuestions.length > 0) {
      onSelectQuestion(availableQuestions[0]);
    }
    setSelectedChoiceId(null);
    setLockedNotice(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !question || !onUpdateQuestion) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onUpdateQuestion({
        ...question,
        imageUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // If this category has no questions yet, show clean topic-specific empty state
  if (!question || availableQuestions.length === 0) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-white px-4 sm:px-8 py-16 max-w-3xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4 shadow-sm border border-zinc-200">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="font-bebas text-4xl sm:text-5xl text-black font-bold tracking-wide">
          {category.name} Quiz Archive
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 max-w-md mt-2 mb-6">
          No questions have been created for the <strong className="text-black">{category.name}</strong> topic yet. Questions are strictly partitioned per topic.
        </p>
        {onNavigateToAdmin && (
          <button
            onClick={onNavigateToAdmin}
            className="bg-black text-white px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold hover:bg-zinc-800 transition-colors cursor-pointer shadow-md"
          >
            Create Question in Admin Console
          </button>
        )}
      </div>
    );
  }

  const isAnswered = selectedChoiceId !== null;
  const isCorrect = selectedChoiceId === question.correctChoiceId;
  const cleanQuestionText = question.questionText.replace(/^(ex\.|ex)\s*/i, '');
  const currentIndex = availableQuestions.findIndex((q) => q.id === question.id);
  const displayImageUrl = question.imageUrl || artifact?.imageUrl;

  // Question progression check: A question is unlocked ONLY IF all previous questions are passed
  const isQuestionUnlocked = (idx: number) => {
    if (idx === 0) return true; // Question 1 is always unlocked
    // Must have passed question idx - 1
    const prevQ = availableQuestions[idx - 1];
    return prevQ && passedQuestionIds.includes(prevQ.id);
  };

  const handleQuestionTabClick = (q: QuizQuestion, idx: number) => {
    if (isQuestionUnlocked(idx)) {
      playInteractionSound('click');
      onSelectQuestion(q);
      setSelectedChoiceId(null);
      setLockedNotice(null);
    } else {
      playInteractionSound('wrong');
      setLockedNotice(
        `Question ${idx + 1} is locked! You must answer and pass Question ${idx} correctly before proceeding.`
      );
      setTimeout(() => setLockedNotice(null), 4000);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-white px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* Category context & switcher if multiple questions exist in this topic */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-200">
            {category.name} Quiz
          </span>
          {availableQuestions.length > 1 && (
            <span className="text-xs text-zinc-400 font-semibold">
              ({availableQuestions.length} questions in this topic)
            </span>
          )}
        </div>

        {/* Right Header Section: Scrollable Question Tabs + Quiz Music Button */}
        <div className="flex items-center gap-2 max-w-full">
          {/* Question Selector Tabs: Horizontally scrollable when more than 2 questions exist */}
          {availableQuestions.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] xs:max-w-[260px] sm:max-w-md md:max-w-lg lg:max-w-xl py-1 px-0.5">
              {availableQuestions.map((q, idx) => {
                const unlocked = isQuestionUnlocked(idx);
                const isPassed = passedQuestionIds.includes(q.id);
                const isCurrent = q.id === question.id;

                return (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionTabClick(q, idx)}
                    disabled={!unlocked}
                    className={`shrink-0 px-3 py-1 text-xs font-medium rounded transition-all flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-black text-white font-bold shadow-sm'
                        : unlocked
                        ? isPassed
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 cursor-pointer'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 cursor-pointer'
                        : 'bg-zinc-100 text-zinc-400 cursor-not-allowed opacity-60'
                    }`}
                    title={
                      unlocked
                        ? isPassed
                          ? `Question ${idx + 1} (Passed)`
                          : `Question ${idx + 1}`
                        : `Question ${idx + 1} is locked until Question ${idx} is passed`
                    }
                  >
                    {!unlocked && <Lock className="w-3 h-3 text-zinc-400" />}
                    {isPassed && !isCurrent && <Check className="w-3 h-3 text-emerald-600" />}
                    <span>Q{idx + 1}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quiz Mode Background Music Toggle: ALWAYS visible even when there's only 1 question */}
          <button
            type="button"
            onClick={handleToggleMute}
            className="shrink-0 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-black bg-zinc-100 hover:bg-zinc-200 rounded border border-zinc-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title={isMuted ? 'Unmute Quiz Mode Music' : 'Mute Quiz Mode Music'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Music Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-600" />
                <span className="hidden sm:inline">Quiz Music</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Locked Notice Notification */}
      {lockedNotice && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs animate-fadeIn">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{lockedNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Artifact / Reference Image with non-cropped wrapping */}
        <div className="lg:col-span-5">
          <div className="w-full rounded-xl overflow-hidden border border-zinc-200 shadow-sm bg-zinc-950/5 p-3 flex items-center justify-center min-h-[260px] max-h-[460px] relative group">
            {displayImageUrl ? (
              <img
                src={displayImageUrl}
                alt={artifact?.title ? artifact.title.replace(/^(ex\.|ex)\s*/i, '') : 'Archive Item'}
                className="max-w-full max-h-[440px] w-auto h-auto object-contain rounded-lg shadow-inner"
              />
            ) : (
              <div className="text-zinc-400 text-sm italic">No reference image assigned</div>
            )}
          </div>

          {artifact && (
            <p className="text-center font-bebas text-lg text-zinc-600 tracking-wider mt-2">
              {artifact.title.replace(/^(ex\.|ex)\s*/i, '')}
            </p>
          )}

          {/* Change Reference Image Option - STRICTLY ADMIN ONLY */}
          {isAdmin && onUpdateQuestion && (
            <div className="mt-2.5 flex items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-black bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-300 transition-colors cursor-pointer"
                title="Change or upload reference image"
              >
                <Camera className="w-3.5 h-3.5 text-zinc-500" />
                <span>Change Reference Image</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Question Box */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          {/* Question Counter Pill */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Question {currentIndex + 1} of {availableQuestions.length}
            </span>
            {passedQuestionIds.includes(question.id) && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Passed
              </span>
            )}
          </div>

          {/* Question Text in bold black typography */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black leading-tight mb-6">
            {cleanQuestionText}
          </h2>

          {/* Choices Header */}
          <h4 className="text-xl sm:text-2xl font-normal text-zinc-900 mb-4">
            Choices:
          </h4>

          {/* Interactive Choices List */}
          <div className="space-y-3 mb-6">
            {question.choices.map((choice) => {
              const isThisCorrect = choice.id === question.correctChoiceId;
              const isThisSelected = selectedChoiceId === choice.id;

              // When answered, correct choice turns GREEN (#2ECC71), wrong choice turns RED (#E74C3C)
              let textStyle = 'text-zinc-900 hover:text-black';
              if (isAnswered) {
                if (isThisCorrect) {
                  textStyle = 'text-[#2ECC71] font-bold text-2xl sm:text-3xl';
                } else if (isThisSelected) {
                  textStyle = 'text-[#E74C3C] font-bold text-2xl sm:text-3xl';
                }
              }

              return (
                <div key={choice.id} className="cursor-pointer">
                  <button
                    type="button"
                    onClick={() => handleSelectChoice(choice.id)}
                    className={`w-full text-left font-medium text-lg sm:text-xl md:text-2xl transition-all duration-200 py-1.5 focus:outline-none cursor-pointer flex items-center justify-between ${textStyle}`}
                  >
                    <span>
                      {choice.letter}. {choice.text}
                    </span>

                    {/* Indicator badge if answered */}
                    {isAnswered && (
                      <span className="text-xs uppercase tracking-wider ml-3 px-2 py-0.5 rounded">
                        {isThisCorrect ? (
                          <span className="text-[#2ECC71] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-5 h-5" /> Correct
                          </span>
                        ) : isThisSelected ? (
                          <span className="text-[#E74C3C] font-bold flex items-center gap-1">
                            <AlertCircle className="w-5 h-5" /> Incorrect
                          </span>
                        ) : null}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Feedback & explanation container when answered */}
          {isAnswered && (
            <div className="mt-6 p-4 sm:p-5 rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm transition-all animate-fadeIn">
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-[#2ECC71] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-[#E74C3C] shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h5 className="font-bold text-zinc-900 text-base sm:text-lg">
                    {isCorrect ? 'Correct Answer!' : 'Not quite right!'}
                  </h5>
                  <p className="text-sm sm:text-base text-zinc-700 mt-1 leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>

              {/* Action Button: Strictly require passing the current question before moving to the next! */}
              <div className="mt-4 pt-3 border-t border-zinc-200 flex justify-end">
                {isCorrect ? (
                  availableQuestions.length > 1 && currentIndex < availableQuestions.length - 1 ? (
                    <button
                      onClick={() => {
                        playInteractionSound('click');
                        const nextIdx = currentIndex + 1;
                        onSelectQuestion(availableQuestions[nextIdx]);
                        setSelectedChoiceId(null);
                        setLockedNotice(null);
                      }}
                      className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-black hover:bg-zinc-800 px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      <span>
                        Next Question (Q{currentIndex + 2}/{availableQuestions.length})
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-700">Topic Quiz Completed! 🏆</span>
                      <button
                        onClick={handleRestartTopicQuiz}
                        className="flex items-center gap-1.5 text-xs font-bold text-white bg-black hover:bg-zinc-800 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restart Topic Quiz
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    onClick={resetQuestion}
                    className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-700 hover:text-black bg-white px-3.5 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
