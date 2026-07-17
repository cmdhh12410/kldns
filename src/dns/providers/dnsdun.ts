import { Provider, Zone, RecordInput, DNSRecord, RecordLine, ConfigField } from '../provider';
import { registerProvider } from '../registry';

export class DNSDunProvider implements Provider {
  private userId: string = '';
  private apiKey: string = '';

  key(): string {
    return 'dnsdun';
  }

  label(): string {
    return 'DnsDun';
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

    const response = await fetch(`https://www.dnsdun.com/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await response.json();
    if (data.status !== 'ok' && data.code !== 0) {
      throw new Error(`DnsDun API error: ${data.message || JSON.stringify(data)}`);
    }
    return data;
  }

  async check(): Promise<void> {
    await this.request('domain/list', { page: 1, page_size: 1 });
  }

  async listZones(): Promise<Zone[]> {
    const result = await this.request<any>('domain/list', { page: 1, page_size: 100 });
    return (result.data || []).map((d: any) => ({ id: d.id.toString(), domain: d.domain }));
  }

  async listRecordLines(_zone: Zone): Promise<RecordLine[]> {
    return [{ id: 'default', name: '默认' }];
  }

  async createRecord(zone: Zone, input: RecordInput): Promise<DNSRecord> {
    const result = await this.request<any>('record/create', {
      domain_id: zone.id,
      sub_domain: input.name,
      record_type: input.type,
      record_value: input.value,
    });
    return {
      remote_id: result.data.record_id.toString(),
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async updateRecord(zone: Zone, remoteId: string, input: RecordInput): Promise<DNSRecord> {
    await this.request('record/modify', {
      record_id: remoteId,
      sub_domain: input.name,
      record_type: input.type,
      record_value: input.value,
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
    await this.request('record/delete', { record_id: remoteId });
  }

  async getRecord(_zone: Zone, remoteId: string): Promise<DNSRecord> {
    const result = await this.request<any>('record/info', { record_id: remoteId });
    const r = result.data;
    return {
      remote_id: remoteId,
      name: r.sub_domain,
      type: r.record_type,
      value: r.record_value,
      line_id: 'default',
      line: '默认',
    };
  }

  async listRecords(zone: Zone): Promise<DNSRecord[]> {
    const result = await this.request<any>('record/list', { domain_id: zone.id, page: 1, page_size: 100 });
    return (result.data || []).map((r: any) => ({
      remote_id: r.record_id.toString(),
      name: r.sub_domain,
      type: r.record_type,
      value: r.record_value,
      line_id: 'default',
      line: '默认',
    }));
  }
}

registerProvider('dnsdun', () => new DNSDunProvider());
