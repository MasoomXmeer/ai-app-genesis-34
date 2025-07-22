
import { ProjectContextManager, UserPreferences } from '@/services/cache/ProjectContextManager';
import { GenerationOptions } from '@/services/ai/types';

export interface PromptTemplate {
  id: string;
  name: string;
  version: string;
  category: 'system' | 'user' | 'context' | 'tool-specific';
  template: string;
  variables: string[];
  conditions: PromptCondition[];
  metadata: {
    createdBy: string;
    createdAt: string;
    lastModified: string;
    usage: number;
    effectiveness: number;
  };
}

export interface PromptCondition {
  variable: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'exists';
  value: any;
}

export interface PromptContext {
  projectName: string;
  currentFiles: string[];
  userPreferences: UserPreferences;
  conversationContext: string;
  codeStructure: any;
  userIntent: string;
  framework: string;
  projectType: string;
  complexity: string;
  activeTools: string[];
}

export class DynamicPromptEngine {
  private static instance: DynamicPromptEngine;
  private contextManager: ProjectContextManager;
  private templates: Map<string, PromptTemplate> = new Map();

  static getInstance(): DynamicPromptEngine {
    if (!DynamicPromptEngine.instance) {
      DynamicPromptEngine.instance = new DynamicPromptEngine();
    }
    return DynamicPromptEngine.instance;
  }

