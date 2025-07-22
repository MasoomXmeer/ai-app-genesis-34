export interface DeploymentProvider {
  id: string;
  name: string;
  enabled: boolean;
  clientId: string;
  clientSecret: string;
}

export interface DeploymentConfig {
  [key: string]: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    name: string;
    description: string;
  };
}

export interface DeploymentProject {
  id: string;
  name: string;
  provider: string;
  url: string;
  status: 'deploying' | 'success' | 'error';
  deployedAt: Date;
}

export class DeploymentService {
  private static DEPLOYMENT_CONFIG_KEY = 'deploymentConfig';
  private static DEPLOYED_PROJECTS_KEY = 'deployedProjects';

  static getEnabledProviders(): DeploymentProvider[] {
    const config = this.getDeploymentConfig();
    return Object.entries(config)
      .filter(([_, settings]) => settings.enabled)
      .map(([id, settings]) => ({
        id,
        name: settings.name,
        enabled: settings.enabled,
        clientId: settings.clientId,
        clientSecret: settings.clientSecret
      }));
  }

  static getDeploymentConfig(): DeploymentConfig {
    const config = localStorage.getItem(this.DEPLOYMENT_CONFIG_KEY);
    if (config) {
      try {
        return JSON.parse(config);
      } catch (error) {
        console.error('Failed to parse deployment config:', error);
      }
    }
    
    // Return default configuration
    return {
      vercel: {
        enabled: true,
        clientId: '',
        clientSecret: '',
        name: 'Vercel',
        description: 'Deploy to Vercel with automatic SSL and global CDN'
      },
      netlify: {
        enabled: true,
        clientId: '',
        clientSecret: '',
        name: 'Netlify',
        description: 'Deploy to Netlify with continuous deployment and edge functions'
      }
    };
  }

  static isProviderConfigured(providerId: string): boolean {
    const config = this.getDeploymentConfig();
    const provider = config[providerId];
    return provider && provider.enabled && !!provider.clientId && !!provider.clientSecret;
  }

  static hasAuthToken(providerId: string): boolean {
    const token = localStorage.getItem(`${providerId}_auth_token`);
    const expires = localStorage.getItem(`${providerId}_auth_expires`);
    
    if (!token || !expires) return false;
    
    return Date.now() < parseInt(expires);
  }

  static saveDeployedProject(projectData: any, provider: string, deploymentUrl: string): void {
    const deployedProjects = this.getDeployedProjects();
    const newProject: DeploymentProject = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2)}`,
      name: projectData.name || 'Untitled Project',
      provider,
      url: deploymentUrl,
      status: 'success',
      deployedAt: new Date()
    };
    
    deployedProjects.push(newProject);
    localStorage.setItem(this.DEPLOYED_PROJECTS_KEY, JSON.stringify(deployedProjects));
  }

  static getDeployedProjects(): DeploymentProject[] {
    const projects = localStorage.getItem(this.DEPLOYED_PROJECTS_KEY);
    if (projects) {
      try {
        return JSON.parse(projects).map((p: any) => ({
          ...p,
          deployedAt: new Date(p.deployedAt)
        }));
      } catch (error) {
        console.error('Failed to parse deployed projects:', error);
      }
    }
    return [];
  }

  static removeAuthToken(providerId: string): void {
    localStorage.removeItem(`${providerId}_auth_token`);
    localStorage.removeItem(`${providerId}_auth_expires`);
  }

  static clearAllTokens(): void {
    const providers = ['vercel', 'netlify'];
    providers.forEach(provider => this.removeAuthToken(provider));
  }

  static getProviderOAuthUrl(providerId: string): string {
    const config = this.getDeploymentConfig();
    const provider = config[providerId];
    
    if (!provider || !provider.clientId) {
      throw new Error(`Provider ${providerId} is not configured`);
    }

    const redirectUri = `${window.location.origin}/api/auth/${providerId}/callback`;
    
    switch (providerId) {
      case 'vercel':
        return `https://vercel.com/oauth/authorize?client_id=${provider.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user`;
      case 'netlify':
        return `https://app.netlify.com/authorize?client_id=${provider.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
      default:
        throw new Error(`Unknown provider: ${providerId}`);
    }
  }

  static validateProjectData(projectData: any): boolean {
    return projectData && (projectData.name || projectData.template || projectData.requirements);
  }

  static generateDeploymentId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  }
}

export default DeploymentService;