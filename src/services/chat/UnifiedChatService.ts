
import { ProjectContextManager } from '@/services/cache/ProjectContextManager';
import { DynamicPromptEngine } from '@/services/prompt/DynamicPromptEngine';
import { AIServiceManager } from '@/services/ai/AIServiceManager';
import { GenerationOptions, CodeGenerationRequest } from '@/services/ai/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  tool?: string;
  metadata?: {
    codeGenerated?: boolean;
    filesAffected?: string[];
    toolsUsed?: string[];
    errorFixed?: boolean;
    optimizationApplied?: boolean;
  };
}

export interface ToolCommand {
  command: string;
  args: string[];
  context: string;
}

export type ToolType = 'debug' | 'optimize' | 'generate' | 'analyze' | 'refactor';

export class UnifiedChatService {
  private static instance: UnifiedChatService;
  private contextManager: ProjectContextManager;
  private promptEngine: DynamicPromptEngine;
  private aiService: AIServiceManager;
  private currentTool: ToolType | null = null;
  private messages: ChatMessage[] = [];

  static getInstance(): UnifiedChatService {
    if (!UnifiedChatService.instance) {
      UnifiedChatService.instance = new UnifiedChatService();
    }
    return UnifiedChatService.instance;
  }

  constructor() {
    this.contextManager = ProjectContextManager.getInstance();
    this.promptEngine = DynamicPromptEngine.getInstance();
    this.aiService = AIServiceManager.getInstance();
  }

  async initializeProject(projectId: string): Promise<void> {
    this.contextManager.setProjectId(projectId);
    
    // Check if this is a returning session and restore context
    const projectState = await this.contextManager.getProjectState();
    if (projectState.lastAIInteraction) {
      const timeSinceLastInteraction = Date.now() - new Date(projectState.lastAIInteraction).getTime();
      
      // If more than 1 hour has passed, trigger context recovery
      if (timeSinceLastInteraction > 3600000) {
        await this.triggerContextRecovery();
      }
    }

    // Load conversation history
    const memory = await this.contextManager.getConversationMemory();
    this.messages = memory.messages.map(msg => ({
      id: crypto.randomUUID(),
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      timestamp: msg.timestamp
    }));
  }

  async sendMessage(
    content: string,
    options?: {
      framework?: string;
      projectType?: string;
      forceToolSwitch?: ToolType;
    }
  ): Promise<ChatMessage> {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    this.messages.push(userMessage);
    await this.contextManager.addConversationMessage('user', content);

    // Detect tool commands or intelligent tool switching
    const toolCommand = this.parseToolCommand(content);
    const suggestedTool = toolCommand?.command as ToolType || 
                         options?.forceToolSwitch || 
                         await this.detectRequiredTool(content);

    if (suggestedTool && suggestedTool !== this.currentTool) {
      await this.switchTool(suggestedTool);
    }

    // Generate context-aware response
    const response = await this.generateResponse(content, {
      framework: options?.framework || 'react',
      projectType: options?.projectType || 'web-app',
      tool: this.currentTool
    });

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString(),
      tool: this.currentTool || undefined,
      metadata: response.metadata
    };

    this.messages.push(assistantMessage);
    await this.contextManager.addConversationMessage('assistant', response.content);

    // Update project state based on interaction
    await this.updateProjectStateFromInteraction(content, response);

