import { Database, RecordRepository, SubdomainRepository } from '../repositories';
import { User, Domain, Record, Subdomain, OperationLog } from '../models';
import { getProvider, Provider, Zone, RecordInput, DNSRecord } from '../dns';

export class RecordService {
  private recordRepo: RecordRepository;
  private subdomainRepo: SubdomainRepository;

  constructor(private db: Database) {
    this.recordRepo = new RecordRepository(db);
    this.subdomainRepo = new SubdomainRepository(db);
  }

  async submitRecord(
    user: User,
    did: number,
    subdomainId: number,
    name: string,
    type: string,
    value: string,
    lineId: string = 'default'
  ): Promise<Record> {
    const domain = await this.recordRepo.getDomainForGroup(did, user.group_id);
    if (!domain) {
      throw new Error('Domain not found or no permission');
    }

    const subdomain = await this.subdomainRepo.getSubdomainForUser(subdomainId, user.id);
    if (!subdomain) {
      throw new Error('Subdomain not found or no permission');
    }

    const fullName = name === '@' ? subdomain.name : `${name}.${subdomain.name}`;
    
    const exists = await this.recordRepo.recordNameExists(did, fullName, type, 0);
    if (exists) {
      throw new Error('Record already exists');
    }

    const provider = getProvider(domain.provider_key);
    if (!provider) {
      throw new Error('DNS provider not found');
    }

    provider.configure(JSON.parse(domain.provider_config_ciphertext || '{}'));

    const zone: Zone = { id: domain.remote_zone_id, domain: domain.domain };
    const input: RecordInput = { name: fullName, type, value, line_id: lineId };

    const remoteRecord = await provider.createRecord(zone, input);

    const record: Record = {
      id: 0,
      uid: user.id,
      did,
      subdomain_id: subdomainId,
      record_id: remoteRecord.remote_id,
      name: fullName,
      type,
      value,
      line_id: lineId,
      line: remoteRecord.line,
    };

    const log: OperationLog = {
      uid: user.id,
      source: 'web',
      target_type: 'record',
      target_id: remoteRecord.remote_id,
      action: 'create',
      message: `Create record ${fullName} ${type} ${value}`,
      extra: JSON.stringify({ domain: domain.domain, provider: domain.provider_key }),
    };

    await this.recordRepo.applyCreatedRecord(user, domain, record, log);

    return record;
  }

  async updateRecord(
    user: User,
    recordId: number,
    name: string,
    type: string,
    value: string,
    lineId: string = 'default'
  ): Promise<Record> {
    const record = await this.recordRepo.getRecordForUser(recordId, user.id);
    if (!record) {
      throw new Error('Record not found');
    }

    const domain = await this.recordRepo.getDomainForGroup(record.did, user.group_id);
    if (!domain) {
      throw new Error('Domain not found');
    }

    const provider = getProvider(domain.provider_key);
    if (!provider) {
      throw new Error('DNS provider not found');
    }

    provider.configure(JSON.parse(domain.provider_config_ciphertext || '{}'));

    const zone: Zone = { id: domain.remote_zone_id, domain: domain.domain };
    const input: RecordInput = { name, type, value, line_id: lineId };

    await provider.updateRecord(zone, record.record_id, input);

    const updatedRecord: Record = {
      ...record,
      name,
      type,
      value,
      line_id: lineId,
    };

    const log: OperationLog = {
      uid: user.id,
      source: 'web',
      target_type: 'record',
      target_id: record.record_id,
      action: 'update',
      message: `Update record ${name} ${type} ${value}`,
      extra: JSON.stringify({ domain: domain.domain, provider: domain.provider_key }),
    };

    await this.recordRepo.applyUpdatedRecord(recordId, updatedRecord, log);

    return updatedRecord;
  }

  async deleteRecord(user: User, recordId: number): Promise<void> {
    const record = await this.recordRepo.getRecordForUser(recordId, user.id);
    if (!record) {
      throw new Error('Record not found');
    }

    const domain = await this.recordRepo.getDomainForGroup(record.did, user.group_id);
    if (!domain) {
      throw new Error('Domain not found');
    }

    const provider = getProvider(domain.provider_key);
    if (!provider) {
      throw new Error('DNS provider not found');
    }

    provider.configure(JSON.parse(domain.provider_config_ciphertext || '{}'));

    const zone: Zone = { id: domain.remote_zone_id, domain: domain.domain };
    await provider.deleteRecord(zone, record.record_id);

    const log: OperationLog = {
      uid: user.id,
      source: 'web',
      target_type: 'record',
      target_id: record.record_id,
      action: 'delete',
      message: `Delete record ${record.name}`,
      extra: JSON.stringify({ domain: domain.domain, provider: domain.provider_key }),
    };

    await this.recordRepo.applyDeletedRecord(recordId, log);
  }

  async listRecords(user: User, did?: number, subdomainId?: number, type?: string, keyword?: string): Promise<Record[]> {
    return await this.recordRepo.listRecords(user.id, did, subdomainId, type, keyword);
  }

  async getRecord(user: User, recordId: number): Promise<Record | null> {
    return await this.recordRepo.getRecordForUser(recordId, user.id);
  }
}
