"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, History, Home } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { useAppStore } from '@/store/app-store';
import Link from 'next/link';

export function Navigation() {
  const { currentStep } = useAppStore();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="relative"
            >
              <Sparkles className="h-8 w-8 text-primary" />
              <div className="absolute inset-0 blur-xl bg-primary/20 group-hover:bg-primary/30 transition-colors" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Data Djinn
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentStep === 'upload' 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-muted'
              }`}
            >
              <Home className="h-4 w-4 inline mr-2" />
              Home
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-lg transition-colors hover:bg-muted"
            >
              <History className="h-4 w-4 inline mr-2" />
              History
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-muted-foreground">100% Local AI</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}