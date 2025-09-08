"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { INDUSTRY_VERTICALS } from '@/lib/verticals';
import { useAppStore } from '@/store/app-store';
import { ChevronLeft, Search } from 'lucide-react';

export function VerticalSelector() {
  const { setSelectedVertical, setStep, primaryDataset } = useAppStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredVerticals = INDUSTRY_VERTICALS.filter(vertical =>
    vertical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vertical.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectVertical = (vertical: typeof INDUSTRY_VERTICALS[0]) => {
    setSelectedVertical(vertical);
    setStep('analysis');
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => setStep('upload')}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Select Your Industry</h1>
        <p className="text-muted-foreground">
          Choose the industry vertical that best matches your use case
        </p>
        
        {primaryDataset && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Analyzing:</span> {primaryDataset.name}
            </p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search industries..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVerticals.map((vertical) => (
          <Card
            key={vertical.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-primary"
            onClick={() => handleSelectVertical(vertical)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{vertical.icon}</span>
                <span className="text-lg">{vertical.name}</span>
              </CardTitle>
              <CardDescription>{vertical.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Common Use Cases:</p>
                  <div className="flex flex-wrap gap-1">
                    {vertical.useCases.slice(0, 2).map((useCase, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-secondary rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVerticals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No industries found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}