import { GeneratedFile } from '@/services/ai/types';

export interface ProjectState {
  projectId: string;
  lastAIInteraction: string;
  codebaseFingerprint: string;
  activeContext: {
    currentFiles: string[];
    activeComponents: string[];
    pendingTasks: string[];
    generationQueue: string[];
  };
  aiMemory: {
    conversationSummary: string;
    keyDecisions: string[];
    codingPatterns: string[];
    userIntent: string;
  };
}

export interface CodeStructure {
  functions: { [name: string]: { params: string[], returnType: string, file: string } };
  variables: { [name: string]: { type: string, scope: string, file: string } };
  components: { [name: string]: { props: string[], file: string, dependencies: string[] } };
  imports: { [file: string]: string[] };
  exports: { [file: string]: string[] };
}

export interface ConversationMemory {
  messages: { role: string, content: string, timestamp: string }[];
  context: string;
  tokenCount: number;
  lastCompression: string;
}

export interface GenerationHistory {
  attempts: {
    id: string;
    timestamp: string;
    prompt: string;
    result: string;
    success: boolean;
    framework: string;
    projectType: string;
  }[];
}

export interface UserPreferences {
  namingConventions: {
    functions: string; // camelCase, snake_case, etc.
    variables: string;
    components: string;
    files: string;
  };
  codingPatterns: {
    preferredStateManagement: string;
    componentStructure: string;
    errorHandling: string;
    styling: string;
  };
  frameworkPreferences: {
    react: { hooks: boolean, typescript: boolean, stateManagement: string };
    laravel: { version: string, patterns: string[] };
  };
}

export interface ErrorPatterns {
  commonErrors: {
    pattern: string;
    frequency: number;
    fixes: string[];
    lastOccurrence: string;
  }[];
  preventionRules: {
    rule: string;
    description: string;
    active: boolean;
  }[];
}

export interface OptimizationMap {
  performanceIssues: {
    issue: string;
    frequency: number;
    impact: 'high' | 'medium' | 'low';
    solutions: string[];
  }[];
  appliedOptimizations: {
    optimization: string;
    timestamp: string;
    impact: string;
    codeLocation: string;
  }[];
}

export class ProjectContextManager {
  private static instance: ProjectContextManager;
  private cache: Map<string, any> = new Map();
  private projectId: string;

  static getInstance(): ProjectContextManager {
    if (!ProjectContextManager.instance) {
      ProjectContextManager.instance = new ProjectContextManager();
    }
    return ProjectContextManager.instance;
  }

  setProjectId(projectId: string) {
    this.projectId = projectId;
  }

  private getStorageKey(filename: string): string {
    return `ai-context-${this.projectId}-${filename}`;
  }

