import type { RiskLevel, DrawType, FormatType, Field, Answer, Profile, MicroField } from './';
/**
 * Стандартный ответ от API
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

/**
 * Структура ошибки от API
 */
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

/**
 * Колбэк для отслеживания прогресса загрузки
 */
export interface UploadProgressEvent {
  loaded: number;
  total?: number;
  progress: number; // 0-100
}

export interface Lottery {
  id: string;
  name: string;
  minPrice: number;
  risk: RiskLevel;
  drawType: DrawType;
  format: FormatType;
  description: string;
  features: string[];
}

export interface StepConfig {
  field: Field;
  title: string;
  options: { value: Answer; label: string }[];
}

export interface ChatBubbleProps {
  role: 'assistant' | 'system' | 'user';
  children: React.ReactNode;
}

export interface ProfileWizardProps {
  onComplete: (profile: Profile) => void;
  onCancel: () => void;
}

export interface MicroAnswers {
  pricePriority: 'economy' | 'balance' | 'dontcare' | null;
  riskFeeling: 'avoid' | 'neutral' | 'seek' | null;
  playRhythm: 'often' | 'sometimes' | 'rare' | null;
}

export interface MicroStep {
  field: MicroField;
  title: string;
  options: { value: MicroAnswers[MicroField]; label: string }[];
}

export interface RefineWizardProps {
  lotteries: Lottery[];
  profile: Profile;
  onComplete: (finalLottery: Lottery) => void;
}

export interface ResultsBlockProps {
  profile: Profile | null;
  bestLotteries: Lottery[];
  onGoRefine: () => void;
}
export interface QuickRecommendationsProps {
  hasStartedQuestionnaire: boolean;
  setHasStartedQuestionnaire: (hasStartedQuestionnaire: boolean) => void;
}

export interface FinalBlockProps {
  profile: Profile;
  finalLottery: Lottery;
  setProfile: (profile: Profile | null) => void;
  setBestLottery: (lotteries: Lottery[]) => void;
  setFinalLottery: (lottery: Lottery | null) => void;
  setHasStartedQuestionnaire: (hasStarted: boolean) => void;
  setIsLoadingResults: (isLoading: boolean) => void;
  setHasResults: (hasResults: boolean) => void;
  setHasRefine: (hasRefine: boolean) => void;
  setHasFinal: (hasFinal: boolean) => void;
  setIsLoadingFinal: (isLoading: boolean) => void;
}
export interface LayoutProps {
  children: React.ReactNode;
}
