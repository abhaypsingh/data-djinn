"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle, Sparkles, FileCode, FileSpreadsheet, FileJson } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import { parseFile } from '@/lib/file-parser';
import { useToast } from '@/components/ui/use-toast';

const fileIcons: { [key: string]: React.ReactNode } = {
  csv: <FileSpreadsheet className="w-8 h-8" />,
  xlsx: <FileSpreadsheet className="w-8 h-8" />,
  xls: <FileSpreadsheet className="w-8 h-8" />,
  json: <FileJson className="w-8 h-8" />,
  txt: <FileCode className="w-8 h-8" />,
};

export function FileUploadEnhanced() {
  const { setPrimaryDataset, setStep, setProcessing } = useAppStore();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    setProcessing(true);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const parsedData = await parseFile(file);
      setUploadProgress(100);
      
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
        title: "✨ File uploaded successfully",
        description: `Loaded ${parsedData.rowCount.toLocaleString()} rows from ${file.name}`,
      });

      setTimeout(() => {
        setStep('vertical');
      }, 500);
    } catch (error) {
      toast({
        title: "Error parsing file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setProcessing(false);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  }, [setPrimaryDataset, setStep, setProcessing, toast]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
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

  const fileExt = acceptedFiles[0]?.name.split('.').pop()?.toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
          className="inline-block mb-6"
        >
          <div className="relative">
            <Sparkles className="w-16 h-16 text-primary" />
            <motion.div
              className="absolute inset-0 w-16 h-16"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-16 h-16 text-primary/20" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          Welcome to Data Djinn
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground"
        >
          Transform your data into industry-specific insights with AI magic ✨
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-background via-background to-primary/5">
          <CardContent className="p-0">
            <div
              {...getRootProps()}
              className={`
                relative overflow-hidden rounded-lg p-16 text-center cursor-pointer
                transition-all duration-300 ease-in-out
                ${isDragActive 
                  ? 'bg-primary/10 scale-[1.02]' 
                  : 'hover:bg-muted/50 hover:scale-[1.01]'
                }
              `}
            >
              <input {...getInputProps()} />
              
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>

              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative z-10"
                  >
                    <div className="flex flex-col items-center gap-4">
                      {fileExt && fileIcons[fileExt] ? (
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="text-primary"
                        >
                          {fileIcons[fileExt]}
                        </motion.div>
                      ) : (
                        <FileText className="w-8 h-8 text-primary" />
                      )}
                      
                      <div className="w-64">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Processing...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                      
                      {uploadProgress === 100 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ) : isDragActive ? (
                  <motion.div
                    key="dragactive"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative z-10"
                  >
                    <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-2xl font-semibold text-primary">Drop it like it's hot! 🔥</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      className="mb-6"
                    >
                      <Upload className="w-16 h-16 text-muted-foreground mx-auto" />
                    </motion.div>
                    <div>
                      <p className="text-2xl font-semibold mb-2">
                        Drop your data file here
                      </p>
                      <p className="text-muted-foreground mb-6">
                        or click to browse your files
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        {Object.entries(fileIcons).map(([ext, icon]) => (
                          <motion.div
                            key={ext}
                            whileHover={{ scale: 1.1 }}
                            className="flex flex-col items-center gap-1 text-muted-foreground"
                          >
                            {icon}
                            <span className="text-xs uppercase">{ext}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-8 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">🔒 100% Private & Secure</p>
                  <p className="text-sm text-muted-foreground">
                    Your data never leaves your device. All AI processing happens locally using WebLLM technology.
                  </p>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}