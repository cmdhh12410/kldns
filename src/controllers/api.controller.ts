import { Context } from 'hono';
import { Database, APIRepository, RecordRepository, SubdomainRepository } from '../repositories';
import { RecordService, SubdomainService, PointsService } from '../services';
import { getAuth } from '../middleware/auth';

export class APIController {
  constructor(private db: Database) {}

  async getDomains(c: Context) {
    try {
      const auth = getAuth(c);
      const apiRepo = new APIRepository(this.db);
      const domains = await apiRepo.listAvailableDomains(auth.user.group_id);
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: domains
      });
    } catch (error) {
      console.error('Get domains error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get domains' }, 500);
    }
  }

  async getPublicDomains(c: Context) {
    try {
      const apiRepo = new APIRepository(this.db);
      const domains = await apiRepo.listPublicDomains();
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: domains
      });
    } catch (error) {
      console.error('Get public domains error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get public domains' }, 500);
    }
  }

  async getSubdomains(c: Context) {
    try {
      const auth = getAuth(c);
      const apiRepo = new APIRepository(this.db);
      const status = c.req.query('status');
      const keyword = c.req.query('keyword');
      
      const subdomains = await apiRepo.listSubdomains(
        auth.user.id,
        status ? parseInt(status) : undefined,
        keyword
      );
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: subdomains
      });
    } catch (error) {
      console.error('Get subdomains error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get subdomains' }, 500);
    }
  }

  async createSubdomain(c: Context) {
    try {
      const auth = getAuth(c);
      const body = await c.req.json();
      const { did, name, purpose } = body;

      if (!did || !name) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing required fields' }, 400);
      }

      const subdomainService = new SubdomainService(this.db);
      const subdomain = await subdomainService.registerSubdomain(
        auth.user,
        did,
        name,
        purpose || ''
      );

      return c.json({
        code: 'OK',
        message: 'Subdomain created successfully',
        data: subdomain
      }, 201);
    } catch (error: any) {
      console.error('Create subdomain error:', error);
      if (error.message.includes('Insufficient points')) {
        return c.json({ code: 'INSUFFICIENT_POINTS', message: error.message }, 400);
      }
      if (error.message.includes('reserved')) {
        return c.json({ code: 'RESERVED_NAME', message: error.message }, 400);
      }
      return c.json({ code: 'INTERNAL_ERROR', message: error.message || 'Failed to create subdomain' }, 500);
    }
  }

  async deleteSubdomain(c: Context) {
    try {
      const auth = getAuth(c);
      const id = c.req.param('id');
      
      if (!id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing subdomain ID' }, 400);
      }

      const subdomainService = new SubdomainService(this.db);
      await subdomainService.deleteSubdomain(auth.user, parseInt(id));

      return c.json({
        code: 'OK',
        message: 'Subdomain deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete subdomain error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: error.message || 'Failed to delete subdomain' }, 500);
    }
  }

  async getRecords(c: Context) {
    try {
      const auth = getAuth(c);
      const apiRepo = new APIRepository(this.db);
      const did = c.req.query('did');
      const subdomainId = c.req.query('subdomain_id');
      const type = c.req.query('type');
      const keyword = c.req.query('keyword');
      
      const records = await apiRepo.listRecords(
        auth.user.id,
        did ? parseInt(did) : undefined,
        subdomainId ? parseInt(subdomainId) : undefined,
        type,
        keyword
      );
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: records
      });
    } catch (error) {
      console.error('Get records error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get records' }, 500);
    }
  }

  async createRecord(c: Context) {
    try {
      const auth = getAuth(c);
      const body = await c.req.json();
      const { did, subdomain_id, name, type, value, line_id } = body;

      if (!did || !subdomain_id || !name || !type || !value) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing required fields' }, 400);
      }

      const recordService = new RecordService(this.db);
      const record = await recordService.submitRecord(
        auth.user,
        did,
        subdomain_id,
        name,
        type,
        value,
        line_id || 'default'
      );

      return c.json({
        code: 'OK',
        message: 'Record created successfully',
        data: record
      }, 201);
    } catch (error: any) {
      console.error('Create record error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: error.message || 'Failed to create record' }, 500);
    }
  }

  async updateRecord(c: Context) {
    try {
      const auth = getAuth(c);
      const id = c.req.param('id');
      const body = await c.req.json();
      const { name, type, value, line_id } = body;

      if (!id || !name || !type || !value) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing required fields' }, 400);
      }

      const recordService = new RecordService(this.db);
      const record = await recordService.updateRecord(
        auth.user,
        parseInt(id),
        name,
        type,
        value,
        line_id || 'default'
      );

      return c.json({
        code: 'OK',
        message: 'Record updated successfully',
        data: record
      });
    } catch (error: any) {
      console.error('Update record error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: error.message || 'Failed to update record' }, 500);
    }
  }

  async deleteRecord(c: Context) {
    try {
      const auth = getAuth(c);
      const id = c.req.param('id');
      
      if (!id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing record ID' }, 400);
      }

      const recordService = new RecordService(this.db);
      await recordService.deleteRecord(auth.user, parseInt(id));

      return c.json({
        code: 'OK',
        message: 'Record deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete record error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: error.message || 'Failed to delete record' }, 500);
    }
  }

  async getPoints(c: Context) {
    try {
      const auth = getAuth(c);
      const apiRepo = new APIRepository(this.db);
      const overview = await apiRepo.pointsOverview(auth.user.id);
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: overview
      });
    } catch (error) {
      console.error('Get points error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get points' }, 500);
    }
  }

  async getTokens(c: Context) {
    try {
      const auth = getAuth(c);
      const apiRepo = new APIRepository(this.db);
      const tokens = await apiRepo.listTokens(auth.user.id);
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: tokens
      });
    } catch (error) {
      console.error('Get tokens error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get tokens' }, 500);
    }
  }

  async createToken(c: Context) {
    try {
      const auth = getAuth(c);
      const body = await c.req.json();
      const { name } = body;

      if (!name) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing token name' }, 400);
      }

      const tokenResult = newAPIToken();
      const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

      const apiRepo = new APIRepository(this.db);
      const tokenId = await apiRepo.createToken(
        auth.user.id,
        name,
        tokenResult.hash,
        tokenResult.hint,
        expiresAt
      );

      return c.json({
        code: 'OK',
        message: 'Token created successfully',
        data: {
          id: tokenId,
          name,
          token: tokenResult.plain,
          hint: tokenResult.hint,
          expires_at: expiresAt
        }
      }, 201);
    } catch (error) {
      console.error('Create token error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to create token' }, 500);
    }
  }

  async deleteToken(c: Context) {
    try {
      const auth = getAuth(c);
      const id = c.req.param('id');
      
      if (!id) {
        return c.json({ code: 'INVALID_INPUT', message: 'Missing token ID' }, 400);
      }

      const apiRepo = new APIRepository(this.db);
      await apiRepo.deleteToken(auth.user.id, parseInt(id));

      return c.json({
        code: 'OK',
        message: 'Token deleted successfully'
      });
    } catch (error) {
      console.error('Delete token error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to delete token' }, 500);
    }
  }
}

function newAPIToken() {
  const randomBytes = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const plain = `kldns_${randomBytes}`;
  const hash = hashBearerToken(plain);
  const hint = tokenHint(plain);
  return { plain, hash, hint };
}

async function hashBearerToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(token.trim()));
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function tokenHint(token: string): string {
  return token.substring(0, 8) + '...' + token.substring(token.length - 8);
}
