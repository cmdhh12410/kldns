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
 * 从 KV 命名空间读取文件
 */
async function getFromKV(kv: KVNamespace, key: string): Promise<ArrayBuffer | null> {
  try {
    return await kv.get(key, 'arrayBuffer');
  } catch {
    return null;
  }
}

/**
 * 构建文件响应
 */
function fileResponse(content: ArrayBuffer, path: string): Response {
  return new Response(content, {
    headers: {
      'Content-Type': getMimeType(path),
      'Cache-Control': isStaticAsset(path)
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600',
    },
  });
}

/**
 * 处理前端静态资源服务
 * 优先从 Workers Sites (__STATIC_CONTENT) 读取，其次从自定义 KV 读取
 */
export async function serveStatic(c: Context): Promise<Response> {
  const url = new URL(c.req.url);
  const normalizedPath = normalizePath(url.pathname);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = c.env as any;

  // 1. 优先从 Workers Sites 的 __STATIC_CONTENT 读取
  if (env.__STATIC_CONTENT) {
    const content = await getFromKV(env.__STATIC_CONTENT, normalizedPath);
    if (content) {
      return fileResponse(content, normalizedPath);
    }
  }

  // 2. 其次从自定义 KV 读取
  if (env.KV) {
    const content = await getFromKV(env.KV, `static:${normalizedPath}`);
    if (content) {
      return fileResponse(content, normalizedPath);
    }
  }

  // 3. SPA 路由支持：非静态资源请求返回 index.html
  if (!isStaticAsset(normalizedPath)) {
    // 优先从 Workers Sites
    if (env.__STATIC_CONTENT) {
      const indexContent = await getFromKV(env.__STATIC_CONTENT, 'index.html');
      if (indexContent) {
        return fileResponse(indexContent, 'index.html');
      }
    }
    // 其次从自定义 KV
    if (env.KV) {
      const indexContent = await getFromKV(env.KV, 'static:index.html');
      if (indexContent) {
        return fileResponse(indexContent, 'index.html');
      }
    }
  }

  // 文件不存在
  return new Response('Not Found', { status: 404 });
}
