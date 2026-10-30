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
import {
  PRESENT_CATEGORIES,
  PRESENT_ARTIFACTS,
  PRESENT_QUESTIONS,
} from './data/presentData';
import {
  FUTURE_CATEGORIES,
  FUTURE_ARTIFACTS,
  FUTURE_QUESTIONS,
} from './data/futureData';
import { Slide, Category, Artifact, QuizQuestion, ViewMode, AboutContent, EraMode } from './types';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategoryGrid } from './components/CategoryGrid';
import { CategoryDetail } from './components/CategoryDetail';
import { ArtifactView } from './components/ArtifactView';
import { QuestionView } from './components/QuestionView';
import { AboutView } from './components/AboutView';
import { ThenAndNowView } from './components/ThenAndNowView';
import { AdminModal } from './components/AdminModal';
import { SearchDropdown } from './components/SearchDropdown';
import { DeviceOrientationGuard } from './components/DeviceOrientationGuard';
import { WebsiteIntro } from './components/WebsiteIntro';
import { HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { playInteractionSound, startQuizMusic, stopQuizMusic } from './utils/audioManager';
import {
  testConnection,
  subscribeToArchive,
  seedArchiveIfEmpty,
  syncAllToFirestore,
  syncSlidesDiff,
  syncCategoriesDiff,
  syncArtifactsDiff,
  syncQuestionsDiff,
  syncAboutContentToFirestore,
  resetFirestoreToDefaults,
  isFirestoreQuotaExhausted,
  onQuotaExhaustedChanged,
} from './firebase';

import { formatToYouTubeEmbed } from './utils/youtube';

// Safe localStorage helper to prevent QuotaExceededError from breaking the UI
export const safeLocalStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`[LocalStorage] Quota exceeded or storage restricted for "${key}":`, err);
    // Fallback if slides quota exceeded: strip large data URLs from cache
    if (key === 'ppa_slides') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          const stripped = parsed.map((s: Slide) => ({
            ...s,
            imageUrl: s.imageUrl?.startsWith('data:') ? undefined : s.imageUrl,
          }));
          localStorage.setItem(key, JSON.stringify(stripped));
        }
      } catch {}
    }
  }
};

export const safeLocalStorageRemove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {}
};

// Safe slide sanitizer to prevent oversized base64 images from exceeding limits
const sanitizeSlides = (rawSlides: Slide[]): Slide[] =>
  rawSlides.map((s) => {
    if (s.imageUrl && s.imageUrl.startsWith('data:') && s.imageUrl.length > 780000) {
      console.warn(`[Slide Safety] Dropped oversized data URL for slide ${s.id} (${s.imageUrl.length} bytes)`);
      return { ...s, imageUrl: undefined };
    }
    return s;
  });

// Helper to detect and upgrade legacy placeholder reference links
const isLegacyReferenceLink = (url: string): boolean => {
  return (
    url.includes('wikipedia.org') ||
    url.includes('nhcp.gov.ph') ||
    url.includes('bsp.gov.ph') ||
    url === 'https://psa.gov.ph' ||
    url.includes('inquirer.net') ||
    url.includes('opm.org.ph') ||
    url.includes('filipiknow.net') ||
    url.includes('bagong.pagasa.dost.gov.ph') ||
    url === 'https://denr.gov.ph' ||
    url.includes('deseret.com')
  );
};

// Helper to sanitize categories and apply latest official support sources links
const sanitizeCategories = (cats: Category[]): Category[] =>
  cats.map((c) => {
    const initialMatch = INITIAL_CATEGORIES.find((ic) => ic.id === c.id);
    let referenceLinks = Array.isArray(c.referenceLinks) ? c.referenceLinks : (initialMatch?.referenceLinks || []);

    // If category has no links or contains legacy links, upgrade to the updated official sources
    if (referenceLinks.length === 0 || referenceLinks.some((l) => isLegacyReferenceLink(l.url))) {
      referenceLinks = initialMatch?.referenceLinks || referenceLinks;
    }

    const bannerImageUrl =
      c.bannerImageUrl && c.bannerImageUrl.startsWith('data:') && c.bannerImageUrl.length > 780000
        ? undefined
        : c.bannerImageUrl;
    return {
      ...c,
      name: c.name.replace(/^(ex\.|ex)\s*/i, ''),
      fullDescription: c.fullDescription.replace(/^(ex\.|ex)\s*/i, ''),
      referenceLinks,
      bannerImageUrl,
    };
  });

