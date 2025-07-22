
import { GenerationOptions } from './types';

export class PromptEngine {
  static generateSystemPrompt(options: GenerationOptions): string {
    const { framework, projectType, complexity } = options;
    
    return `You are an expert ${framework} developer and architect with deep expertise in building production-grade ${projectType} applications.

TECHNICAL CONTEXT:
- Framework: ${framework}
- Project Type: ${projectType}
- Complexity Level: ${complexity.level}
- Target Scale: ${complexity.estimatedLines} lines of code
- Required Integrations: ${complexity.integrations.join(', ')}
- Key Features: ${options.features.join(', ')}

DEVELOPMENT STANDARDS:
1. Write production-ready, enterprise-grade code
2. Follow ${framework === 'react' ? 'React 18+ best practices with hooks, TypeScript, and modern patterns' : `${framework} latest conventions and best practices`}
3. Implement comprehensive error handling and edge cases
4. Use proper TypeScript with strict typing
5. Apply SOLID principles and clean architecture
6. Ensure code is testable, maintainable, and scalable
7. Include proper documentation and comments
8. Implement accessibility standards (WCAG 2.1 AA)
9. Optimize for performance and bundle size
10. Follow security best practices

ARCHITECTURE REQUIREMENTS:
- Use component composition over inheritance
- Implement proper separation of concerns
- Create reusable, atomic components
- Apply responsive design principles
- Use semantic HTML and proper ARIA labels
- Implement proper state management patterns
- Handle loading, error, and empty states
- Use modern ES2022+ features appropriately

CODE QUALITY EXPECTATIONS:
- Zero TypeScript errors or warnings
- Proper error boundaries and fallbacks
- Comprehensive input validation
- Memory leak prevention
- Performance optimizations
- Proper async/await usage
- Clean, readable, self-documenting code
- Consistent naming conventions

INTEGRATION REQUIREMENTS:
${complexity.integrations.length > 0 ? `
- Database integration with proper queries and transactions
- API endpoints with proper error handling
- Authentication and authorization
- Real-time features where applicable
- Third-party service integrations
` : '- Prepare for future integrations with modular architecture'}

Generate complete, working, production-ready code that can be deployed immediately.`;
  }

  static generateUserPrompt(userRequest: string, options: GenerationOptions): string {
    const { framework, projectType, complexity } = options;
    
    return `Create a complete ${framework} implementation for the following requirement:

USER REQUIREMENT:
${userRequest}

IMPLEMENTATION SCOPE:
- Framework: ${framework}
- Project Type: ${projectType}
- Complexity: ${complexity.level}
- Must handle: ${options.features.join(', ')}

DELIVERABLES REQUIRED:
1. Complete functional implementation
2. All necessary imports and dependencies
3. Proper TypeScript interfaces and types
4. Error handling and validation
5. Loading and empty states
6. Responsive design implementation
7. Accessibility features
8. Performance optimizations
9. Security considerations
10. Documentation and comments

TECHNICAL SPECIFICATIONS:
- Use latest ${framework} patterns and APIs
- Implement proper state management
- Include comprehensive error boundaries
- Apply modern CSS/styling approaches
- Ensure cross-browser compatibility
- Optimize for mobile and desktop
- Include proper SEO considerations
- Implement proper caching strategies

QUALITY REQUIREMENTS:
- Zero build errors or warnings
- Type-safe implementation
- Comprehensive edge case handling
- Performance monitoring ready
- Production deployment ready
- Scalable architecture
- Maintainable codebase
- Well-documented APIs

Please provide a complete, production-ready implementation that exceeds industry standards and can be deployed to production immediately.`;
  }

  static generateCodeReviewPrompt(code: string, framework: string): string {
    return `Conduct a comprehensive code review of the following ${framework} implementation:

REVIEW CRITERIA:
1. **Architecture & Design Patterns**
   - SOLID principles adherence
   - Separation of concerns
   - Component composition
   - Scalability considerations

2. **Code Quality & Standards**
   - ${framework} best practices
   - TypeScript implementation quality
   - Error handling completeness
   - Performance optimizations

3. **Security Assessment**
   - Input validation and sanitization
   - XSS prevention
   - CSRF protection
   - Data exposure risks

4. **Accessibility & UX**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader compatibility
   - Mobile responsiveness

5. **Performance Analysis**
   - Bundle size optimization
   - Rendering efficiency
   - Memory usage
   - Network optimization

6. **Maintainability**
   - Code readability
   - Documentation quality
   - Testing considerations
   - Refactoring opportunities

CODE TO REVIEW:
\`\`\`${framework}
${code}
\`\`\`

Provide detailed analysis with:
- Specific improvement recommendations
- Code examples for fixes
- Priority levels for issues
- Best practice alternatives
- Performance impact assessments`;
  }

