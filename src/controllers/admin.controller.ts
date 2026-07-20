import { Context } from 'hono';
import { Database, AdminRepository, PointsRepository } from '../repositories';
import { PointsService } from '../services';
import { getAuth } from '../middleware/auth';
import { getRegisteredKeys, getProvider, Provider, Zone, DNSRecord } from '../dns';
import { encrypt, decrypt } from '../utils/secrets';
import { loadEnvConfig } from '../config/env';

export class AdminController {
  constructor(private db: Database) {}

  async getUsers(c: Context) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const page = parseInt(c.req.query('page') || '1');
      const page_size = parseInt(c.req.query('page_size') || c.req.query('limit') || '100');
      const limit = page_size;
      const offset = (page - 1) * page_size;
      
      const users = await adminRepo.getUsers(limit, offset);
      const count = await adminRepo.getUsersCount();
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: {
          items: users,
          total: count,
          page,
          page_size
        }
      });
    } catch (error: any) {
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get users: ' + (error?.message || String(error)) }, 500);
    }
  }

  async createUser(c: Context) {
    try {
      const body = await c.req.json();
      const { username, email, password, group_id, status, points } = body;

      if (!username || !password) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing required fields' }, 400);
      }

      const adminRepo = new AdminRepository(this.db);
      const userId = await adminRepo.createUser(
        username,
        email || '',
        password,
        group_id || 100,
        status || 1,
        points || 0
      );

      return c.json({
        code: 'OK',
        message: 'User created successfully',
        data: { id: userId }
      }, 201);
    } catch (error) {
      console.error('Create user error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to create user' }, 500);
    }
  }

  async updateUser(c: Context) {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();

      if (!id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing user ID' }, 400);
      }

      const adminRepo = new AdminRepository(this.db);
      await adminRepo.updateUser(parseInt(id), body);

      return c.json({
        code: 'OK',
        message: 'User updated successfully'
      });
    } catch (error) {
      console.error('Update user error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to update user' }, 500);
    }
  }

  async deleteUser(c: Context) {
    try {
      const id = c.req.param('id');
      
      if (!id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing user ID' }, 400);
      }

      const adminRepo = new AdminRepository(this.db);
      await adminRepo.deleteUser(parseInt(id));

      return c.json({
        code: 'OK',
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to delete user' }, 500);
    }
  }

  async adjustPoints(c: Context) {
    try {
      const auth = getAuth(c);
      const id = c.req.param('id');
      const body = await c.req.json();
      const { delta, action, remark } = body;

      if (!id || delta === undefined || !action || !remark) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing required fields' }, 400);
      }

      const pointsService = new PointsService(this.db);
      const result = await pointsService.adjustPoints(
        parseInt(id),
        auth.user.id,
        delta,
        action,
        remark
      );

      return c.json({
        code: 'OK',
        message: 'Points adjusted successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Adjust points error:', error);
      if (error.message === 'USER_NOT_FOUND') {
        return c.json({ code: 'USER_NOT_FOUND', message: 'User not found' }, 404);
      }
      if (error.message === 'INSUFFICIENT_POINTS') {
        return c.json({ code: 'INSUFFICIENT_POINTS', message: 'Insufficient points' }, 400);
      }
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to adjust points' }, 500);
    }
  }

  async getGroups(c: Context) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const groups = await adminRepo.getGroups();
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: groups
      });
    } catch (error) {
      console.error('Get groups error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get groups' }, 500);
    }
  }

  async createGroup(c: Context) {
    try {
      const body = await c.req.json();
      const { name } = body;

      if (!name) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing required fields' }, 400);
      }

      const adminRepo = new AdminRepository(this.db);
      const groupId = await adminRepo.createGroup(name);

      return c.json({
        code: 'OK',
        message: 'Group created successfully',
        data: { id: groupId }
      }, 201);
    } catch (error) {
      console.error('Create group error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to create group' }, 500);
    }
  }

  async deleteGroup(c: Context) {
    try {
      const id = c.req.param('id');
      
      if (!id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing group ID' }, 400);
      }

      const adminRepo = new AdminRepository(this.db);
      await adminRepo.deleteGroup(parseInt(id));

      return c.json({
        code: 'OK',
        message: 'Group deleted successfully'
      });
    } catch (error) {
      console.error('Delete group error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to delete group' }, 500);
    }
  }

  async getDomains(c: Context) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const page = parseInt(c.req.query('page') || '1');
      const page_size = parseInt(c.req.query('page_size') || c.req.query('limit') || '100');
      const limit = page_size;
      const offset = (page - 1) * page_size;
      
      const domains = await adminRepo.getDomains(limit, offset);
      const count = await adminRepo.getDomainsCount();
      
      const domainsWithLabel = domains.map(domain => {
        const provider = getProvider(domain.provider_key);
        return {
          ...domain,
          provider_label: provider ? provider.label() : domain.provider_key
        };
      });
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: {
          items: domainsWithLabel,
          total: count,
          page,
          page_size
        }
      });
    } catch (error: any) {
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get domains: ' + (error?.message || String(error)) }, 500);
    }
  }

  async createDomain(c: Context) {
    try {
      const body = await c.req.json();
      const { domain, provider_key, remote_zone_id, points_cost, record_types, beian, require_review, description, provider_config, group_policy } = body;

      if (!domain || !provider_key || !remote_zone_id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing required fields' }, 400);
      }

      const envConfig = loadEnvConfig(c.env);
      const recordTypesStr = Array.isArray(record_types) ? record_types.join(',') : (record_types || 'A,CNAME');

      let providerConfigCiphertext = '';
      if (provider_config && Object.keys(provider_config).length > 0) {
        providerConfigCiphertext = await encrypt(JSON.stringify(provider_config), envConfig.SECRET_KEY);
      }

      const adminRepo = new AdminRepository(this.db);
      const domainId = await adminRepo.createDomain(
        domain,
        provider_key,
        remote_zone_id,
        points_cost || 0,
        recordTypesStr,
        beian || 0,
        require_review || 0,
        description || '',
        providerConfigCiphertext,
        group_policy || '0'
      );

      return c.json({
        code: 'OK',
        message: 'Domain created successfully',
        data: { id: domainId }
      }, 201);
    } catch (error) {
      console.error('Create domain error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to create domain' }, 500);
    }
  }

  async updateDomain(c: Context) {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();

      if (!id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing domain ID' }, 400);
      }

      const updates: any = {};
      if (body.domain !== undefined) updates.domain = body.domain;
      if (body.points_cost !== undefined) updates.points_cost = body.points_cost;
      if (body.beian !== undefined) updates.beian = body.beian;
      if (body.require_review !== undefined) updates.require_review = body.require_review;
      if (body.description !== undefined) updates.description = body.description;
      if (body.group_policy !== undefined) updates.group_policy = body.group_policy;
      if (body.record_types !== undefined) {
        updates.record_types = Array.isArray(body.record_types)
          ? body.record_types.join(',')
          : body.record_types;
      }

      if (body.provider_config && Object.keys(body.provider_config).length > 0) {
        const envConfig = loadEnvConfig(c.env);
        updates.provider_config_ciphertext = await encrypt(JSON.stringify(body.provider_config), envConfig.SECRET_KEY);
      }

      const adminRepo = new AdminRepository(this.db);
      await adminRepo.updateDomain(parseInt(id), updates);

      return c.json({
        code: 'OK',
        message: 'Domain updated successfully'
      });
    } catch (error) {
      console.error('Update domain error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to update domain' }, 500);
    }
  }

  async deleteDomain(c: Context) {
    try {
      const id = c.req.param('id');
      
      if (!id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing domain ID' }, 400);
      }

      const adminRepo = new AdminRepository(this.db);
      await adminRepo.deleteDomain(parseInt(id));

      return c.json({
        code: 'OK',
        message: 'Domain deleted successfully'
      });
    } catch (error) {
      console.error('Delete domain error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to delete domain' }, 500);
    }
  }

  async syncDomainRecords(c: Context) {
    try {
      const id = c.req.param('id');
      
      if (!id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing domain ID' }, 400);
      }

      const adminRepo = new AdminRepository(this.db);
      const domain = await adminRepo.getDomainById(parseInt(id));
      
      if (!domain) {
        return c.json({ code: 'NOT_FOUND', message: 'Domain not found' }, 404);
      }

      const provider = getProvider(domain.provider_key);
      if (!provider) {
        return c.json({ code: 'PROVIDER_NOT_FOUND', message: 'DNS provider not found' }, 404);
      }

      const envConfig = loadEnvConfig(c.env);
      let providerConfig: Record<string, string> = {};
      if (domain.provider_config_ciphertext) {
        try {
          const decrypted = await decrypt(domain.provider_config_ciphertext, envConfig.SECRET_KEY);
          providerConfig = JSON.parse(decrypted);
        } catch (e) {
          console.error('Failed to decrypt provider config:', e);
          return c.json({ code: 'CONFIG_ERROR', message: 'Failed to decrypt provider configuration' }, 500);
        }
      } else {
        return c.json({ code: 'NO_CONFIG', message: '该域名未配置 DNS 平台凭证，请先编辑域名并填写 API Token' }, 400);
      }

      // Validate required config fields
      const configFields = provider.configFields();
      for (const field of configFields) {
        if (field.required && !providerConfig[field.name]?.trim()) {
          return c.json({ code: 'MISSING_CONFIG', message: `缺少必填配置项: ${field.label}（${field.name}），请编辑域名并填写` }, 400);
        }
      }

      provider.configure(providerConfig);
      const zone: Zone = { id: domain.remote_zone_id, domain: domain.domain };
      const remoteRecords = await provider.listRecords(zone);

      const existingIds = await adminRepo.getExistingRecordIdsForDomain(parseInt(id));

      let created = 0;
      let skipped = 0;

      for (const record of remoteRecords) {
        if (existingIds.has(record.remote_id)) {
          skipped++;
          continue;
        }
        try {
          await adminRepo.insertSyncRecord(parseInt(id), record);
          created++;
        } catch (e) {
          console.error('Failed to insert synced record:', e, record);
          skipped++;
        }
      }

      return c.json({
        code: 'OK',
        message: 'Sync completed',
        data: {
          total: remoteRecords.length,
          created,
          skipped,
        }
      });
    } catch (error: any) {
      console.error('Sync domain records error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: error.message || 'Failed to sync records' }, 500);
    }
  }

  async getSubdomains(c: Context) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const page = parseInt(c.req.query('page') || '1');
      const page_size = parseInt(c.req.query('page_size') || c.req.query('limit') || '100');
      const limit = page_size;
      const offset = (page - 1) * page_size;
      const status = c.req.query('status') ? parseInt(c.req.query('status')!) : undefined;
      
      const subdomains = await adminRepo.getSubdomains(limit, offset, status);
      const count = await adminRepo.getSubdomainsCount(status);
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: {
          items: subdomains,
          total: count,
          page,
          page_size
        }
      });
    } catch (error: any) {
      return c.json({ 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to get subdomains: ' + (error?.message || String(error)) 
      }, 500);
    }
  }

  async getRecords(c: Context) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const page = parseInt(c.req.query('page') || '1');
      const pageSize = parseInt(c.req.query('page_size') || c.req.query('limit') || '100');
      const limit = pageSize;
      const offset = (page - 1) * pageSize;

      const records = await adminRepo.getRecords(limit, offset);
      const count = await adminRepo.getRecordsCount();

      return c.json({
        code: 'OK',
        message: 'Success',
        data: {
          items: records,
          total: count,
          page,
          page_size: pageSize
        }
      });
    } catch (error: any) {
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get records: ' + (error?.message || String(error)) }, 500);
    }
  }

  async createRecord(c: Context) {
    try {
      const body = await c.req.json();
      const { uid, did, name, type, value, line_id } = body;
      
      if (!uid || !did || !name || !type || !value) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing required fields' }, 400);
      }
      
      const adminRepo = new AdminRepository(this.db);
      const id = await adminRepo.createRecord({
        uid, did, name, type, value, line_id: line_id || '0'
      });
      
      return c.json({ code: 'OK', message: 'Record created', data: { id } }, 201);
    } catch (error: any) {
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to create record: ' + (error?.message || String(error)) }, 500);
    }
  }

  async updateRecord(c: Context) {
    try {
      const id = parseInt(c.req.param('id') || '0');
      const body = await c.req.json();
      
      if (!id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing record ID' }, 400);
      }
      
      const { name, type, value, line_id } = body;
      
      const adminRepo = new AdminRepository(this.db);
      await adminRepo.updateRecord(id, { name, type, value, line_id });
      
      return c.json({ code: 'OK', message: 'Record updated' });
    } catch (error: any) {
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to update record: ' + (error?.message || String(error)) }, 500);
    }
  }

  async deleteRecord(c: Context) {
    try {
      const id = parseInt(c.req.param('id') || '0');
      
      if (!id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing record ID' }, 400);
      }
      
      const adminRepo = new AdminRepository(this.db);
      await adminRepo.deleteRecord(id);
      
      return c.json({ code: 'OK', message: 'Record deleted' });
    } catch (error: any) {
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to delete record: ' + (error?.message || String(error)) }, 500);
    }
  }

  async getOperationLogs(c: Context) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const page = parseInt(c.req.query('page') || '1');
      const page_size = parseInt(c.req.query('page_size') || c.req.query('limit') || '100');
      const limit = page_size;
      const offset = (page - 1) * page_size;
      
      const logs = await adminRepo.getOperationLogs(limit, offset);
      const count = await adminRepo.getOperationLogsCount();
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: {
          items: logs,
          total: count,
          page,
          page_size
        }
      });
    } catch (error) {
      console.error('Get operation logs error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get operation logs' }, 500);
    }
  }

  async getProviders(c: Context) {
    try {
      const keys = getRegisteredKeys();
      const providers = keys.map(key => {
        const provider = getProvider(key);
        if (!provider) return null;
        return {
          key: provider.key(),
          label: provider.label(),
          fields: provider.configFields()
        };
      }).filter(Boolean);

      return c.json({
        code: 'OK',
        message: 'Success',
        data: providers
      });
    } catch (error) {
      console.error('Get providers error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get providers' }, 500);
    }
  }

  async getProviderZones(c: Context) {
    try {
      const body = await c.req.json();
      const { key, config } = body;

      if (!key || !config) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing key or config' }, 400);
      }

      const provider = getProvider(key);
      if (!provider) {
        return c.json({ code: 'PROVIDER_NOT_FOUND', message: 'Provider not found' }, 404);
      }

      provider.configure(config);
      const zones = await provider.listZones();

      return c.json({
        code: 'OK',
        message: 'Success',
        data: zones
      });
    } catch (error: any) {
      console.error('Get provider zones error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: error.message || 'Failed to get zones' }, 500);
    }
  }
}
