"use client";

import React, { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle, Sparkles, FileCode, FileSpreadsheet, FileJson, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export function FileUploadMobile() {
  const { setPrimaryDataset, setStep, setProcessing } = useAppStore();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setSelectedFile(file);
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
        setSelectedFile(null);
      }, 1000);
    }
  }, [setPrimaryDataset, setStep, setProcessing, toast]);

  // Handle file selection from input
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  // Detect if iOS
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const fileExt = selectedFile?.name.split('.').pop()?.toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      <div className="text-center mb-8 md:mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
          className="inline-block mb-4 md:mb-6"
        >
          <div className="relative">
            <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-primary" />
            <motion.div
              className="absolute inset-0 w-12 h-12 md:w-16 md:h-16"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-primary/20" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          Welcome to Data Djinn
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground"
        >
          Transform your data into insights ✨
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-background via-background to-primary/5">
          <CardContent className="p-0">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".csv,.xlsx,.xls,.json,.txt"
              className="hidden"
              aria-label="File upload"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative overflow-hidden rounded-lg p-8 md:p-16 text-center cursor-pointer
                transition-all duration-300 ease-in-out
                ${isDragOver 
                  ? 'bg-primary/10 scale-[1.02]' 
                  : 'hover:bg-muted/50 hover:scale-[1.01]'
                }
              `}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
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
                      
                      <div className="w-full max-w-xs">
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
                ) : isDragOver ? (
                  <motion.div
                    key="dragactive"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative z-10"
                  >
                    <Upload className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto mb-4" />
                    <p className="text-xl md:text-2xl font-semibold text-primary">Drop your file here!</p>
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
                      className="mb-4 md:mb-6"
                    >
                      <Upload className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto" />
                    </motion.div>
                    
                    {isIOS && (
                      <div className="mb-4 p-2 bg-primary/10 rounded-lg inline-flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary">Tap to select file</span>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xl md:text-2xl font-semibold mb-2">
                        {isIOS ? 'Tap to select your file' : 'Drop your data file here'}
                      </p>
                      <p className="text-muted-foreground mb-4 md:mb-6">
                        or click to browse
                      </p>
                      
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="mb-4 md:mb-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Select File
                      </Button>
                      
                      <div className="flex items-center justify-center gap-3 md:gap-4">
                        {Object.entries(fileIcons).map(([ext, icon]) => (
                          <motion.div
                            key={ext}
                            whileHover={{ scale: 1.1 }}
                            className="flex flex-col items-center gap-1 text-muted-foreground"
                          >
                            <div className="scale-75 md:scale-100">{icon}</div>
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
              className="p-6 md:p-8 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-500/10 flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">🔒 100% Private & Secure</p>
                  <p className="text-sm text-muted-foreground">
                    Your data never leaves your device. All AI processing happens locally.
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