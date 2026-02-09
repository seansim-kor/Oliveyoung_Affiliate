// @ts-ignore
import __STATIC_CONTENT_MANIFEST from '__STATIC_CONTENT_MANIFEST';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

type Env = {
  __STATIC_CONTENT: KVNamespace;
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: any
  ): Promise<Response> {
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
        }
      );
    } catch (error) {
      // If not found and it's a GET request, return index.html for SPA routing
      if (request.method === 'GET') {
        try {
          return await getAssetFromKV(
            {
              request: new Request(
                new URL('/index.html', request.url).toString(),
                request
              ),
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
            }
          );
        } catch (_e) {
          return new Response('Not Found', { status: 404 });
        }
      }
      return new Response('Not Found', { status: 404 });
    }
  },
};
