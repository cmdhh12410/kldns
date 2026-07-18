import { Hono, Context, Next } from 'hono';
import type { Env } from '../types';
import { corsMiddleware } from '../middleware/cors';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import { Database } from '../repositories';
import {
  AuthController,
  APIController,
  AdminController,
  HealthController,
  InstallController,
  SettingsController,
} from '../controllers';

// Helper to create controller instances with database
function createControllers(db: Database) {
  return {
    auth: new AuthController(db),
    api: new APIController(db),
    admin: new AdminController(db),
    health: new HealthController(db),
    install: new InstallController(db),
    settings: new SettingsController(db),
  };
}

export function createRouter(): Hono<{ Bindings: Env }> {
  const app = new Hono<{ Bindings: Env }>();

  // Global CORS middleware
  app.use('*', corsMiddleware());

  // Health check (public)
  app.get('/api/health', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.health.check(c);
  });

  // Install admin (public)
  app.post('/api/install/admin', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.install.createAdmin(c);
  });

  // Public API endpoints
  app.post('/api/auth/register', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.auth.register(c);
  });

  app.post('/api/auth/login', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.auth.login(c);
  });

  app.post('/api/admin/auth/login', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.auth.login(c); // Use same login method for admin
  });

  app.get('/api/public/domains', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.getPublicDomains(c);
  });

  app.get('/api/settings/turnstile', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.settings.getTurnstileSettings(c);
  });

  // Authenticated user API endpoints
  const api = new Hono<{ Bindings: Env }>();
  
  // Apply auth middleware to all /api routes
  api.use('*', async (c: Context, next: Next) => {
    const db = new Database(c.env.DB);
    return authMiddleware(db)(c, next);
  });

  // Auth endpoints
  api.get('/auth/me', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.auth.me(c);
  });

  api.put('/auth/password', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.auth.changePassword(c);
  });

  // Domain endpoints
  api.get('/domains', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.getDomains(c);
  });

  // Settings endpoints
  api.get('/settings/dns-policy', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.settings.getSettings(c);
  });

  // Subdomain endpoints
  api.get('/subdomains', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.getSubdomains(c);
  });

  api.post('/subdomains', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.createSubdomain(c);
  });

  api.delete('/subdomains/:id', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.deleteSubdomain(c);
  });

  // Record endpoints
  api.get('/records', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.getRecords(c);
  });

  api.post('/records', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.createRecord(c);
  });

  api.put('/records/:id', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.updateRecord(c);
  });

  api.delete('/records/:id', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.deleteRecord(c);
  });

  // Points endpoints
  api.get('/points', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.getPoints(c);
  });

  // Token endpoints
  api.get('/tokens', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.getTokens(c);
  });

  api.post('/tokens', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.createToken(c);
  });

  api.delete('/tokens/:id', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.api.deleteToken(c);
  });

  app.route('/api', api);

  // Admin API endpoints
  const admin = new Hono<{ Bindings: Env }>();
  
  // Apply auth and admin middleware to all /api/admin routes
  admin.use('*', async (c: Context, next: Next) => {
    const db = new Database(c.env.DB);
    return authMiddleware(db)(c, next);
  });

  admin.use('*', async (c: Context, next: Next) => {
    return adminMiddleware()(c, next);
  });

  // User management
  admin.get('/users', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getUsers(c);
  });

  admin.put('/users/:id', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.updateUser(c);
  });

  admin.delete('/users/:id', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.deleteUser(c);
  });

  admin.post('/users/:id/points', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.adjustPoints(c);
  });

  // Points management
  admin.get('/points', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getUsers(c);
  });

  // Group management
  admin.get('/groups', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getUsers(c);
  });

  admin.post('/groups', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.createUser(c);
  });

  admin.delete('/groups/:id', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.deleteUser(c);
  });

  // Domain management
  admin.get('/domains', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getDomains(c);
  });

  admin.post('/domains', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.createDomain(c);
  });

  admin.post('/domains/:id/sync-records', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.updateDomain(c);
  });

  admin.put('/domains/:id', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.updateDomain(c);
  });

  admin.delete('/domains/:id', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.deleteDomain(c);
  });

  // DNS provider management
  admin.get('/dns-providers', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getProviders(c);
  });

  admin.post('/dns-providers/zones', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getProviderZones(c);
  });

  // Record management
  admin.get('/records', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getRecords(c);
  });

  admin.post('/records', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getRecords(c);
  });

  admin.put('/records/:id', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getRecords(c);
  });

  admin.delete('/records/:id', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getRecords(c);
  });

  // Subdomain management
  admin.get('/subdomains', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getSubdomains(c);
  });

  admin.post('/subdomains/:id/approve', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getSubdomains(c);
  });

  admin.post('/subdomains/:id/reject', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getSubdomains(c);
  });

  admin.delete('/subdomains/:id', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getSubdomains(c);
  });

  // Operation logs
  admin.get('/logs', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.admin.getOperationLogs(c);
  });

  // Settings management
  admin.get('/settings', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.settings.getSettings(c);
  });

  admin.put('/settings', async (c) => {
    const db = new Database(c.env.DB);
    const controllers = createControllers(db);
    return controllers.settings.updateSettings(c);
  });

  app.route('/api/admin', admin);

  // SPA fallback - serve index.html for all non-API GET requests
  app.get('*', async (c) => {
    const accept = c.req.header('Accept') || '';
    if (!accept.includes('text/html')) {
      return c.json({ code: 'NOT_FOUND', message: 'Not Found' }, 404);
    }
    if (c.env.ASSETS) {
      const indexUrl = new URL('/index.html', c.req.url);
      const response = await c.env.ASSETS.fetch(new Request(indexUrl, c.req.raw));
      if (response.status === 200) return response;
    }
    if (c.env.__STATIC_CONTENT) {
      const indexHtml = await c.env.__STATIC_CONTENT.get('index.html');
      if (indexHtml) {
        return new Response(indexHtml, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
    }
    return c.json({ code: 'NOT_FOUND', message: 'Not Found' }, 404);
  });

  return app;
}