    return assistantMessage;
  }

  private parseToolCommand(content: string): ToolCommand | null {
    const commandRegex = /^\/(debug|optimize|generate|analyze|refactor)\s*(.*)/i;
    const match = content.match(commandRegex);
    
    if (match) {
      return {
        command: match[1].toLowerCase(),
        args: match[2] ? match[2].split(' ') : [],
        context: content
      };
    }
    
    return null;
  }

  private async detectRequiredTool(content: string): Promise<ToolType | null> {
    const lowerContent = content.toLowerCase();
    
    // Debug patterns
    if (lowerContent.includes('error') || lowerContent.includes('bug') || 
        lowerContent.includes('not working') || lowerContent.includes('fix') ||
        lowerContent.includes('issue') || lowerContent.includes('broken')) {
      return 'debug';
    }
    
    // Optimization patterns
    if (lowerContent.includes('slow') || lowerContent.includes('optimize') ||
        lowerContent.includes('performance') || lowerContent.includes('improve') ||
        lowerContent.includes('faster') || lowerContent.includes('efficiency')) {
      return 'optimize';
    }
    
    // Multi-file generation patterns
    if (lowerContent.includes('full project') || lowerContent.includes('complete app') ||
        lowerContent.includes('entire system') || lowerContent.includes('whole application') ||
        lowerContent.includes('project structure')) {
      return 'generate';
    }
    
    // Refactoring patterns
    if (lowerContent.includes('refactor') || lowerContent.includes('restructure') ||
        lowerContent.includes('reorganize') || lowerContent.includes('clean up')) {
      return 'refactor';
    }
    
    // Analysis patterns
    if (lowerContent.includes('analyze') || lowerContent.includes('review') ||
        lowerContent.includes('examine') || lowerContent.includes('assess')) {
      return 'analyze';
    }
    
    return null;
  }

  private async switchTool(tool: ToolType): Promise<void> {
    this.currentTool = tool;
    
    // Update project state
    await this.contextManager.updateProjectState({
      aiMemory: {
        ...(await this.contextManager.getProjectState()).aiMemory,
        userIntent: `Using ${tool} tool`
      }
    });

    // Add tool switch message
    const switchMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'system',
      content: `Switched to ${tool.toUpperCase()} mode`,
      timestamp: new Date().toISOString(),
      tool
    };
    
    this.messages.push(switchMessage);
  }

  private async generateResponse(
    userInput: string,
    context: {
      framework: string;
      projectType: string;
      tool?: ToolType | null;
    }
  ): Promise<{
    content: string;
    metadata: ChatMessage['metadata'];
  }> {
    try {
      // Get context-aware system prompt
      const systemPrompt = await this.getSystemPrompt(context.tool);
      
      // Prepare generation options
      const options: GenerationOptions = {
        framework: context.framework,
        projectType: context.projectType,
        complexity: { level: 'medium', estimatedLines: 100, frameworks: [context.framework], integrations: [] },
        features: [],
        streaming: false,
        temperature: 0.7
      };

      // Generate response using AI service
      const request: CodeGenerationRequest = {
        prompt: userInput,
        options,
        projectId: await this.getProjectId()
      };

      let responseContent: string;
      let isCodeGenerated = false;
      let filesAffected: string[] = [];

      if (context.tool) {
        // Tool-specific response generation
        responseContent = await this.generateToolSpecificResponse(context.tool, userInput, systemPrompt, options);
        isCodeGenerated = ['debug', 'optimize', 'generate', 'refactor'].includes(context.tool);
      } else {
        // General conversation response
        responseContent = await this.aiService.generateCode(request);
      }

      return {
        content: responseContent,
        metadata: {
          codeGenerated: isCodeGenerated,
          filesAffected: filesAffected,
          toolsUsed: context.tool ? [context.tool] : [],
          errorFixed: context.tool === 'debug',
          optimizationApplied: context.tool === 'optimize'
        }
      };

    } catch (error) {
      console.error('Failed to generate response:', error);
      return {
        content: 'I encountered an error while processing your request. Please try again.',
        metadata: {}
      };
    }
  }

  private async generateToolSpecificResponse(
    tool: ToolType,
    userInput: string,
    systemPrompt: string,
    options: GenerationOptions
  ): Promise<string> {
    const templateId = `${tool}-mode`;
    const toolPrompt = await this.promptEngine.generatePrompt(templateId);
    const combinedPrompt = `${systemPrompt}\n\n${toolPrompt}\n\nUser Request: ${userInput}`;

    const request: CodeGenerationRequest = {
      prompt: combinedPrompt,
      options,
      projectId: await this.getProjectId()
    };

    return await this.aiService.generateCode(request);
  }

  private async getSystemPrompt(tool?: ToolType | null): Promise<string> {
    if (tool) {
      return await this.promptEngine.generatePrompt('unified-system', {
        activeTools: [tool]
      });
    } else {
      return await this.promptEngine.generatePrompt('unified-system');
    }
  }

  private async triggerContextRecovery(): Promise<void> {
    const contextSummary = await this.contextManager.getAIContextSummary();
    const recoveryPrompt = await this.promptEngine.generatePrompt('context-recovery', {
      conversationContext: contextSummary
    });

    const recoveryMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'system',
      content: recoveryPrompt,
      timestamp: new Date().toISOString()
    };

    this.messages.push(recoveryMessage);
  }

  private async updateProjectStateFromInteraction(
    userInput: string,
    response: { content: string; metadata: ChatMessage['metadata'] }
  ): Promise<void> {
    const currentState = await this.contextManager.getProjectState();
    
    // Extract user intent from input
    let userIntent = userInput.substring(0, 100);
    if (userInput.length > 100) userIntent += '...';

    // Update key decisions if this seems like an important decision
    const keyDecisions = [...currentState.aiMemory.keyDecisions];
    if (response.metadata?.codeGenerated) {
      keyDecisions.push(`Generated code: ${userIntent}`);
    }

    // Update active context
    const pendingTasks = [...currentState.activeContext.pendingTasks];
    if (this.currentTool) {
      const task = `${this.currentTool}: ${userIntent}`;
      if (!pendingTasks.includes(task)) {
        pendingTasks.push(task);
      }
    }

    await this.contextManager.updateProjectState({
      aiMemory: {
        ...currentState.aiMemory,
        userIntent,
        keyDecisions: keyDecisions.slice(-10) // Keep last 10 decisions
      },
      activeContext: {
        ...currentState.activeContext,
        pendingTasks: pendingTasks.slice(-5) // Keep last 5 tasks
      }
    });
  }

  private async getProjectId(): Promise<string> {
    const state = await this.contextManager.getProjectState();
    return state.projectId;
  }

  // Public methods for tool integration
  getCurrentTool(): ToolType | null {
    return this.currentTool;
  }

  async switchToTool(tool: ToolType): Promise<void> {
    await this.switchTool(tool);
  }

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  async clearConversation(): Promise<void> {
    this.messages = [];
    await this.contextManager.clearProjectContext();
    this.currentTool = null;
  }

  async exportConversation(): Promise<string> {
    return JSON.stringify({
      messages: this.messages,
      projectContext: await this.contextManager.exportProjectContext()
    }, null, 2);
  }

  // Method for admin context management
  async getProjectContext(): Promise<any> {
    return {
      state: await this.contextManager.getProjectState(),
      structure: await this.contextManager.getCodeStructure(),
      preferences: await this.contextManager.getUserPreferences(),
      history: await this.contextManager.getGenerationHistory(),
      errors: await this.contextManager.getErrorPatterns(),
      optimizations: await this.contextManager.getOptimizationMap()
    };
  }
}
