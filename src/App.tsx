/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_SLIDES,
  INITIAL_CATEGORIES,
  INITIAL_ARTIFACTS,
  INITIAL_QUESTIONS,
  INITIAL_ABOUT_CONTENT,
} from './data/initialData';
import { Slide, Category, Artifact, QuizQuestion, ViewMode, AboutContent } from './types';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategoryGrid } from './components/CategoryGrid';
import { CategoryDetail } from './components/CategoryDetail';
import { ArtifactView } from './components/ArtifactView';
import { QuestionView } from './components/QuestionView';
import { AboutView } from './components/AboutView';
import { AdminModal } from './components/AdminModal';
import { SearchDropdown } from './components/SearchDropdown';
import { DeviceOrientationGuard } from './components/DeviceOrientationGuard';
import { WebsiteIntro } from './components/WebsiteIntro';
import { HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { playInteractionSound, startQuizMusic, stopQuizMusic } from './utils/audioManager';
import { testConnection, fetchArchiveFromFirestore } from './firebase';

// Helper to sanitize any legacy "ex." prefix from persisted localStorage data
const sanitizeCategories = (cats: Category[]): Category[] =>
  cats.map((c) => ({
    ...c,
    name: c.name.replace(/^(ex\.|ex)\s*/i, ''),
    fullDescription: c.fullDescription.replace(/^(ex\.|ex)\s*/i, ''),
  }));

const sanitizeArtifacts = (arts: Artifact[]): Artifact[] =>
  arts.map((a) => ({
    ...a,
    title: a.title.replace(/^(ex\.|ex)\s*/i, ''),
    description: a.description.replace(/^(ex\.|ex)\s*/i, ''),
    notes: a.notes.replace(/^(ex\.|ex)\s*/i, ''),
  }));

const sanitizeQuestions = (qs: QuizQuestion[]): QuizQuestion[] =>
  qs.map((q) => ({
    ...q,
    questionText: q.questionText.replace(/^(ex\.|ex)\s*/i, ''),
  }));

export default function App() {
  // Persistent state in localStorage
  const [slides, setSlides] = useState<Slide[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_slides');
      return saved ? JSON.parse(saved) : INITIAL_SLIDES;
    } catch {
      return INITIAL_SLIDES;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_categories');
      return saved ? sanitizeCategories(JSON.parse(saved)) : sanitizeCategories(INITIAL_CATEGORIES);
    } catch {
      return sanitizeCategories(INITIAL_CATEGORIES);
    }
  });

  const [artifacts, setArtifacts] = useState<Artifact[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_artifacts');
      if (saved) {
        const parsed: Artifact[] = sanitizeArtifacts(JSON.parse(saved));
        INITIAL_ARTIFACTS.forEach((initArt) => {
          if (!parsed.some((a) => a.id === initArt.id)) {
            parsed.push(initArt);
          }
        });
        return parsed;
      }
      return sanitizeArtifacts(INITIAL_ARTIFACTS);
    } catch {
      return sanitizeArtifacts(INITIAL_ARTIFACTS);
    }
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_questions');
      if (saved) {
        const parsed: QuizQuestion[] = sanitizeQuestions(JSON.parse(saved));
        // Ensure any newly added initial questions are merged if a category has none
        INITIAL_QUESTIONS.forEach((initQ) => {
          if (!parsed.some((q) => q.categoryId === initQ.categoryId)) {
            parsed.push(initQ);
          }
        });
        return parsed;
      }
      return sanitizeQuestions(INITIAL_QUESTIONS);
    } catch {
      return sanitizeQuestions(INITIAL_QUESTIONS);
    }
  });

  const [aboutContent, setAboutContent] = useState<AboutContent>(() => {
    try {
      const saved = localStorage.getItem('ppa_about_content');
      return saved ? JSON.parse(saved) : INITIAL_ABOUT_CONTENT;
    } catch {
      return INITIAL_ABOUT_CONTENT;
    }
  });

  // Persistent Admin Login State: Prevents auto-logout when clicking back
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ppa_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    try {
      localStorage.setItem('ppa_admin_logged_in', 'true');
    } catch {}
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('ppa_admin_logged_in');
    } catch {}
  };

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ppa_slides', JSON.stringify(slides));
  }, [slides]);

  useEffect(() => {
    localStorage.setItem('ppa_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('ppa_artifacts', JSON.stringify(artifacts));
  }, [artifacts]);

  useEffect(() => {
    localStorage.setItem('ppa_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('ppa_about_content', JSON.stringify(aboutContent));
  }, [aboutContent]);

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [history, setHistory] = useState<ViewMode[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories.find((c) => c.id === 'social') || categories[0]
  );
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact>(
    artifacts.find((a) => a.id === 'nokia-phones') || artifacts[0]
  );
  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion>(
    questions.find((q) => q.categoryId === 'social') || questions[0]
  );

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Website Opening Intro MP4 state: Plays before actual site is opened
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Track if user opened Artifacts so returning to Topic prompts Quiz question
  const [hasOpenedArtifacts, setHasOpenedArtifacts] = useState<boolean>(false);
  const [showQuizPrompt, setShowQuizPrompt] = useState<boolean>(false);
  const [showArtifactsPrompt, setShowArtifactsPrompt] = useState<boolean>(false);

  // Track categories where user answered "No" to the Artifacts prompt so it never repeats and adds a red dot
  const [declinedArtifactsCategories, setDeclinedArtifactsCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_declined_artifacts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // After 8 seconds inside a "Topic" (category view), pop a message asking to go to Artifacts
  // IF they answer No, do NOT repeat it again!
  useEffect(() => {
    if (currentView !== 'category') {
      setShowArtifactsPrompt(false);
      return;
    }

    // If already declined for this topic, do not trigger the timer or repeat
    if (declinedArtifactsCategories.includes(selectedCategory.id)) {
      setShowArtifactsPrompt(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowArtifactsPrompt(true);
    }, 8000); // 8 seconds as requested

    return () => clearTimeout(timer);
  }, [currentView, selectedCategory.id, declinedArtifactsCategories]);

  // Quiz Background Music: Plays ONLY when in Quiz / Question Mode
  useEffect(() => {
    if (currentView === 'questions') {
      startQuizMusic();
    } else {
      stopQuizMusic();
    }
    return () => {
      stopQuizMusic();
    };
  }, [currentView]);

  // Global Interaction Sound for clicks/taps on all interactive elements
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = target.closest(
        'button, a, input, select, textarea, [role="button"], .cursor-pointer'
      );
      if (isInteractive) {
        playInteractionSound('click');
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  // Firebase Firestore Connection & Initial Cloud Sync
  useEffect(() => {
    testConnection().then((connected) => {
      if (connected) {
        fetchArchiveFromFirestore().then((cloud) => {
          if (cloud.slides && cloud.slides.length > 0) setSlides(cloud.slides);
          if (cloud.categories && cloud.categories.length > 0) setCategories(cloud.categories);
          if (cloud.artifacts && cloud.artifacts.length > 0) setArtifacts(cloud.artifacts);
          if (cloud.questions && cloud.questions.length > 0) setQuestions(cloud.questions);
          if (cloud.aboutContent) setAboutContent(cloud.aboutContent);
        });
      }
    });
  }, []);

  // Navigation helper
  const navigateTo = (view: ViewMode) => {
    if (view !== currentView) {
      if (view === 'artifacts') {
        setHasOpenedArtifacts(true);
      }
      setHistory((prev) => [...prev, currentView]);
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentView === 'artifacts') {
      setCurrentView('category');
      if (hasOpenedArtifacts) {
        setShowQuizPrompt(true);
        setHasOpenedArtifacts(false);
      }
    } else if (currentView === 'questions') {
      setCurrentView('category');
    } else if (currentView === 'category') {
      setCurrentView('home');
    } else if (currentView === 'admin' || currentView === 'about') {
      // Go back without logging out the admin!
      if (history.length > 0) {
        const previous = history[history.length - 1];
        setHistory((prev) => prev.slice(0, -1));
        setCurrentView(previous);
      } else {
        setCurrentView('home');
      }
    } else if (history.length > 0) {
      const previous = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentView(previous);
    } else {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToTopicFromArtifacts = () => {
    setCurrentView('category');
    if (hasOpenedArtifacts) {
      setShowQuizPrompt(true);
      setHasOpenedArtifacts(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    const catArt = artifacts.find((a) => a.categoryId === cat.id);
    if (catArt) setSelectedArtifact(catArt);

    const catQ = questions.find((q) => q.categoryId === cat.id);
    if (catQ) setSelectedQuestion(catQ);

    navigateTo('category');
  };

  const handleSelectArtifact = (art: Artifact) => {
    setHasOpenedArtifacts(true);
    setSelectedArtifact(art);
    const cat = categories.find((c) => c.id === art.categoryId);
    if (cat) setSelectedCategory(cat);
    navigateTo('artifacts');
  };

  const handleSelectQuestion = (q: QuizQuestion) => {
    setSelectedQuestion(q);
    const cat = categories.find((c) => c.id === q.categoryId);
    if (cat) setSelectedCategory(cat);
    const art = artifacts.find((a) => a.id === q.artifactId);
    if (art) setSelectedArtifact(art);
    navigateTo('questions');
  };

  const handleResetDefaults = () => {
    const cleanCats = sanitizeCategories(INITIAL_CATEGORIES);
    const cleanArts = sanitizeArtifacts(INITIAL_ARTIFACTS);
    const cleanQs = sanitizeQuestions(INITIAL_QUESTIONS);

    setSlides(INITIAL_SLIDES);
    setCategories(cleanCats);
    setArtifacts(cleanArts);
    setQuestions(cleanQs);
    setAboutContent(INITIAL_ABOUT_CONTENT);
    setSelectedCategory(cleanCats.find((c) => c.id === 'social') || cleanCats[0]);
    setSelectedArtifact(cleanArts.find((a) => a.id === 'nokia-phones') || cleanArts[0]);
    setSelectedQuestion(cleanQs[0]);
    localStorage.removeItem('ppa_slides');
    localStorage.removeItem('ppa_categories');
    localStorage.removeItem('ppa_artifacts');
    localStorage.removeItem('ppa_questions');
    localStorage.removeItem('ppa_about_content');
    localStorage.removeItem('ppa_declined_artifacts');
    setDeclinedArtifactsCategories([]);
  };

  // Find artifacts & questions for current category
  const categoryArtifacts = artifacts.filter(
    (a) => a.categoryId === selectedCategory.id
  );
  const currentArtifact =
    categoryArtifacts.find((a) => a.id === selectedArtifact?.id) ||
    categoryArtifacts[0] ||
    artifacts[0];

  const categoryQuestions = questions.filter(
    (q) => q.categoryId === selectedCategory.id
  );
  const currentQuestion =
    categoryQuestions.find((q) => q.id === selectedQuestion?.id) ||
    categoryQuestions[0];

  return (
    <DeviceOrientationGuard>
      {/* Opening Intro Video MP4: Plays before the actual website is opened */}
      {showIntro && <WebsiteIntro onFinish={() => setShowIntro(false)} />}

      <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans select-none antialiased">
        {/* 1. Header & Navigation Bar */}
        <Header
          currentView={currentView}
          onNavigate={navigateTo}
          onBack={handleBack}
          canGoBack={currentView !== 'home'}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Search live dropdown modal */}
        <SearchDropdown
          searchQuery={searchQuery}
          categories={categories}
          artifacts={artifacts}
          questions={questions}
          onSelectCategory={handleSelectCategory}
          onSelectArtifact={handleSelectArtifact}
          onSelectQuestion={handleSelectQuestion}
          onClose={() => setSearchQuery('')}
        />

        {/* Main Content Area based on current view */}
        <main className="flex-1 w-full flex flex-col">
          {/* VIEW 1: Main Landing / Home Page */}
          {currentView === 'home' && (
            <div className="flex-1 flex flex-col">
              {/* Hero Slider Section */}
              <HeroSlider slides={slides} />

              {/* Category Grid: 5 Main Topic Cards */}
              <CategoryGrid
                categories={categories}
                onSelectCategory={handleSelectCategory}
              />
            </div>
          )}

          {/* VIEW 2: Category Detail View */}
          {currentView === 'category' && (
            <CategoryDetail
              category={selectedCategory}
              isAdmin={isAdminLoggedIn}
              hasDeclinedArtifacts={declinedArtifactsCategories.includes(selectedCategory.id)}
              onOpenArtifacts={() => {
                setHasOpenedArtifacts(true);
                navigateTo('artifacts');
              }}
              onOpenQuestions={() => navigateTo('questions')}
              onUpdateCategoryBanner={(catId, bannerUrl) => {
                setCategories((prev) =>
                  prev.map((c) => (c.id === catId ? { ...c, bannerImageUrl: bannerUrl } : c))
                );
                setSelectedCategory((prev) =>
                  prev.id === catId ? { ...prev, bannerImageUrl: bannerUrl } : prev
                );
              }}
            />
          )}

          {/* VIEW 3: Artifacts View */}
          {currentView === 'artifacts' && (
            <ArtifactView
              artifact={currentArtifact}
              availableArtifacts={categoryArtifacts.length > 0 ? categoryArtifacts : artifacts}
              onSelectArtifact={setSelectedArtifact}
              onBackToTopic={handleBackToTopicFromArtifacts}
            />
          )}

          {/* VIEW 4: Interactive Quiz / Questions View */}
          {currentView === 'questions' && (
            <QuestionView
              question={currentQuestion}
              category={selectedCategory}
              artifact={currentArtifact}
              availableQuestions={categoryQuestions}
              isAdmin={isAdminLoggedIn}
              onSelectQuestion={setSelectedQuestion}
              onUpdateQuestion={(updatedQ) => {
                setQuestions((prev) =>
                  prev.map((q) => (q.id === updatedQ.id ? updatedQ : q))
                );
                setSelectedQuestion(updatedQ);
              }}
              onNavigateToAdmin={() => navigateTo('admin')}
            />
          )}

          {/* VIEW 5: About Page Modal / Screen */}
          {currentView === 'about' && <AboutView content={aboutContent} />}

          {/* VIEW 6: Admin Settings & Management System */}
          {currentView === 'admin' && (
            <AdminModal
              slides={slides}
              categories={categories}
              artifacts={artifacts}
              questions={questions}
              aboutContent={aboutContent}
              isAuthenticated={isAdminLoggedIn}
              onLoginSuccess={handleAdminLoginSuccess}
              onLogout={handleAdminLogout}
              onUpdateSlides={setSlides}
              onUpdateCategories={setCategories}
              onUpdateArtifacts={setArtifacts}
              onUpdateQuestions={setQuestions}
              onUpdateAboutContent={setAboutContent}
              onResetDefaults={handleResetDefaults}
            />
          )}
        </main>

        {/* Museum Archival Footer */}
        <footer className="w-full bg-[#000000] text-zinc-400 py-3 px-4 text-center text-xs border-t border-zinc-900 mt-auto">
          <p className="flex items-center justify-center gap-2">
            <span>PopPinoyArchives &copy; 2000–2010 Philippine Popular Culture Museum.</span>
            <span className="hidden sm:inline">&bull; All artifacts and educational materials preserved.</span>
          </p>
        </footer>

        {/* TRANSITION POPUP: Prompt user to answer quiz when returning from Artifacts to Topic */}
        {showQuizPrompt && (
          <div
            onClick={() => setShowQuizPrompt(false)}
            className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 backdrop-blur-2xl border border-zinc-200 text-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center animate-scaleUp relative overflow-hidden"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)',
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <HelpCircle className="w-7 h-7" />
              </div>

              <h3 className="font-bebas text-3xl sm:text-4xl text-black tracking-wide mb-2">
                Answer Topic Questions?
              </h3>

              <p className="text-sm text-zinc-600 mb-6 leading-relaxed font-normal">
                You just explored artifacts in <strong className="text-black">{selectedCategory.name}</strong>. Would you like to Answer the Questions?
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuizPrompt(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-bold text-sm transition-colors cursor-pointer"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuizPrompt(false);
                    navigateTo('questions');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Yes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOPIC PROMPT: Pops after every 5 seconds inside a Topic asking if they want Artifacts */}
        {showArtifactsPrompt && (
          <div
            onClick={() => setShowArtifactsPrompt(false)}
            className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 backdrop-blur-2xl border border-zinc-200 text-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center animate-scaleUp relative overflow-hidden"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)',
              }}
            >
              <h3 className="font-bebas text-3xl sm:text-4xl text-black tracking-wide mb-2">
                Explore Artifacts?
              </h3>

              <p className="text-sm text-zinc-600 mb-6 leading-relaxed font-normal">
                Do you want to go to <strong className="text-black">{selectedCategory.name}</strong> Artifacts?
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeclinedArtifactsCategories((prev) => {
                      if (prev.includes(selectedCategory.id)) return prev;
                      const updated = [...prev, selectedCategory.id];
                      try {
                        localStorage.setItem('ppa_declined_artifacts', JSON.stringify(updated));
                      } catch {}
                      return updated;
                    });
                    setShowArtifactsPrompt(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-bold text-sm transition-colors cursor-pointer"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowArtifactsPrompt(false);
                    navigateTo('artifacts');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DeviceOrientationGuard>
  );
}
