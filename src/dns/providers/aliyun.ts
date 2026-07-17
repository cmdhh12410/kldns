import { Provider, Zone, RecordInput, DNSRecord, RecordLine, ConfigField } from '../provider';
import { registerProvider } from '../registry';

export class AliyunProvider implements Provider {
  private accessKeyId: string = '';
  private accessKeySecret: string = '';

  key(): string {
    return 'aliyun';
  }

  label(): string {
    return '阿里云 DNS';
  }

  configFields(): ConfigField[] {
    return [
      {
        name: 'access_key_id',
        label: 'AccessKey ID',
        required: true,
        secret: false,
      },
      {
        name: 'access_key_secret',
        label: 'AccessKey Secret',
        required: true,
        secret: true,
      },
    ];
  }

  configure(config: Record<string, string>): void {
    this.accessKeyId = config.access_key_id || '';
    this.accessKeySecret = config.access_key_secret || '';
  }

  private async request<T>(
    action: string,
    params: Record<string, any> = {}
  ): Promise<T> {
    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    const signatureNonce = Math.random().toString(36).substring(2);
    
    const commonParams = {
      Format: 'JSON',
      Version: '2015-01-09',
      AccessKeyId: this.accessKeyId,
      SignatureMethod: 'HMAC-SHA1',
      Timestamp: timestamp,
      SignatureVersion: '1.0',
      SignatureNonce: signatureNonce,
      Action: action,
      ...params,
    };

    const response = await fetch('https://alidns.aliyuncs.com/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Aliyun DNS API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.Code && data.Code !== '200') {
      throw new Error(`Aliyun DNS API error: ${data.Message}`);
    }

    return data;
  }

  async check(): Promise<void> {
    await this.request('DescribeDomains', { PageSize: '1' });
  }

  async listZones(): Promise<Zone[]> {
    const result = await this.request<any>('DescribeDomains', {
      PageSize: '100',
      PageNumber: '1',
    });

    const domains = result.Domains?.Domain || [];
    return domains.map((domain: any) => ({
      id: domain.DomainId,
      domain: domain.DomainName,
    }));
  }

  async listRecordLines(_zone: Zone): Promise<RecordLine[]> {
    return [{ id: 'default', name: '默认' }];
  }

  async createRecord(zone: Zone, input: RecordInput): Promise<DNSRecord> {
    const result = await this.request<any>('AddDomainRecord', {
      DomainName: zone.domain,
      RR: input.name,
      Type: input.type,
      Value: input.value,
      Line: 'default',
    });

    return {
      remote_id: result.RecordId,
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
    await this.request('UpdateDomainRecord', {
      RecordId: remoteId,
      RR: input.name,
      Type: input.type,
      Value: input.value,
      Line: 'default',
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
    await this.request('DeleteDomainRecord', {
      RecordId: remoteId,
    });
  }

  async getRecord(_zone: Zone, remoteId: string): Promise<DNSRecord> {
    const result = await this.request<any>('DescribeDomainRecordInfo', {
      RecordId: remoteId,
    });

    return {
      remote_id: remoteId,
      name: result.RR,
      type: result.Type,
      value: result.Value,
      line_id: 'default',
      line: '默认',
    };
  }

  async listRecords(zone: Zone): Promise<DNSRecord[]> {
    const result = await this.request<any>('DescribeDomainRecords', {
      DomainName: zone.domain,
      PageSize: '100',
      PageNumber: '1',
    });

    const records = result.DomainRecords?.DomainRecord || [];
    return records.map((record: any) => ({
      remote_id: record.RecordId,
      name: record.RR,
      type: record.Type,
      value: record.Value,
      line_id: 'default',
      line: record.Line || '默认',
    }));
  }
}

registerProvider('aliyun', () => new AliyunProvider());
