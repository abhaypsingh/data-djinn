"use client";

import { useAppStore } from '@/store/app-store';
import { FileUploadMobile } from '@/components/FileUploadMobile';
import { VerticalSelector } from '@/components/VerticalSelector';
import { DataAnalysis } from '@/components/DataAnalysis';
import { DatasetRecommendations } from '@/components/DatasetRecommendations';
import { SolutionGenerator } from '@/components/SolutionGenerator';

export default function Home() {
  const { currentStep } = useAppStore();

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="container mx-auto">
        {currentStep === 'upload' && <FileUploadMobile />}
        {currentStep === 'vertical' && <VerticalSelector />}
        {currentStep === 'analysis' && <DataAnalysis />}
        {currentStep === 'recommend' && <DatasetRecommendations />}
        {currentStep === 'solution' && <SolutionGenerator />}
      </div>
    </main>
  );
}