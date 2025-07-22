
import { GenerationOptions } from './types';

export class PromptEngine {
  static generateSystemPrompt(options: GenerationOptions): string {
    const { framework, projectType, features } = options;
    
    const basePrompt = `You are an expert software architect and developer specializing in ${framework} development.`;
    
    const frameworkSpecific = this.getFrameworkSpecificPrompt(framework);
    const projectTypePrompt = this.getProjectTypePrompt(projectType);
    const featuresPrompt = this.getFeaturesPrompt(features);
    
    return `${basePrompt}\n\n${frameworkSpecific}\n\n${projectTypePrompt}\n\n${featuresPrompt}\n\nIMPORTANT GUIDELINES:
- Generate clean, production-ready code
- Follow best practices and modern patterns
- Include proper TypeScript types
- Add comprehensive error handling
- Ensure code is well-structured and maintainable
- Include relevant comments and documentation
- Follow security best practices
- Make the code responsive and accessible`;
  }

  static generateUserPrompt(description: string, options: GenerationOptions): string {
    const { framework, projectType } = options;
    
    return `Create a professional ${projectType} application using ${framework} with the following requirements:

${description}

Please generate:
1. Complete file structure
2. All necessary components and logic
3. Proper configuration files
4. Basic styling and responsive design
5. Error handling and loading states
6. Type definitions where applicable

Ensure the application is production-ready and follows modern development practices.`;
  }

  private static getFrameworkSpecificPrompt(framework: string): string {
    const prompts = {
      react: `Focus on modern React development with:
- Functional components and hooks
- TypeScript for type safety
- Modern state management (Context/Zustand)
- Component composition patterns
- Performance optimizations`,
      
      laravel: `Focus on Laravel best practices:
- Eloquent ORM and relationships
- Form requests and validation
- API resources and controllers
- Queue jobs and events
- Middleware and policies
- Blade components and layouts`,
      
      vue: `Focus on Vue.js 3 Composition API:
- Script setup syntax
- Reactive state management
- Component composition
- TypeScript integration
- Modern Vue ecosystem`,
      
      angular: `Focus on Angular best practices:
- Component architecture
- Services and dependency injection
- RxJS and reactive programming
- Angular Material components
- Route guards and resolvers`
    };
    
    return prompts[framework as keyof typeof prompts] || prompts.react;
  }

  private static getProjectTypePrompt(projectType: string): string {
    const prompts = {
      fintech: `Build a financial technology application with:
- Security-first architecture
- Real-time data handling
- Compliance considerations
- Advanced analytics
- Payment processing integration`,
      
      ecommerce: `Build an e-commerce platform with:
- Product catalog management
- Shopping cart functionality
- Payment gateway integration
- Order management system
- Inventory tracking`,
      
      healthcare: `Build a healthcare application with:
- HIPAA compliance considerations
- Patient data security
- Appointment scheduling
- Medical records management
- Integration capabilities`,
      
      enterprise: `Build an enterprise application with:
- Scalable architecture
- Role-based access control
- Advanced reporting
- Integration capabilities
- Multi-tenant support`
    };
    
    return prompts[projectType as keyof typeof prompts] || 'Build a professional web application with modern architecture and best practices.';
  }

  private static getFeaturesPrompt(features: string[]): string {
    if (!features.length) return '';
    
    return `Include the following features:
${features.map(feature => `- ${feature}`).join('\n')}`;
  }
}
