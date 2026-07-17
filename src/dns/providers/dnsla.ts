import { Provider, Zone, RecordInput, DNSRecord, RecordLine, ConfigField } from '../provider';
import { registerProvider } from '../registry';

export class DNSLAProvider implements Provider {
  private appId: string = '';
  private appKey: string = '';

  key(): string {
    return 'dnsla';
  }

  label(): string {
    return 'DNSLA';
  }

  configFields(): ConfigField[] {
    return [
      { name: 'app_id', label: 'App ID', required: true, secret: false },
      { name: 'app_key', label: 'App Key', required: true, secret: true },
    ];
  }

  configure(config: Record<string, string>): void {
    this.appId = config.app_id || '';
    this.appKey = config.app_key || '';
  }

  private async request<T>(method: string, path: string, body?: any): Promise<T> {
    const response = await fetch(`https://api.dns.la/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'API-KEY': this.appId,
        'API-SECRET': this.appKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    if (data.code !== 200) {
      throw new Error(`DNSLA API error: ${data.message}`);
    }
    return data.data;
  }

  async check(): Promise<void> {
    await this.request('GET', '/user/info');
  }

  async listZones(): Promise<Zone[]> {
    const result = await this.request<any>('GET', '/domain/list?pageSize=100');
    return (result.list || []).map((d: any) => ({ id: d.id.toString(), domain: d.domain }));
  }

  async listRecordLines(_zone: Zone): Promise<RecordLine[]> {
    return [{ id: 'default', name: '默认' }];
  }

  async createRecord(zone: Zone, input: RecordInput): Promise<DNSRecord> {
    const result = await this.request<any>('POST', '/record/create', {
      domainID: zone.id,
      host: input.name,
      type: input.type,
      value: input.value,
    });
    return {
      remote_id: result.id.toString(),
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async updateRecord(zone: Zone, remoteId: string, input: RecordInput): Promise<DNSRecord> {
    await this.request('PUT', `/record/update`, {
      id: remoteId,
      host: input.name,
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

  async deleteRecord(_zone: Zone, remoteId: string): Promise<void> {
    await this.request('DELETE', `/record/delete?id=${remoteId}`);
  }

  async getRecord(_zone: Zone, remoteId: string): Promise<DNSRecord> {
    const result = await this.request<any>('GET', `/record/get?id=${remoteId}`);
    return {
      remote_id: remoteId,
      name: result.host,
      type: result.type,
      value: result.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async listRecords(zone: Zone): Promise<DNSRecord[]> {
    const result = await this.request<any>('GET', `/record/list?domainID=${zone.id}&pageSize=100`);
    return (result.list || []).map((r: any) => ({
      remote_id: r.id.toString(),
      name: r.host,
      type: r.type,
      value: r.value,
      line_id: 'default',
      line: '默认',
    }));
  }
}

registerProvider('dnsla', () => new DNSLAProvider());
