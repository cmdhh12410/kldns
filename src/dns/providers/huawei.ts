import { Provider, Zone, RecordInput, DNSRecord, RecordLine, ConfigField } from '../provider';
import { registerProvider } from '../registry';

export class HuaweiProvider implements Provider {
  private accessKeyId: string = '';
  private secretAccessKey: string = '';

  key(): string {
    return 'huawei';
  }

  label(): string {
    return '华为云 DNS';
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
    const response = await fetch(`https://dns.myhuaweicloud.com${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': this.secretAccessKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    if (data.error_code) {
      throw new Error(`Huawei DNS API error: ${data.error_msg}`);
    }
    return data;
  }

  async check(): Promise<void> {
    await this.request('GET', '/v2/zones?limit=1');
  }

  async listZones(): Promise<Zone[]> {
    const result = await this.request<any>('GET', '/v2/zones?limit=100');
    return (result.zones || []).map((z: any) => ({ id: z.id, domain: z.name.replace(/\.$/, '') }));
  }

  async listRecordLines(_zone: Zone): Promise<RecordLine[]> {
    return [{ id: 'default', name: '默认' }];
  }

  async createRecord(zone: Zone, input: RecordInput): Promise<DNSRecord> {
    const result = await this.request<any>('POST', `/v2/zones/${zone.id}/recordsets`, {
      name: `${input.name}.${zone.domain}.`,
      type: input.type,
      records: [input.value],
    });
    return {
      remote_id: result.id,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async updateRecord(zone: Zone, remoteId: string, input: RecordInput): Promise<DNSRecord> {
    await this.request('PUT', `/v2/zones/${zone.id}/recordsets/${remoteId}`, {
      name: `${input.name}.${zone.domain}.`,
      type: input.type,
      records: [input.value],
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
    await this.request('DELETE', `/v2/zones/${zone.id}/recordsets/${remoteId}`);
  }

  async getRecord(zone: Zone, remoteId: string): Promise<DNSRecord> {
    const result = await this.request<any>('GET', `/v2/zones/${zone.id}/recordsets/${remoteId}`);
    return {
      remote_id: remoteId,
      name: result.name.replace(`.${zone.domain}.`, ''),
      type: result.type,
      value: result.records[0],
      line_id: 'default',
      line: '默认',
    };
  }

  async listRecords(zone: Zone): Promise<DNSRecord[]> {
    const result = await this.request<any>('GET', `/v2/zones/${zone.id}/recordsets?limit=100`);
    return (result.recordsets || []).map((r: any) => ({
      remote_id: r.id,
      name: r.name.replace(`.${zone.domain}.`, ''),
      type: r.type,
      value: r.records[0],
      line_id: 'default',
      line: '默认',
    }));
  }
}

registerProvider('huawei', () => new HuaweiProvider());
