export interface Slide {
  id: string;
  titleHighlight: string;
  titleSuffix: string;
  subtitle?: string;
  imageUrl?: string;
  color?: string; // e.g. '#EAB308', '#06B6D4', '#EF4444'
}

export interface Category {
  id: string;
  name: string;
  summary: string;
  fullDescription: string;
  accentColor?: string;
  bannerImageUrl?: string;
}

export interface ArtifactVideo {
  id: string;
  url: string;
  title?: string;
}

export interface Artifact {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  notes: string;
  imageUrl: string;
  videoUrl: string;
  videoTitle?: string;
  videos?: ArtifactVideo[];
}

export interface QuizChoice {
  id: string;
  letter: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  categoryId: string;
  artifactId?: string;
  imageUrl?: string;
  questionText: string;
  choices: QuizChoice[];
  correctChoiceId: string;
  explanation: string;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  desc: string;
}

export interface AboutContent {
  paragraph1: string;
  paragraph2: string;
  timelineTitle: string;
  milestones: TimelineMilestone[];
}

export type ViewMode = 'home' | 'category' | 'artifacts' | 'questions' | 'about' | 'admin';
