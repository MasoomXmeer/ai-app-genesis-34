
import { GenerationOptions } from './types';

export class PromptEngine {
  static generateSystemPrompt(options: GenerationOptions): string {
    const { framework, projectType, complexity } = options;
    
    return `You are an expert ${framework} developer building a ${projectType} application.

Project Context:
- Framework: ${framework}
- Project Type: ${projectType}
- Complexity Level: ${complexity.level}
- Estimated Lines: ${complexity.estimatedLines}
- Required Features: ${options.features.join(', ')}

Guidelines:
1. Generate clean, production-ready code
2. Follow ${framework} best practices and conventions
3. Include proper TypeScript types (if applicable)
4. Add appropriate error handling
5. Use modern ES6+ syntax
6. Include helpful comments for complex logic
7. Ensure responsive design for UI components
8. Follow accessibility standards

Code Style:
- Use functional components for React
- Prefer composition over inheritance
- Write self-documenting code
- Use meaningful variable and function names
- Keep functions small and focused

Please generate complete, working code that can be immediately used in a ${framework} project.`;
  }

  static generateUserPrompt(userRequest: string, options: GenerationOptions): string {
    const { framework, projectType } = options;
    
    return `Create ${framework} code for the following request in a ${projectType} context:

${userRequest}

Requirements:
- Generate complete, functional code
- Include all necessary imports and dependencies
- Follow ${framework} best practices
- Add proper error handling
- Make it production-ready
- Include TypeScript types if applicable

Please provide the complete implementation.`;
  }

  static generateCodeReviewPrompt(code: string, framework: string): string {
    return `Review the following ${framework} code for:

1. Best practices adherence
2. Performance optimizations
3. Security concerns
4. Code maintainability
5. Bug detection
6. TypeScript type safety (if applicable)

Code to review:
\`\`\`${framework}
${code}
\`\`\`

Provide specific suggestions for improvement with code examples.`;
  }

  static generateOptimizationPrompt(code: string, framework: string): string {
    return `Optimize the following ${framework} code for:

1. Performance improvements
2. Bundle size reduction
3. Memory usage optimization
4. Rendering efficiency (for UI components)
5. Code maintainability

Original code:
\`\`\`${framework}
${code}
\`\`\`

Provide the optimized version with explanations of the improvements made.`;
  }

  static generateDebugPrompt(code: string, error: string, framework: string): string {
    return `Debug the following ${framework} code that is producing this error:

Error: ${error}

Code:
\`\`\`${framework}
${code}
\`\`\`

Please:
1. Identify the root cause of the error
2. Provide the corrected code
3. Explain what was wrong and why the fix works
4. Suggest preventive measures for similar issues`;
  }
}