const sanitizeArtifacts = (arts: Artifact[]): Artifact[] =>
  arts.map((a) => {
    let videos = a.videos;
    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      if (a.videoUrl && a.videoUrl.trim() !== '') {
        videos = [
          {
            id: `vid-${a.id}-default`,
            url: formatToYouTubeEmbed(a.videoUrl),
            title: a.videoTitle || 'Main Archival Video',
          },
        ];
      } else {
        videos = [];
      }
    } else {
      videos = videos.map((v, idx) => ({
        ...v,
        id: v.id || `vid-${a.id}-${idx}`,
        url: formatToYouTubeEmbed(v.url),
      }));
    }
    const imageUrl =
      a.imageUrl && a.imageUrl.startsWith('data:') && a.imageUrl.length > 780000
        ? undefined
        : a.imageUrl;
    return {
      ...a,
      title: a.title.replace(/^(ex\.|ex)\s*/i, ''),
      description: a.description.replace(/^(ex\.|ex)\s*/i, ''),
      notes: a.notes.replace(/^(ex\.|ex)\s*/i, ''),
      imageUrl,
      videos,
      videoUrl: videos[0]?.url || a.videoUrl || '',
      videoTitle: videos[0]?.title || a.videoTitle || '',
      noVideoEmbed: a.noVideoEmbed === true,
    };
  });

export const LEGACY_DEFAULT_ARTIFACT_IDS = new Set([
  'nokia-phones',
  'friendster-internet-cafe',
  'edsa-dos',
  'hello-garci-scandal',
  'bpo-boom',
  'opm-bands',
  'anime-fever-tv',
  'typhoon-ondoy',
]);

export const sanitizeAndUpgradeArtifacts = (arts: Artifact[]): Artifact[] => {
  const sanitized = sanitizeArtifacts(arts);

  // Filter out any old legacy placeholder artifacts
  const withoutLegacy = sanitized.filter((a) => !LEGACY_DEFAULT_ARTIFACT_IDS.has(a.id));

  // Merge with the official INITIAL_ARTIFACTS
  const combined = [...INITIAL_ARTIFACTS];
  withoutLegacy.forEach((customA) => {
    if (!combined.some((a) => a.id === customA.id)) {
      combined.push(customA);
    }
  });

  return combined;
};

export const LEGACY_DEFAULT_QUESTION_IDS = new Set([
  'q-social-nokia',
  'q-political-edsa',
  'q-cultural-music',
  'q-economic-bpo',
  'q-environmental-ondoy',
]);

export const sanitizeAndUpgradeQuestions = (qs: QuizQuestion[]): QuizQuestion[] => {
  const sanitized = qs.map((q) => {
    let imageUrl = q.imageUrl;
    // Strip large or legacy Nokia phone data URLs from question images so they use the topic's banner graphic
    if (
      imageUrl &&
      ((imageUrl.startsWith('data:') && imageUrl.length > 780000) ||
        imageUrl.includes('phone1Body') ||
        imageUrl.includes('nokiaGreenScreen'))
    ) {
      imageUrl = undefined;
    }
    return {
      ...q,
      imageUrl,
      questionText: q.questionText.replace(/^(ex\.|ex)\s*/i, ''),
    };
  });

  // Filter out any of the old legacy placeholder questions
  const withoutLegacy = sanitized.filter((q) => !LEGACY_DEFAULT_QUESTION_IDS.has(q.id));

  // Merge with the official 10 INITIAL_QUESTIONS
  const combined = [...INITIAL_QUESTIONS];
  withoutLegacy.forEach((customQ) => {
    if (!combined.some((q) => q.id === customQ.id)) {
      combined.push(customQ);
    }
  });

  return combined;
};

