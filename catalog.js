/**
 * DeepSeek pricing catalog loader.
 *
 * The public documentation ships machine-readable Markdown at fixed URLs.
 * The Host reads both language editions once on startup, merges the CNY and
 * USD price columns, and serves the result to the browser half. If the
 * network or the page layout is unavailable, the last shipped table is used.
 */

const CNY_URL = 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing.md';
const USD_URL = 'https://api-docs.deepseek.com/quick_start/pricing.md';
const FETCH_TIMEOUT_MS = 7000;

export const FALLBACK_CATALOG = Object.freeze({
  source: 'fallback',
  fetchedAt: null,
  models: [
    {
      id: 'deepseek-flash',
      shortName: 'Flash',
      version: 'V4.1 Flash',
      prices: {
        CNY: { hit: 0.04, miss: 2, out: 8 },
        USD: { hit: 0.006, miss: 0.3, out: 1.2 }
      }
    },
    {
      id: 'deepseek-v4-pro',
      shortName: 'V4 Pro',
      version: 'V4 Pro',
      prices: {
        CNY: { hit: 0.3, miss: 9, out: 27 },
        USD: { hit: 0.044, miss: 1.32, out: 3.96 }
      }
    }
  ]
});

function splitRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim());
}

function stripFootnote(value) {
  return String(value || '').replace(/\([^)]*\)/g, '').trim();
}

function shortName(id) {
  return id.replace(/^deepseek-/, '').split('-').map(part => {
    if (/^v\d+$/i.test(part)) return part.toUpperCase();
    return part.length ? part[0].toUpperCase() + part.slice(1) : part;
  }).join(' ');
}

function numberFrom(value) {
  const match = String(value || '').replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

/**
 * Parse one pricing Markdown table.
 * @param markdown - the official pricing page text.
 * @param currency - `CNY` for the Chinese table, `USD` for the English table.
 * @returns models in table order, each with peak prices for that currency.
 */
export function parsePricingMarkdown(markdown, currency) {
  const rows = String(markdown || '').split(/\r?\n/).filter(line => line.trim().startsWith('|'));
  const headerIndex = rows.findIndex(line => /^\|\s*(模型|MODEL)\s*\|/i.test(line));
  if (headerIndex < 0) return [];

  const header = splitRow(rows[headerIndex]);
  const ids = header.slice(3).map(stripFootnote).filter(Boolean);
  if (ids.length === 0) return [];

  const models = new Map(ids.map(id => [id, {
    id,
    shortName: shortName(id),
    version: '',
    peak: { hit: NaN, miss: NaN, out: NaN },
    off: { hit: NaN, miss: NaN, out: NaN }
  }]));

  for (let index = headerIndex + 1; index < rows.length; index += 1) {
    const cells = splitRow(rows[index]);
    if (cells.length < 4) continue;
    const label = cells[1] || '';
    const tariff = cells[2] || '';
    if (/模型版本|MODEL VERSION/i.test(label)) {
      ids.forEach((id, modelIndex) => {
        const version = stripFootnote(cells[3 + modelIndex]);
        if (version) models.get(id).version = version.replace(/^DeepSeek-/i, '');
      });
      continue;
    }

    const text = `${label} ${tariff}`.toLowerCase();
    let kind = null;
    if (/cache\s*miss|缓存未命中/.test(text)) kind = 'miss';
    else if (/cache\s*hit|缓存命中/.test(text)) kind = 'hit';
    else if (/output\s*tokens|tokens输出|输出/.test(text)) kind = 'out';
    if (!kind) continue;

    let tariffWindow = null;
    if (/off-peak|空闲/.test(text)) tariffWindow = 'off';
    else if (/\bpeak\b|高峰/.test(text)) tariffWindow = 'peak';
    if (!tariffWindow) continue;

    ids.forEach((id, modelIndex) => {
      const price = numberFrom(cells[3 + modelIndex]);
      if (Number.isFinite(price)) models.get(id)[tariffWindow][kind] = price;
    });
  }

  return Array.from(models.values()).map(model => {
    const prices = {};
    for (const kind of ['hit', 'miss', 'out']) {
      const peak = Number.isFinite(model.peak[kind])
        ? model.peak[kind]
        : Number.isFinite(model.off[kind]) ? model.off[kind] * 2 : NaN;
      if (!Number.isFinite(peak) || peak < 0) return null;
      prices[kind] = peak;
    }
    return {
      id: model.id,
      shortName: model.shortName,
      version: model.version,
      prices: { [currency]: prices }
    };
  }).filter(Boolean);
}

/**
 * Merge the CNY and USD tables by model id.
 * @param cnyModels - parsed Chinese models.
 * @param usdModels - parsed English models.
 * @returns the client catalog shape.
 */
export function mergeCatalog(cnyModels, usdModels) {
  const usdById = new Map(usdModels.map(model => [model.id, model]));
  const merged = cnyModels.map(model => ({
    id: model.id,
    shortName: model.shortName,
    version: model.version || (usdById.get(model.id) && usdById.get(model.id).version) || model.shortName,
    prices: {
      CNY: model.prices.CNY,
      USD: usdById.get(model.id) ? usdById.get(model.id).prices.USD : undefined
    }
  })).filter(model => model.prices.CNY);

  /* Keep USD-only models usable when the Chinese table lags. */
  for (const model of usdModels) {
    if (!merged.some(item => item.id === model.id)) {
      merged.push({
        id: model.id,
        shortName: model.shortName,
        version: model.version || model.shortName,
        prices: { USD: model.prices.USD }
      });
    }
  }
  return merged;
}

async function fetchText(url) {
  if (typeof fetch !== 'function') throw new Error('fetch is unavailable');
  const response = await fetch(url, {
    headers: { accept: 'text/markdown,text/plain;q=0.9' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
  });
  if (!response.ok) throw new Error(`pricing fetch ${response.status}`);
  return response.text();
}

/**
 * Fetch both pricing tables once and return an official catalog.
 * @returns a catalog, or the fallback catalog when either currency table is unavailable.
 */
export async function loadOfficialCatalog() {
  const [cnyResult, usdResult] = await Promise.allSettled([fetchText(CNY_URL), fetchText(USD_URL)]);
  if (cnyResult.status !== 'fulfilled') throw cnyResult.reason;
  const usdModels = usdResult.status === 'fulfilled'
    ? parsePricingMarkdown(usdResult.value, 'USD')
    : [];
  const models = mergeCatalog(
    parsePricingMarkdown(cnyResult.value, 'CNY'),
    usdModels
  );
  if (models.length === 0) throw new Error('pricing table did not contain models');
  return {
    source: 'official',
    fetchedAt: Date.now(),
    models
  };
}
