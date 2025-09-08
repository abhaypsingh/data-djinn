"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { ChevronLeft, Plus, Trash2, FileText, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { parseFile } from '@/lib/file-parser';
import { useToast } from '@/components/ui/use-toast';

export function DatasetRecommendations() {
  const {
    recommendations,
    additionalDatasets,
    addAdditionalDataset,
    removeAdditionalDataset,
    setStep,
    selectedVertical,
  } = useAppStore();
  
  const [uploadedDatasets, setUploadedDatasets] = useState<Map<string, File>>(new Map());
  const { toast } = useToast();

  const onDrop = async (acceptedFiles: File[], recommendation?: string) => {
    for (const file of acceptedFiles) {
      try {
        const parsedData = await parseFile(file);
        const dataset = {
          id: `dataset-${Date.now()}-${Math.random()}`,
          name: file.name,
          description: recommendation || `Additional dataset: ${parsedData.format} file`,
          data: parsedData,
          preview: parsedData.preview,
          type: 'additional' as const,
          uploadedAt: new Date(),
        };
        
        addAdditionalDataset(dataset);
        setUploadedDatasets(prev => new Map(prev).set(recommendation || file.name, file));
        
        toast({
          title: "Dataset added",
          description: `${file.name} has been added to your analysis`,
        });
      } catch (error) {
        toast({
          title: "Error adding dataset",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => onDrop(files),
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
    },
  });

  const proceedToSolution = () => {
    if (additionalDatasets.length === 0) {
      toast({
        title: "No additional datasets",
        description: "Please add at least one additional dataset to generate solutions",
        variant: "destructive",
      });
      return;
    }
    setStep('solution');
  };

  const skipToSolution = () => {
    setStep('solution');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => setStep('analysis')}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Analysis
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Additional Datasets</h1>
        <p className="text-muted-foreground">
          Add the recommended datasets to enhance your {selectedVertical?.name} analysis
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommended Datasets</CardTitle>
            <CardDescription>
              Based on your data analysis, these additional datasets would be valuable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => {
                const isUploaded = Array.from(uploadedDatasets.keys()).some(key => 
                  key.includes(rec) || rec.includes(key)
                );
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isUploaded ? 'bg-green-50 border-green-200' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        {isUploaded ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium">{rec}</p>
                          {isUploaded && (
                            <p className="text-sm text-green-600 mt-1">Dataset uploaded</p>
                          )}
                        </div>
                      </div>
                      {!isUploaded && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.csv,.xlsx,.xls,.json,.txt';
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement).files;
                              if (files) onDrop(Array.from(files), rec);
                            };
                            input.click();
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Additional Datasets</CardTitle>
            <CardDescription>
              You can also upload any other relevant datasets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <input {...getInputProps()} />
              <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop files here, or click to select
              </p>
            </div>
          </CardContent>
        </Card>

        {additionalDatasets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Datasets ({additionalDatasets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {additionalDatasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{dataset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dataset.data.rowCount} rows, {dataset.data.columnCount} columns
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAdditionalDataset(dataset.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button
            onClick={proceedToSolution}
            disabled={additionalDatasets.length === 0}
            className="flex-1"
          >
            Generate Solution ({additionalDatasets.length} datasets)
          </Button>
          <Button
            onClick={skipToSolution}
            variant="outline"
          >
            Skip & Generate with Primary Data Only
          </Button>
        </div>
      </div>
    </div>
  );
}