export default function App() {
  // Persistent state in localStorage
  const [slides, setSlides] = useState<Slide[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_slides');
      return saved ? sanitizeSlides(JSON.parse(saved)) : sanitizeSlides(INITIAL_SLIDES);
    } catch {
      return sanitizeSlides(INITIAL_SLIDES);
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
        return sanitizeAndUpgradeArtifacts(JSON.parse(saved));
      }
      return sanitizeAndUpgradeArtifacts(INITIAL_ARTIFACTS);
    } catch {
      return sanitizeAndUpgradeArtifacts(INITIAL_ARTIFACTS);
    }
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_questions');
      if (saved) {
        return sanitizeAndUpgradeQuestions(JSON.parse(saved));
      }
      return sanitizeAndUpgradeQuestions(INITIAL_QUESTIONS);
    } catch {
      return sanitizeAndUpgradeQuestions(INITIAL_QUESTIONS);
    }
  });

  // Present Time (2026) State
  const [presentCategories, setPresentCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_present_categories');
      return saved ? JSON.parse(saved) : PRESENT_CATEGORIES;
    } catch {
      return PRESENT_CATEGORIES;
    }
  });

  const [presentArtifacts, setPresentArtifacts] = useState<Artifact[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_present_artifacts');
      return saved ? JSON.parse(saved) : PRESENT_ARTIFACTS;
    } catch {
      return PRESENT_ARTIFACTS;
    }
  });

  const [presentQuestions, setPresentQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_present_questions');
      return saved ? JSON.parse(saved) : PRESENT_QUESTIONS;
    } catch {
      return PRESENT_QUESTIONS;
    }
  });

  // Future Time (2030-2040) State
  const [futureCategories, setFutureCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_future_categories');
      return saved ? JSON.parse(saved) : FUTURE_CATEGORIES;
    } catch {
      return FUTURE_CATEGORIES;
    }
  });

  const [futureArtifacts, setFutureArtifacts] = useState<Artifact[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_future_artifacts');
      return saved ? JSON.parse(saved) : FUTURE_ARTIFACTS;
    } catch {
      return FUTURE_ARTIFACTS;
    }
  });

  const [futureQuestions, setFutureQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('ppa_future_questions');
      return saved ? JSON.parse(saved) : FUTURE_QUESTIONS;
    } catch {
      return FUTURE_QUESTIONS;
    }
  });

  const [aboutContent, setAboutContent] = useState<AboutContent>(() => {
    try {
      const saved = localStorage.getItem('ppa_about_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.milestones && parsed.milestones.length < 13) {
          return INITIAL_ABOUT_CONTENT;
        }
        return parsed;
      }
      return INITIAL_ABOUT_CONTENT;
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

  // Cloud Quota Exhaustion state (detects if free daily quota reached to pause attempts gracefully)
  const [isCloudQuotaPaused, setIsCloudQuotaPaused] = useState<boolean>(() => isFirestoreQuotaExhausted());

  useEffect(() => {
    return onQuotaExhaustedChanged((exhausted) => {
      setIsCloudQuotaPaused(exhausted);
    });
  }, []);

  // Save changes to localStorage with quota-safe protection
  useEffect(() => {
    safeLocalStorageSet('ppa_slides', JSON.stringify(slides));
  }, [slides]);

  useEffect(() => {
    safeLocalStorageSet('ppa_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    safeLocalStorageSet('ppa_artifacts', JSON.stringify(artifacts));
  }, [artifacts]);

  useEffect(() => {
    safeLocalStorageSet('ppa_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    safeLocalStorageSet('ppa_about_content', JSON.stringify(aboutContent));
  }, [aboutContent]);

  useEffect(() => {
    safeLocalStorageSet('ppa_present_categories', JSON.stringify(presentCategories));
  }, [presentCategories]);

  useEffect(() => {
    safeLocalStorageSet('ppa_present_artifacts', JSON.stringify(presentArtifacts));
  }, [presentArtifacts]);

  useEffect(() => {
    safeLocalStorageSet('ppa_present_questions', JSON.stringify(presentQuestions));
  }, [presentQuestions]);

  useEffect(() => {
    safeLocalStorageSet('ppa_future_categories', JSON.stringify(futureCategories));
  }, [futureCategories]);

  useEffect(() => {
    safeLocalStorageSet('ppa_future_artifacts', JSON.stringify(futureArtifacts));
  }, [futureArtifacts]);

  useEffect(() => {
    safeLocalStorageSet('ppa_future_questions', JSON.stringify(futureQuestions));
  }, [futureQuestions]);

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [activeEra, setActiveEra] = useState<EraMode>('then');
  const [history, setHistory] = useState<ViewMode[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    categories.find((c) => c.id === 'social') || categories[0]
  );
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact>(
    artifacts.find((a) => a.id === 'soc-nokia-texting') || artifacts[0]
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

  // Firebase Firestore Connection & Real-Time Live Sync for All Devices (Guests and Admins)
  useEffect(() => {
    let isSubscribed = true;

    // Check connection and seed initial archive to Cloud if Firestore is empty
    testConnection().then(async (connected) => {
      if (connected) {
        await seedArchiveIfEmpty(
          INITIAL_SLIDES,
          sanitizeCategories(INITIAL_CATEGORIES),
          sanitizeAndUpgradeArtifacts(INITIAL_ARTIFACTS),
          sanitizeAndUpgradeQuestions(INITIAL_QUESTIONS),
          INITIAL_ABOUT_CONTENT
        );
      }
    });

    // Real-Time onSnapshot listener: When admin makes changes on ANY device,
    // all connected guests and visitors see changes LIVE in real-time!
    const unsubscribe = subscribeToArchive({
      onSlides: (cloudSlides) => {
        if (!isSubscribed) return;
        if (cloudSlides && cloudSlides.length > 0) {
          setSlides(sanitizeSlides(cloudSlides));
        }
      },
      onCategories: (cloudCategories) => {
        if (!isSubscribed) return;
        if (cloudCategories && cloudCategories.length > 0) {
          setCategories(sanitizeCategories(cloudCategories));
        }
      },
      onArtifacts: (cloudArtifacts) => {
        if (!isSubscribed) return;
        if (cloudArtifacts && cloudArtifacts.length > 0) {
          const upgraded = sanitizeAndUpgradeArtifacts(cloudArtifacts);
          setArtifacts(upgraded);
          // If Firestore still held any old legacy artifact IDs, old Nokia SVG image, or outdated notes, sync the upgraded artifacts to cloud
          const isCloudOutdated = cloudArtifacts.some(
            (a) =>
              LEGACY_DEFAULT_ARTIFACT_IDS.has(a.id) ||
              (a.id === 'soc-nokia-texting' && !a.imageUrl?.includes('hqdefault.jpg')) ||
              (a.id === 'cult-anime' &&
                (a.videoUrl?.includes('zZ_JvvXuFuA') ||
                  a.videos?.some((v) => v.url.includes('zZ_JvvXuFuA')))) ||
              INITIAL_ARTIFACTS.some((initA) => initA.id === a.id && initA.notes !== a.notes)
          );
          if (isCloudOutdated) {
            syncArtifactsDiff(cloudArtifacts, upgraded);
          }
        }
      },
      onQuestions: (cloudQuestions) => {
        if (!isSubscribed) return;
        if (cloudQuestions && cloudQuestions.length > 0) {
          const upgraded = sanitizeAndUpgradeQuestions(cloudQuestions);
          setQuestions(upgraded);
          // If Firestore still held any old legacy question IDs or questions with legacy Nokia image, sync upgraded questions
          if (
            cloudQuestions.some(
              (q) =>
                LEGACY_DEFAULT_QUESTION_IDS.has(q.id) ||
                (q.imageUrl &&
                  (q.imageUrl.includes('phone1Body') || q.imageUrl.includes('nokiaGreenScreen')))
            )
          ) {
            syncQuestionsDiff(cloudQuestions, upgraded);
          }
        }
      },
      onAbout: (cloudAbout) => {
        if (!isSubscribed) return;
        if (cloudAbout) {
          if (cloudAbout.milestones && cloudAbout.milestones.length < 13) {
            setAboutContent(INITIAL_ABOUT_CONTENT);
            syncAboutContentToFirestore(INITIAL_ABOUT_CONTENT);
          } else {
            setAboutContent(cloudAbout);
          }
        }
      },
      onError: (err) => {
        console.warn('Real-time subscription notice:', err);
      },
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
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
    } else if (currentView === 'questions' || currentView === 'then-and-now') {
      setCurrentView('category');
    } else if (currentView === 'category') {
      if (activeEra === 'future') {
        setActiveEra('then');
      } else {
        setCurrentView('home');
      }
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
    setActiveEra('then'); // Reset to 2000-2010 retro era when selecting topic from home
    const catArt = artifacts.find((a) => a.categoryId === cat.id);
    if (catArt) setSelectedArtifact(catArt);

    const catQ = questions.find((q) => q.categoryId === cat.id);
    if (catQ) setSelectedQuestion(catQ);

    navigateTo('category');
  };

  const handleOpenFuture = () => {
    setActiveEra('future');
    const catId = selectedCategory.id;
    const futureArt = futureArtifacts.find((a) => a.categoryId === catId);
    if (futureArt) setSelectedArtifact(futureArt);
    const futureQ = futureQuestions.find((q) => q.categoryId === catId);
    if (futureQ) setSelectedQuestion(futureQ);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleEra = () => {
    if (activeEra === 'future') {
      setActiveEra('then');
      const catId = selectedCategory.id;
      const firstRetroArt = artifacts.find((a) => a.categoryId === catId);
      if (firstRetroArt) setSelectedArtifact(firstRetroArt);
      const firstRetroQ = questions.find((q) => q.categoryId === catId);
      if (firstRetroQ) setSelectedQuestion(firstRetroQ);
      return;
    }

    const nextEra: EraMode = activeEra === 'then' ? 'now' : 'then';
    setActiveEra(nextEra);
    const catId = selectedCategory.id;
    if (nextEra === 'now') {
      const firstPresentArt = presentArtifacts.find((a) => a.categoryId === catId);
      if (firstPresentArt) setSelectedArtifact(firstPresentArt);
      const firstPresentQ = presentQuestions.find((q) => q.categoryId === catId);
      if (firstPresentQ) setSelectedQuestion(firstPresentQ);
    } else {
      const firstRetroArt = artifacts.find((a) => a.categoryId === catId);
      if (firstRetroArt) setSelectedArtifact(firstRetroArt);
      const firstRetroQ = questions.find((q) => q.categoryId === catId);
      if (firstRetroQ) setSelectedQuestion(firstRetroQ);
    }
  };

  const handleSelectArtifact = (art: Artifact) => {
    setHasOpenedArtifacts(true);
    setSelectedArtifact(art);
    const cat =
      categories.find((c) => c.id === art.categoryId) ||
      presentCategories.find((c) => c.id === art.categoryId) ||
      futureCategories.find((c) => c.id === art.categoryId);
    if (cat) setSelectedCategory(cat);
    navigateTo('artifacts');
  };

  const handleSelectQuestion = (q: QuizQuestion) => {
    setSelectedQuestion(q);
    const cat =
      categories.find((c) => c.id === q.categoryId) ||
      presentCategories.find((c) => c.id === q.categoryId) ||
      futureCategories.find((c) => c.id === q.categoryId);
    if (cat) setSelectedCategory(cat);
    const art =
      artifacts.find((a) => a.id === q.artifactId) ||
      presentArtifacts.find((a) => a.id === q.artifactId) ||
      futureArtifacts.find((a) => a.id === q.artifactId);
    if (art) setSelectedArtifact(art);
    navigateTo('questions');
  };

  // Cloud Firestore Sync Handlers for Admin changes (Instantly updates Cloud & triggers live updates for all guests)
  const handleUpdateSlides = (newSlides: Slide[]) => {
    setSlides(newSlides);
    syncSlidesDiff(slides, newSlides);
  };

  const handleUpdateCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    syncCategoriesDiff(categories, newCategories);
  };

  const handleUpdateArtifacts = (newArtifacts: Artifact[]) => {
    setArtifacts(newArtifacts);
    syncArtifactsDiff(artifacts, newArtifacts);
  };

  const handleUpdateQuestions = (newQuestions: QuizQuestion[]) => {
    setQuestions(newQuestions);
    syncQuestionsDiff(questions, newQuestions);
  };

  const handleUpdatePresentCategories = (newCats: Category[]) => {
    setPresentCategories(newCats);
  };

  const handleUpdatePresentArtifacts = (newArts: Artifact[]) => {
    setPresentArtifacts(newArts);
  };

  const handleUpdatePresentQuestions = (newQs: QuizQuestion[]) => {
    setPresentQuestions(newQs);
  };

  const handleUpdateFutureCategories = (newCats: Category[]) => {
    setFutureCategories(newCats);
  };

  const handleUpdateFutureArtifacts = (newArts: Artifact[]) => {
    setFutureArtifacts(newArts);
  };

  const handleUpdateFutureQuestions = (newQs: QuizQuestion[]) => {
    setFutureQuestions(newQs);
  };

  const handleUpdateAboutContent = (newAbout: AboutContent) => {
    setAboutContent(newAbout);
    syncAboutContentToFirestore(newAbout);
  };

  const handleForceSyncCloud = async () => {
    await syncAllToFirestore(slides, categories, artifacts, questions, aboutContent);
  };

  const handleResetDefaults = () => {
    const cleanCats = sanitizeCategories(INITIAL_CATEGORIES);
    const cleanArts = sanitizeAndUpgradeArtifacts(INITIAL_ARTIFACTS);
    const cleanQs = sanitizeAndUpgradeQuestions(INITIAL_QUESTIONS);

    setSlides(INITIAL_SLIDES);
    setCategories(cleanCats);
    setArtifacts(cleanArts);
    setQuestions(cleanQs);
    setPresentCategories(PRESENT_CATEGORIES);
    setPresentArtifacts(PRESENT_ARTIFACTS);
    setPresentQuestions(PRESENT_QUESTIONS);
    setFutureCategories(FUTURE_CATEGORIES);
    setFutureArtifacts(FUTURE_ARTIFACTS);
    setFutureQuestions(FUTURE_QUESTIONS);
    setAboutContent(INITIAL_ABOUT_CONTENT);
    setSelectedCategory(cleanCats.find((c) => c.id === 'social') || cleanCats[0]);
    setSelectedArtifact(cleanArts.find((a) => a.id === 'soc-nokia-texting') || cleanArts[0]);
    safeLocalStorageRemove('ppa_slides');
    safeLocalStorageRemove('ppa_categories');
    safeLocalStorageRemove('ppa_artifacts');
    safeLocalStorageRemove('ppa_questions');
    safeLocalStorageRemove('ppa_present_categories');
    safeLocalStorageRemove('ppa_present_artifacts');
    safeLocalStorageRemove('ppa_present_questions');
    safeLocalStorageRemove('ppa_future_categories');
    safeLocalStorageRemove('ppa_future_artifacts');
    safeLocalStorageRemove('ppa_future_questions');
    safeLocalStorageRemove('ppa_about_content');
    safeLocalStorageRemove('ppa_declined_artifacts');
    setDeclinedArtifactsCategories([]);

    // Also reset Cloud Firestore so all devices see the restored defaults in real-time
    resetFirestoreToDefaults(
      INITIAL_SLIDES,
      cleanCats,
      cleanArts,
      cleanQs,
      INITIAL_ABOUT_CONTENT
    );
  };

  // Active Category resolution depending on activeEra
  const activeCategory: Category =
    activeEra === 'future'
      ? (futureCategories.find((c) => c.id === selectedCategory.id) || futureCategories[0])
      : activeEra === 'now'
      ? (presentCategories.find((c) => c.id === selectedCategory.id) || presentCategories[0])
      : (categories.find((c) => c.id === selectedCategory.id) || selectedCategory);

  // Find artifacts & questions for current category based on activeEra
  const categoryArtifacts =
    activeEra === 'future'
      ? futureArtifacts.filter((a) => a.categoryId === selectedCategory.id)
      : activeEra === 'now'
      ? presentArtifacts.filter((a) => a.categoryId === selectedCategory.id)
      : artifacts.filter((a) => a.categoryId === selectedCategory.id);

  const currentArtifact =
    categoryArtifacts.find((a) => a.id === selectedArtifact?.id) ||
    categoryArtifacts[0] ||
    (activeEra === 'future'
      ? futureArtifacts[0]
      : activeEra === 'now'
      ? presentArtifacts[0]
      : artifacts[0]);

  const categoryQuestions =
    activeEra === 'future'
      ? futureQuestions.filter((q) => q.categoryId === selectedCategory.id)
      : activeEra === 'now'
      ? presentQuestions.filter((q) => q.categoryId === selectedCategory.id)
      : questions.filter((q) => q.categoryId === selectedCategory.id);

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
          categories={[...categories, ...presentCategories, ...futureCategories]}
          artifacts={[...artifacts, ...presentArtifacts, ...futureArtifacts]}
          questions={[...questions, ...presentQuestions, ...futureQuestions]}
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
              category={activeCategory}
              featuredArtifact={currentArtifact}
              isAdmin={isAdminLoggedIn}
              hasDeclinedArtifacts={declinedArtifactsCategories.includes(selectedCategory.id)}
              activeEra={activeEra}
              onToggleEra={handleToggleEra}
              onOpenFuture={handleOpenFuture}
              onOpenArtifacts={() => {
                setHasOpenedArtifacts(true);
                navigateTo('artifacts');
              }}
              onOpenQuestions={() => navigateTo('questions')}
              onOpenThenAndNow={handleToggleEra}
              onUpdateCategoryBanner={(catId, bannerUrl) => {
                if (activeEra === 'future') {
                  const updated = futureCategories.map((c) =>
                    c.id === catId ? { ...c, bannerImageUrl: bannerUrl } : c
                  );
                  setFutureCategories(updated);
                } else if (activeEra === 'now') {
                  const updated = presentCategories.map((c) =>
                    c.id === catId ? { ...c, bannerImageUrl: bannerUrl } : c
                  );
                  setPresentCategories(updated);
                } else {
                  const updated = categories.map((c) =>
                    c.id === catId ? { ...c, bannerImageUrl: bannerUrl } : c
                  );
                  setCategories(updated);
                  setSelectedCategory((prev) =>
                    prev.id === catId ? { ...prev, bannerImageUrl: bannerUrl } : prev
                  );
                  syncCategoriesDiff(categories, updated);
                }
              }}
            />
          )}

          {/* VIEW 3: Artifacts View */}
          {currentView === 'artifacts' && (
            <ArtifactView
              artifact={currentArtifact}
              availableArtifacts={categoryArtifacts.length > 0 ? categoryArtifacts : (activeEra === 'future' ? futureArtifacts : activeEra === 'now' ? presentArtifacts : artifacts)}
              onSelectArtifact={setSelectedArtifact}
              onBackToTopic={handleBackToTopicFromArtifacts}
            />
          )}

          {/* VIEW 4: Interactive Quiz / Questions View */}
          {currentView === 'questions' && (
            <QuestionView
              question={currentQuestion}
              category={activeCategory}
              artifact={currentArtifact}
              availableQuestions={categoryQuestions}
              isAdmin={isAdminLoggedIn}
              onSelectQuestion={setSelectedQuestion}
              onUpdateQuestion={(updatedQ) => {
                if (activeEra === 'future') {
                  const updated = futureQuestions.map((q) => (q.id === updatedQ.id ? updatedQ : q));
                  setFutureQuestions(updated);
                  setSelectedQuestion(updatedQ);
                } else if (activeEra === 'now') {
                  const updated = presentQuestions.map((q) => (q.id === updatedQ.id ? updatedQ : q));
                  setPresentQuestions(updated);
                  setSelectedQuestion(updatedQ);
                } else {
                  const updated = questions.map((q) => (q.id === updatedQ.id ? updatedQ : q));
                  setQuestions(updated);
                  setSelectedQuestion(updatedQ);
                  syncQuestionsDiff(questions, updated);
                }
              }}
              onNavigateToAdmin={() => navigateTo('admin')}
            />
          )}

          {/* VIEW 5: Then & Now Comparison View */}
          {currentView === 'then-and-now' && (
            <ThenAndNowView
              category={selectedCategory}
              categories={categories}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onBackToTopic={() => navigateTo('category')}
            />
          )}

          {/* VIEW 6: About Page Modal / Screen */}
          {currentView === 'about' && <AboutView content={aboutContent} />}

          {/* VIEW 7: Admin Settings & Management System */}
          {currentView === 'admin' && (
            <AdminModal
              slides={slides}
              categories={categories}
              artifacts={artifacts}
              questions={questions}
              presentCategories={presentCategories}
              presentArtifacts={presentArtifacts}
              presentQuestions={presentQuestions}
              futureCategories={futureCategories}
              futureArtifacts={futureArtifacts}
              futureQuestions={futureQuestions}
              aboutContent={aboutContent}
              isAuthenticated={isAdminLoggedIn}
              onLoginSuccess={handleAdminLoginSuccess}
              onLogout={handleAdminLogout}
              onUpdateSlides={handleUpdateSlides}
              onUpdateCategories={handleUpdateCategories}
              onUpdateArtifacts={handleUpdateArtifacts}
              onUpdateQuestions={handleUpdateQuestions}
              onUpdatePresentCategories={handleUpdatePresentCategories}
              onUpdatePresentArtifacts={handleUpdatePresentArtifacts}
              onUpdatePresentQuestions={handleUpdatePresentQuestions}
              onUpdateFutureCategories={handleUpdateFutureCategories}
              onUpdateFutureArtifacts={handleUpdateFutureArtifacts}
              onUpdateFutureQuestions={handleUpdateFutureQuestions}
              onUpdateAboutContent={handleUpdateAboutContent}
              onResetDefaults={handleResetDefaults}
              onForceSyncCloud={handleForceSyncCloud}
              isCloudQuotaPaused={isCloudQuotaPaused}
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
