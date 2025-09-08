"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { initializeWebLLM, analyzeData } from '@/lib/webllm-client';
import { ChevronLeft, Loader2, Sparkles, Database, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function DataAnalysis() {
  const {
    primaryDataset,
    selectedVertical,
    setStep,
    setAnalysisResult,
    setRecommendations,
    setLLMInitialized,
    setLLMLoadingProgress,
    llmInitialized,
    llmLoadingProgress,
    analysisResults,
  } = useAppStore();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [suggestedDatasets, setSuggestedDatasets] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!llmInitialized) {
      initializeLLM();
    } else if (primaryDataset && !analysisResults.has(primaryDataset.id)) {
      performAnalysis();
    }
  }, [llmInitialized]);

  const initializeLLM = async () => {
    try {
      await initializeWebLLM((report) => {
        const progress = report.progress || 0;
        setLLMLoadingProgress(Math.round(progress * 100));
      });
      setLLMInitialized(true);
      toast({
        title: "AI Model Ready",
        description: "The local AI model has been loaded successfully",
      });
      if (primaryDataset) {
        performAnalysis();
      }
    } catch (error) {
      toast({
        title: "Error loading AI model",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const performAnalysis = async () => {
    if (!primaryDataset || !selectedVertical) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeData(
        primaryDataset.preview,
        selectedVertical.name,
        selectedVertical.description
      );
      
      setAnalysis(result);
      setAnalysisResult(primaryDataset.id, result);
      
      const datasets = extractSuggestedDatasets(result);
      setSuggestedDatasets(datasets);
      setRecommendations(datasets);
      
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractSuggestedDatasets = (analysisText: string): string[] => {
    const suggestions: string[] = [];
    const lines = analysisText.split('\n');
    let inSuggestionsSection = false;
    
    for (const line of lines) {
      if (line.toLowerCase().includes('additional dataset') || 
          line.toLowerCase().includes('combine with')) {
        inSuggestionsSection = true;
      }
      if (inSuggestionsSection && line.trim().startsWith('-')) {
        suggestions.push(line.trim().substring(1).trim());
      }
    }
    
    if (suggestions.length === 0) {
      suggestions.push('Customer demographic data');
      suggestions.push('Historical performance metrics');
      suggestions.push('Market trend data');
    }
    
    return suggestions;
  };

  const proceedToRecommendations = () => {
    setStep('recommend');
  };

  if (!llmInitialized) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Loading AI Model</CardTitle>
            <CardDescription>
              Downloading and initializing the local AI model...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading model... {llmLoadingProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${llmLoadingProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This may take a few minutes on first load. The model runs entirely on your device.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => setStep('vertical')}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Industry Selection
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Data Analysis</h1>
        <p className="text-muted-foreground">
          AI-powered analysis of your data for {selectedVertical?.name}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Dataset Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">File:</span> {primaryDataset?.name}</p>
              <p><span className="font-medium">Format:</span> {primaryDataset?.data.format}</p>
              <p><span className="font-medium">Rows:</span> {primaryDataset?.data.rowCount}</p>
              <p><span className="font-medium">Columns:</span> {primaryDataset?.data.columnCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Analysis
            </CardTitle>
            <CardDescription>
              Insights and recommendations for {selectedVertical?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="flex items-center gap-3 py-8">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing your data...</span>
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans">{analysis}</pre>
                </div>
              </div>
            ) : (
              <Button onClick={performAnalysis}>
                Start Analysis
              </Button>
            )}
          </CardContent>
        </Card>

        {suggestedDatasets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Suggested Additional Datasets
              </CardTitle>
              <CardDescription>
                Combining these datasets could enhance your analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {suggestedDatasets.map((dataset, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{dataset}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6"
                onClick={proceedToRecommendations}
                disabled={!analysis}
              >
                Continue to Add Datasets
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}