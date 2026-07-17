import { Provider, Zone, RecordInput, DNSRecord, RecordLine, ConfigField } from '../provider';
import { registerProvider } from '../registry';

export class CloudflareProvider implements Provider {
  private apiToken: string = '';
  private baseUrl = 'https://api.cloudflare.com/client/v4';

  key(): string {
    return 'cloudflare';
  }

  label(): string {
    return 'Cloudflare';
  }

  configFields(): ConfigField[] {
    return [
      {
        name: 'api_token',
        label: 'API Token',
        required: true,
        secret: true,
        description: 'Cloudflare API Token (需要 DNS 编辑权限)',
      },
    ];
  }

  configure(config: Record<string, string>): void {
    this.apiToken = config.api_token || '';
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(`Cloudflare API error: ${JSON.stringify(data.errors)}`);
    }

    return data.result;
  }

  async check(): Promise<void> {
    await this.request<any>('GET', '/user/tokens/verify');
  }

  async listZones(): Promise<Zone[]> {
    const result = await this.request<any>('GET', '/zones?per_page=50');
    return result.map((zone: any) => ({
      id: zone.id,
      domain: zone.name,
    }));
  }

  async listRecordLines(_zone: Zone): Promise<RecordLine[]> {
    return [{ id: 'default', name: '默认' }];
  }

  async createRecord(zone: Zone, input: RecordInput): Promise<DNSRecord> {
    const body = {
      type: input.type,
      name: input.name,
      content: input.value,
      ttl: 1,
    };

    const result = await this.request<any>(
      'POST',
      `/zones/${zone.id}/dns_records`,
      body
    );

    return {
      remote_id: result.id,
      name: result.name,
      type: result.type,
      value: result.content,
      line_id: 'default',
      line: '默认',
    };
  }

  async updateRecord(
    zone: Zone,
    remoteId: string,
    input: RecordInput
  ): Promise<DNSRecord> {
    const body = {
      type: input.type,
      name: input.name,
      content: input.value,
      ttl: 1,
    };

    const result = await this.request<any>(
      'PUT',
      `/zones/${zone.id}/dns_records/${remoteId}`,
      body
    );

    return {
      remote_id: result.id,
      name: result.name,
      type: result.type,
      value: result.content,
      line_id: 'default',
      line: '默认',
    };
  }

  async deleteRecord(zone: Zone, remoteId: string): Promise<void> {
    await this.request<any>(
      'DELETE',
      `/zones/${zone.id}/dns_records/${remoteId}`
    );
  }

  async getRecord(zone: Zone, remoteId: string): Promise<DNSRecord> {
    const result = await this.request<any>(
      'GET',
      `/zones/${zone.id}/dns_records/${remoteId}`
    );

    return {
      remote_id: result.id,
      name: result.name,
      type: result.type,
      value: result.content,
      line_id: 'default',
      line: '默认',
    };
  }

  async listRecords(zone: Zone): Promise<DNSRecord[]> {
    const result = await this.request<any>(
      'GET',
      `/zones/${zone.id}/dns_records?per_page=100`
    );

    return result.map((record: any) => ({
      remote_id: record.id,
      name: record.name,
      type: record.type,
      value: record.content,
      line_id: 'default',
      line: '默认',
    }));
  }
}

registerProvider('cloudflare', () => new CloudflareProvider());
