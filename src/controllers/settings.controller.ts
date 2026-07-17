import { Context } from 'hono';
import { Database, SettingsRepository } from '../repositories';
import { getAuth } from '../middleware/auth';

export class SettingsController {
  constructor(private db: Database) {}

  async getSettings(c: Context) {
    try {
      const settingsRepo = new SettingsRepository(this.db);
      const settings = await settingsRepo.getAll();
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: settings
      });
    } catch (error) {
      console.error('Get settings error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get settings' }, 500);
    }
  }

  async updateSettings(c: Context) {
    try {
      const auth = getAuth(c);
      
      if (auth.user.group_id !== 99) {
        return c.json({ code: 'FORBIDDEN', message: 'Admin access required' }, 403);
      }

      const body = await c.req.json();
      const settingsRepo = new SettingsRepository(this.db);

      for (const [key, value] of Object.entries(body)) {
        await settingsRepo.set(key, value as string);
      }

      return c.json({
        code: 'OK',
        message: 'Settings updated successfully'
      });
    } catch (error) {
      console.error('Update settings error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to update settings' }, 500);
    }
  }

  async getWebSettings(c: Context) {
    try {
      const settingsRepo = new SettingsRepository(this.db);
      const webSettings = await settingsRepo.getJSON('array_web');
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: webSettings
      });
    } catch (error) {
      console.error('Get web settings error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get web settings' }, 500);
    }
  }

  async getTurnstileSettings(c: Context) {
    try {
      const settingsRepo = new SettingsRepository(this.db);
      const turnstileSettings = await settingsRepo.getJSON('array_turnstile');
      
      return c.json({
        code: 'OK',
        message: 'Success',
        data: turnstileSettings
      });
    } catch (error) {
      console.error('Get turnstile settings error:', error);
      return c.json({ code: 'INTERNAL_ERROR', message: 'Failed to get turnstile settings' }, 500);
    }
  }
}
