import { Provider, Zone, RecordInput, DNSRecord, RecordLine, ConfigField } from '../provider';
import { registerProvider } from '../registry';

export class WestProvider implements Provider {
  private username: string = '';
  private apiKey: string = '';

  key(): string {
    return 'west';
  }

  label(): string {
    return '西部数码';
  }

  configFields(): ConfigField[] {
    return [
      { name: 'username', label: '用户名', required: true, secret: false },
      { name: 'api_key', label: 'API Key', required: true, secret: true },
    ];
  }

  configure(config: Record<string, string>): void {
    this.username = config.username || '';
    this.apiKey = config.api_key || '';
  }

  private async request<T>(action: string, params: Record<string, any> = {}): Promise<T> {
    const body = new URLSearchParams({
      username: this.username,
      apikey: this.apiKey,
      act: action,
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    });

    const response = await fetch('https://apipanel.west.cn/api/domain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await response.json();
    if (data.result !== 200) {
      throw new Error(`West API error: ${data.msg || data.message}`);
    }
    return data;
  }

  async check(): Promise<void> {
    await this.request('domain:getdomainlist', { page: 1, limit: 1 });
  }

  async listZones(): Promise<Zone[]> {
    const result = await this.request<any>('domain:getdomainlist', { page: 1, limit: 100 });
    return (result.data?.list || []).map((d: any) => ({ id: d.domain, domain: d.domain }));
  }

  async listRecordLines(_zone: Zone): Promise<RecordLine[]> {
    return [{ id: 'default', name: '默认' }];
  }

  async createRecord(zone: Zone, input: RecordInput): Promise<DNSRecord> {
    const result = await this.request<any>('domain:adddnsrecord', {
      domain: zone.domain,
      host: input.name,
      type: input.type,
      value: input.value,
    });
    return {
      remote_id: result.data?.record_id?.toString() || '',
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async updateRecord(zone: Zone, remoteId: string, input: RecordInput): Promise<DNSRecord> {
    await this.request('domain:updatednsrecord', {
      domain: zone.domain,
      record_id: remoteId,
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

  async deleteRecord(zone: Zone, remoteId: string): Promise<void> {
    await this.request('domain:deldnsrecord', {
      domain: zone.domain,
      record_id: remoteId,
    });
  }

  async getRecord(zone: Zone, remoteId: string): Promise<DNSRecord> {
    const result = await this.request<any>('domain:getdnsrecord', {
      domain: zone.domain,
      record_id: remoteId,
    });
    const r = result.data;
    return {
      remote_id: remoteId,
      name: r.host,
      type: r.type,
      value: r.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async listRecords(zone: Zone): Promise<DNSRecord[]> {
    const result = await this.request<any>('domain:getdnsrecordlist', {
      domain: zone.domain,
      page: 1,
      limit: 100,
    });
    return (result.data?.list || []).map((r: any) => ({
      remote_id: r.record_id.toString(),
      name: r.host,
      type: r.type,
      value: r.value,
      line_id: 'default',
      line: '默认',
    }));
  }
}

registerProvider('west', () => new WestProvider());
