import { create } from 'zustand';
import { Vertical } from '@/lib/verticals';

export interface Dataset {
  id: string;
  name: string;
  description: string;
  data: any;
  preview: string;
  type: 'primary' | 'additional';
  uploadedAt: Date;
  analysisResult?: string;
}

export interface AppState {
  currentStep: 'upload' | 'vertical' | 'analysis' | 'recommend' | 'solution';
  selectedVertical: Vertical | null;
  primaryDataset: Dataset | null;
  additionalDatasets: Dataset[];
  analysisResults: Map<string, string>;
  recommendations: string[];
  solution: string | null;
  isProcessing: boolean;
  llmInitialized: boolean;
  llmLoadingProgress: number;
  
  setStep: (step: AppState['currentStep']) => void;
  setSelectedVertical: (vertical: Vertical) => void;
  setPrimaryDataset: (dataset: Dataset) => void;
  addAdditionalDataset: (dataset: Dataset) => void;
  removeAdditionalDataset: (id: string) => void;
  setAnalysisResult: (datasetId: string, result: string) => void;
  setRecommendations: (recommendations: string[]) => void;
  setSolution: (solution: string) => void;
  setProcessing: (isProcessing: boolean) => void;
  setLLMInitialized: (initialized: boolean) => void;
  setLLMLoadingProgress: (progress: number) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentStep: 'upload',
  selectedVertical: null,
  primaryDataset: null,
  additionalDatasets: [],
  analysisResults: new Map(),
  recommendations: [],
  solution: null,
  isProcessing: false,
  llmInitialized: false,
  llmLoadingProgress: 0,

  setStep: (step) => set({ currentStep: step }),
  
  setSelectedVertical: (vertical) => set({ selectedVertical: vertical }),
  
  setPrimaryDataset: (dataset) => set({ primaryDataset: dataset }),
  
  addAdditionalDataset: (dataset) => 
    set((state) => ({ 
      additionalDatasets: [...state.additionalDatasets, dataset] 
    })),
  
  removeAdditionalDataset: (id) =>
    set((state) => ({
      additionalDatasets: state.additionalDatasets.filter(d => d.id !== id)
    })),
  
  setAnalysisResult: (datasetId, result) =>
    set((state) => {
      const newResults = new Map(state.analysisResults);
      newResults.set(datasetId, result);
      return { analysisResults: newResults };
    }),
  
  setRecommendations: (recommendations) => set({ recommendations }),
  
  setSolution: (solution) => set({ solution }),
  
  setProcessing: (isProcessing) => set({ isProcessing }),
  
  setLLMInitialized: (initialized) => set({ llmInitialized: initialized }),
  
  setLLMLoadingProgress: (progress) => set({ llmLoadingProgress: progress }),
  
  reset: () => set({
    currentStep: 'upload',
    selectedVertical: null,
    primaryDataset: null,
    additionalDatasets: [],
    analysisResults: new Map(),
    recommendations: [],
    solution: null,
    isProcessing: false,
    llmLoadingProgress: 0,
  }),
}));