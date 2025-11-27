export interface BambuSetting {
  name: string;
  value: string;
  reason: string;
}

export interface SettingCategory {
  categoryName: string;
  settings: BambuSetting[];
}

export interface AnalysisResult {
  isFailedPrint: boolean;
  modelName: string;
  materialSuggestion: string;
  summary: string;
  categories: SettingCategory[];
  warnings: string[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface AppSettings {
  temperature: number;
  modelDisplay: string;
}