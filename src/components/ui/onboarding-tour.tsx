import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="header"]',
    title: 'Welcome to AI Builder Pro!',
    content: 'Let us show you around your new AI-powered development platform.',
    position: 'bottom'
  },
  {
    target: '[data-tour="navigation"]',
    title: 'Navigation',
    content: 'Access all features from the main navigation menu.',
    position: 'bottom'
  },
  {
    target: '[data-tour="ai-builder"]',
    title: 'AI Builder',
    content: 'Create applications using AI by describing what you want to build.',
    position: 'top'
  },
  {
    target: '[data-tour="dashboard"]',
    title: 'Dashboard',
    content: 'Monitor your projects and manage your account from the dashboard.',
    position: 'top'
  }
];

export function OnboardingTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('onboarding-completed');
    if (!hasSeenTour) {
      setTimeout(() => setIsActive(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    localStorage.setItem('onboarding-completed', 'true');
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isActive) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      
      {/* Tour card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{currentTourStep.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {currentTourStep.content}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {currentStep + 1} of {tourSteps.length}
              </span>
              
              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                )}
                
                <Button size="sm" onClick={handleNext}>
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep < tourSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 ml-1" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}