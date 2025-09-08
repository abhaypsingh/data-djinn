"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { generateSolution } from '@/lib/webllm-client';
import { ChevronLeft, Loader2, Lightbulb, Download, RefreshCw, Home } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function SolutionGenerator() {
  const {
    primaryDataset,
    additionalDatasets,
    selectedVertical,
    solution,
    setSolution,
    setStep,
    reset,
    analysisId,
    sessionId,
  } = useAppStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [problemStatement, setProblemStatement] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (selectedVertical) {
      setProblemStatement(
        `Optimize ${selectedVertical.name.toLowerCase()} operations using data-driven insights`
      );
    }
  }, [selectedVertical]);

  const generateSolutionHandler = async () => {
    if (!primaryDataset || !selectedVertical) return;
    
    setIsGenerating(true);
    try {
      const additionalDatasetDescriptions = additionalDatasets.map(
        d => `${d.name}: ${d.description}`
      );
      
      const generatedSolution = await generateSolution(
        primaryDataset.description,
        additionalDatasetDescriptions,
        selectedVertical.name,
        problemStatement
      );
      
      setSolution(generatedSolution);
      
      // Update existing analysis or create new one
      try {
        if (analysisId) {
          // Update existing analysis with solution
          const updateResponse = await fetch(`/api/analysis/${analysisId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              solution: generatedSolution,
              metadata: {
                problemStatement,
                datasetsCount: additionalDatasets.length + 1,
                vertical: selectedVertical.name,
                sessionId,
              }
            }),
          });
          
          if (updateResponse.ok) {
            toast({
              title: "✅ Solution saved",
              description: "Your analysis has been updated with the solution",
            });
          }
          
          // Save additional datasets
          for (const dataset of additionalDatasets) {
            await fetch('/api/dataset', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                analysisId,
                name: dataset.name,
                type: 'additional',
                format: dataset.data.format,
                rowCount: dataset.data.rowCount,
                columnCount: dataset.data.columnCount,
                preview: dataset.preview.substring(0, 1000),
              }),
            });
          }
        } else {
          // Create new analysis if no ID exists
          const analysisData = {
            verticalId: selectedVertical.id,
            primaryDatasetName: primaryDataset.name,
            analysisResult: primaryDataset.analysisResult || '',
            recommendations: additionalDatasetDescriptions,
            solution: generatedSolution,
            metadata: {
              problemStatement,
              datasetsCount: additionalDatasets.length + 1,
              vertical: selectedVertical.name,
              sessionId,
            }
          };
          
          const saveResponse = await fetch('/api/analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(analysisData),
          });
          
          if (saveResponse.ok) {
            toast({
              title: "✅ Solution saved",
              description: "Your analysis has been saved to the dashboard",
            });
          }
        }
        
        // Update session
        if (sessionId) {
          await fetch('/api/session', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              step: 'solution',
              metadata: { solutionGenerated: true }
            }),
          });
        }
      } catch (saveError) {
        console.error('Error saving analysis:', saveError);
      }
      
      toast({
        title: "Solution generated",
        description: "Your comprehensive solution has been created",
      });
    } catch (error) {
      toast({
        title: "Error generating solution",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSolution = () => {
    if (!solution) return;
    
    const content = `Data Djinn Solution Report
==============================
Industry: ${selectedVertical?.name}
Generated: ${new Date().toLocaleString()}

Primary Dataset: ${primaryDataset?.name}
${primaryDataset?.description}

Additional Datasets:
${additionalDatasets.map(d => `- ${d.name}: ${d.description}`).join('\n')}

Problem Statement:
${problemStatement}

Solution:
${solution}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-djinn-solution-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startNew = () => {
    reset();
    setStep('upload');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => setStep('recommend')}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Datasets
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Solution Generation</h1>
        <p className="text-muted-foreground">
          AI-powered solution for {selectedVertical?.name}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Problem Statement</CardTitle>
            <CardDescription>
              Define the specific problem you want to solve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="Describe the problem you want to solve..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-medium mb-1">Primary Dataset:</p>
                <p className="text-sm text-muted-foreground">
                  {primaryDataset?.name} - {primaryDataset?.description}
                </p>
              </div>
              {additionalDatasets.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Additional Datasets ({additionalDatasets.length}):</p>
                  <ul className="space-y-1">
                    {additionalDatasets.map((dataset) => (
                      <li key={dataset.id} className="text-sm text-muted-foreground">
                        • {dataset.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Generated Solution
            </CardTitle>
            <CardDescription>
              Comprehensive solution for your {selectedVertical?.name} use case
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center gap-3 py-8">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating comprehensive solution...</span>
              </div>
            ) : solution ? (
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans bg-muted/50 p-4 rounded-lg">
                    {solution}
                  </pre>
                </div>
                <div className="flex gap-3">
                  <Button onClick={downloadSolution}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Solution
                  </Button>
                  <Button variant="outline" onClick={generateSolutionHandler}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={generateSolutionHandler}
                disabled={!problemStatement}
                size="lg"
              >
                Generate Solution
              </Button>
            )}
          </CardContent>
        </Card>

        {solution && (
          <div className="flex justify-center">
            <Button onClick={startNew} variant="outline" size="lg">
              <Home className="w-4 h-4 mr-2" />
              Start New Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}