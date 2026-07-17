export interface EnvConfig {
  APP_NAME: string;
  APP_MODE: string;
  SECRET_KEY: string;
}

export function loadEnvConfig(env: any): EnvConfig {
  return {
    APP_NAME: env.APP_NAME || 'kldns',
    APP_MODE: env.APP_MODE || 'dev',
    SECRET_KEY: env.SECRET_KEY || 'change-me-before-production-kldns-secret',
  };
}

export function validateEnvConfig(config: EnvConfig): void {
  if (config.APP_MODE === 'production' && config.SECRET_KEY === 'change-me-before-production-kldns-secret') {
    throw new Error('Cannot use default SECRET_KEY in production mode');
  }
}
