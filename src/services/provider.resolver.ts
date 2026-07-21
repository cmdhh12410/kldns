import { Database, SettingsRepository } from '../repositories';
import { Domain } from '../models';
import { getProvider, Provider } from '../dns';
import { decrypt } from '../utils/secrets';

export class ProviderResolver {
  private settingsRepo: SettingsRepository;

  constructor(private db: Database, private secretKey: string) {
    this.settingsRepo = new SettingsRepository(db);
  }

  async resolve(domain: Domain): Promise<Provider> {
    const provider = getProvider(domain.provider_key);
    if (!provider) {
      throw new Error(`Provider ${domain.provider_key} not found`);
    }

    let config: Record<string, string> = {};
    
    if (domain.provider_config_ciphertext) {
      try {
        const decrypted = await decrypt(domain.provider_config_ciphertext, this.secretKey);
        config = JSON.parse(decrypted);
      } catch (error) {
        throw new Error('Failed to decrypt provider configuration');
      }
    }

    provider.configure(config);
    return provider;
  }
}
