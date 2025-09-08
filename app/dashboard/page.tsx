"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Download,
  Eye,
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { INDUSTRY_VERTICALS } from '@/lib/verticals';

interface Analysis {
  id: number;
  vertical_id: string;
  primary_dataset_name: string;
  analysis_result: string;
  recommendations: string[];
  solution: string;
  metadata: any;
  created_at: string;
}

export default function Dashboard() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<string>('all');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('/api/analysis');
      const data = await response.json();
      if (data.success) {
        setAnalyses(data.data);
      }
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVerticalInfo = (verticalId: string) => {
    return INDUSTRY_VERTICALS.find(v => v.id === verticalId);
  };

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.primary_dataset_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVertical = selectedVertical === 'all' || analysis.vertical_id === selectedVertical;
    return matchesSearch && matchesVertical;
  });

  const downloadAnalysis = (analysis: Analysis) => {
    const vertical = getVerticalInfo(analysis.vertical_id);
    const content = `Data Djinn Analysis Report
==============================
Industry: ${vertical?.name}
Dataset: ${analysis.primary_dataset_name}
Date: ${new Date(analysis.created_at).toLocaleString()}

Analysis:
${analysis.analysis_result}

Recommendations:
${analysis.recommendations.join('\n')}

Solution:
${analysis.solution}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${analysis.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Analysis Dashboard
          </h1>
          <p className="text-muted-foreground">View and manage your data analysis history</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Analyses</p>
                    <p className="text-3xl font-bold">{analyses.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Industries</p>
                    <p className="text-3xl font-bold">
                      {new Set(analyses.map(a => a.vertical_id)).size}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500/10 to-green-600/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-3xl font-bold">
                      {analyses.filter(a => {
                        const date = new Date(a.created_at);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return date > weekAgo;
                      }).length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500/10 to-orange-600/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Solutions</p>
                    <p className="text-3xl font-bold">
                      {analyses.filter(a => a.solution).length}
                    </p>
                  </div>
                  <History className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 flex gap-4 flex-wrap"
        >
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={selectedVertical}
              onChange={(e) => setSelectedVertical(e.target.value)}
              className="px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Industries</option>
              {INDUSTRY_VERTICALS.map(vertical => (
                <option key={vertical.id} value={vertical.id}>
                  {vertical.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Analyses List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"
              />
              <p className="mt-4 text-muted-foreground">Loading analyses...</p>
            </div>
          ) : filteredAnalyses.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12 text-center">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl font-semibold mb-2">No analyses found</p>
                <p className="text-muted-foreground">
                  {searchTerm || selectedVertical !== 'all' 
                    ? "Try adjusting your filters" 
                    : "Start by uploading and analyzing your first dataset"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAnalyses.map((analysis, index) => {
              const vertical = getVerticalInfo(analysis.vertical_id);
              return (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{vertical?.icon}</span>
                            <div>
                              <h3 className="text-lg font-semibold">{analysis.primary_dataset_name}</h3>
                              <p className="text-sm text-muted-foreground">{vertical?.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(analysis.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {analysis.recommendations?.length || 0} recommendations
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {analysis.analysis_result?.substring(0, 200)}...
                          </p>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadAnalysis(analysis)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}