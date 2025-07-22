import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cloud } from 'lucide-react';
import DeploymentModal from './DeploymentModal';

interface DeploymentButtonProps {
  projectData?: any;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const DeploymentButton: React.FC<DeploymentButtonProps> = ({ 
  projectData, 
  variant = "default", 
  size = "default",
  className = "" 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        className={`${className} ${variant === "default" ? "gradient-primary" : ""}`}
        onClick={() => setIsModalOpen(true)}
      >
        <Cloud className="h-4 w-4 mr-2" />
        Deploy
      </Button>
      
      <DeploymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectData={projectData}
      />
    </>
  );
};

export default DeploymentButton;