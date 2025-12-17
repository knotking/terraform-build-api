export enum AppMode {
  GENERATE = 'GENERATE',
  EDIT = 'EDIT',
  ANALYZE = 'ANALYZE',
  HISTORY = 'HISTORY'
}

export interface GenerationResult {
  id: string;
  type: AppMode;
  input: string; // The prompt or the source code
  output: string; // The generated response
  timestamp: number;
  model: string;
}

export interface AnalysisConfig {
  security: boolean;
  cost: boolean;
  bestPractices: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
