import React from 'react';
import { VisualToCode as VisualToCodeComponent } from '@/components/ai/VisualToCode';
import { toast } from 'sonner';

const VisualToCode = () => {
  const handleCodeGenerated = (code: string, framework: string) => {
    toast.success(`Generated ${framework} code successfully!`);
    // In a real app, this could save to a project or workspace
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Visual to Code
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform screenshots and designs into production-ready code using advanced AI vision technology
          </p>
        </div>
        
        <VisualToCodeComponent onCodeGenerated={handleCodeGenerated} />
      </div>
    </div>
  );
};

export default VisualToCode;