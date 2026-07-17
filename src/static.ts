import { Context } from 'hono';

// MIME 类型映射
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
};

// 获取文件扩展名
function getExtension(path: string): string {
  const lastDot = path.lastIndexOf('.');
  return lastDot >= 0 ? path.substring(lastDot) : '';
}

// 获取 MIME 类型
function getMimeType(path: string): string {
  const ext = getExtension(path);
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// 规范化路径
function normalizePath(path: string): string {
  // 移除开头的斜杠
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  // 默认返回 index.html
  if (!path || path === '') {
    return 'index.html';
  }
  return path;
}

// 检查是否是静态资源请求
function isStaticAsset(path: string): boolean {
  const ext = getExtension(path);
  return ext !== '' && ext !== '.html';
}

/**
 * 处理前端静态资源服务
 * 优先从 KV 存储读取，如果不存在则尝试从本地读取
 */
export async function serveStatic(c: Context): Promise<Response> {
  const url = new URL(c.req.url);
  let pathname = url.pathname;

  // 规范化路径
  const normalizedPath = normalizePath(pathname);
  
  // 尝试从 KV 读取文件
  const env = c.env as { KV?: KVNamespace };
  if (env.KV) {
    try {
      const kvKey = `static:${normalizedPath}`;
      const content = await env.KV.get(kvKey, 'arrayBuffer');
      
      if (content) {
        const mimeType = getMimeType(normalizedPath);
        return new Response(content, {
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': isStaticAsset(normalizedPath) 
              ? 'public, max-age=31536000, immutable' 
              : 'public, max-age=3600',
          },
        });
      }
    } catch (error) {
      console.error('KV read error:', error);
    }
  }

  // SPA 路由支持：如果不是静态资源请求，返回 index.html
  if (!isStaticAsset(normalizedPath)) {
    if (env.KV) {
      try {
        const indexContent = await env.KV.get('static:index.html', 'arrayBuffer');
        if (indexContent) {
          return new Response(indexContent, {
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=3600',
            },
          });
        }
      } catch (error) {
        console.error('KV index.html read error:', error);
      }
    }
  }

  // 文件不存在
  return new Response('Not Found', { status: 404 });
}
