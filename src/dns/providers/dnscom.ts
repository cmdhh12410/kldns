import { Provider, Zone, RecordInput, DNSRecord, RecordLine, ConfigField } from '../provider';
import { registerProvider } from '../registry';

export class DNSComProvider implements Provider {
  private userId: string = '';
  private apiKey: string = '';

  key(): string {
    return 'dnscom';
  }

  label(): string {
    return 'DNS.com';
  }

  configFields(): ConfigField[] {
    return [
      { name: 'user_id', label: '用户ID', required: true, secret: false },
      { name: 'api_key', label: 'API Key', required: true, secret: true },
    ];
  }

  configure(config: Record<string, string>): void {
    this.userId = config.user_id || '';
    this.apiKey = config.api_key || '';
  }

  private async request<T>(path: string, params: Record<string, any> = {}): Promise<T> {
    const body = new URLSearchParams({
      user_id: this.userId,
      api_key: this.apiKey,
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    });

    const response = await fetch(`https://www.dns.com/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(`DNS.com API error: ${data.message}`);
    }
    return data.data;
  }

  async check(): Promise<void> {
    await this.request('domain/getDomainList', { page: 1, pageSize: 1 });
  }

  async listZones(): Promise<Zone[]> {
    const result = await this.request<any>('domain/getDomainList', { page: 1, pageSize: 100 });
    return (result.data || []).map((d: any) => ({ id: d.domainID.toString(), domain: d.domain }));
  }

  async listRecordLines(_zone: Zone): Promise<RecordLine[]> {
    return [{ id: 'default', name: '默认' }];
  }

  async createRecord(zone: Zone, input: RecordInput): Promise<DNSRecord> {
    const result = await this.request<any>('record/createRecord', {
      domainID: zone.id,
      host: input.name,
      type: input.type,
      value: input.value,
    });
    return {
      remote_id: result.recordID.toString(),
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async updateRecord(zone: Zone, remoteId: string, input: RecordInput): Promise<DNSRecord> {
    await this.request('record/updateRecord', {
      recordID: remoteId,
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
    await this.request('record/deleteRecord', { recordID: remoteId });
  }

  async getRecord(_zone: Zone, remoteId: string): Promise<DNSRecord> {
    const result = await this.request<any>('record/getRecordInfo', { recordID: remoteId });
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
    const result = await this.request<any>('record/getRecordList', { domainID: zone.id, page: 1, pageSize: 100 });
    return (result.data || []).map((r: any) => ({
      remote_id: r.recordID.toString(),
      name: r.host,
      type: r.type,
      value: r.value,
      line_id: 'default',
      line: '默认',
    }));
  }
}

registerProvider('dnscom', () => new DNSComProvider());
