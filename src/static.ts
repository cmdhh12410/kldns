import { Context } from 'hono';
import { getAssetFromKV, NotFoundError, MethodNotAllowedError } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';

const assetManifest = JSON.parse(manifestJSON);

export async function serveStatic(c: Context): Promise<Response> {
  try {
    return await getAssetFromKV(
      {
        request: c.req.raw,
        waitUntil(promise) {
          c.executionCtx.waitUntil(promise);
        },
      },
      {
        ASSET_NAMESPACE: c.env.__STATIC_CONTENT,
        ASSET_MANIFEST: assetManifest,
      }
    );
  } catch (e) {
    if (e instanceof NotFoundError || e instanceof MethodNotAllowedError) {
      try {
        return await getAssetFromKV(
          {
            request: new Request(new URL('/index.html', c.req.url).toString(), c.req.raw),
            waitUntil(promise) {
              c.executionCtx.waitUntil(promise);
            },
          },
          {
            ASSET_NAMESPACE: c.env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        );
      } catch {
        return new Response('Not Found', { status: 404 });
      }
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
