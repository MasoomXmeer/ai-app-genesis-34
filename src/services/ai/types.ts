
export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'groq';
  capabilities: ModelCapability[];
  maxTokens: number;
  costPerToken: number;
  speed: 'fast' | 'medium' | 'slow';
  complexity: 'simple' | 'medium' | 'complex';
}

export interface ModelCapability {
  type: 'code-generation' | 'code-review' | 'architecture' | 'debugging' | 'optimization';
  frameworks: string[];
  languages: string[];
}

export interface GenerationOptions {
  framework: string;
  projectType: string;
  complexity: ProjectComplexity;
  features: string[];
  streaming?: boolean;
  temperature?: number;
  maxTokens?: number;
}

export interface ProjectComplexity {
  level: 'simple' | 'medium' | 'complex' | 'enterprise';
  estimatedLines: number;
  frameworks: string[];
  integrations: string[];
}

export interface StreamingResponse {
  id: string;
  modelUsed: string;
  content: string;
  progress: number;
  stage: string;
  estimatedCompletion: number;
  isComplete: boolean;
  error?: string;
}

export interface CodeGenerationRequest {
  prompt: string;
  options: GenerationOptions;
  userId?: string;
  projectId?: string;
}

export interface CodeGenerationResult {
  code: string;
  files: GeneratedFile[];
  documentation: string;
  tests?: string;
  metadata: GenerationMetadata;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'component' | 'hook' | 'service' | 'config' | 'test';
  language: string;
}

export interface GenerationMetadata {
  modelUsed: string;
  tokensUsed: number;
  generationTime: number;
  complexity: string;
  frameworks: string[];
  estimatedQuality: number;
}