  constructor() {
    this.contextManager = ProjectContextManager.getInstance();
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates() {
    const templates: PromptTemplate[] = [
      {
        id: 'unified-system',
        name: 'Unified AI Builder System Prompt',
        version: '1.0',
        category: 'system',
        template: `You are an advanced AI Builder assistant with persistent project memory and unified tool integration.

CURRENT PROJECT CONTEXT:
- Project: {project_name}
- Framework: {framework} 
- Project Type: {project_type}
- Active Tools: {active_tools}
- User Intent: {user_intent}

EXISTING CODE STRUCTURE:
{code_structure_summary}

USER PREFERENCES:
- Naming: {naming_conventions}
- Patterns: {coding_patterns}
- State Management: {state_management}

CONVERSATION CONTEXT:
{conversation_context}

TOOL INTEGRATION COMMANDS:
- /debug: Switch to Smart Debugger mode
- /optimize: Activate Code Optimizer  
- /generate: Use Multi-File Generator
- /analyze: Analyze current codebase
- /refactor: Refactor existing code

MEMORY SYSTEM:
You have persistent memory of this project through hidden cache files. You remember:
- All previously generated code and its structure
- User preferences and patterns
- Previous conversations and decisions  
- Common errors and their solutions
- Applied optimizations and their impact

CRITICAL INSTRUCTIONS:
1. Maintain consistency with existing codebase
2. Follow established naming conventions and patterns
3. Reference previous decisions and explanations
4. Suggest relevant tool switches based on context
5. Proactively prevent known error patterns
6. Apply learned optimizations automatically
7. Never lose context of the overall project vision

When generating code:
- Check existing structure to avoid conflicts
- Follow user's established patterns
- Include necessary imports and dependencies
- Ensure new code integrates seamlessly
- Apply previous optimization learnings`,
        variables: [
          'project_name', 'framework', 'project_type', 'active_tools', 'user_intent',
          'code_structure_summary', 'naming_conventions', 'coding_patterns', 
          'state_management', 'conversation_context'
        ],
        conditions: [],
        metadata: {
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          usage: 0,
          effectiveness: 0
        }
      },
      {
        id: 'context-recovery',
        name: 'Context Recovery Prompt',
        version: '1.0',
        category: 'system',
        template: `CONTEXT RECOVERY MODE ACTIVATED

I am restoring my memory of your project from cached context files:

{context_summary}

I remember our previous work on {project_name} and will continue from where we left off.
I have full awareness of the existing codebase structure and our conversation history.

How can I help you continue with your project?`,
        variables: ['context_summary', 'project_name'],
        conditions: [{ variable: 'context_recovery', operator: 'equals', value: true }],
        metadata: {
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          usage: 0,
          effectiveness: 0
        }
      },
      {
        id: 'debug-mode',
        name: 'Smart Debugger Integration',
        version: '1.0',
        category: 'tool-specific',
        template: `SMART DEBUGGER MODE ACTIVATED

I'm now analyzing your code for issues with enhanced context awareness.

Current codebase structure: {code_structure_summary}
Known error patterns: {error_patterns}
Previous fixes applied: {previous_fixes}

I will:
1. Check against known error patterns from your project history
2. Apply fixes consistent with your coding style
3. Suggest optimizations based on previous learnings
4. Update the project's error knowledge base

What specific issue would you like me to debug?`,
        variables: ['code_structure_summary', 'error_patterns', 'previous_fixes'],
        conditions: [{ variable: 'active_tool', operator: 'equals', value: 'debug' }],
        metadata: {
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          usage: 0,
          effectiveness: 0
        }
      },
      {
        id: 'optimization-mode',
        name: 'Code Optimizer Integration',
        version: '1.0',
        category: 'tool-specific',
        template: `CODE OPTIMIZER MODE ACTIVATED

Analyzing your codebase for performance improvements with project history awareness.

Current performance profile: {performance_history}
Previously applied optimizations: {applied_optimizations}
User preferences: {optimization_preferences}

I will:
1. Avoid suggesting previously applied optimizations
2. Focus on high-impact improvements based on your patterns
3. Consider your performance priorities and constraints
4. Update optimization history with new improvements

What aspect of performance would you like me to optimize?`,
        variables: ['performance_history', 'applied_optimizations', 'optimization_preferences'],
        conditions: [{ variable: 'active_tool', operator: 'equals', value: 'optimize' }],
        metadata: {
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          usage: 0,
          effectiveness: 0
        }
      },
      {
        id: 'multi-file-mode',
        name: 'Multi-File Generator Integration',
        version: '1.0',
        category: 'tool-specific',
        template: `MULTI-FILE GENERATOR MODE ACTIVATED

Generating comprehensive project structure with full context awareness.

Existing project structure: {existing_structure}
Established patterns: {coding_patterns}
Architecture decisions: {architecture_decisions}
Dependencies: {current_dependencies}

I will:
1. Extend existing structure without breaking changes
2. Follow established architectural patterns
3. Maintain consistency with current dependencies
4. Apply learned naming and organization conventions
5. Generate comprehensive, production-ready files

What type of multi-file structure would you like me to generate?`,
        variables: ['existing_structure', 'coding_patterns', 'architecture_decisions', 'current_dependencies'],
        conditions: [{ variable: 'active_tool', operator: 'equals', value: 'generate' }],
        metadata: {
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          usage: 0,
          effectiveness: 0
        }
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  async generatePrompt(templateId: string, context?: Partial<PromptContext>): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const fullContext = await this.buildPromptContext(context);
    
    // Check conditions
    if (!this.evaluateConditions(template.conditions, fullContext)) {
      return '';
    }

    let prompt = template.template;

    // Replace variables
    template.variables.forEach(variable => {
      const value = this.getContextValue(fullContext, variable);
      prompt = prompt.replace(new RegExp(`{${variable}}`, 'g'), String(value || ''));
    });

    // Update usage statistics
    template.metadata.usage++;
    this.templates.set(templateId, template);

    return prompt;
  }

  private async buildPromptContext(context?: Partial<PromptContext>): Promise<PromptContext> {
    const projectState = await this.contextManager.getProjectState();
    const codeStructure = await this.contextManager.getCodeStructure();
    const userPreferences = await this.contextManager.getUserPreferences();
    const conversationMemory = await this.contextManager.getConversationMemory();
    const contextSummary = await this.contextManager.getAIContextSummary();

    return {
      projectName: context?.projectName || projectState.projectId,
      currentFiles: context?.currentFiles || projectState.activeContext.currentFiles,
      userPreferences: context?.userPreferences || userPreferences,
      conversationContext: context?.conversationContext || conversationMemory.context,
      codeStructure,
      userIntent: context?.userIntent || projectState.aiMemory.userIntent,
      framework: context?.framework || 'react',
      projectType: context?.projectType || 'web-app',
      complexity: context?.complexity || 'medium',
      activeTools: context?.activeTools || [],
      ...context
    };
  }

  private getContextValue(context: PromptContext, variable: string): any {
    switch (variable) {
      case 'project_name':
        return context.projectName;
      case 'framework':
        return context.framework;
      case 'project_type':
        return context.projectType;
      case 'active_tools':
        return context.activeTools.join(', ');
      case 'user_intent':
        return context.userIntent;
      case 'code_structure_summary':
        return this.createCodeStructureSummary(context.codeStructure);
      case 'naming_conventions':
        return `${context.userPreferences.namingConventions.functions} functions, ${context.userPreferences.namingConventions.components} components`;
      case 'coding_patterns':
        return context.userPreferences.codingPatterns.preferredStateManagement;
      case 'state_management':
        return context.userPreferences.codingPatterns.preferredStateManagement;
      case 'conversation_context':
        return context.conversationContext;
      case 'context_summary':
        return context.conversationContext;
      default:
        return '';
    }
  }

  private createCodeStructureSummary(structure: any): string {
    const componentCount = Object.keys(structure.components || {}).length;
    const functionCount = Object.keys(structure.functions || {}).length;
    const fileCount = Object.keys(structure.imports || {}).length;

    return `${componentCount} components, ${functionCount} functions across ${fileCount} files`;
  }

  private evaluateConditions(conditions: PromptCondition[], context: PromptContext): boolean {
    return conditions.every(condition => {
      const value = this.getContextValue(context, condition.variable);
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'contains':
          return String(value).includes(String(condition.value));
        case 'exists':
          return value != null && value !== '';
        case 'greater':
          return Number(value) > Number(condition.value);
        case 'less':
          return Number(value) < Number(condition.value);
        default:
          return true;
      }
    });
  }

  // Admin methods for template management
  addTemplate(template: Omit<PromptTemplate, 'metadata'>): void {
    const fullTemplate: PromptTemplate = {
      ...template,
      metadata: {
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        usage: 0,
        effectiveness: 0
      }
    };
    this.templates.set(template.id, fullTemplate);
  }

  updateTemplate(id: string, updates: Partial<PromptTemplate>): void {
    const existing = this.templates.get(id);
    if (existing) {
      const updated = {
        ...existing,
        ...updates,
        metadata: {
          ...existing.metadata,
          lastModified: new Date().toISOString()
        }
      };
      this.templates.set(id, updated);
    }
  }

  deleteTemplate(id: string): void {
    this.templates.delete(id);
  }

  getAllTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  recordTemplateEffectiveness(templateId: string, rating: number): void {
    const template = this.templates.get(templateId);
    if (template) {
      // Simple moving average for effectiveness
      template.metadata.effectiveness = 
        (template.metadata.effectiveness * template.metadata.usage + rating) / 
        (template.metadata.usage + 1);
      this.templates.set(templateId, template);
    }
  }
}
