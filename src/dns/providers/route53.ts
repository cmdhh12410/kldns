import { Provider, Zone, RecordInput, DNSRecord, RecordLine, ConfigField } from '../provider';
import { registerProvider } from '../registry';

export class Route53Provider implements Provider {
  private accessKeyId: string = '';
  private secretAccessKey: string = '';
  private region: string = 'us-east-1';

  key(): string {
    return 'route53';
  }

  label(): string {
    return 'AWS Route53';
  }

  configFields(): ConfigField[] {
    return [
      { name: 'access_key_id', label: 'Access Key ID', required: true, secret: false },
      { name: 'secret_access_key', label: 'Secret Access Key', required: true, secret: true },
      { name: 'region', label: 'Region', required: false, secret: false, description: '默认 us-east-1' },
    ];
  }

  configure(config: Record<string, string>): void {
    this.accessKeyId = config.access_key_id || '';
    this.secretAccessKey = config.secret_access_key || '';
    this.region = config.region || 'us-east-1';
  }

  private async request<T>(method: string, path: string, body?: any): Promise<T> {
    const response = await fetch(`https://route53.amazonaws.com${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Route53 API error: ${response.status} - ${error}`);
    }

    if (method === 'DELETE') return {} as T;
    return await response.json();
  }

  async check(): Promise<void> {
    await this.request('GET', '/2013-04-01/hostedzone?maxitems=1');
  }

  async listZones(): Promise<Zone[]> {
    const result = await this.request<any>('GET', '/2013-04-01/hostedzone?maxitems=100');
    const zones = result.HostedZones?.HostedZone || [];
    return zones.map((z: any) => ({
      id: z.Id.replace('/hostedzone/', ''),
      domain: z.Name.replace(/\.$/, ''),
    }));
  }

  async listRecordLines(_zone: Zone): Promise<RecordLine[]> {
    return [{ id: 'default', name: '默认' }];
  }

  async createRecord(zone: Zone, input: RecordInput): Promise<DNSRecord> {
    const recordName = input.name === '@' ? zone.domain : `${input.name}.${zone.domain}`;
    await this.request('POST', `/2013-04-01/hostedzone/${zone.id}/rrset`, {
      Changes: [{
        Action: 'CREATE',
        ResourceRecordSet: {
          Name: recordName,
          Type: input.type,
          TTL: 300,
          ResourceRecords: [{ Value: input.value }],
        },
      }],
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
    await this.request('POST', `/2013-04-01/hostedzone/${zone.id}/rrset`, {
      Changes: [{
        Action: 'UPSERT',
        ResourceRecordSet: {
          Name: recordName,
          Type: input.type,
          TTL: 300,
          ResourceRecords: [{ Value: input.value }],
        },
      }],
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
    await this.request('POST', `/2013-04-01/hostedzone/${zone.id}/rrset`, {
      Changes: [{
        Action: 'DELETE',
        ResourceRecordSet: {
          Name: recordName,
          Type: type,
          TTL: 300,
          ResourceRecords: [{ Value: '' }],
        },
      }],
    });
  }

  async getRecord(zone: Zone, remoteId: string): Promise<DNSRecord> {
    const [name, type] = remoteId.split(':');
    const recordName = name === '@' ? zone.domain : `${name}.${zone.domain}`;
    const result = await this.request<any>('GET', `/2013-04-01/hostedzone/${zone.id}/rrset?name=${recordName}&type=${type}`);
    const record = result.ResourceRecordSets?.ResourceRecordSet?.[0];
    return {
      remote_id: remoteId,
      name: name,
      type: type,
      value: record?.ResourceRecords?.ResourceRecord?.[0]?.Value || '',
      line_id: 'default',
      line: '默认',
    };
  }

  async listRecords(zone: Zone): Promise<DNSRecord[]> {
    const result = await this.request<any>('GET', `/2013-04-01/hostedzone/${zone.id}/rrset?maxitems=100`);
    const records = result.ResourceRecordSets?.ResourceRecordSet || [];
    return records
      .filter((r: any) => r.Type !== 'NS' && r.Type !== 'SOA')
      .map((r: any) => ({
        remote_id: `${r.Name.replace(`.${zone.domain}`, '').replace(zone.domain, '@')}:${r.Type}`,
        name: r.Name.replace(`.${zone.domain}`, '').replace(zone.domain, '@'),
        type: r.Type,
        value: r.ResourceRecords?.ResourceRecord?.[0]?.Value || '',
        line_id: 'default',
        line: '默认',
      }));
  }
}

registerProvider('route53', () => new Route53Provider());
