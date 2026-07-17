import { Provider, Zone, RecordInput, DNSRecord, RecordLine, ConfigField } from '../provider';
import { registerProvider } from '../registry';

export class DNSPodProvider implements Provider {
  private secretId: string = '';
  private secretKey: string = '';

  key(): string {
    return 'dnspod';
  }

  label(): string {
    return 'DNSPod (腾讯云)';
  }

  configFields(): ConfigField[] {
    return [
      {
        name: 'secret_id',
        label: 'SecretId',
        required: true,
        secret: false,
      },
      {
        name: 'secret_key',
        label: 'SecretKey',
        required: true,
        secret: true,
      },
    ];
  }

  configure(config: Record<string, string>): void {
    this.secretId = config.secret_id || '';
    this.secretKey = config.secret_key || '';
  }

  private async request<T>(
    action: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    const timestamp = Math.floor(Date.now() / 1000);
    const body = {
      ...params,
      LoginToken: `${this.secretId},${this.secretKey}`,
      Format: 'json',
    };

    const response = await fetch(`https://dnspod.tencentcloudapi.com/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`DNSPod API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.Response && data.Response.Error) {
      throw new Error(`DNSPod API error: ${data.Response.Error.Message}`);
    }

    return data.Response || data;
  }

  async check(): Promise<void> {
    await this.request('DescribeUserDetail', {});
  }

  async listZones(): Promise<Zone[]> {
    const result = await this.request<any>('DescribeDomainList', {
      Offset: 0,
      Limit: 100,
    });

    const domainList = result.DomainList || [];
    return domainList.map((domain: any) => ({
      id: domain.DomainId.toString(),
      domain: domain.Name,
    }));
  }

  async listRecordLines(_zone: Zone): Promise<RecordLine[]> {
    return [{ id: 'default', name: '默认' }];
  }

  async createRecord(zone: Zone, input: RecordInput): Promise<DNSRecord> {
    const result = await this.request<any>('CreateRecord', {
      Domain: zone.domain,
      SubDomain: input.name,
      RecordType: input.type,
      RecordLine: '默认',
      Value: input.value,
    });

    return {
      remote_id: result.RecordId.toString(),
      name: input.name,
      type: input.type,
      value: input.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async updateRecord(
    zone: Zone,
    remoteId: string,
    input: RecordInput
  ): Promise<DNSRecord> {
    await this.request('ModifyRecord', {
      Domain: zone.domain,
      RecordId: remoteId,
      SubDomain: input.name,
      RecordType: input.type,
      RecordLine: '默认',
      Value: input.value,
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
    await this.request('DeleteRecord', {
      Domain: zone.domain,
      RecordId: remoteId,
    });
  }

  async getRecord(zone: Zone, remoteId: string): Promise<DNSRecord> {
    const result = await this.request<any>('DescribeRecord', {
      Domain: zone.domain,
      RecordId: remoteId,
    });

    const info = result.RecordInfo || result;
    return {
      remote_id: remoteId,
      name: info.SubDomain || info.name,
      type: info.RecordType || info.type,
      value: info.Value || info.value,
      line_id: 'default',
      line: '默认',
    };
  }

  async listRecords(zone: Zone): Promise<DNSRecord[]> {
    const result = await this.request<any>('DescribeRecordList', {
      Domain: zone.domain,
      Offset: 0,
      Limit: 100,
    });

    const recordList = result.RecordList || [];
    return recordList.map((record: any) => ({
      remote_id: record.RecordId.toString(),
      name: record.Name,
      type: record.Type,
      value: record.Value,
      line_id: 'default',
      line: record.Line || '默认',
    }));
  }
}

registerProvider('dnspod', () => new DNSPodProvider());
