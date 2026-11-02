window.__ModuleLoader__.load({
  id: 'dsh-deepseek-balance',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useCallback, useEffect, useMemo, useRef, useState } = React;

    const NS = 'deepseek-balance';
    const P = 'dsb';
    const VERSION = '0.2.1-rc.5';
    const PREF_KEY = 'dsh.deepseek-balance.prefs.v5';
    const CATALOG_PATH = '/dsh-deepseek-balance/catalog.json';
    const REFRESH_MS = 10000;
    const CLOCK_MS = 5 * 60 * 1000;

    /* ------------------------------------------------------------------ *
     * Copy
     * ------------------------------------------------------------------ */
    const zh = {
      title: 'DeepSeek 余额',
      balance: '余额',
      bonus: '含赠送',
      peak: '高峰',
      offPeak: '空闲',
      peakTariff: '标准价',
      offTariff: '5 折',
      standard: '标准价',
      discount: '5 折',
      until: '至',
      current: '当前',
      other: '另一时段',
      model: '模型',
      period: '时段',
      effort: '推理强度',
      estimate: '可用 tokens',
      approx: '约 ',
      tokens: 'tok',
      rounds: '轮对话',
      effortOff: '关闭',
      effortLow: '轻',
      effortMedium: '中',
      effortHigh: '高',
      effortMax: '极高',
      effortBase: '基准',
      refresh: '刷新',
      autoRefresh: '余额每 10 秒自动刷新；时段每 5 分钟校准',
      justNow: '刚刚更新',
      minutesAgo: '分钟前',
      retry: '重试',
      signedOut: '未登录',
      signedOutHint: '在左下角头像中登录 DeepSeek 账号后即可查看余额。',
      error: '读取失败',
      errorHint: '余额接口暂时不可用，稍后重试。',
      loading: '正在读取余额',
      estimator: '估算设置',
      useSession: '用会话实际值',
      autoSession: '自动',
      autoSessionHint: '切换会话时更新，并每 60 秒自动读取当前会话实际值',
      ioRatio: '输入占比',
      cacheHit: '缓存命中率',
      input: '输入',
      output: '输出',
      cacheMiss: '未命中',
      realtime: '实时 · 10 秒',
      refresh5m: '5 分钟更新',
      startupUpdate: '启动时更新',
      builtinPricing: '内置价 · 2026-11',
      windowNote: '高峰：工作日 09:00–12:00 / 14:00–18:00',
      holidayNote: '不含法定节假日调休与 Search/Fetch 费用。',
      today: '今天',
      tomorrow: '明天',
      weekday0: '周日',
      weekday1: '周一',
      weekday2: '周二',
      weekday3: '周三',
      weekday4: '周四',
      weekday5: '周五',
      weekday6: '周六',
      unitDay: '天',
      unitHour: '小时',
      unitMinute: '分',
      login: '登录后查看'
    };
    const en = {
      title: 'DeepSeek Balance',
      balance: 'Balance',
      bonus: 'Bonus included',
      peak: 'Peak',
      offPeak: 'Off-peak',
      peakTariff: 'Standard',
      offTariff: '50% off',
      standard: 'Standard',
      discount: '50% off',
      until: 'until',
      current: 'Current',
      other: 'Other window',
      model: 'Model',
      period: 'Window',
      effort: 'Reasoning',
      estimate: 'Usable tokens',
      approx: '≈ ',
      tokens: 'tok',
      rounds: 'rounds',
      effortOff: 'Off',
      effortLow: 'Light',
      effortMedium: 'Medium',
      effortHigh: 'High',
      effortMax: 'Max',
      effortBase: 'Baseline',
      refresh: 'Refresh',
      autoRefresh: 'Balance refreshes every 10s; the window is recalibrated every 5m',
      justNow: 'updated just now',
      minutesAgo: 'min ago',
      retry: 'Retry',
      signedOut: 'Not signed in',
      signedOutHint: 'Sign in from the avatar at the bottom-left to see your balance.',
      error: 'Could not read balance',
      errorHint: 'The account service is temporarily unavailable. Try again shortly.',
      loading: 'Reading balance',
      estimator: 'Estimate settings',
      useSession: 'Use session actuals',
      autoSession: 'Auto',
      autoSessionHint: 'Updates on session switch and re-reads the current Session every 60s',
      ioRatio: 'Input share',
      cacheHit: 'Cache hit rate',
      input: 'Input',
      output: 'Output',
      cacheMiss: 'Missing',
      realtime: 'Live · 10s',
      refresh5m: '5m refresh',
      startupUpdate: 'Updated at launch',
      builtinPricing: 'Built-in · Nov 2026',
      windowNote: 'Peak: weekdays 09:00–12:00 / 14:00–18:00',
      holidayNote: 'Excludes holiday adjustments and Search/Fetch fees.',
      today: 'today',
      tomorrow: 'tomorrow',
      weekday0: 'Sun',
      weekday1: 'Mon',
      weekday2: 'Tue',
      weekday3: 'Wed',
      weekday4: 'Thu',
      weekday5: 'Fri',
      weekday6: 'Sat',
      unitDay: 'd',
      unitHour: 'h',
      unitMinute: 'm',
      login: 'Sign in to view'
    };

    /* ------------------------------------------------------------------ *
     * Built-in fallback catalog. The Host replaces this once at startup
     * by reading the official pricing Markdown; this table keeps the card
     * useful when the startup fetch fails.
     * ------------------------------------------------------------------ */
    const FALLBACK_CATALOG = {
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
    };

    const EFFORTS = [
      { id: 'off', key: 'effortOff', q: 0.45 },
      { id: 'low', key: 'effortLow', q: 0.65 },
      { id: 'medium', key: 'effortMedium', q: 0.82 },
      { id: 'high', key: 'effortHigh', q: 1 },
      { id: 'max', key: 'effortMax', q: 1.3 }
    ];
    const DEFAULT_PREFS = {
      model: 'deepseek-flash',
      effort: 'high',
      inputShare: 99.75,
      cacheHit: 99.7,
      autoSession: true
    };

    function clamp(value, min, max, fallback) {
      const number = Number(value);
      return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
    }

    function roundShare(value) {
      return Math.round(Number(value) * 100) / 100;
    }

    function readPrefs() {
      try {
        if (typeof localStorage === 'undefined') return { ...DEFAULT_PREFS };
        const raw = localStorage.getItem(PREF_KEY);
        if (!raw) return { ...DEFAULT_PREFS };
        const parsed = JSON.parse(raw);
        return {
          model: typeof parsed.model === 'string' && parsed.model ? parsed.model : DEFAULT_PREFS.model,
          effort: EFFORTS.some(effort => effort.id === parsed.effort) ? parsed.effort : DEFAULT_PREFS.effort,
          inputShare: roundShare(clamp(parsed.inputShare, 0, 100, DEFAULT_PREFS.inputShare)),
          cacheHit: roundShare(clamp(parsed.cacheHit, 0, 100, DEFAULT_PREFS.cacheHit)),
          autoSession: typeof parsed.autoSession === 'boolean' ? parsed.autoSession : true
        };
      } catch {
        return { ...DEFAULT_PREFS };
      }
    }

    function writePrefs(prefs) {
      try {
        if (typeof localStorage !== 'undefined') localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
      } catch {
        /* Storage can be disabled; the current in-memory choice still works. */
      }
    }

    function normalizeCatalog(input) {
      if (!input || !Array.isArray(input.models)) return null;
      const models = input.models.map(model => {
        if (!model || typeof model.id !== 'string' || !model.id) return null;
        const prices = {};
        for (const currency of ['CNY', 'USD']) {
          const source = model.prices && model.prices[currency];
          if (!source) continue;
          const hit = Number(source.hit);
          const miss = Number(source.miss);
          const out = Number(source.out);
          if (![hit, miss, out].every(value => Number.isFinite(value) && value >= 0)) continue;
          prices[currency] = { hit, miss, out };
        }
        if (!prices.CNY && !prices.USD) return null;
        return {
          id: model.id,
          shortName: typeof model.shortName === 'string' && model.shortName ? model.shortName : model.id.replace(/^deepseek-/, ''),
          version: typeof model.version === 'string' && model.version ? model.version : model.id,
          prices
        };
      }).filter(Boolean);
      if (models.length === 0) return null;
      return {
        source: input.source === 'official' ? 'official' : 'fallback',
        fetchedAt: Number.isFinite(input.fetchedAt) ? input.fetchedAt : null,
        models
      };
    }

    /* ------------------------------------------------------------------ *
     * Estimation
     * ------------------------------------------------------------------ */
    function estimateFor(balance, model, effort, peak, currency, inputSharePercent, cacheHitPercent) {
      const rate = (model.prices && (model.prices[currency] || model.prices.CNY)) || { hit: 0.04, miss: 2, out: 8 };
      const multiplier = peak ? 1 : 0.5;
      const hit = rate.hit * multiplier;
      const miss = rate.miss * multiplier;
      const out = rate.out * multiplier;
      const inputShare = clamp(inputSharePercent, 0, 100, 80) / 100;
      const cacheHit = clamp(cacheHitPercent, 0, 100, 70) / 100;
      const outputShare = 1 - inputShare;
      const costPerUnit = inputShare * (cacheHit * hit + (1 - cacheHit) * miss) + outputShare * effort.q * out;
      const safeBalance = Number.isFinite(balance) ? Math.max(0, balance) : 0;
      const units = costPerUnit > 0 ? safeBalance / costPerUnit : 0;
      const tokens = units * (inputShare + outputShare * effort.q) * 1000000;
      const tokensPerRound = 32000 + 2000 * effort.q;
      return {
        tokens,
        rounds: tokensPerRound > 0 ? tokens / tokensPerRound : 0,
        hit,
        miss,
        out
      };
    }

    /* ------------------------------------------------------------------ *
     * Beijing tariff window. Peak: weekdays 09:00-12:00, 14:00-18:00.
     * Everything else, including weekends, is off-peak.
     * ------------------------------------------------------------------ */
    const BEIJING_OFFSET = 8 * 60 * 60 * 1000;

    function beijingParts(ms) {
      const date = new Date(ms + BEIJING_OFFSET);
      return {
        y: date.getUTCFullYear(),
        m: date.getUTCMonth() + 1,
        d: date.getUTCDate(),
        w: date.getUTCDay(),
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds()
      };
    }

    function isPeak(ms) {
      const p = beijingParts(ms);
      if (p.w === 0 || p.w === 6) return false;
      const minutes = p.hour * 60 + p.minute;
      return (minutes >= 9 * 60 && minutes < 12 * 60) || (minutes >= 14 * 60 && minutes < 18 * 60);
    }

    function nextPeriodChange(ms) {
      const current = isPeak(ms);
      for (let day = 0; day <= 9; day += 1) {
        const p = beijingParts(ms + day * 86400000);
        const boundaries = [0, 9 * 60, 12 * 60, 14 * 60, 18 * 60];
        for (const minute of boundaries) {
          const at = Date.UTC(p.y, p.m - 1, p.d, Math.floor(minute / 60) - 8, minute % 60);
          if (at > ms && isPeak(at + 60000) !== current) return at;
        }
      }
      return ms + 86400000;
    }

    function periodInfo(now) {
      const peak = isPeak(now);
      return { peak, nextAt: nextPeriodChange(now) };
    }

    /* ------------------------------------------------------------------ *
     * Formatting
     * ------------------------------------------------------------------ */
    function localeId(active) {
      return String(active || '').toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US';
    }

    function trimZero(value) {
      return String(value).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
    }

    function formatShare(value) {
      return trimZero((Number.isFinite(value) ? value : 0).toFixed(2));
    }

    function formatMoney(value, currency, locale) {
      if (!Number.isFinite(value)) return '--';
      const safe = Math.abs(value);
      const text = safe.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return `${value < 0 ? '-' : ''}${currency === 'USD' ? '$' : '¥'}${text}`;
    }

    /* K / M / B with a length-aware number of decimals. No 万 / 亿. */
    function formatTokens(value) {
      if (!Number.isFinite(value) || value <= 0) return '0';
      if (value >= 1000000000) {
        const scaled = value / 1000000000;
        return `${trimZero(scaled.toFixed(scaled >= 10 ? 1 : 2))}B`;
      }
      if (value >= 1000000) {
        const scaled = value / 1000000;
        return `${trimZero(scaled.toFixed(scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2))}M`;
      }
      if (value >= 1000) {
        const scaled = value / 1000;
        return `${trimZero(scaled.toFixed(scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2))}K`;
      }
      return String(Math.round(value));
    }

    function formatRounds(value, locale) {
      if (!Number.isFinite(value) || value <= 0) return '0';
      return Math.max(0, Math.floor(value)).toLocaleString(locale);
    }

    function pad2(value) {
      return String(value).padStart(2, '0');
    }

    function formatClock(ts) {
      if (!Number.isFinite(ts)) return '';
      const p = beijingParts(ts);
      return `${pad2(p.hour)}:${pad2(p.minute)}`;
    }

    function formatTimestamp(ts) {
      if (!Number.isFinite(ts)) return '';
      const p = beijingParts(ts);
      return `${pad2(p.hour)}:${pad2(p.minute)}:${pad2(p.second)}`;
    }

    function formatUntil(at, now, t) {
      if (!Number.isFinite(at)) return '';
      const target = beijingParts(at);
      const current = beijingParts(now);
      const targetDay = Date.UTC(target.y, target.m - 1, target.d);
      const currentDay = Date.UTC(current.y, current.m - 1, current.d);
      const dayDiff = Math.round((targetDay - currentDay) / 86400000);
      const hm = `${pad2(target.hour)}:${pad2(target.minute)}`;
      if (dayDiff === 0) return `${t('today')} ${hm}`;
      if (dayDiff === 1) return `${t('tomorrow')} ${hm}`;
      return `${t(`weekday${target.w}`)} ${hm}`;
    }

    function formatDurationShort(ms, t) {
      const totalMinutes = Math.max(0, Math.ceil(ms / 60000));
      const days = Math.floor(totalMinutes / (24 * 60));
      const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
      if (days > 0) return `${days}${t('unitDay')}`;
      if (hours > 0) return `${hours}${t('unitHour')}`;
      return `${totalMinutes}${t('unitMinute')}`;
    }

    function summarize(balance) {
      const rechargeWallets = Array.isArray(balance && balance.value) ? balance.value : [];
      const bonusWallets = Array.isArray(balance && balance.bonusWallets) ? balance.bonusWallets : [];
      const totals = new Map();
      const add = (wallet, bonus) => {
        if (!wallet) return;
        const currency = wallet.currency === 'USD' ? 'USD' : 'CNY';
        const amount = Number(String(wallet.balance == null ? '' : wallet.balance).replace(/,/g, ''));
        if (!Number.isFinite(amount)) return;
        const row = totals.get(currency) || { currency, total: 0, recharge: 0, bonus: 0 };
        row.total += amount;
        if (bonus) row.bonus += amount;
        else row.recharge += amount;
        totals.set(currency, row);
      };
      rechargeWallets.forEach(wallet => add(wallet, false));
      bonusWallets.forEach(wallet => add(wallet, true));
      const currency = totals.has('CNY') ? 'CNY' : totals.has('USD') ? 'USD' : 'CNY';
      const row = totals.get(currency) || { currency, total: 0, recharge: 0, bonus: 0 };
      return {
        currency,
        total: row.total,
        recharge: row.recharge,
        bonus: row.bonus
      };
    }

    /* ------------------------------------------------------------------ *
     * Hooks
     * ------------------------------------------------------------------ */
    function useTween(target, duration = 520) {
      const [shown, setShown] = useState(target);
      const shownRef = useRef(target);
      const frameRef = useRef(0);

      useEffect(() => {
        if (typeof target !== 'number' || !Number.isFinite(target)) {
          shownRef.current = target;
          setShown(target);
          return undefined;
        }
        const from = shownRef.current;
        if (typeof from !== 'number' || !Number.isFinite(from) || Math.abs(from - target) < 0.000001) {
          shownRef.current = target;
          setShown(target);
          return undefined;
        }
        const started = performance.now();
        const ease = progress => 1 - Math.pow(1 - progress, 3);
        const tick = stamp => {
          const progress = Math.min(1, (stamp - started) / duration);
          const value = from + (target - from) * ease(progress);
          shownRef.current = value;
          setShown(value);
          if (progress < 1) frameRef.current = requestAnimationFrame(tick);
          else {
            shownRef.current = target;
            setShown(target);
          }
        };
        frameRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameRef.current);
      }, [target, duration]);

      return shown;
    }

    function useClock() {
      const [now, setNow] = useState(() => Date.now());
      useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), CLOCK_MS);
        return () => clearInterval(timer);
      }, []);
      return [now, useCallback(() => setNow(Date.now()), [])];
    }

    /** Read the Session id persisted by the Workspace's main-view selection. */
    function readActiveSessionId() {
      try {
        if (typeof localStorage === 'undefined') return null;
        const raw = localStorage.getItem('dsh.sessions.current');
        if (!raw) return null;
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed.sessionId === 'string' && parsed.sessionId) return parsed.sessionId;
        } catch {
          /* Fall through to the tolerant scan. */
        }
        const match = raw.match(/session-[0-9a-f-]{8,}/i);
        return match ? match[0] : null;
      } catch {
        return null;
      }
    }

    function usageFromSession(session) {
      const values = session && session.projectionValues;
      const usage = values && values.tokenUsage;
      if (!usage) return null;
      const totals = usage.totals || usage;
      const cacheRead = Number(totals.cacheReadTokens) || 0;
      const uncached = Number(totals.uncachedInputTokens) || 0;
      const cacheWrite = Number(totals.cacheWriteTokens) || 0;
      const output = Number(totals.outputTokens) || 0;
      const input = cacheRead + uncached + cacheWrite;
      const total = input + output;
      if (total <= 0) return null;
      const mainView = session.retainedBy && Number(session.retainedBy.mainView) > 0 ? 1 : 0;
      const lastPromptAt = values.sessionListMetadata && Number(values.sessionListMetadata.lastPromptAt) || 0;
      return {
        score: (mainView ? 1e15 : 0) + Math.max(Number(session.updatedAt) || 0, lastPromptAt),
        sessionId: session.sessionId,
        input,
        output,
        total,
        inputShare: (input / total) * 100,
        hitRate: input > 0 ? (cacheRead / input) * 100 : 0
      };
    }

    /**
     * Read the current Session's provider-reported usage. The persisted main-view
     * id is authoritative; the main-view/latest scan is only a fallback for a
     * brand-new Session whose summary has not appeared yet.
     */
    function extractSessionUsage(state, activeSessionId) {
      const byId = state && state.byId;
      if (!byId) return null;
      if (activeSessionId && byId[activeSessionId]) return usageFromSession(byId[activeSessionId]);
      let best = null;
      for (const session of Object.values(byId)) {
        const usage = usageFromSession(session);
        if (!usage) continue;
        if (!best || usage.score > best.score) best = usage;
      }
      return best;
    }

    function NumberField({ value, min, max, onCommit, label }) {
      const [draft, setDraft] = useState(() => formatShare(value));
      useEffect(() => {
        setDraft(formatShare(value));
      }, [value]);
      const commit = () => {
        const parsed = Number(draft);
        const next = Number.isFinite(parsed) ? roundShare(clamp(parsed, min, max, value)) : value;
        setDraft(formatShare(next));
        onCommit(next);
      };
      return h('span', { className: `${P}-numWrap` },
        h('input', {
          type: 'text',
          inputMode: 'decimal',
          spellCheck: false,
          className: `${P}-num`,
          value: draft,
          'aria-label': label,
          onChange: event => setDraft(event.target.value),
          onBlur: commit,
          onKeyDown: event => {
            if (event.key === 'Enter') event.currentTarget.blur();
          }
        }),
        h('span', { className: `${P}-pct` }, '%')
      );
    }

    /* ------------------------------------------------------------------ *
     * Icons
     * ------------------------------------------------------------------ */
    const ICON_PATHS = {
      wallet: 'M4.6 8.2h13.2A2.2 2.2 0 0 1 20 10.4v7A2.2 2.2 0 0 1 17.8 19.6H6.2A2.2 2.2 0 0 1 4 17.4v-9A2.4 2.4 0 0 1 6.4 6h9.1M15.8 12.1h4.4M15.8 15.2h4.4',
      sun: 'M12 8.1a3.9 3.9 0 1 0 0 7.8 3.9 3.9 0 0 0 0-7.8ZM12 2.2v2M12 19.8v2M2.2 12h2M19.8 12h2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4',
      moon: 'M19 14.4A7.7 7.7 0 0 1 9.6 5a7.7 7.7 0 1 0 9.4 9.4Z',
      refresh: 'M19.2 8.2A7.8 7.8 0 1 0 20 12M19.2 3.9v4.3h-4.3',
      login: 'M12 12.1a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.6 20.2a7.4 7.4 0 0 1 14.8 0',
      chevron: 'm9 5 7 7-7 7',
      spark: 'M12 3.2 13.8 9l5.8 1.8-5.8 1.8L12 18.4l-1.8-5.8L4.4 10.8 10.2 9 12 3.2Z'
    };

    function Glyph({ name, className }) {
      return h('svg', {
        className: className || '',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.65,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true
      }, h('path', { d: ICON_PATHS[name] || ICON_PATHS.wallet }));
    }

    /* ------------------------------------------------------------------ *
     * Styles
     * ------------------------------------------------------------------ */
    const CSS = `
.${P}-root{position:relative;flex:1 1 0%;min-width:0;font-family:var(--dsw-font-family,inherit);font-size:13px;line-height:1.35;color:var(--dsw-alias-label-primary);container-type:inline-size}
.${P}-root,.${P}-root *{box-sizing:border-box;corner-shape:round}
.${P}-root button{font:inherit;color:inherit}
.${P}-card{position:relative;isolation:isolate;width:100%;min-width:0;height:44px;display:flex;align-items:center;gap:8px;padding:6px 9px;text-align:left;border:1px solid var(--dsw-alias-border-l1);border-radius:11px;background:linear-gradient(135deg,color-mix(in srgb,var(--dsw-alias-brand-primary) 9%,transparent),transparent 62%),var(--dsw-alias-bg-layer-1);cursor:pointer;overflow:hidden;transition:border-color .18s ease,background .18s ease,transform .18s ease,box-shadow .18s ease}
.${P}-card::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(108deg,transparent 36%,color-mix(in srgb,var(--dsw-alias-brand-primary) 12%,transparent) 50%,transparent 64%);transform:translateX(-125%);transition:transform .62s ease;pointer-events:none}
.${P}-card:hover{border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 42%,var(--dsw-alias-border-l1));transform:translateY(-1px)}
.${P}-card:hover::after{transform:translateX(125%)}
.${P}-card:active{transform:translateY(0) scale(.994)}
.${P}-card:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.${P}-orb{position:relative;flex:none;width:29px;height:29px;display:grid;place-items:center;border-radius:9px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 14%,transparent);color:var(--dsw-alias-brand-primary)}
.${P}-orb>svg{width:18px;height:18px}
.${P}-live{position:absolute;top:-1px;right:-1px;width:8px;height:8px;border-radius:50%;background:var(--dsw-alias-state-success-primary);box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-1)}
.${P}-live::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:1px solid var(--dsw-alias-state-success-primary);animation:${P}-pulse 2.4s ease-out infinite}
.${P}-live.is-warn{background:var(--dsw-alias-state-warn-primary)}
.${P}-live.is-warn::after{border-color:var(--dsw-alias-state-warn-primary)}
.${P}-live.is-error{background:var(--dsw-alias-state-error-primary)}
.${P}-live.is-error::after{border-color:var(--dsw-alias-state-error-primary);animation:none;opacity:0}
.${P}-live.is-idle{background:var(--dsw-alias-state-idle-primary)}
.${P}-live.is-idle::after{border-color:var(--dsw-alias-state-idle-primary);animation:none;opacity:0}
.${P}-delta{position:absolute;right:8px;bottom:4px;z-index:4;pointer-events:none;white-space:nowrap;padding:2px 6px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary) 32%,var(--dsw-alias-border-l1));border-radius:6px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 14%,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-state-error-primary);font-size:10px;font-weight:650;line-height:14px;font-variant-numeric:tabular-nums;animation:${P}-coin-drop 1.6s cubic-bezier(.2,.7,.3,1) forwards}
.${P}-delta.is-plus{border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary) 32%,var(--dsw-alias-border-l1));background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 12%,var(--dsw-alias-bg-layer-2));color:var(--dsw-alias-state-success-primary)}
.${P}-copy{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}
.${P}-eyebrow{display:flex;align-items:center;gap:5px;min-width:0;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:14px;white-space:nowrap}
.${P}-name{min-width:0;overflow:hidden;text-overflow:ellipsis;letter-spacing:.005em}
.${P}-period{flex:none;border-radius:5px;padding:1px 5px;font-size:10px;font-weight:650;line-height:13px;letter-spacing:.02em;color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 13%,transparent)}
.${P}-period.is-peak{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 13%,transparent)}
.${P}-line{display:flex;align-items:baseline;gap:6px;min-width:0}
.${P}-balance{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:16px;font-weight:650;line-height:19px;letter-spacing:-.018em;font-variant-numeric:tabular-nums}
.${P}-balance.is-flash{animation:${P}-flash .65s ease}
.${P}-balance.is-muted{color:var(--dsw-alias-label-secondary);font-weight:500;font-size:13px}
.${P}-balance.is-error{color:var(--dsw-alias-state-error-primary);font-size:13px;font-weight:500}
.${P}-est{margin-left:auto;flex:none;max-width:56%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:10.5px;line-height:19px;font-variant-numeric:tabular-nums}
@container (max-width: 158px){.${P}-est{display:none}}
@container (max-width: 148px){.${P}-name{display:none}.${P}-period{margin-left:-2px}}
.${P}-root.is-rail{flex:none;width:36px}
.${P}-card.is-rail{width:36px;height:36px;padding:0;justify-content:center;border-radius:10px}
.${P}-card.is-rail .${P}-copy{display:none}
.${P}-card.is-rail .${P}-orb{width:27px;height:27px;background:transparent}

.${P}-pop{position:absolute;z-index:1200;left:-4px;right:auto;bottom:calc(100% + 10px);width:260px;max-width:calc(100vw - 20px);max-height:min(650px,calc(100vh - 120px));overflow-y:auto;overscroll-behavior:contain;padding:11px;border:1px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-overlay);box-shadow:var(--dsw-elevation-panel);backdrop-filter:blur(18px) saturate(130%);transform-origin:0 100%;animation:${P}-pop-in .18s cubic-bezier(.2,.8,.2,1);scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l2) transparent}
.${P}-root.is-rail .${P}-pop{left:0}
.${P}-head{display:flex;align-items:flex-start;gap:9px;padding:0 1px 10px}
.${P}-headOrb{flex:none;width:36px;height:36px;display:grid;place-items:center;border-radius:11px;color:var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 13%,transparent)}
.${P}-headOrb>svg{width:21px;height:21px}
.${P}-headCopy{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:1px;padding-top:1px}
.${P}-headTitle{color:var(--dsw-alias-label-secondary);font-size:11.5px;line-height:15px;letter-spacing:.02em}
.${P}-headBalance{font-size:23px;font-weight:650;line-height:27px;letter-spacing:-.028em;font-variant-numeric:tabular-nums}
.${P}-headBonus{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:15px;font-variant-numeric:tabular-nums}
.${P}-headMuted{color:var(--dsw-alias-label-secondary);font-size:14px;font-weight:500}
.${P}-iconBtn{flex:none;width:28px;height:28px;display:grid;place-items:center;padding:0;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;transition:background .16s ease,color .16s ease,transform .16s ease}
.${P}-iconBtn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.${P}-iconBtn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.${P}-iconBtn:disabled{cursor:default;opacity:.7}
.${P}-iconBtn>svg{width:16px;height:16px}
.${P}-iconBtn.is-spinning>svg{animation:${P}-spin .8s linear infinite}

.${P}-periodCard{display:flex;align-items:center;gap:9px;padding:9px 10px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-success-primary) 28%,var(--dsw-alias-border-l1));border-radius:12px;background:linear-gradient(120deg,color-mix(in srgb,var(--dsw-alias-state-success-primary) 7%,transparent),transparent 74%)}
.${P}-periodCard.is-peak{border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 30%,var(--dsw-alias-border-l1));background:linear-gradient(120deg,color-mix(in srgb,var(--dsw-alias-state-error-primary) 8%,transparent),transparent 74%)}
.${P}-periodIcon{flex:none;width:31px;height:31px;display:grid;place-items:center;border-radius:50%;color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 13%,transparent)}
.${P}-periodIcon.is-peak{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 13%,transparent)}
.${P}-periodIcon>svg{width:18px;height:18px}
.${P}-periodCopy{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}
.${P}-periodTitle{font-size:12.5px;font-weight:600;line-height:16px}
.${P}-periodMeta{color:var(--dsw-alias-label-secondary);font-size:10.5px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.${P}-periodSave{flex:none;padding:3px 6px;border-radius:6px;color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 12%,transparent);font-size:10px;font-weight:650;line-height:13px}
.${P}-periodSave.is-standard{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 12%,transparent)}

.${P}-field{margin-top:10px}
.${P}-fieldLabel{display:block;margin:0 1px 5px;color:var(--dsw-alias-label-secondary);font-size:10.5px;line-height:13px;letter-spacing:.04em}
.${P}-tabs{display:flex;gap:3px;padding:3px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);overflow-x:auto;scrollbar-width:none}
.${P}-tabs::-webkit-scrollbar{display:none}
.${P}-tab{flex:1 0 88px;min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:5px 8px;border:1px solid transparent;border-radius:7px;background:transparent;cursor:pointer;text-align:left;transition:background .16s ease,color .16s ease,border-color .16s ease}
.${P}-tab:hover{background:var(--dsw-alias-bg-layer-2)}
.${P}-tab:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.${P}-tab.is-active{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}
.${P}-tabName{font-size:12px;font-weight:650;line-height:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.${P}-tabSub{font-size:10px;line-height:12px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.${P}-tab.is-active .${P}-tabSub{color:var(--dsw-alias-brand-primary);opacity:.85}

.${P}-effort{margin-top:10px}
.${P}-effortHead{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin:0 1px 2px}
.${P}-effortHead .${P}-fieldLabel{margin:0;display:inline}
.${P}-effortValue{flex:none;color:var(--dsw-alias-brand-primary);font-size:11px;font-weight:650;line-height:13px}
.${P}-ticks{display:flex;justify-content:space-between;padding:0 1px;margin-top:-1px}
.${P}-tick{padding:2px 0;border:0;background:none;color:var(--dsw-alias-label-secondary);font-size:9.5px;line-height:12px;cursor:pointer;transition:color .16s ease,font-weight .16s ease}
.${P}-tick:hover{color:var(--dsw-alias-label-primary)}
.${P}-tick.is-active{color:var(--dsw-alias-brand-primary);font-weight:650}
.${P}-tick:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px;border-radius:4px}

.${P}-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin-top:8px;padding:7px 2px 1px;border-top:1px solid var(--dsw-alias-border-l1)}
.${P}-heroMain{min-width:0;display:flex;flex-direction:column;gap:2px}
.${P}-heroLabel{color:var(--dsw-alias-label-secondary);font-size:10.5px;line-height:13px;letter-spacing:.04em}
.${P}-heroValue{display:flex;align-items:baseline;gap:4px;min-width:0;color:var(--dsw-alias-brand-primary)}
.${P}-approx{font-size:15px;font-weight:500;opacity:.9}
.${P}-heroNum{font-size:28px;font-weight:650;line-height:31px;letter-spacing:-.035em;font-variant-numeric:tabular-nums;white-space:nowrap}
.${P}-heroUnit{font-size:11px;font-weight:600;opacity:.75}
.${P}-rounds{flex:none;padding-bottom:2px;color:var(--dsw-alias-label-secondary);font-size:10.5px;line-height:14px;white-space:nowrap}

.${P}-swap{display:grid;grid-template-columns:minmax(0,1fr) 1px minmax(0,1fr);align-items:center;gap:8px;margin-top:7px;padding:7px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-layer-1)}
.${P}-swapItem{min-width:0;display:flex;flex-direction:column;gap:2px}
.${P}-swapTop{display:flex;align-items:center;gap:4px;color:var(--dsw-alias-label-secondary);font-size:9.5px;line-height:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.${P}-swapTop b{font-weight:650;color:var(--dsw-alias-label-primary)}
.${P}-swapTop .is-peak{color:var(--dsw-alias-state-error-primary)}
.${P}-swapTop .is-off{color:var(--dsw-alias-state-success-primary)}
.${P}-swapValue{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:650;line-height:17px;letter-spacing:-.012em;font-variant-numeric:tabular-nums}
.${P}-swapValue span{font-size:9px;font-weight:500;color:var(--dsw-alias-label-secondary)}
.${P}-swapDivider{width:1px;height:24px;background:var(--dsw-alias-border-l1)}

.${P}-estimator{margin-top:8px;padding-top:7px;border-top:1px solid var(--dsw-alias-border-l1)}
.${P}-estimatorHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 1px 2px}
.${P}-sectionTitle{margin:0 1px 2px;color:var(--dsw-alias-label-secondary);font-size:10px;line-height:13px;letter-spacing:.04em}
.${P}-estimatorHead .${P}-sectionTitle{margin:0}
.${P}-estimatorTools{flex:none;display:flex;align-items:center;gap:8px}
.${P}-auto{display:inline-flex;align-items:center;gap:3px;color:var(--dsw-alias-label-secondary);font-size:9.5px;line-height:13px;cursor:pointer;white-space:nowrap}
.${P}-auto input{width:11px;height:11px;margin:0;accent-color:var(--dsw-alias-brand-primary);cursor:pointer}
.${P}-link{padding:1px 0;border:0;background:none;color:var(--dsw-alias-brand-primary);font-size:9.5px!important;font-weight:600;line-height:13px;cursor:pointer;text-decoration:underline;text-underline-offset:2px}
.${P}-link:hover{opacity:.8}
.${P}-link:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px;border-radius:3px}
.${P}-sliderRow{margin-top:8px}
.${P}-sliderHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 1px}
.${P}-sliderLabel{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:14px}
.${P}-sliderValue{flex:none;display:inline-flex;align-items:center;gap:1px;font-size:12px;font-weight:650;line-height:14px;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}
.${P}-numWrap{display:inline-flex;align-items:center;gap:1px}
.${P}-num{width:47px;height:18px;padding:0 3px;border:1px solid var(--dsw-alias-border-l1);border-radius:5px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:11px;font-weight:650;line-height:16px;text-align:right;font-variant-numeric:tabular-nums;outline:none}
.${P}-num:focus{border-color:var(--dsw-alias-brand-primary)}
.${P}-pct{font-size:10px;font-weight:500;color:var(--dsw-alias-label-secondary)}
.${P}-sliderFoot{display:flex;justify-content:space-between;margin:0 1px;color:var(--dsw-alias-label-secondary);font-size:9.5px;line-height:12px}
.${P}-range{--${P}-pct:50%;-webkit-appearance:none;appearance:none;width:100%;height:20px;margin:2px 0 0;background:transparent;cursor:pointer;touch-action:pan-y}
.${P}-range::-webkit-slider-runnable-track{height:4px;border-radius:99px;background:linear-gradient(90deg,var(--dsw-alias-brand-primary) 0 var(--${P}-pct),var(--dsw-alias-bg-layer-2) var(--${P}-pct) 100%)}
.${P}-range::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;margin-top:-5.5px;border-radius:50%;border:2px solid var(--dsw-alias-bg-layer-1);background:var(--dsw-alias-brand-primary);box-shadow:0 0 0 1px var(--dsw-alias-border-l2);transition:transform .14s ease}
.${P}-range:active::-webkit-slider-thumb{transform:scale(1.08)}
.${P}-range:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px;border-radius:6px}
.${P}-range::-moz-range-track{height:4px;border-radius:99px;background:var(--dsw-alias-bg-layer-2)}
.${P}-range::-moz-range-progress{height:4px;border-radius:99px;background:var(--dsw-alias-brand-primary)}
.${P}-range::-moz-range-thumb{width:13px;height:13px;border-radius:50%;border:2px solid var(--dsw-alias-bg-layer-1);background:var(--dsw-alias-brand-primary);box-shadow:0 0 0 1px var(--dsw-alias-border-l2)}

.${P}-meta{display:flex;flex-direction:column;gap:2px;margin-top:8px;padding:6px 8px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-layer-1)}
.${P}-metaRow{display:flex;align-items:baseline;justify-content:space-between;gap:8px;min-width:0;font-size:10.5px;line-height:14px}
.${P}-metaLabel{flex:none;color:var(--dsw-alias-label-secondary)}
.${P}-metaValue{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary);text-align:right;font-variant-numeric:tabular-nums}
.${P}-metaValue.is-peak{color:var(--dsw-alias-state-error-primary)}
.${P}-metaValue.is-off{color:var(--dsw-alias-state-success-primary)}
.${P}-metaValue.is-warn{color:var(--dsw-alias-state-warn-primary)}

.${P}-empty{display:flex;flex-direction:column;align-items:center;gap:7px;padding:16px 12px 12px;text-align:center}
.${P}-emptyIcon{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1)}
.${P}-emptyIcon>svg{width:19px;height:19px}
.${P}-emptyTitle{font-size:13px;font-weight:600;line-height:17px}
.${P}-emptyText{margin:0;color:var(--dsw-alias-label-secondary);font-size:11.5px;line-height:17px;max-width:230px}
.${P}-retry{margin-top:2px;padding:6px 13px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-size:11.5px!important;font-weight:550;cursor:pointer}
.${P}-retry:hover{background:var(--dsw-alias-bg-layer-2)}
.${P}-retry:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.${P}-skeleton{display:flex;flex-direction:column;gap:8px;padding:8px 2px 4px}
.${P}-bone{height:9px;border-radius:5px;background:linear-gradient(90deg,var(--dsw-alias-bg-layer-1) 20%,var(--dsw-alias-bg-layer-2) 38%,var(--dsw-alias-bg-layer-1) 56%);background-size:400% 100%;animation:${P}-shimmer 1.35s ease-in-out infinite}
.${P}-bone.short{width:46%}
.${P}-bone.medium{width:72%}
.${P}-bone.tall{height:24px;width:57%}

.${P}-foot{margin-top:7px;padding-top:6px;border-top:1px solid var(--dsw-alias-border-l1);display:flex;flex-direction:column;align-items:center;gap:2px;color:var(--dsw-alias-label-secondary)}
.${P}-credit{color:var(--dsw-alias-label-secondary);font-size:9.5px;line-height:13px;text-decoration:none;letter-spacing:.02em}
.${P}-credit:hover{color:var(--dsw-alias-brand-primary);text-decoration:underline;text-underline-offset:2px}
.${P}-credit:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px;border-radius:3px}
.${P}-sr{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}

@keyframes ${P}-pulse{0%{opacity:.55;transform:scale(.62)}70%{opacity:0;transform:scale(1.7)}100%{opacity:0;transform:scale(1.7)}}
@keyframes ${P}-pop-in{from{opacity:0;transform:translateY(7px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes ${P}-spin{to{transform:rotate(360deg)}}
@keyframes ${P}-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
@keyframes ${P}-flash{0%{color:var(--dsw-alias-brand-primary);transform:translateY(-1px)}100%{color:inherit;transform:translateY(0)}}
@keyframes ${P}-coin-drop{0%{opacity:0;transform:translateY(-3px) scale(.94)}14%{opacity:1;transform:translateY(0) scale(1)}72%{opacity:1;transform:translateY(1px) scale(1)}100%{opacity:0;transform:translateY(4px) scale(.98)}}
@media (prefers-reduced-motion:reduce){
  .${P}-card,.${P}-card::after,.${P}-tab,.${P}-tick,.${P}-range::-webkit-slider-thumb{transition:none}
  .${P}-live::after,.${P}-pop,.${P}-bone,.${P}-balance.is-flash,.${P}-iconBtn.is-spinning>svg,.${P}-delta{animation:none}
  .${P}-card:hover{transform:none}
}
`;

    /* ------------------------------------------------------------------ *
     * Component
     * ------------------------------------------------------------------ */
    function BalanceWidget(props) {
      const t = typeof props.t === 'function'
        ? props.t
        : typeof props.translate === 'function' ? props.translate : key => key;
      const wide = props.wide !== false;
      const [clockNow, syncClock] = useClock();
      const rootRef = useRef(null);
      const triggerRef = useRef(null);
      const aliveRef = useRef(true);
      const inFlightRef = useRef(false);
      const requestRef = useRef(0);
      const [open, setOpen] = useState(false);
      const [refreshing, setRefreshing] = useState(false);
      const [data, setData] = useState({ status: 'loading' });
      const [flash, setFlash] = useState(false);
      const [delta, setDelta] = useState(null);
      const [catalog, setCatalog] = useState(FALLBACK_CATALOG);
      const [catalogReady, setCatalogReady] = useState(false);
      const initialPrefs = useMemo(readPrefs, []);
      const [modelId, setModelId] = useState(initialPrefs.model);
      const [effortId, setEffortId] = useState(initialPrefs.effort);
      const [inputShare, setInputShare] = useState(initialPrefs.inputShare);
      const [cacheHit, setCacheHit] = useState(initialPrefs.cacheHit);
      const [autoSession, setAutoSession] = useState(initialPrefs.autoSession);
      const [activeSessionId, setActiveSessionId] = useState(() => readActiveSessionId());
      const previousTotalRef = useRef(null);
      const appliedSessionRef = useRef(null);
      const usageRef = useRef(null);
      const useSessions = typeof props.useSessions === 'function' ? props.useSessions : null;
      const sessionsState = useSessions ? useSessions(state => state) : null;
      const sessionUsage = useMemo(() => extractSessionUsage(sessionsState, activeSessionId), [sessionsState, activeSessionId]);
      const sessionKey = sessionUsage ? sessionUsage.sessionId : null;

      useEffect(() => {
        const timer = setInterval(() => {
          const next = readActiveSessionId();
          if (next) setActiveSessionId(current => current === next ? current : next);
        }, 1000);
        return () => clearInterval(timer);
      }, []);

      const locale = localeId((() => {
        try {
          return typeof props.getLocale === 'function' ? props.getLocale() : 'zh';
        } catch {
          return 'zh';
        }
      })());

      const applyUsage = useCallback(usage => {
        if (!usage) return;
        appliedSessionRef.current = usage.sessionId;
        setInputShare(roundShare(usage.inputShare));
        setCacheHit(roundShare(usage.hitRate));
      }, []);

      const applySessionUsage = useCallback(() => {
        if (!sessionUsage) return;
        setAutoSession(true);
        applyUsage(sessionUsage);
      }, [applyUsage, sessionUsage]);

      const editInputShare = useCallback(value => {
        setAutoSession(false);
        setInputShare(value);
      }, []);

      const editCacheHit = useCallback(value => {
        setAutoSession(false);
        setCacheHit(value);
      }, []);

      const refresh = useCallback(async manual => {
        if (inFlightRef.current) return;
        if (typeof props.read !== 'function') {
          setData(current => current.status === 'ready' ? { ...current, stale: true, error: true } : { status: 'error' });
          return;
        }
        inFlightRef.current = true;
        if (manual) setRefreshing(true);
        const request = ++requestRef.current;
        try {
          const balance = await props.read();
          if (!aliveRef.current || request !== requestRef.current) return;
          if (balance == null) {
            setData({ status: 'signed-out' });
            previousTotalRef.current = null;
            return;
          }
          if (balance.status !== 'ready') {
            setData(current => current.status === 'ready'
              ? { ...current, stale: true, error: true }
              : { status: 'error' });
            return;
          }
          const next = summarize(balance);
          setData({
            status: 'ready',
            currency: next.currency,
            total: next.total,
            recharge: next.recharge,
            bonus: next.bonus,
            readAt: Date.now(),
            stale: false,
            error: false
          });
        } catch {
          if (!aliveRef.current || request !== requestRef.current) return;
          setData(current => current.status === 'ready'
            ? { ...current, stale: true, error: true }
            : { status: 'error' });
        } finally {
          if (aliveRef.current && request === requestRef.current) setRefreshing(false);
          inFlightRef.current = false;
        }
      }, [props.read]);

      useEffect(() => {
        aliveRef.current = true;
        refresh(false);
        return () => {
          aliveRef.current = false;
          requestRef.current += 1;
        };
      }, [refresh]);

      useEffect(() => {
        const poll = () => {
          if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
          refresh(false);
        };
        const onVisibility = () => {
          if (document.visibilityState === 'visible') refresh(false);
        };
        const onFocus = () => refresh(false);
        const timer = setInterval(poll, REFRESH_MS);
        if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisibility);
        if (typeof window !== 'undefined') window.addEventListener('focus', onFocus);
        return () => {
          clearInterval(timer);
          if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisibility);
          if (typeof window !== 'undefined') window.removeEventListener('focus', onFocus);
        };
      }, [refresh]);

      /* Startup-only model catalog fetch. */
      useEffect(() => {
        let active = true;
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = setTimeout(() => {
          if (controller) controller.abort();
        }, 12000);
        const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
        (async () => {
          for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
              if (typeof fetch !== 'function') throw new Error('fetch unavailable');
              const response = await fetch(CATALOG_PATH, {
                cache: 'no-store',
                signal: controller ? controller.signal : undefined
              });
              if (!response.ok) throw new Error(`catalog ${response.status}`);
              const parsed = normalizeCatalog(await response.json());
              if (!parsed) throw new Error('catalog empty');
              if (active) setCatalog(parsed);
              break;
            } catch {
              if (attempt < 2 && active) await wait(700 * (attempt + 1));
              else break;
            }
          }
          clearTimeout(timer);
          if (active) setCatalogReady(true);
        })();
        return () => {
          active = false;
          clearTimeout(timer);
          if (controller) controller.abort();
        };
      }, []);

      useEffect(() => {
        usageRef.current = sessionUsage;
      }, [sessionUsage]);

      useEffect(() => {
        if (!autoSession || !sessionUsage) return;
        if (appliedSessionRef.current !== sessionUsage.sessionId) applyUsage(sessionUsage);
      }, [applyUsage, autoSession, sessionKey]);

      useEffect(() => {
        if (!autoSession) return undefined;
        const timer = setInterval(() => {
          if (usageRef.current) applyUsage(usageRef.current);
        }, 60000);
        return () => clearInterval(timer);
      }, [applyUsage, autoSession]);

      useEffect(() => {
        if (data.status !== 'ready') {
          previousTotalRef.current = null;
          setDelta(null);
          return undefined;
        }
        const previous = previousTotalRef.current;
        previousTotalRef.current = data.total;
        if (typeof previous === 'number' && Math.abs(previous - data.total) > 0.0001) {
          setFlash(true);
          setDelta({ amount: data.total - previous, id: Date.now() });
          const timer = setTimeout(() => {
            setFlash(false);
            setDelta(null);
          }, 1600);
          return () => clearTimeout(timer);
        }
        return undefined;
      }, [data.status, data.total]);

      useEffect(() => {
        writePrefs({ model: modelId, effort: effortId, inputShare, cacheHit, autoSession });
      }, [autoSession, cacheHit, effortId, inputShare, modelId]);

      useEffect(() => {
        if (!open) return undefined;
        const onPointerDown = event => {
          if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
        };
        const onKeyDown = event => {
          if (event.key === 'Escape') {
            setOpen(false);
            if (triggerRef.current) triggerRef.current.focus();
          }
        };
        document.addEventListener('pointerdown', onPointerDown, true);
        document.addEventListener('keydown', onKeyDown);
        return () => {
          document.removeEventListener('pointerdown', onPointerDown, true);
          document.removeEventListener('keydown', onKeyDown);
        };
      }, [open]);

      const models = catalog.models && catalog.models.length ? catalog.models : FALLBACK_CATALOG.models;
      useEffect(() => {
        if (!catalogReady || models.length === 0) return;
        if (!models.some(item => item.id === modelId)) setModelId(models[0].id);
      }, [catalogReady, modelId, models]);

      const model = models.find(item => item.id === modelId) || models[0];
      const effort = EFFORTS.find(item => item.id === effortId) || EFFORTS[2];
      const effortIndex = Math.max(0, EFFORTS.findIndex(item => item.id === effort.id));
      const effortPercent = EFFORTS.length > 1 ? (effortIndex / (EFFORTS.length - 1)) * 100 : 0;
      const period = periodInfo(clockNow);
      const currentLabel = period.peak ? t('peak') : t('offPeak');
      const otherLabel = period.peak ? t('offPeak') : t('peak');
      const currentTariff = period.peak ? t('peakTariff') : t('offTariff');
      const total = data.status === 'ready' ? data.total : 0;
      const currency = data.status === 'ready' ? data.currency : 'CNY';
      const currentEstimate = estimateFor(total, model, effort, period.peak, currency, inputShare, cacheHit);
      const otherEstimate = estimateFor(total, model, effort, !period.peak, currency, inputShare, cacheHit);
      const shownBalance = useTween(data.status === 'ready' ? data.total : null);
      const shownTokens = useTween(data.status === 'ready' ? currentEstimate.tokens : null);
      const shownRounds = useTween(data.status === 'ready' ? currentEstimate.rounds : null);
      const balanceText = data.status === 'ready' ? formatMoney(data.total, data.currency, locale) : '';
      const tokenText = formatTokens(data.status === 'ready' ? currentEstimate.tokens : 0);
      const untilText = formatUntil(period.nextAt, clockNow, t);
      const remainingText = formatDurationShort(period.nextAt - clockNow, t);
      const updatedText = data.status === 'ready' ? formatTimestamp(data.readAt) : '';
      const modelStamp = catalog.source === 'official' && catalog.fetchedAt
        ? `${t('startupUpdate')} ${formatClock(catalog.fetchedAt)}`
        : t('builtinPricing');
      const signedOut = data.status === 'signed-out';
      const loadError = data.status === 'error';
      const loading = data.status === 'loading';
      const stale = data.status === 'ready' && data.stale;
      const dotClass = signedOut
        ? 'is-idle'
        : loadError
          ? 'is-error'
          : stale
            ? 'is-warn'
            : data.status === 'ready'
              ? ''
              : 'is-idle';
      const statusText = signedOut
        ? t('signedOut')
        : loadError
          ? t('error')
          : loading
            ? t('loading')
            : '';
      const cardAria = data.status === 'ready'
        ? `${t('title')}, ${balanceText}, ${currentLabel}, ${t('approx')}${tokenText} ${t('tokens')}`
        : statusText;
      const popId = `${P}-popover`;

      return h(React.Fragment, null,
        h('style', { key: 'style' }, CSS),
        h('div', {
          key: 'root',
          ref: rootRef,
          className: `${P}-root${wide ? '' : ' is-rail'}${open ? ' is-open' : ''}`
        },
          h('button', {
            ref: triggerRef,
            type: 'button',
            className: `${P}-card${wide ? '' : ' is-rail'}`,
            onClick: () => {
              const next = !open;
              setOpen(next);
              if (next) {
                syncClock();
                refresh(false);
              }
            },
            'aria-expanded': open,
            'aria-controls': open ? popId : undefined,
            'aria-label': cardAria,
            title: data.status === 'ready' ? t('autoRefresh') : statusText
          },
            h('span', { className: `${P}-orb`, 'aria-hidden': true },
              h(Glyph, { name: 'wallet' }),
              h('span', { className: `${P}-live ${dotClass}` })
            ),
            wide ? h('span', { className: `${P}-copy` },
              h('span', { className: `${P}-eyebrow` },
                h('span', { className: `${P}-name` }, t('title')),
                h('span', { className: `${P}-period${period.peak ? ' is-peak' : ''}` }, currentLabel)
              ),
              h('span', { className: `${P}-line` },
                data.status === 'ready'
                  ? h('span', { className: `${P}-balance${flash ? ' is-flash' : ''}` }, formatMoney(shownBalance == null ? data.total : shownBalance, data.currency, locale))
                  : h('span', { className: `${P}-balance ${loadError ? 'is-error' : 'is-muted'}` }, statusText),
                data.status === 'ready' && !delta
                  ? h('span', { className: `${P}-est` }, `${t('approx')}${formatTokens(currentEstimate.tokens)} ${t('tokens')}`)
                  : null
              )
            ) : null
          ),
          delta ? h('span', {
            key: delta.id,
            className: `${P}-delta ${delta.amount > 0 ? 'is-plus' : 'is-minus'}`
          }, `${delta.amount > 0 ? '+' : '−'}${formatMoney(Math.abs(delta.amount), data.currency, locale)}`) : null,
          h('span', { className: `${P}-sr`, 'aria-live': 'polite' }, data.status === 'ready' ? balanceText : statusText),
          open ? h('div', {
            id: popId,
            className: `${P}-pop`,
            role: 'dialog',
            'aria-label': t('title')
          },
            h('div', { className: `${P}-head` },
              h('span', { className: `${P}-headOrb`, 'aria-hidden': true }, h(Glyph, { name: 'wallet' })),
              h('span', { className: `${P}-headCopy` },
                h('span', { className: `${P}-headTitle` }, t('title')),
                data.status === 'ready'
                  ? h('span', { className: `${P}-headBalance` }, formatMoney(shownBalance == null ? data.total : shownBalance, data.currency, locale))
                  : h('span', { className: `${P}-headBalance ${P}-headMuted` }, statusText),
                data.status === 'ready' && data.bonus > 0
                  ? h('span', { className: `${P}-headBonus` }, `${t('bonus')} ${formatMoney(data.bonus, data.currency, locale)}`)
                  : null
              ),
              h('button', {
                type: 'button',
                className: `${P}-iconBtn${refreshing ? ' is-spinning' : ''}`,
                onClick: event => {
                  event.stopPropagation();
                  refresh(true);
                },
                disabled: refreshing,
                title: t('refresh'),
                'aria-label': t('refresh')
              }, h(Glyph, { name: 'refresh' }))
            ),
            data.status === 'ready'
              ? h(React.Fragment, null,
                h('div', { className: `${P}-periodCard${period.peak ? ' is-peak' : ''}`, title: `${t('windowNote')} · ${t('holidayNote')}` },
                  h('span', { className: `${P}-periodIcon${period.peak ? ' is-peak' : ''}`, 'aria-hidden': true }, h(Glyph, { name: period.peak ? 'sun' : 'moon' })),
                  h('span', { className: `${P}-periodCopy` },
                    h('span', { className: `${P}-periodTitle` }, `${currentLabel} · ${currentTariff}`),
                    h('span', { className: `${P}-periodMeta` }, `${t('until')} ${untilText} · ${remainingText}`)
                  ),
                  h('span', { className: `${P}-periodSave${period.peak ? ' is-standard' : ''}` }, period.peak ? t('standard') : t('discount'))
                ),
                h('div', { className: `${P}-field` },
                  h('span', { className: `${P}-fieldLabel` }, t('model')),
                  h('div', { className: `${P}-tabs`, role: 'tablist', 'aria-label': t('model') },
                    models.map(item => h('button', {
                      key: item.id,
                      type: 'button',
                      role: 'tab',
                      title: item.id,
                      'aria-selected': item.id === model.id,
                      className: `${P}-tab${item.id === model.id ? ' is-active' : ''}`,
                      onClick: () => setModelId(item.id)
                    },
                      h('span', { className: `${P}-tabName` }, item.shortName || item.id),
                      h('span', { className: `${P}-tabSub` }, item.version || item.id)
                    ))
                  )
                ),
                h('div', { className: `${P}-effort` },
                  h('div', { className: `${P}-effortHead` },
                    h('span', { className: `${P}-fieldLabel` }, t('effort')),
                    h('span', { className: `${P}-effortValue` }, effort.q === 1 ? `${t(effort.key)} · ${t('effortBase')}` : `${t(effort.key)} · ×${trimZero(effort.q.toFixed(2))}`)
                  ),
                  h('input', {
                    type: 'range',
                    className: `${P}-range`,
                    min: 0,
                    max: EFFORTS.length - 1,
                    step: 1,
                    value: effortIndex,
                    style: { [`--${P}-pct`]: `${effortPercent}%` },
                    onChange: event => setEffortId(EFFORTS[Number(event.target.value)].id),
                    'aria-label': t('effort'),
                    'aria-valuetext': t(effort.key)
                  }),
                  h('div', { className: `${P}-ticks`, role: 'group', 'aria-label': t('effort') },
                    EFFORTS.map(item => h('button', {
                      key: item.id,
                      type: 'button',
                      className: `${P}-tick${item.id === effort.id ? ' is-active' : ''}`,
                      'aria-pressed': item.id === effort.id,
                      onClick: () => setEffortId(item.id)
                    }, t(item.key)))
                  )
                ),
                h('div', { className: `${P}-hero` },
                  h('span', { className: `${P}-heroMain` },
                    h('span', { className: `${P}-heroLabel` }, t('estimate')),
                    h('span', { className: `${P}-heroValue` },
                      h('span', { className: `${P}-approx` }, t('approx')),
                      h('span', { className: `${P}-heroNum`, title: Math.round(currentEstimate.tokens).toLocaleString(locale) }, formatTokens(shownTokens == null ? currentEstimate.tokens : shownTokens)),
                      h('span', { className: `${P}-heroUnit` }, t('tokens'))
                    )
                  ),
                  h('span', { className: `${P}-rounds` }, `${t('approx')}${formatRounds(shownRounds == null ? currentEstimate.rounds : shownRounds, locale)} ${t('rounds')}`)
                ),
                h('div', { className: `${P}-swap` },
                  h('div', { className: `${P}-swapItem` },
                    h('div', { className: `${P}-swapTop` },
                      h('b', null, t('current')),
                      h('span', { className: period.peak ? 'is-peak' : 'is-off' }, currentLabel)
                    ),
                    h('div', { className: `${P}-swapValue` },
                      formatTokens(currentEstimate.tokens),
                      h('span', null, ` ${t('tokens')}`)
                    )
                  ),
                  h('span', { className: `${P}-swapDivider`, 'aria-hidden': true }),
                  h('div', { className: `${P}-swapItem` },
                    h('div', { className: `${P}-swapTop` },
                      h('b', null, t('other')),
                      h('span', null, otherLabel)
                    ),
                    h('div', { className: `${P}-swapValue` },
                      formatTokens(otherEstimate.tokens),
                      h('span', null, ` ${t('tokens')}`)
                    )
                  )
                ),
                h('div', { className: `${P}-estimator` },
                  h('div', { className: `${P}-estimatorHead` },
                    h('div', { className: `${P}-sectionTitle` }, t('estimator')),
                    h('div', { className: `${P}-estimatorTools` },
                      h('label', { className: `${P}-auto`, title: t('autoSessionHint') },
                        h('input', {
                          type: 'checkbox',
                          checked: autoSession,
                          onChange: event => {
                            const next = event.target.checked;
                            setAutoSession(next);
                            if (next && sessionUsage) applyUsage(sessionUsage);
                          },
                          'aria-label': t('autoSessionHint')
                        }),
                        h('span', null, t('autoSession'))
                      ),
                      sessionUsage
                        ? h('button', {
                          type: 'button',
                          className: `${P}-link`,
                          title: `${t('useSession')}: ${formatTokens(sessionUsage.input)} ${t('input')} / ${formatTokens(sessionUsage.output)} ${t('output')} · ${formatShare(sessionUsage.hitRate)}%`,
                          onClick: applySessionUsage
                        }, t('useSession'))
                        : null
                    )
                  ),
                  h('div', { className: `${P}-sliderRow` },
                    h('div', { className: `${P}-sliderHead` },
                      h('span', { className: `${P}-sliderLabel` }, t('ioRatio')),
                      h(NumberField, {
                        value: inputShare,
                        min: 0,
                        max: 100,
                        onCommit: value => editInputShare(value),
                        label: t('ioRatio')
                      })
                    ),
                    h('input', {
                      type: 'range',
                      className: `${P}-range`,
                      min: 0,
                      max: 100,
                      step: 0.01,
                      value: inputShare,
                      style: { [`--${P}-pct`]: `${inputShare}%` },
                      onChange: event => editInputShare(roundShare(clamp(event.target.value, 0, 100, inputShare))),
                      'aria-label': t('ioRatio')
                    }),
                    h('div', { className: `${P}-sliderFoot` },
                      h('span', null, `${t('input')} ${formatShare(inputShare)}%`),
                      h('span', null, `${t('output')} ${formatShare(100 - inputShare)}%`)
                    )
                  ),
                  h('div', { className: `${P}-sliderRow` },
                    h('div', { className: `${P}-sliderHead` },
                      h('span', { className: `${P}-sliderLabel` }, t('cacheHit')),
                      h(NumberField, {
                        value: cacheHit,
                        min: 0,
                        max: 100,
                        onCommit: value => editCacheHit(value),
                        label: t('cacheHit')
                      })
                    ),
                    h('input', {
                      type: 'range',
                      className: `${P}-range`,
                      min: 0,
                      max: 100,
                      step: 0.01,
                      value: cacheHit,
                      style: { [`--${P}-pct`]: `${cacheHit}%` },
                      onChange: event => editCacheHit(roundShare(clamp(event.target.value, 0, 100, cacheHit))),
                      'aria-label': t('cacheHit')
                    }),
                    h('div', { className: `${P}-sliderFoot` },
                      h('span', null, t('cacheHit')),
                      h('span', null, `${t('cacheMiss')} ${formatShare(100 - cacheHit)}%`)
                    )
                  )
                ),
                h('div', { className: `${P}-meta` },
                  h('div', { className: `${P}-metaRow` },
                    h('span', { className: `${P}-metaLabel` }, t('model')),
                    h('span', { className: `${P}-metaValue${catalog.source === 'official' ? '' : ' is-warn'}` }, modelStamp)
                  ),
                  h('div', { className: `${P}-metaRow` },
                    h('span', { className: `${P}-metaLabel` }, t('balance')),
                    h('span', { className: `${P}-metaValue` }, `${t('realtime')} · ${updatedText}`)
                  ),
                  h('div', { className: `${P}-metaRow` },
                    h('span', { className: `${P}-metaLabel` }, t('period')),
                    h('span', { className: `${P}-metaValue ${period.peak ? 'is-peak' : 'is-off'}` }, `${currentLabel} · ${t('refresh5m')}`)
                  )
                ),
                h('div', { className: `${P}-foot` },
                  h('a', {
                    className: `${P}-credit`,
                    href: 'https://github.com/Assenters',
                    target: '_blank',
                    rel: 'noopener noreferrer'
                  }, 'GitHub-Assenters')
                )
              )
              : signedOut
                ? h('div', { className: `${P}-empty` },
                  h('span', { className: `${P}-emptyIcon`, 'aria-hidden': true }, h(Glyph, { name: 'login' })),
                  h('span', { className: `${P}-emptyTitle` }, t('signedOut')),
                  h('p', { className: `${P}-emptyText` }, t('signedOutHint'))
                )
                : loadError
                  ? h('div', { className: `${P}-empty` },
                    h('span', { className: `${P}-emptyIcon`, 'aria-hidden': true }, h(Glyph, { name: 'wallet' })),
                    h('span', { className: `${P}-emptyTitle` }, t('error')),
                    h('p', { className: `${P}-emptyText` }, t('errorHint')),
                    h('button', {
                      type: 'button',
                      className: `${P}-retry`,
                      onClick: event => {
                        event.stopPropagation();
                        refresh(true);
                      }
                    }, t('retry'))
                  )
                  : h('div', { className: `${P}-skeleton` },
                    h('div', { className: `${P}-bone short` }),
                    h('div', { className: `${P}-bone tall` }),
                    h('div', { className: `${P}-bone medium` }),
                    h('div', { className: `${P}-bone` })
                  )
          ) : null
        )
      );
    }

    /* ------------------------------------------------------------------ *
     * Plugin
     * ------------------------------------------------------------------ */
    return {
      inject: ['slots', 'locale', 'remote', 'remote.account'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'deepseek-balance: copy');

        const getLocale = () => {
          try {
            const state = ctx.locale.getSnapshot();
            return state && state.active ? state.active : 'zh';
          } catch {
            return 'zh';
          }
        };
        const read = async () => {
          if (!ctx.remote || !ctx.remote.account) throw new Error('account namespace unavailable');
          const result = await ctx.remote.account.getBalance({
            version: VERSION,
            locale: getLocale(),
            timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60
          });
          if (!result.ok) throw new Error(result.error && result.error.message ? result.error.message : 'account balance unavailable');
          return result.value;
        };
        const port = {
          read,
          getLocale,
          translate: ctx.locale.bind(NS)
        };

        ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
          name: 'sidebar.footer.action',
          id: 'deepseek-balance',
          order: -10,
          locale: NS,
          inject: () => port
        }, BalanceWidget));
      }
    };
  }
});
