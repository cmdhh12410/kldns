import { Provider, ProviderFactory } from './provider';

const registry = new Map<string, ProviderFactory>();

export function registerProvider(key: string, factory: ProviderFactory): void {
  registry.set(key, factory);
}

export function getProvider(key: string): Provider | null {
  const factory = registry.get(key);
  return factory ? factory() : null;
}

export function getRegisteredKeys(): string[] {
  return Array.from(registry.keys()).sort();
}
