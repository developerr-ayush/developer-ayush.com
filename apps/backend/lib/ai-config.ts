import fs from 'fs';
import path from 'path';

// Define types for the configuration
export interface AIConfig {
  aiModels: {
    openai: {
      default: string;
      models: string[];
    };
    groq: {
      default: string;
      models: string[];
    };
    gemini: {
      default: string;
      models: string[];
    };
  };
  requestTimeouts: {
    default: number;
    simplified: number;
  };
  prompts: {
    blogGeneration: {
      systemPrompt: string;
    };
  };
  responseFormats: {
    blog: {
      simplified: {
        template: any;
        guidelines: string[];
      };
      detailed: {
        template: any;
        guidelines: string[];
      };
    };
  };
  blockTypes: {
    [key: string]: {
      data: any;
    };
  };
  validation: {
    minTitleLength: number;
    maxTitleLength: number;
    maxDescriptionLength: number;
    minBlocksSimplified: number;
    minBlocksDetailed: number;
  };
  fixes: {
    jsonRegexPatterns: Array<{
      pattern: string;
      replacement: string;
    }>;
  };
}

// Read and parse the configuration file
const configPath = path.join(process.cwd(), 'config', 'ai-config.json');
let aiConfig: AIConfig;

try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  aiConfig = JSON.parse(configFile) as AIConfig;
} catch (error) {
  console.error('Error loading AI configuration:', error);
  // Provide a minimal default configuration if file can't be loaded
  aiConfig = {
    aiModels: {
      openai: {
        default: 'gpt-3.5-turbo',
        models: ['gpt-3.5-turbo']
      },
      groq: {
        default: 'meta-llama/llama-4-scout-17b-16e-instruct',
        models: ['meta-llama/llama-4-scout-17b-16e-instruct']
      },
      gemini: {
        default: 'gemini-2.5-pro-preview-05-06',
        models: ['gemini-2.5-pro-preview-05-06', 'gemini-1.5-flash']
      }
    },
    requestTimeouts: {
      default: 45000,
      simplified: 25000
    },
    prompts: {
      blogGeneration: {
        systemPrompt: 'Generate a blog post in JSON format.'
      }
    },
    responseFormats: {
      blog: {
        simplified: {
          template: {},
          guidelines: []
        },
        detailed: {
          template: {},
          guidelines: []
        }
      }
    },
    blockTypes: {},
    validation: {
      minTitleLength: 10,
      maxTitleLength: 255,
      maxDescriptionLength: 1000,
      minBlocksSimplified: 2,
      minBlocksDetailed: 4
    },
    fixes: {
      jsonRegexPatterns: []
    }
  };
}

// Helper functions for working with the configuration
export function getDefaultModel(provider: 'openai' | 'groq' | 'gemini'): string {
  return aiConfig.aiModels[provider].default;
}

export function getModelList(provider: 'openai' | 'groq' | 'gemini'): string[] {
  return aiConfig.aiModels[provider].models;
}

export function getTimeout(simplified = false): number {
  return simplified ? aiConfig.requestTimeouts.simplified : aiConfig.requestTimeouts.default;
}

export function getBlogSystemPrompt(): string {
  return aiConfig.prompts.blogGeneration.systemPrompt;
}

export function getBlogResponseFormat(detailed = true): {
  template: any;
  guidelines: string[];
} {
  return detailed 
    ? aiConfig.responseFormats.blog.detailed 
    : aiConfig.responseFormats.blog.simplified;
}

export function getValidationRules(): typeof aiConfig.validation {
  return aiConfig.validation;
}

export function getJsonFixPatterns(): typeof aiConfig.fixes.jsonRegexPatterns {
  return aiConfig.fixes.jsonRegexPatterns;
}

// Export the entire configuration
export default aiConfig; 