/**
 * Host half of the DeepSeek balance widget.
 *
 * It reads the public DeepSeek pricing Markdown once when DSH starts, keeps
 * the parsed model catalog in memory, and serves it to the browser half from
 * a same-origin route. Account balance reads stay in `client.js` through the
 * authenticated `remote.account` namespace; this half never sees credentials.
 */
import { FALLBACK_CATALOG, loadOfficialCatalog } from './catalog.js';

const CATALOG_PATH = '/dsh-deepseek-balance/catalog.json';

export function apply(ctx) {
  let catalog = FALLBACK_CATALOG;
  const ready = loadOfficialCatalog()
    .then(next => {
      catalog = next;
      return next;
    })
    .catch(() => {
      catalog = FALLBACK_CATALOG;
      return FALLBACK_CATALOG;
    });

  ctx.inject(['webServer'], scope => {
    scope.effect(() => scope.webServer.register({
      kind: 'exact',
      path: CATALOG_PATH,
      handler: async (req, res) => {
        if (req.method !== 'GET') {
          res.writeHead(405, { allow: 'GET', 'content-type': 'text/plain; charset=utf-8' });
          res.end('Method Not Allowed');
          return;
        }
        await ready;
        const body = JSON.stringify(catalog);
        res.writeHead(200, {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
          'content-length': Buffer.byteLength(body)
        });
        res.end(body);
      }
    }), 'deepseek-balance: pricing catalog route');
  });
}
