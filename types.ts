
export interface LayoutSettings {
  // Cores
  colorBackground: string;
  colorText: string;
  colorTitle: string;
  colorCard: string;
  colorCardText: string;
  colorCardAccent: string;
  
  // Tipografia e Estilo
  fontStyle: 'classic' | 'modern' | 'minimal';
  fontTitle: 'playfair' | 'inter' | 'syne' | 'montserrat' | 'caveat' | 'cormorant' | 'jetbrains';
  fontBody: 'playfair' | 'inter' | 'syne' | 'montserrat' | 'caveat' | 'cormorant' | 'jetbrains';
  baseFontSize: number;
  
  showDays: boolean;
  showArchitecture: boolean;
  showCover: boolean;
  showFooter: boolean;
  
  // Branding e Personalização
  backgroundPattern: string;
  watermarkImage?: string;
  watermarkOpacity?: number;
  watermarkGrayscale?: boolean;
  designerSignature?: string;
  socialMediaSignature?: string;
  agencySignature?: string;
  companyName?: string;
  
  showObservation?: boolean;
  
  // Densidade
  contentDensity: 'compact' | 'elegant' | 'spacious';
  
  // Nomenclatura das Sessões
  sessionLabelType: 'sessao' | 'dia' | 'post' | 'sequencia' | 'aula' | 'modulo';

  // Presets
  preset?: string;
}

export interface SavedProject {
  id: string;
  timestamp: number;
  doc: EditorialDocument;
  settings: LayoutSettings;
}

export interface EditorialDocument {
  title: string;
  subtitle: string;
  positionPhrase: string;
  architecture: {
    feeling: string;
    pain: string;
    authority: string;
  };
  sessions: SessionPlan[];
  observation: string;
}

export interface CarouselSlide {
  slideNumber: number;
  visualDescription: string;
  imageSuggestion: string;
  textOnCard: string;
}

export interface ReelsScene {
  sceneNumber: number;
  visualAction: string;
  audioSpeech: string;
  transition?: string;
  audioSuggestion?: string;
}

export interface ReelsScript {
  hook: string;
  scenes: ReelsScene[];
  cta: string;
}

export interface SessionPlan {
  session: string;
  format: string;
  theme: string;
  strategicIntent: string;
  creativeDirection: string;
  carouselSlides?: CarouselSlide[];
  reelsScript?: ReelsScript;
  staticPostInfo?: {
    visualComposition: string;
    imageSuggestion: string;
    headlineOnCard: string;
  };
  visualElements: {
    cards?: string;
    reels?: string;
    stories?: string;
  };
  caption: string;
  viewerPsychology: string;
  approachStrategy: string;
  storySuggestions: string[];
  executionNotes?: string;
}

