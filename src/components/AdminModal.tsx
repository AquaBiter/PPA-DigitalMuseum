import React, { useState, useRef } from 'react';
import {
  Settings,
  User,
  Plus,
  Trash2,
  Upload,
  RotateCcw,
  LogOut,
  Check,
  Layers,
  HelpCircle,
  FolderOpen,
  Sliders,
  BookOpen,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Globe,
  Database,
  Cloud,
  RefreshCw,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { Slide, Category, Artifact, QuizQuestion, AboutContent, TimelineMilestone } from '../types';
import {
  FIREBASE_PROJECT_ID,
  FIRESTORE_DATABASE_ID,
  FIREBASE_CONSOLE_URL,
  FIREBASE_FIRESTORE_URL,
  FIREBASE_HOSTING_URL,
  FIREBASE_AUTH_URL,
  FIREBASE_RULES_URL,
  testConnection,
  syncArchiveToFirestore,
  fetchArchiveFromFirestore,
} from '../firebase';

interface AdminModalProps {
  slides: Slide[];
  categories: Category[];
  artifacts: Artifact[];
  questions: QuizQuestion[];
  aboutContent: AboutContent;
  isAuthenticated: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  onUpdateSlides: (slides: Slide[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onUpdateArtifacts: (artifacts: Artifact[]) => void;
  onUpdateQuestions: (questions: QuizQuestion[]) => void;
  onUpdateAboutContent: (about: AboutContent) => void;
  onResetDefaults: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  slides,
  categories,
  artifacts,
  questions,
  aboutContent,
  isAuthenticated,
  onLoginSuccess,
  onLogout,
  onUpdateSlides,
  onUpdateCategories,
  onUpdateArtifacts,
  onUpdateQuestions,
  onUpdateAboutContent,
  onResetDefaults,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'slides' | 'topics' | 'artifacts' | 'questions' | 'about' | 'firebase'>('artifacts');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [isTestingConn, setIsTestingConn] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');

  const handleTestCloudConnection = async () => {
    setIsTestingConn(true);
    try {
      const ok = await testConnection();
      setConnectionStatus(ok ? 'connected' : 'error');
      showToast(ok ? 'Firebase Firestore connected successfully!' : 'Connection issue. Check network.');
    } catch {
      setConnectionStatus('error');
      showToast('Firebase connection test failed');
    } finally {
      setIsTestingConn(false);
    }
  };

  const handlePushAllToFirestore = async () => {
    setIsSyncingCloud(true);
    try {
      const res = await syncArchiveToFirestore(slides, categories, artifacts, questions, aboutContent);
      if (res.success) {
        showToast(`Successfully synced ${res.count} records to Cloud Firestore!`);
      } else {
        showToast(`Sync warning: ${res.error || 'Failed'}`);
      }
    } catch (e) {
      showToast('Error syncing to Firestore');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handlePullFromFirestore = async () => {
    setIsSyncingCloud(true);
    try {
      const cloudData = await fetchArchiveFromFirestore();
      let restoredCount = 0;
      if (cloudData.slides && cloudData.slides.length > 0) {
        onUpdateSlides(cloudData.slides);
        restoredCount += cloudData.slides.length;
      }
      if (cloudData.categories && cloudData.categories.length > 0) {
        onUpdateCategories(cloudData.categories);
        restoredCount += cloudData.categories.length;
      }
      if (cloudData.artifacts && cloudData.artifacts.length > 0) {
        onUpdateArtifacts(cloudData.artifacts);
        restoredCount += cloudData.artifacts.length;
      }
      if (cloudData.questions && cloudData.questions.length > 0) {
        onUpdateQuestions(cloudData.questions);
        restoredCount += cloudData.questions.length;
      }
      if (cloudData.aboutContent) {
        onUpdateAboutContent(cloudData.aboutContent);
        restoredCount++;
      }
      if (restoredCount > 0) {
        showToast(`Fetched & updated ${restoredCount} items from Cloud Firestore!`);
      } else {
        showToast('Firestore database currently has no records. You can push local data first!');
      }
    } catch {
      showToast('Failed to pull from Firestore');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Topic filter for Questions tab to ensure questions are strictly per topic/category
  const [selectedQuestionCategory, setSelectedQuestionCategory] = useState<string>(() => {
    return categories[0]?.id || 'social';
  });

  // File input ref for local storage device upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ type: 'slide' | 'artifact' | 'category' | 'question'; id: string } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'Admin123') {
      onLoginSuccess();
      setLoginError('');
      showToast('Authenticated as Admin');
    } else {
      setLoginError('Invalid credentials. Use Username: Admin and Password: Admin123');
    }
  };

  const handleQuickFill = () => {
    setUsername('Admin');
    setPassword('Admin123');
    setLoginError('');
  };

  // Image Upload handler from Local Device Storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;

    const reader = new FileReader();
    reader.onload = () => {
      const resultDataUrl = reader.result as string;

      if (uploadTarget.type === 'slide') {
        const updated = slides.map((s) =>
          s.id === uploadTarget.id ? { ...s, imageUrl: resultDataUrl } : s
        );
        onUpdateSlides(updated);
        showToast('Image uploaded from device to hero slide!');
      } else if (uploadTarget.type === 'artifact') {
        const updated = artifacts.map((a) =>
          a.id === uploadTarget.id ? { ...a, imageUrl: resultDataUrl } : a
        );
        onUpdateArtifacts(updated);
        showToast('Image uploaded from device to artifact!');
      } else if (uploadTarget.type === 'category') {
        const updated = categories.map((c) =>
          c.id === uploadTarget.id ? { ...c, bannerImageUrl: resultDataUrl } : c
        );
        onUpdateCategories(updated);
        showToast('Banner graphic uploaded for topic!');
      } else if (uploadTarget.type === 'question') {
        const updated = questions.map((q) =>
          q.id === uploadTarget.id ? { ...q, imageUrl: resultDataUrl } : q
        );
        onUpdateQuestions(updated);
        showToast('Reference image uploaded for question!');
      }
      setUploadTarget(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const triggerUpload = (type: 'slide' | 'artifact' | 'category' | 'question', id: string) => {
    setUploadTarget({ type, id });
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // --- CRUD: ABOUT & TIMELINE ---
  const handleUpdateAboutText = (field: 'paragraph1' | 'paragraph2' | 'timelineTitle', val: string) => {
    onUpdateAboutContent({
      ...aboutContent,
      [field]: val,
    });
  };

  const handleAddMilestone = () => {
    const newM: TimelineMilestone = {
      id: `milestone-${Date.now()}`,
      year: '200X',
      title: 'New Cultural Milestone',
      desc: 'Description of key Philippine pop culture moments from the 2000s.',
    };
    onUpdateAboutContent({
      ...aboutContent,
      milestones: [...aboutContent.milestones, newM],
    });
    showToast('New timeline milestone added');
  };

  const handleDeleteMilestone = (id: string) => {
    onUpdateAboutContent({
      ...aboutContent,
      milestones: aboutContent.milestones.filter((m) => m.id !== id),
    });
    showToast('Milestone removed');
  };

  const handleUpdateMilestone = (id: string, field: keyof TimelineMilestone, val: string) => {
    onUpdateAboutContent({
      ...aboutContent,
      milestones: aboutContent.milestones.map((m) => (m.id === id ? { ...m, [field]: val } : m)),
    });
  };

  const handleMoveMilestone = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= aboutContent.milestones.length) return;
    const newArr = [...aboutContent.milestones];
    const [moved] = newArr.splice(index, 1);
    newArr.splice(targetIdx, 0, moved);
    onUpdateAboutContent({
      ...aboutContent,
      milestones: newArr,
    });
  };

  // --- CRUD: HERO SLIDES ---
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      titleHighlight: 'NEW TITLE',
      titleSuffix: 'artifacts',
      subtitle: 'New Philippine 2000s historical exhibition',
      color: '#06B6D4',
    };
    onUpdateSlides([...slides, newSlide]);
    showToast('New Hero Slide added');
  };

  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      alert('You must have at least one hero slide.');
      return;
    }
    onUpdateSlides(slides.filter((s) => s.id !== id));
    showToast('Hero slide removed');
  };

  const handleUpdateSlideField = (id: string, field: keyof Slide, val: string) => {
    onUpdateSlides(
      slides.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  // --- CRUD: CATEGORIES / TOPICS ---
  const handleAddCategory = () => {
    const newCat: Category = {
      id: `topic-${Date.now()}`,
      name: 'NEW TOPIC',
      summary: 'Explore this newly archived aspect of 2000s Philippine life.',
      fullDescription: 'This archive examines this topic in everyday Filipino culture from 2000 to 2010.',
      accentColor: '#F59E0B',
    };
    onUpdateCategories([...categories, newCat]);
    showToast('New category added');
  };

  const handleDeleteCategory = (id: string) => {
    if (categories.length <= 1) {
      alert('You must have at least one category.');
      return;
    }
    onUpdateCategories(categories.filter((c) => c.id !== id));
    showToast('Category removed');
  };

  const handleUpdateCategoryField = (id: string, field: keyof Category, val: string) => {
    onUpdateCategories(
      categories.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  // --- CRUD: ARTIFACTS ---
  const handleAddArtifact = () => {
    const defaultCatId = categories[0]?.id || 'social';
    const newArtifact: Artifact = {
      id: `artifact-${Date.now()}`,
      categoryId: defaultCatId,
      title: 'NEW ARTIFACT',
      description: 'Description of the cultural artifact and its relevance to 2000s Filipino life.',
      notes: 'Key historical context and observation.',
      imageUrl: artifacts[0]?.imageUrl || '',
      videoUrl: 'https://www.youtube.com/embed/rP1Zc5oJ8aE',
      videoTitle: 'Archival video footage',
    };
    onUpdateArtifacts([...artifacts, newArtifact]);
    showToast('New artifact created');
  };

  const handleDeleteArtifact = (id: string) => {
    if (artifacts.length <= 1) {
      alert('You must have at least one artifact.');
      return;
    }
    onUpdateArtifacts(artifacts.filter((a) => a.id !== id));
    showToast('Artifact removed');
  };

  const handleUpdateArtifactField = (id: string, field: keyof Artifact, val: string) => {
    onUpdateArtifacts(
      artifacts.map((a) => (a.id === id ? { ...a, [field]: val } : a))
    );
  };

  // --- CRUD: QUESTIONS (Strictly per Topic / Category) ---
  const handleAddQuestionToCategory = (targetCatId: string) => {
    const cat = categories.find((c) => c.id === targetCatId) || categories[0];
    const catArtifact = artifacts.find((a) => a.categoryId === targetCatId);

    const newQuestion: QuizQuestion = {
      id: `question-${Date.now()}`,
      categoryId: targetCatId,
      artifactId: catArtifact?.id,
      questionText: `What was a defining ${cat?.name || ''} milestone during the 2000s?`,
      choices: [
        { id: `choice-A-${Date.now()}`, letter: 'A', text: 'Option A' },
        { id: `choice-B-${Date.now()}`, letter: 'B', text: 'Option B' },
      ],
      correctChoiceId: `choice-A-${Date.now()}`,
      explanation: 'Historical context for the answer.',
    };
    onUpdateQuestions([...questions, newQuestion]);
    showToast(`Added question to ${cat?.name || 'Topic'}`);
  };

  const handleDeleteQuestion = (id: string) => {
    onUpdateQuestions(questions.filter((q) => q.id !== id));
    showToast('Question removed');
  };

  const handleUpdateQuestionCategory = (id: string, newCatId: string) => {
    onUpdateQuestions(
      questions.map((q) => (q.id === id ? { ...q, categoryId: newCatId } : q))
    );
    showToast('Question moved to new topic');
  };

  const handleUpdateQuestionText = (id: string, text: string) => {
    onUpdateQuestions(
      questions.map((q) => (q.id === id ? { ...q, questionText: text } : q))
    );
  };

  const handleUpdateChoiceText = (qId: string, choiceId: string, text: string) => {
    onUpdateQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        return {
          ...q,
          choices: q.choices.map((c) => (c.id === choiceId ? { ...c, text } : c)),
        };
      })
    );
  };

  const handleSetCorrectChoice = (qId: string, choiceId: string) => {
    onUpdateQuestions(
      questions.map((q) => (q.id === qId ? { ...q, correctChoiceId: choiceId } : q))
    );
    showToast('Updated correct answer');
  };

  // Hidden file input for uploading from device local storage
  const hiddenFileInput = (
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileUpload}
      accept="image/*"
      className="hidden"
    />
  );

  // If NOT logged in: Show Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[calc(100vh-120px)] bg-white px-4 sm:px-8 py-8 max-w-5xl mx-auto flex flex-col justify-center">
        {hiddenFileInput}

        {/* Toast Notification on login page if auto-filled */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-sm font-medium animate-bounce">
            <Check className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Big Gear & User with Password Dots Icon */}
          <div className="md:col-span-5 flex flex-col items-center justify-center space-y-8 select-none">
            {/* Gear Icon in black circle */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-black flex items-center justify-center text-white shadow-lg">
              <Settings className="w-20 h-20 sm:w-24 sm:h-24 stroke-[2]" />
            </div>

            {/* User with password dots icon - Hidden Auto-Fill button */}
            <button
              type="button"
              onClick={() => {
                handleQuickFill();
                showToast('Admin credentials filled');
              }}
              className="flex flex-col items-center group cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95"
              title="Click to Auto-Fill Credentials"
              aria-label="Auto-Fill Credentials"
            >
              <div className="w-20 h-20 rounded-full border-4 border-black flex items-center justify-center transition-colors group-hover:border-zinc-700">
                <User className="w-12 h-12 text-black stroke-[2.5] group-hover:text-zinc-700 transition-colors" />
              </div>
              <div className="w-32 h-12 border-4 border-black border-t-0 flex items-center justify-center gap-2 mt-1 transition-colors group-hover:border-zinc-700">
                <span className="w-2 h-2 rounded-full bg-black group-hover:bg-zinc-700 transition-colors" />
                <span className="w-2 h-2 rounded-full bg-black group-hover:bg-zinc-700 transition-colors" />
                <span className="w-2 h-2 rounded-full bg-black group-hover:bg-zinc-700 transition-colors" />
                <span className="w-2 h-2 rounded-full bg-black group-hover:bg-zinc-700 transition-colors" />
                <span className="w-2 h-2 rounded-full bg-black group-hover:bg-zinc-700 transition-colors" />
              </div>
            </button>
          </div>

          {/* Right Column: Arial Admin Login & Login Form */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2
                  className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Admin Login
                </h2>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter Admin"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Admin123"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black font-medium"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-zinc-800 font-bold py-2.5 px-4 rounded-lg transition-colors cursor-pointer text-sm shadow-sm"
                  >
                    Log In to Dashboard
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-zinc-200">
                <p className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-zinc-800 leading-snug">
                  ADMIN CAN ADD, REMOVE, AND MODIFY EVERYTHING. (hero sliders, Questions, artifacts, and topics)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active question topic object
  const activeQuestionCategoryObj =
    categories.find((c) => c.id === selectedQuestionCategory) || categories[0];

  // Questions filtered strictly to the selected topic
  const questionsInActiveCategory = questions.filter(
    (q) => q.categoryId === selectedQuestionCategory
  );

  // --- LOGGED IN: FULL CRUD MANAGEMENT DASHBOARD ---
  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-white px-4 sm:px-8 py-6 max-w-7xl mx-auto">
      {hiddenFileInput}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-sm font-medium animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Dashboard Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-bebas text-4xl sm:text-5xl text-black font-bold tracking-wide">
              Archive Management Console
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">
              Admin Active
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Create, edit, delete, and manage topics, artifacts, and questions per category.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Firebase Quick Action Links */}
          <a
            href={FIREBASE_CONSOLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            title="Open Firebase Console in new tab"
          >
            <Cloud className="w-3.5 h-3.5 text-amber-600" />
            <span>Firebase Console</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <a
            href={FIREBASE_HOSTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 border border-blue-300 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            title="Open Firebase Hosting in new tab"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Hosting</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button
            onClick={() => {
              if (confirm('Reset all categories, artifacts, questions, and slides back to reference defaults?')) {
                onResetDefaults();
                showToast('Reset to default reference archive');
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            title="Reset to Original Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <button
            onClick={() => {
              onLogout();
              showToast('Logged out of Admin');
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 my-6 border-b border-zinc-200 pb-3">
        <button
          onClick={() => setActiveTab('artifacts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'artifacts'
              ? 'bg-black text-white shadow'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Artifacts ({artifacts.length})
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-black text-white shadow'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Questions Per Topic ({questions.length})
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'topics'
              ? 'bg-black text-white shadow'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Topics / Categories ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'slides'
              ? 'bg-black text-white shadow'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Hero Sliders ({slides.length})
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'about'
              ? 'bg-black text-white shadow'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          About & Timeline ({aboutContent.milestones.length})
        </button>

        <button
          onClick={() => setActiveTab('firebase')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'firebase'
              ? 'bg-amber-600 text-white shadow'
              : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <Cloud className="w-4 h-4" />
          Firebase Console & Hosting
        </button>
      </div>

      {/* TAB CONTENT: ARTIFACTS */}
      {activeTab === 'artifacts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bebas text-2xl text-zinc-900 font-bold">
              Manage Museum Artifacts
            </h3>
            <button
              onClick={handleAddArtifact}
              className="flex items-center gap-1.5 bg-black text-white hover:bg-zinc-800 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add New Artifact
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artifacts.map((art) => (
              <div
                key={art.id}
                className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-3">
                    <input
                      type="text"
                      value={art.title}
                      onChange={(e) => handleUpdateArtifactField(art.id, 'title', e.target.value)}
                      className="font-bebas text-2xl text-black font-bold bg-transparent border-b border-dashed border-zinc-400 focus:outline-none focus:border-black flex-1"
                      placeholder="Artifact Title"
                    />
                    <button
                      onClick={() => handleDeleteArtifact(art.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded cursor-pointer"
                      title="Delete Artifact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                      Assigned Category
                    </label>
                    <select
                      value={art.categoryId}
                      onChange={(e) => handleUpdateArtifactField(art.id, 'categoryId', e.target.value)}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 rounded border border-zinc-300 bg-white text-zinc-800"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                      Description Text
                    </label>
                    <textarea
                      value={art.description}
                      onChange={(e) => handleUpdateArtifactField(art.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full text-xs p-2 rounded border border-zinc-300 bg-white text-zinc-800 font-normal leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={art.notes}
                      onChange={(e) => handleUpdateArtifactField(art.id, 'notes', e.target.value)}
                      rows={2}
                      className="w-full text-xs p-2 rounded border border-zinc-300 bg-white text-zinc-800 font-normal"
                    />
                  </div>

                  {/* Image with Local Device Storage Upload - uncropped flexible wrapping */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                      Artifact Image (URL or Local Device Upload)
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => triggerUpload('artifact', art.id)}
                        className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold px-3 py-1.5 rounded cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload from Device Local Storage
                      </button>
                    </div>

                    <div className="w-full h-44 rounded-lg overflow-hidden border border-zinc-300 bg-zinc-900/5 p-2 flex items-center justify-center">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    </div>
                  </div>

                  {/* Video URL */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                      Video Embed / Link URL
                    </label>
                    <input
                      type="text"
                      value={art.videoUrl}
                      onChange={(e) => handleUpdateArtifactField(art.id, 'videoUrl', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-zinc-300 bg-white text-zinc-800 font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: QUESTIONS (ORGANIZED STRICTLY PER TOPIC / CATEGORY) */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bebas text-2xl text-zinc-900 font-bold">
                Manage Quiz Questions Per Topic
              </h3>
              <p className="text-xs text-zinc-500">
                Questions are strictly isolated to their corresponding category. Select a topic below to manage its questions.
              </p>
            </div>

            <button
              onClick={() => handleAddQuestionToCategory(selectedQuestionCategory)}
              className="flex items-center gap-1.5 bg-black text-white hover:bg-zinc-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Question to {activeQuestionCategoryObj?.name || 'Topic'}
            </button>
          </div>

          {/* Topic / Category Filter Buttons Bar */}
          <div className="bg-zinc-100 p-2 sm:p-3 rounded-xl border border-zinc-200">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2 px-1">
              Select Category To View / Create Questions:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const count = questions.filter((q) => q.categoryId === cat.id).length;
                const isSelected = selectedQuestionCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedQuestionCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-black text-white shadow-md'
                        : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-300'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                        isSelected
                          ? 'bg-zinc-700 text-white'
                          : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Questions Grid for Selected Topic */}
          {questionsInActiveCategory.length === 0 ? (
            <div className="p-8 text-center bg-zinc-50 rounded-2xl border border-zinc-200">
              <HelpCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <h4 className="font-bold text-zinc-800 text-sm">
                No questions created for {activeQuestionCategoryObj?.name} yet.
              </h4>
              <p className="text-xs text-zinc-500 mt-1 mb-4">
                Questions are placed only in their chosen category and won't appear randomly in other topics.
              </p>
              <button
                onClick={() => handleAddQuestionToCategory(selectedQuestionCategory)}
                className="bg-black text-white text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Create First Question for {activeQuestionCategoryObj?.name}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questionsInActiveCategory.map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                        Topic: {activeQuestionCategoryObj?.name}
                      </span>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                        Move to another Topic:
                      </label>
                      <select
                        value={q.categoryId}
                        onChange={(e) => handleUpdateQuestionCategory(q.id, e.target.value)}
                        className="w-full text-xs font-semibold px-2.5 py-1.5 rounded border border-zinc-300 bg-white text-zinc-800"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                        Question Prompt
                      </label>
                      <textarea
                        value={q.questionText}
                        onChange={(e) => handleUpdateQuestionText(q.id, e.target.value)}
                        rows={2}
                        className="w-full text-sm font-semibold p-2 rounded border border-zinc-300 bg-white text-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                        Choices (Select radio button for Correct Answer):
                      </label>
                      <div className="space-y-2">
                        {q.choices.map((choice) => (
                          <div key={choice.id} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={choice.id === q.correctChoiceId}
                              onChange={() => handleSetCorrectChoice(q.id, choice.id)}
                              className="w-4 h-4 text-emerald-600 cursor-pointer"
                              title="Mark as correct choice"
                            />
                            <span className="font-bold text-xs text-zinc-700 w-5">
                              {choice.letter}.
                            </span>
                            <input
                              type="text"
                              value={choice.text}
                              onChange={(e) => handleUpdateChoiceText(q.id, choice.id, e.target.value)}
                              className={`flex-1 text-xs p-1.5 rounded border ${
                                choice.id === q.correctChoiceId
                                  ? 'border-emerald-500 bg-emerald-50/50 font-bold text-emerald-900'
                                  : 'border-zinc-300 bg-white text-zinc-800'
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                        Explanation Feedback
                      </label>
                      <textarea
                        value={q.explanation}
                        onChange={(e) => {
                          onUpdateQuestions(
                            questions.map((item) =>
                              item.id === q.id ? { ...item, explanation: e.target.value } : item
                            )
                          );
                        }}
                        rows={2}
                        className="w-full text-xs p-2 rounded border border-zinc-300 bg-white text-zinc-800"
                      />
                    </div>

                    {/* Reference Image for this Question */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                        Reference Image (Non-cropped)
                      </label>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => triggerUpload('question', q.id)}
                          className="flex items-center gap-1.5 bg-zinc-800 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded cursor-pointer transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload Custom Image from Device
                        </button>
                        {q.imageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateQuestions(
                                questions.map((item) =>
                                  item.id === q.id ? { ...item, imageUrl: undefined } : item
                                )
                              );
                              showToast('Reset question to default artifact image');
                            }}
                            className="text-xs text-red-600 hover:underline cursor-pointer"
                          >
                            Reset to Artifact Image
                          </button>
                        )}
                      </div>
                      {(q.imageUrl || artifacts.find((a) => a.id === q.artifactId)?.imageUrl) && (
                        <div className="w-full h-28 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-950/5 p-2 flex items-center justify-center">
                          <img
                            src={q.imageUrl || artifacts.find((a) => a.id === q.artifactId)?.imageUrl}
                            alt="Reference"
                            className="max-h-full max-w-full object-contain rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: TOPICS / CATEGORIES */}
      {activeTab === 'topics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bebas text-2xl text-zinc-900 font-bold">
              Manage Topics & Categories
            </h3>
            <button
              onClick={handleAddCategory}
              className="flex items-center gap-1.5 bg-black text-white hover:bg-zinc-800 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Topic
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-3">
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => handleUpdateCategoryField(cat.id, 'name', e.target.value)}
                      className="font-bebas text-2xl text-black font-bold bg-transparent border-b border-dashed border-zinc-400 focus:outline-none focus:border-black flex-1"
                      placeholder="Category Name"
                    />
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded cursor-pointer"
                      title="Delete Topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                      Summary (Home Card)
                    </label>
                    <textarea
                      value={cat.summary}
                      onChange={(e) => handleUpdateCategoryField(cat.id, 'summary', e.target.value)}
                      rows={2}
                      className="w-full text-xs p-2 rounded border border-zinc-300 bg-white text-zinc-800 font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                      Full Archive Description (Category Page)
                    </label>
                    <textarea
                      value={cat.fullDescription}
                      onChange={(e) => handleUpdateCategoryField(cat.id, 'fullDescription', e.target.value)}
                      rows={4}
                      className="w-full text-xs p-2 rounded border border-zinc-300 bg-white text-zinc-800 font-normal leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={cat.accentColor || '#06B6D4'}
                        onChange={(e) => handleUpdateCategoryField(cat.id, 'accentColor', e.target.value)}
                        className="w-8 h-8 rounded border border-zinc-300 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-zinc-600">{cat.accentColor || '#06B6D4'}</span>
                    </div>
                  </div>

                  {/* Category Banner Graphic (Replace reference illustration) */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                      Banner Illustration / Image (Default: Rolling Hills Vector)
                    </label>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => triggerUpload('category', cat.id)}
                        className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold px-3 py-1.5 rounded cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload Custom Banner Image
                      </button>
                      {cat.bannerImageUrl && (
                        <button
                          type="button"
                          onClick={() => handleUpdateCategoryField(cat.id, 'bannerImageUrl', '')}
                          className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded bg-red-50 hover:bg-red-100 cursor-pointer"
                        >
                          Reset to Vector Illustration
                        </button>
                      )}
                    </div>

                    {cat.bannerImageUrl && (
                      <div className="w-full h-32 rounded-lg overflow-hidden border border-zinc-300 bg-zinc-900/5 p-1 flex items-center justify-center">
                        <img
                          src={cat.bannerImageUrl}
                          alt={cat.name}
                          className="max-w-full max-h-full object-contain rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HERO SLIDERS */}
      {activeTab === 'slides' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bebas text-2xl text-zinc-900 font-bold">
              Manage Hero Sliders
            </h3>
            <button
              onClick={handleAddSlide}
              className="flex items-center gap-1.5 bg-black text-white hover:bg-zinc-800 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Slide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Slide {idx + 1}
                    </span>
                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded cursor-pointer"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                        Highlighted Word
                      </label>
                      <input
                        type="text"
                        value={slide.titleHighlight}
                        onChange={(e) => handleUpdateSlideField(slide.id, 'titleHighlight', e.target.value)}
                        className="w-full text-sm font-bold p-2 rounded border border-zinc-300 bg-white text-zinc-900"
                        placeholder="e.g. TITLE"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                        Suffix Word
                      </label>
                      <input
                        type="text"
                        value={slide.titleSuffix}
                        onChange={(e) => handleUpdateSlideField(slide.id, 'titleSuffix', e.target.value)}
                        className="w-full text-sm font-bold p-2 rounded border border-zinc-300 bg-white text-zinc-900"
                        placeholder="e.g. artifacts"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={slide.subtitle || ''}
                      onChange={(e) => handleUpdateSlideField(slide.id, 'subtitle', e.target.value)}
                      className="w-full text-xs p-2 rounded border border-zinc-300 bg-white text-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                      Theme Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={slide.color || '#EAB308'}
                        onChange={(e) => handleUpdateSlideField(slide.id, 'color', e.target.value)}
                        className="w-8 h-8 rounded border border-zinc-300 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-zinc-600">{slide.color || '#EAB308'}</span>
                    </div>
                  </div>

                  {/* Local Device Storage Image Upload - background preview */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                      Slide Background Image
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => triggerUpload('slide', slide.id)}
                        className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold px-3 py-1.5 rounded cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload Background Image from Device
                      </button>
                    </div>

                    {slide.imageUrl && (
                      <div className="w-full h-36 rounded-lg overflow-hidden border border-zinc-300 bg-zinc-900/5 p-1 relative flex items-center justify-center">
                        <img
                          src={slide.imageUrl}
                          alt="Hero slide background"
                          className="w-full h-full object-cover rounded"
                        />
                        <span className="absolute bottom-1 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                          Background Image
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ABOUT & CULTURAL TIMELINE */}
      {activeTab === 'about' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="border-b border-zinc-200 pb-4">
            <h3 className="font-bebas text-3xl text-zinc-900 font-bold">
              Manage About Page & Cultural Timeline
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Customize the museum narrative and modify the milestones of The 2000–2010 Cultural Timeline.
            </p>
          </div>

          {/* 1. About Narrative Paragraphs */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h4 className="font-bebas text-xl text-black font-bold tracking-wide flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-600" />
              Museum About Paragraphs
            </h4>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-600 mb-1">
                Paragraph 1 (Decade Introduction)
              </label>
              <textarea
                value={aboutContent.paragraph1}
                onChange={(e) => handleUpdateAboutText('paragraph1', e.target.value)}
                rows={3}
                className="w-full text-sm p-3 rounded-lg border border-zinc-300 bg-white text-zinc-900 leading-relaxed font-normal focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="First paragraph of the museum narrative..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-zinc-600 mb-1">
                Paragraph 2 (Museum Exploration Guide)
              </label>
              <textarea
                value={aboutContent.paragraph2}
                onChange={(e) => handleUpdateAboutText('paragraph2', e.target.value)}
                rows={3}
                className="w-full text-sm p-3 rounded-lg border border-zinc-300 bg-white text-zinc-900 leading-relaxed font-normal focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Second paragraph describing the digital experience..."
              />
            </div>
          </div>

          {/* 2. Cultural Timeline Section */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
              <div>
                <h4 className="font-bebas text-xl text-black font-bold tracking-wide">
                  The 2000–2010 Cultural Timeline Milestones
                </h4>
                <p className="text-xs text-zinc-500">
                  Add, rearrange, or edit the defining Philippine cultural moments of the decade.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddMilestone}
                className="flex items-center gap-1.5 bg-black text-white hover:bg-zinc-800 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Add Milestone
              </button>
            </div>

            {/* Timeline Title Editor */}
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-600 mb-1">
                Timeline Header Title
              </label>
              <input
                type="text"
                value={aboutContent.timelineTitle}
                onChange={(e) => handleUpdateAboutText('timelineTitle', e.target.value)}
                className="w-full text-base font-bold p-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="e.g. The 2000–2010 Cultural Timeline"
              />
            </div>

            {/* Milestones List */}
            <div className="space-y-4 pt-2">
              {aboutContent.milestones.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="p-4 rounded-xl border border-zinc-200 bg-white shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bebas text-lg text-black font-bold">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={m.year}
                        onChange={(e) => handleUpdateMilestone(m.id, 'year', e.target.value)}
                        placeholder="Year (e.g. 2000)"
                        className="font-bebas text-xl text-zinc-900 font-extrabold w-24 px-2 py-0.5 rounded border border-zinc-300 bg-zinc-50"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveMilestone(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-zinc-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveMilestone(idx, 'down')}
                        disabled={idx === aboutContent.milestones.length - 1}
                        className="p-1.5 text-zinc-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMilestone(m.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer ml-1"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">
                      Milestone Title
                    </label>
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => handleUpdateMilestone(m.id, 'title', e.target.value)}
                      placeholder="Milestone Title"
                      className="w-full text-sm font-bold p-2 rounded border border-zinc-300 bg-white text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-500 mb-1">
                      Historical Description
                    </label>
                    <textarea
                      value={m.desc}
                      onChange={(e) => handleUpdateMilestone(m.id, 'desc', e.target.value)}
                      rows={2}
                      placeholder="Brief historical description..."
                      className="w-full text-xs p-2 rounded border border-zinc-300 bg-white text-zinc-800 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FIREBASE CONSOLE & HOSTING */}
      {activeTab === 'firebase' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Description */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bebas text-3xl text-zinc-900 tracking-wide">
                    Firebase Console & Cloud Hosting
                  </h3>
                  <p className="text-sm text-zinc-600 mt-0.5">
                    Live connection to Google Cloud Firestore database & Firebase Hosting for the Philippine Ports Authority Digital Museum.
                  </p>
                </div>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleTestCloudConnection}
                  disabled={isTestingConn}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-50 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingConn ? 'animate-spin' : ''}`} />
                  {isTestingConn ? 'Testing...' : 'Test Connection'}
                </button>

                <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-zinc-200 text-xs font-semibold shadow-sm">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      connectionStatus === 'connected'
                        ? 'bg-emerald-500'
                        : connectionStatus === 'error'
                        ? 'bg-red-500'
                        : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-zinc-700 capitalize">
                    {connectionStatus === 'connected'
                      ? 'Cloud Connected'
                      : connectionStatus === 'error'
                      ? 'Offline'
                      : 'Active Project'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Launch Cards */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4">
              Direct Firebase Console Launchpad
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Main Firebase Console */}
              <a
                href={FIREBASE_CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl border border-zinc-200 bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-amber-600 transition-colors" />
                  </div>
                  <h5 className="font-bold text-zinc-900 group-hover:text-amber-600 text-base">
                    Firebase Project Overview
                  </h5>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Access project settings, service accounts, and Google Cloud telemetry.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>ID: {FIREBASE_PROJECT_ID}</span>
                  <span className="text-amber-600 font-semibold group-hover:underline">Open Console &rarr;</span>
                </div>
              </a>

              {/* Card 2: Cloud Firestore */}
              <a
                href={FIREBASE_FIRESTORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl border border-zinc-200 bg-white hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Database className="w-5 h-5" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-orange-600 transition-colors" />
                  </div>
                  <h5 className="font-bold text-zinc-900 group-hover:text-orange-600 text-base">
                    Cloud Firestore Database
                  </h5>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Inspect, search, and edit live museum documents (artifacts, questions, slides).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono truncate">
                  <span className="truncate max-w-[160px]">DB: {FIRESTORE_DATABASE_ID}</span>
                  <span className="text-orange-600 font-semibold group-hover:underline shrink-0">Open DB &rarr;</span>
                </div>
              </a>

              {/* Card 3: Firebase Hosting */}
              <a
                href={FIREBASE_HOSTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl border border-zinc-200 bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Globe className="w-5 h-5" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h5 className="font-bold text-zinc-900 group-hover:text-blue-600 text-base">
                    Firebase Hosting Dashboard
                  </h5>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    View active release versions, domains, rollbacks, and SSL certificates.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>handy-envoy-b9v0l.web.app</span>
                  <span className="text-blue-600 font-semibold group-hover:underline">Open Hosting &rarr;</span>
                </div>
              </a>

              {/* Card 4: Firebase Authentication */}
              <a
                href={FIREBASE_AUTH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl border border-zinc-200 bg-white hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <h5 className="font-bold text-zinc-900 group-hover:text-emerald-600 text-base">
                    Authentication Console
                  </h5>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Manage museum admin users, login providers, and authentication logs.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Firebase Auth</span>
                  <span className="text-emerald-600 font-semibold group-hover:underline">Open Auth &rarr;</span>
                </div>
              </a>

              {/* Card 5: Security Rules */}
              <a
                href={FIREBASE_RULES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl border border-zinc-200 bg-white hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <h5 className="font-bold text-zinc-900 group-hover:text-purple-600 text-base">
                    Firestore Security Rules
                  </h5>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    View and audit deployed Firestore access rules and role security policies.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Deployed Rules</span>
                  <span className="text-purple-600 font-semibold group-hover:underline">Open Rules &rarr;</span>
                </div>
              </a>

              {/* Card 6: Live Production Link */}
              <a
                href={`https://${FIREBASE_PROJECT_ID}.web.app`}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl border border-zinc-200 bg-white hover:border-cyan-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Server className="w-5 h-5" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-cyan-600 transition-colors" />
                  </div>
                  <h5 className="font-bold text-zinc-900 group-hover:text-cyan-600 text-base">
                    Live Hosted App URL
                  </h5>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Preview your published production web app deployed to Google Cloud CDN.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>web.app CDN</span>
                  <span className="text-cyan-600 font-semibold group-hover:underline">Visit Site &rarr;</span>
                </div>
              </a>
            </div>
          </div>

          {/* Cloud Synchronization Hub */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/70">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-zinc-200 gap-4">
              <div>
                <h4 className="font-bebas text-2xl text-zinc-900 tracking-wide flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-600" />
                  Cloud Data Synchronization Hub
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                  Synchronize all current topics, artifacts, quiz questions, hero slides, and timeline milestones to Google Cloud Firestore.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handlePullFromFirestore}
                  disabled={isSyncingCloud}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                  Pull from Cloud Firestore
                </button>

                <button
                  type="button"
                  onClick={handlePushAllToFirestore}
                  disabled={isSyncingCloud}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <Upload className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-bounce' : ''}`} />
                  Push Local Archive to Cloud
                </button>
              </div>
            </div>

            {/* Current Sync Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
              <div className="p-3.5 rounded-xl bg-white border border-zinc-200 text-center">
                <div className="text-2xl font-bebas font-bold text-zinc-900">{artifacts.length}</div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight">Artifacts</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-zinc-200 text-center">
                <div className="text-2xl font-bebas font-bold text-zinc-900">{categories.length}</div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight">Categories</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-zinc-200 text-center">
                <div className="text-2xl font-bebas font-bold text-zinc-900">{questions.length}</div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight">Quiz Q&amp;As</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-zinc-200 text-center">
                <div className="text-2xl font-bebas font-bold text-zinc-900">{slides.length}</div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight">Hero Slides</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-zinc-200 text-center col-span-2 sm:col-span-1">
                <div className="text-2xl font-bebas font-bold text-zinc-900">{aboutContent.milestones.length}</div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight">Milestones</div>
              </div>
            </div>
          </div>

          {/* Firebase Hosting Deployment Guide for VS Code */}
          <div className="p-6 rounded-2xl border border-zinc-200 bg-white">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bebas text-2xl text-zinc-900 tracking-wide">
                  Deploying to Firebase Hosting via VS Code / Terminal
                </h4>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                  Your project is preconfigured with <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-800">firebase.json</code> pointing to the <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-800">dist</code> production folder.
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>npm run build &amp;&amp; npx firebase deploy --only hosting</span>
                <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-1 rounded">Single Command Deploy</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="font-bold text-zinc-900 mb-1 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Production Hosting Domains
                  </div>
                  <ul className="space-y-1 text-zinc-600 font-mono text-[11px]">
                    <li>• https://handy-envoy-b9v0l.web.app</li>
                    <li>• https://handy-envoy-b9v0l.firebaseapp.com</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                  <div className="font-bold text-zinc-900 mb-1 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Preconfigured Settings
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    Single Page App (SPA) rewrites to index.html and Firestore security rules are enabled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
