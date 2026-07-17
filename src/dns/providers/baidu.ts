import { Provider, Zone, RecordInput, DNSRecord, RecordLine, ConfigField } from '../provider';
import { registerProvider } from '../registry';

export class BaiduProvider implements Provider {
  private accessKeyId: string = '';
  private secretAccessKey: string = '';

  key(): string {
    return 'baidu';
  }

  label(): string {
    return '百度云 DNS';
  }

  configFields(): ConfigField[] {
    return [
      { name: 'access_key_id', label: 'Access Key ID', required: true, secret: false },
      { name: 'secret_access_key', label: 'Secret Access Key', required: true, secret: true },
    ];
  }

  configure(config: Record<string, string>): void {
    this.accessKeyId = config.access_key_id || '';
    this.secretAccessKey = config.secret_access_key || '';
  }

  private async request<T>(method: string, path: string, body?: any): Promise<T> {
    const response = await fetch(`https://dns.baidubce.com${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bce-auth-v1 ${this.accessKeyId}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    if (data.code) {
      throw new Error(`Baidu DNS API error: ${data.message}`);
    }
    return data;
  }

  async check(): Promise<void> {
    await this.request('GET', '/v1/dns/zone?pageSize=1');
  }

  async listZones(): Promise<Zone[]> {
    const result = await this.request<any>('GET', '/v1/dns/zone?pageSize=100');
    return (result.zones || []).map((z: any) => ({ id: z.id, domain: z.name }));
  }

  async listRecordLines(_zone: Zone): Promise<RecordLine[]> {
    return [{ id: 'default', name: '默认' }];
  }

  async createRecord(zone: Zone, input: RecordInput): Promise<DNSRecord> {
    const result = await this.request<any>('POST', `/v1/dns/zone/${zone.domain}/record`, {
      rr: input.name,
      type: input.type,
      value: input.value,
    });
    return {
      remote_id: result.recordId,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async updateRecord(zone: Zone, remoteId: string, input: RecordInput): Promise<DNSRecord> {
    await this.request('PUT', `/v1/dns/zone/${zone.domain}/record/${remoteId}`, {
      rr: input.name,
      type: input.type,
      value: input.value,
    });
    return {
      remote_id: remoteId,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async deleteRecord(zone: Zone, remoteId: string): Promise<void> {
    await this.request('DELETE', `/v1/dns/zone/${zone.domain}/record/${remoteId}`);
  }

  async getRecord(zone: Zone, remoteId: string): Promise<DNSRecord> {
    const result = await this.request<any>('GET', `/v1/dns/zone/${zone.domain}/record/${remoteId}`);
    return {
      remote_id: remoteId,
      name: result.rr,
      type: result.type,
      value: result.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async listRecords(zone: Zone): Promise<DNSRecord[]> {
    const result = await this.request<any>('GET', `/v1/dns/zone/${zone.domain}/record?pageSize=100`);
    return (result.records || []).map((r: any) => ({
      remote_id: r.recordId,
      name: r.rr,
      type: r.type,
      value: r.value,
      line_id: 'default',
      line: '默认',
    }));
  }
}

registerProvider('baidu', () => new BaiduProvider());
