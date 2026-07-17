import { Provider, Zone, RecordInput, DNSRecord, RecordLine, ConfigField } from '../provider';
import { registerProvider } from '../registry';

export class GoogleProvider implements Provider {
  private projectId: string = '';
  private serviceAccountKey: string = '';

  key(): string {
    return 'google';
  }

  label(): string {
    return 'Google Cloud DNS';
  }

  configFields(): ConfigField[] {
    return [
      { name: 'project_id', label: 'Project ID', required: true, secret: false },
      { name: 'service_account_key', label: 'Service Account Key (JSON)', required: true, secret: true },
    ];
  }

  configure(config: Record<string, string>): void {
    this.projectId = config.project_id || '';
    this.serviceAccountKey = config.service_account_key || '';
  }

  private async request<T>(method: string, path: string, body?: any): Promise<T> {
    const response = await fetch(`https://dns.googleapis.com/dns/v1${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.serviceAccountKey}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google DNS API error: ${response.status} - ${error}`);
    }

    if (method === 'DELETE') return {} as T;
    return await response.json();
  }

  async check(): Promise<void> {
    await this.request('GET', `/projects/${this.projectId}/managedZones?maxResults=1`);
  }

  async listZones(): Promise<Zone[]> {
    const result = await this.request<any>('GET', `/projects/${this.projectId}/managedZones?maxResults=100`);
    return (result.managedZones || []).map((z: any) => ({
      id: z.id.toString(),
      domain: z.dnsName.replace(/\.$/, ''),
    }));
  }

  async listRecordLines(_zone: Zone): Promise<RecordLine[]> {
    return [{ id: 'default', name: '默认' }];
  }

  async createRecord(zone: Zone, input: RecordInput): Promise<DNSRecord> {
    const recordName = input.name === '@' ? zone.domain : `${input.name}.${zone.domain}`;
    await this.request('POST', `/projects/${this.projectId}/managedZones/${zone.id}/rrsets`, {
      name: `${recordName}.`,
      type: input.type,
      ttl: 300,
      rrdatas: [input.value],
    });
    return {
      remote_id: `${recordName}:${input.type}`,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async updateRecord(zone: Zone, _remoteId: string, input: RecordInput): Promise<DNSRecord> {
    const recordName = input.name === '@' ? zone.domain : `${input.name}.${zone.domain}`;
    await this.request('PATCH', `/projects/${this.projectId}/managedZones/${zone.id}/rrsets/${recordName}/${input.type}`, {
      ttl: 300,
      rrdatas: [input.value],
    });
    return {
      remote_id: `${recordName}:${input.type}`,
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async deleteRecord(zone: Zone, remoteId: string): Promise<void> {
    const [name, type] = remoteId.split(':');
    const recordName = name === '@' ? zone.domain : `${name}.${zone.domain}`;
    await this.request('DELETE', `/projects/${this.projectId}/managedZones/${zone.id}/rrsets/${recordName}/${type}`);
  }

  async getRecord(zone: Zone, remoteId: string): Promise<DNSRecord> {
    const [name, type] = remoteId.split(':');
    const recordName = name === '@' ? zone.domain : `${name}.${zone.domain}`;
    const result = await this.request<any>('GET', `/projects/${this.projectId}/managedZones/${zone.id}/rrsets/${recordName}/${type}`);
    return {
      remote_id: remoteId,
      name: name,
      type: result.type,
      value: result.rrdatas?.[0] || '',
      line_id: 'default',
      line: '默认',
    };
  }

  async listRecords(zone: Zone): Promise<DNSRecord[]> {
    const result = await this.request<any>('GET', `/projects/${this.projectId}/managedZones/${zone.id}/rrsets?maxResults=100`);
    return (result.rrsets || [])
      .filter((r: any) => r.type !== 'NS' && r.type !== 'SOA')
      .map((r: any) => ({
        remote_id: `${r.name.replace(`.${zone.domain}.`, '').replace(`${zone.domain}.`, '@')}:${r.type}`,
        name: r.name.replace(`.${zone.domain}.`, '').replace(`${zone.domain}.`, '@'),
        type: r.type,
        value: r.rrdatas?.[0] || '',
        line_id: 'default',
        line: '默认',
      }));
  }
}

registerProvider('google', () => new GoogleProvider());