  private async readCache<T>(filename: string, defaultValue: T): Promise<T> {
    const key = this.getStorageKey(filename);
    try {
      const cached = this.cache.get(key);
      if (cached) return cached;

      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cache.set(key, parsed);
        return parsed;
      }
    } catch (error) {
      console.warn(`Failed to read cache for ${filename}:`, error);
    }
    return defaultValue;
  }

  private async writeCache<T>(filename: string, data: T): Promise<void> {
    const key = this.getStorageKey(filename);
    try {
      this.cache.set(key, data);
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to write cache for ${filename}:`, error);
    }
  }

  async getProjectState(): Promise<ProjectState> {
    return this.readCache('project-state', {
      projectId: this.projectId,
      lastAIInteraction: new Date().toISOString(),
      codebaseFingerprint: '',
      activeContext: {
        currentFiles: [],
        activeComponents: [],
        pendingTasks: [],
        generationQueue: []
      },
      aiMemory: {
        conversationSummary: '',
        keyDecisions: [],
        codingPatterns: [],
        userIntent: ''
      }
    });
  }

  async updateProjectState(updates: Partial<ProjectState>): Promise<void> {
    const current = await this.getProjectState();
    const updated = { ...current, ...updates, lastAIInteraction: new Date().toISOString() };
    await this.writeCache('project-state', updated);
  }

  async getCodeStructure(): Promise<CodeStructure> {
    return this.readCache('code-structure', {
      functions: {},
      variables: {},
      components: {},
      imports: {},
      exports: {}
    });
  }

  async updateCodeStructure(files: GeneratedFile[]): Promise<void> {
    const structure = await this.getCodeStructure();
    
    // Parse files and extract structure information
    files.forEach(file => {
      // This would use a proper AST parser in production
      const content = file.content;
      
      // Extract function signatures
      const functionMatches = content.match(/(?:function|const|let|var)\s+(\w+)/g);
      if (functionMatches) {
        functionMatches.forEach(match => {
          const funcName = match.split(/\s+/).pop() || '';
          if (funcName && !structure.functions[funcName]) {
            structure.functions[funcName] = {
              params: [],
              returnType: 'unknown',
              file: file.path
            };
          }
        });
      }

      // Extract React components
      const componentMatches = content.match(/(?:const|function)\s+([A-Z]\w+)/g);
      if (componentMatches) {
        componentMatches.forEach(match => {
          const compName = match.split(/\s+/).pop() || '';
          if (compName && !structure.components[compName]) {
            structure.components[compName] = {
              props: [],
              file: file.path,
              dependencies: []
            };
          }
        });
      }

      // Extract imports
      const importMatches = content.match(/import\s+.*\s+from\s+['"`]([^'"`]+)['"`]/g);
      if (importMatches) {
        structure.imports[file.path] = importMatches.map(imp => 
          imp.match(/from\s+['"`]([^'"`]+)['"`]/)?.[1] || ''
        ).filter(Boolean);
      }
    });

    await this.writeCache('code-structure', structure);
  }

  async getConversationMemory(): Promise<ConversationMemory> {
    return this.readCache('conversation-memory', {
      messages: [],
      context: '',
      tokenCount: 0,
      lastCompression: ''
    });
  }

  async addConversationMessage(role: string, content: string): Promise<void> {
    const memory = await this.getConversationMemory();
    memory.messages.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });
    
    // Estimate token count (rough approximation)
    memory.tokenCount = memory.messages.reduce((count, msg) => 
      count + Math.ceil(msg.content.length / 4), 0
    );

    // Compress if approaching limits
    if (memory.tokenCount > 15000) {
      await this.compressConversationMemory(memory);
    }

    await this.writeCache('conversation-memory', memory);
  }

  private async compressConversationMemory(memory: ConversationMemory): Promise<void> {
    // Keep recent messages and create summary of older ones
    const recentMessages = memory.messages.slice(-10);
    const olderMessages = memory.messages.slice(0, -10);
    
    const summary = this.createConversationSummary(olderMessages);
    
    memory.messages = recentMessages;
    memory.context = summary;
    memory.tokenCount = recentMessages.reduce((count, msg) => 
      count + Math.ceil(msg.content.length / 4), 0
    );
    memory.lastCompression = new Date().toISOString();
  }

  private createConversationSummary(messages: any[]): string {
    // Extract key information from conversation
    const keyTopics = new Set<string>();
    const codeBlocks: string[] = [];
    const decisions: string[] = [];

    messages.forEach(msg => {
      const content = msg.content.toLowerCase();
      
      // Extract code blocks
      const codeMatches = msg.content.match(/```[\s\S]*?```/g);
      if (codeMatches) {
        codeBlocks.push(...codeMatches);
      }

      // Identify key decisions
      if (content.includes('decided') || content.includes('chosen') || content.includes('will use')) {
        decisions.push(msg.content.substring(0, 200));
      }

      // Extract technical terms
      const techTerms = content.match(/\b(react|vue|angular|laravel|typescript|javascript|component|function|api|database)\b/g);
      if (techTerms) {
        techTerms.forEach(term => keyTopics.add(term));
      }
    });

    return `
Conversation Summary:
- Key technologies: ${Array.from(keyTopics).join(', ')}
- Important decisions: ${decisions.slice(0, 3).join('; ')}
- Code examples generated: ${codeBlocks.length} blocks
- Messages compressed: ${messages.length}
    `.trim();
  }

  async getGenerationHistory(): Promise<GenerationHistory> {
    return this.readCache('generation-history', { attempts: [] });
  }

  async addGenerationAttempt(attempt: {
    prompt: string;
    result: string;
    success: boolean;
    framework: string;
    projectType: string;
  }): Promise<void> {
    const history = await this.getGenerationHistory();
    history.attempts.push({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...attempt
    });

    // Keep only last 50 attempts
    if (history.attempts.length > 50) {
      history.attempts = history.attempts.slice(-50);
    }

    await this.writeCache('generation-history', history);
  }

  async getUserPreferences(): Promise<UserPreferences> {
    return this.readCache('user-preferences', {
      namingConventions: {
        functions: 'camelCase',
        variables: 'camelCase',
        components: 'PascalCase',
        files: 'kebab-case'
      },
      codingPatterns: {
        preferredStateManagement: 'useState',
        componentStructure: 'functional',
        errorHandling: 'try-catch',
        styling: 'tailwind'
      },
      frameworkPreferences: {
        react: { hooks: true, typescript: true, stateManagement: 'useState' },
        laravel: { version: '10', patterns: ['eloquent', 'middleware'] }
      }
    });
  }

  async updateUserPreferences(updates: Partial<UserPreferences>): Promise<void> {
    const current = await this.getUserPreferences();
    const updated = { ...current, ...updates };
    await this.writeCache('user-preferences', updated);
  }

  async getErrorPatterns(): Promise<ErrorPatterns> {
    return this.readCache('error-patterns', {
      commonErrors: [],
      preventionRules: [
        {
          rule: 'check-imports',
          description: 'Verify all imports are valid',
          active: true
        },
        {
          rule: 'type-safety',
          description: 'Ensure TypeScript types are correct',
          active: true
        }
      ]
    });
  }

  async recordError(error: string, fix: string): Promise<void> {
    const patterns = await this.getErrorPatterns();
    
    const existing = patterns.commonErrors.find(e => e.pattern === error);
    if (existing) {
      existing.frequency++;
      existing.lastOccurrence = new Date().toISOString();
      if (!existing.fixes.includes(fix)) {
        existing.fixes.push(fix);
      }
    } else {
      patterns.commonErrors.push({
        pattern: error,
        frequency: 1,
        fixes: [fix],
        lastOccurrence: new Date().toISOString()
      });
    }

    await this.writeCache('error-patterns', patterns);
  }

  async getOptimizationMap(): Promise<OptimizationMap> {
    return this.readCache('optimization-map', {
      performanceIssues: [],
      appliedOptimizations: []
    });
  }

  async recordOptimization(optimization: string, impact: string, location: string): Promise<void> {
    const map = await this.getOptimizationMap();
    map.appliedOptimizations.push({
      optimization,
      timestamp: new Date().toISOString(),
      impact,
      codeLocation: location
    });

    await this.writeCache('optimization-map', map);
  }

  async exportProjectContext(): Promise<string> {
    const context = {
      projectState: await this.getProjectState(),
      codeStructure: await this.getCodeStructure(),
      conversationMemory: await this.getConversationMemory(),
      generationHistory: await this.getGenerationHistory(),
      userPreferences: await this.getUserPreferences(),
      errorPatterns: await this.getErrorPatterns(),
      optimizationMap: await this.getOptimizationMap()
    };

    return JSON.stringify(context, null, 2);
  }

  async importProjectContext(contextData: string): Promise<void> {
    try {
      const context = JSON.parse(contextData);
      
      await this.writeCache('project-state', context.projectState);
      await this.writeCache('code-structure', context.codeStructure);
      await this.writeCache('conversation-memory', context.conversationMemory);
      await this.writeCache('generation-history', context.generationHistory);
      await this.writeCache('user-preferences', context.userPreferences);
      await this.writeCache('error-patterns', context.errorPatterns);
      await this.writeCache('optimization-map', context.optimizationMap);
    } catch (error) {
      console.error('Failed to import project context:', error);
      throw new Error('Invalid context data format');
    }
  }

  async clearProjectContext(): Promise<void> {
    const files = [
      'project-state',
      'code-structure',
      'conversation-memory',
      'generation-history',
      'user-preferences',
      'error-patterns',
      'optimization-map'
    ];

    for (const file of files) {
      const key = this.getStorageKey(file);
      this.cache.delete(key);
      localStorage.removeItem(key);
    }
  }

  // Context reconstruction for AI continuity
  async getAIContextSummary(): Promise<string> {
    const state = await this.getProjectState();
    const structure = await this.getCodeStructure();
    const preferences = await this.getUserPreferences();
    const memory = await this.getConversationMemory();

    return `
PROJECT CONTEXT SUMMARY:
======================

Current Intent: ${state.aiMemory.userIntent}

Active Components: ${state.activeContext.activeComponents.join(', ')}
Current Files: ${state.activeContext.currentFiles.join(', ')}
Pending Tasks: ${state.activeContext.pendingTasks.join(', ')}

Code Structure:
- Functions: ${Object.keys(structure.functions).join(', ')}
- Components: ${Object.keys(structure.components).join(', ')}
- Key Variables: ${Object.keys(structure.variables).slice(0, 10).join(', ')}

User Preferences:
- Framework Patterns: ${preferences.codingPatterns.preferredStateManagement}
- Naming: ${preferences.namingConventions.functions} functions, ${preferences.namingConventions.components} components
- Styling: ${preferences.codingPatterns.styling}

Previous Context: ${memory.context}

Recent Key Decisions:
${state.aiMemory.keyDecisions.slice(-3).join('\n')}
`.trim();
  }
}
