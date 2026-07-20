import { Database, SubdomainRepository, RecordRepository } from '../repositories';
import { User, Domain, Subdomain, OperationLog } from '../models';
import { SettingsRepository } from '../repositories/settings.repository';

export class SubdomainService {
  private subdomainRepo: SubdomainRepository;
  private recordRepo: RecordRepository;
  private settingsRepo: SettingsRepository;

  constructor(private db: Database) {
    this.subdomainRepo = new SubdomainRepository(db);
    this.recordRepo = new RecordRepository(db);
    this.settingsRepo = new SettingsRepository(db);
  }

  async registerSubdomain(
    user: User,
    did: number,
    name: string,
    purpose: string = ''
  ): Promise<Subdomain> {
    const domain = await this.recordRepo.getDomainForGroup(did, user.group_id);
    if (!domain) {
      throw new Error('Domain not found or no permission');
    }

    if (domain.points_cost > 0 && user.points < domain.points_cost) {
      throw new Error('Insufficient points');
    }

    const reserved = await this.settingsRepo.getReserveDomainNames();
    if (reserved.includes(name.toLowerCase())) {
      throw new Error('This subdomain name is reserved');
    }

    const exists = await this.subdomainRepo.existsByName(domain.id, name);
    if (exists) {
      throw new Error('该二级域名已被注册，请换一个名称');
    }

    const requireReview = domain.require_review === 1;

    const log: OperationLog = {
      uid: user.id,
      source: 'web',
      target_type: 'subdomain',
      target_id: `${name}.${domain.domain}`,
      action: 'register',
      message: `Register subdomain ${name}.${domain.domain}`,
      extra: JSON.stringify({ domain: domain.domain, name, purpose, requireReview }),
    };

    const subdomain = await this.subdomainRepo.registerSubdomain(
      user,
      domain,
      name,
      purpose,
      requireReview,
      log
    );

    return subdomain;
  }

  async deleteSubdomain(user: User, subdomainId: number): Promise<void> {
    const result = await this.db.queryOne<any>(
      `SELECT s.*, d.points_cost, d.domain 
       FROM subdomains s 
       JOIN domains d ON d.id = s.did 
       WHERE s.id = ? AND s.uid = ?`,
      [subdomainId, user.id]
    );

    if (!result) {
      throw new Error('Subdomain not found');
    }

    const subdomain: Subdomain = {
      id: result.id,
      uid: result.uid,
      did: result.did,
      name: result.name,
      full_domain: result.full_domain,
      status: result.status,
      purpose: result.purpose,
      reject_reason: result.reject_reason,
      reviewed_by: result.reviewed_by,
      reviewed_at: result.reviewed_at,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };

    const recordCount = await this.subdomainRepo.countRecordsForSubdomain(subdomainId, user.id);
    if (recordCount > 0) {
      throw new Error('Please delete all records under this subdomain first');
    }

    const log: OperationLog = {
      uid: user.id,
      source: 'web',
      target_type: 'subdomain',
      target_id: subdomain.full_domain,
      action: 'delete',
      message: `Delete subdomain ${subdomain.full_domain}`,
      extra: JSON.stringify({ subdomain_id: subdomain.id, full_domain: subdomain.full_domain }),
    };

    await this.subdomainRepo.deleteSubdomain(subdomain, log);
  }

  async listSubdomains(user: User, status?: number, keyword?: string): Promise<Subdomain[]> {
    return await this.subdomainRepo.listSubdomains(user.id, status, keyword);
  }

  async getSubdomain(user: User, subdomainId: number): Promise<Subdomain | null> {
    const result = await this.db.queryOne<any>(
      `SELECT s.* FROM subdomains s WHERE s.id = ? AND s.uid = ?`,
      [subdomainId, user.id]
    );

    if (!result) return null;

    return {
      id: result.id,
      uid: result.uid,
      did: result.did,
      name: result.name,
      full_domain: result.full_domain,
      status: result.status,
      purpose: result.purpose,
      reject_reason: result.reject_reason,
      reviewed_by: result.reviewed_by,
      reviewed_at: result.reviewed_at,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
  }
}