  static generateOptimizationPrompt(code: string, framework: string): string {
    return `Optimize the following ${framework} code for production deployment:

OPTIMIZATION TARGETS:
1. **Performance Optimization**
   - Bundle size reduction (target: 30% reduction)
   - Runtime performance improvements
   - Memory usage optimization
   - Rendering efficiency enhancements

2. **Code Splitting & Lazy Loading**
   - Component-level code splitting
   - Route-based splitting
   - Dynamic imports optimization
   - Preloading strategies

3. **State Management Optimization**
   - Unnecessary re-renders elimination
   - State normalization
   - Selector optimization
   - Memory leak prevention

4. **Asset Optimization**
   - Image optimization
   - Font loading optimization
   - CSS optimization
   - JavaScript minification

5. **Caching Strategies**
   - HTTP caching headers
   - Service worker integration
   - Browser caching optimization
   - API response caching

ORIGINAL CODE:
\`\`\`${framework}
${code}
\`\`\`

Provide:
- Fully optimized code implementation
- Performance metrics comparison
- Optimization technique explanations
- Trade-off analysis
- Monitoring recommendations
- Deployment best practices`;
  }

  static generateDebugPrompt(code: string, error: string, framework: string): string {
    return `Debug and fix the following ${framework} code producing this error:

ERROR DETAILS:
${error}

DEBUGGING APPROACH:
1. **Root Cause Analysis**
   - Error type classification
   - Stack trace analysis
   - Dependencies investigation
   - State/props examination

2. **Common Issue Patterns**
   - ${framework}-specific gotchas
   - TypeScript type mismatches
   - Async/await issues
   - State management problems

3. **Fix Implementation**
   - Immediate error resolution
   - Prevention of similar issues
   - Code improvement opportunities
   - Testing considerations

4. **Error Prevention**
   - Type safety improvements
   - Validation enhancements
   - Error boundary implementation
   - Logging and monitoring

PROBLEMATIC CODE:
\`\`\`${framework}
${code}
\`\`\`

Provide:
- Exact root cause identification
- Complete corrected code
- Explanation of the fix
- Prevention strategies
- Testing recommendations
- Monitoring suggestions
- Similar issue patterns to watch for`;
  }

  static generateArchitecturePrompt(requirements: string, options: GenerationOptions): string {
    const { framework, projectType, complexity } = options;
    
    return `Design a comprehensive architecture for a ${framework} ${projectType} application:

REQUIREMENTS:
${requirements}

ARCHITECTURE SCOPE:
- Complexity Level: ${complexity.level}
- Scale: ${complexity.estimatedLines} lines of code
- Integrations: ${complexity.integrations.join(', ')}
- Key Features: ${options.features.join(', ')}

ARCHITECTURE COMPONENTS:
1. **Application Structure**
   - Directory organization
   - Module boundaries
   - Component hierarchy
   - Service layer design

2. **Data Layer**
   - State management strategy
   - API integration patterns
   - Caching mechanisms
   - Data flow architecture

3. **UI/UX Architecture**
   - Component library structure
   - Design system integration
   - Responsive layout strategy
   - Accessibility implementation

4. **Performance Architecture**
   - Code splitting strategy
   - Lazy loading implementation
   - Bundle optimization
   - Caching layers

5. **Security Architecture**
   - Authentication flow
   - Authorization patterns
   - Data protection
   - Input validation

6. **Deployment Architecture**
   - Build optimization
   - Environment configuration
   - CI/CD pipeline design
   - Monitoring and logging

Provide:
- Complete architectural diagram
- Implementation roadmap
- Technology stack recommendations
- Scalability considerations
- Security measures
- Performance benchmarks
- Testing strategy
- Deployment guidelines`;
  }
}
