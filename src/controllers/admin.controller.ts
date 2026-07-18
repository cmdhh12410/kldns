import { Context } from 'hono';
import { Database, AdminRepository, PointsRepository } from '../repositories';
import { PointsService } from '../services';
import { getAuth } from '../middleware/auth';
import { getRegisteredKeys, getProvider, Provider, Zone } from '../dns';

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
    } catch (error) {
      console.error('Get users error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get users' }, 500);
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
    } catch (error) {
      console.error('Get domains error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get domains' }, 500);
    }
  }

  async createDomain(c: Context) {
    try {
      const body = await c.req.json();
      const { domain, provider_key, remote_zone_id, points_cost, record_types, beian, require_review, description } = body;

      if (!domain || !provider_key || !remote_zone_id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing required fields' }, 400);
      }

      const adminRepo = new AdminRepository(this.db);
      const domainId = await adminRepo.createDomain(
        domain,
        provider_key,
        remote_zone_id,
        points_cost || 0,
        record_types || 'A,CNAME',
        beian || 0,
        require_review || 0,
        description || ''
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

      const adminRepo = new AdminRepository(this.db);
      await adminRepo.updateDomain(parseInt(id), body);

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
    } catch (error) {
      console.error('Get subdomains error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get subdomains' }, 500);
    }
  }

  async getRecords(c: Context) {
    try {
      const adminRepo = new AdminRepository(this.db);
      const page = parseInt(c.req.query('page') || '1');
      const page_size = parseInt(c.req.query('page_size') || c.req.query('limit') || '100');
      const limit = page_size;
      const offset = (page - 1) * page_size;
      
      const records = await adminRepo.getRecords(limit, offset);
      const count = await adminRepo.getRecordsCount();
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: {
          items: records,
          total: count,
          page,
          page_size
        }
      });
    } catch (error) {
      console.error('Get records error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get records' }, 500);
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
