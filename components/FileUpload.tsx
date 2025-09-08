"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { parseFile } from '@/lib/file-parser';
import { useToast } from '@/components/ui/use-toast';

export function FileUpload() {
  const { setPrimaryDataset, setStep, setProcessing } = useAppStore();
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setProcessing(true);

    try {
      const parsedData = await parseFile(file);
      
      setPrimaryDataset({
        id: `dataset-${Date.now()}`,
        name: file.name,
        description: `${parsedData.format} file with ${parsedData.rowCount} rows and ${parsedData.columnCount} columns`,
        data: parsedData,
        preview: parsedData.preview,
        type: 'primary',
        uploadedAt: new Date(),
      });

      toast({
        title: "File uploaded successfully",
        description: `Loaded ${parsedData.rowCount} rows from ${file.name}`,
      });

      setStep('vertical');
    } catch (error) {
      toast({
        title: "Error parsing file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }, [setPrimaryDataset, setStep, setProcessing, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Data Djinn</h1>
        <p className="text-lg text-muted-foreground">
          Transform your data into industry-specific insights with AI
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
              transition-colors duration-200 ease-in-out
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center gap-4">
              {isDragActive ? (
                <>
                  <Upload className="w-12 h-12 text-primary animate-pulse" />
                  <p className="text-lg font-medium">Drop your file here</p>
                </>
              ) : (
                <>
                  <FileText className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium mb-2">
                      Drag & drop your data file here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: CSV, Excel, JSON, TXT
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Privacy First</p>
                <p>Your data is processed entirely on your device using WebLLM. No data is sent to external servers.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}