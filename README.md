<p align="center">
  <img src="icon.svg" width="88" height="88" alt="DeepSeek Balance icon">
</p>

<h1 align="center">DeepSeek Balance for DSH</h1>

<p align="center">
  <b>实时 DeepSeek 余额 + 可用 token 估算，常驻 DSH 侧边栏头像上方。</b><br>
  <b>Live DeepSeek balance and token-capacity estimates above the DSH sidebar avatar.</b>
</p>

<p align="center">
  <a href="#中文">中文</a> ·
  <a href="#english">English</a> ·
  <a href="CHANGELOG.md">Changelog</a> ·
  <a href="LICENSE">MIT License</a>
</p>

---

## 中文

### 简介

一个给 DeepSeek Harness（DSH）用的轻量 Web 插件。它把实时余额、模型价格、高峰/空闲时段和当前会话的真实用量放在一起，估算“剩下的钱还能用多少 tokens”。卡片固定在侧边栏头像上方，不覆盖工作区。

### 功能

- **实时余额**：读取已登录账号的充值余额与赠送余额，每 10 秒刷新，窗口聚焦、打开详情、手动刷新时立即更新。
- **会话实际值**：点击“用会话实际值”，从当前 Session 的 provider `tokenUsage` 读取真实输入/输出比例与缓存命中率。
- **自动校准**：切换会话时立即校准；Auto 模式每 60 秒重新读取当前会话。手动拖动滑条会关闭 Auto，点击按钮可重新开启。
- **模型目录**：DSH 启动时由 Host 读取 DeepSeek 官方 pricing Markdown 一次，解析模型、版本、CNY/USD 价格；失败时使用内置价格表。
- **模型 × 推理强度 × 时段**：Flash / V4 Pro 等模型，五档推理强度滑条，当前与另一时段对比。
- **精确比例**：输入占比与缓存命中率支持 0.01% 精度和直接数字输入，避免 1% 粒度带来的巨大误差。
- **余额差值动画**：余额变化时显示 `−¥0.18` / `+¥0.18` 掉落标签。
- **可读性**：放大的正文、模型名与说明；`K / M / B` 自动 token 单位；深色、浅色、跟随系统主题。
- **减少动态效果**：尊重 `prefers-reduced-motion`。

### 安装

1. 下载 Release 中的 `dsh-deepseek-balance-1.0.0.zip` 并解压。
2. 在 DSH 的插件管理器中把 `dsh-deepseek-balance` 目录作为本地 bundle 安装；或执行：

   ```bash
   dsh plugin --profile desktop add link:/absolute/path/to/dsh-deepseek-balance
   ```

3. 启用插件并刷新 Web 页面。

无需构建、无需 `pnpm install`，源码就是可加载的客户端 bundle。

### 估算逻辑

```text
inputPrice = hitRate * cacheHitPrice + (1 - hitRate) * cacheMissPrice
cost/M     = inputShare * inputPrice + outputShare * effortFactor * outputPrice
```

- 默认按长 DSH Agent 会话设为 **99.75% 输入 / 0.25% 输出、99.7% 命中**，但仍推荐点一次“用会话实际值”。
- “高”推理强度是 **1.0 基准**，因为用户填写的比例本身已经包含实际产生的思考 tokens；其余档位只相对基准缩放输出侧。
- 空闲时段价格为高峰时段的一半。
- 不含法定节假日调休与 Search/Fetch 费用，最终以 DeepSeek 平台账单为准。

### 隐私

- 余额通过 DSH 已认证的 `remote.account` 读取，账号 token 不进入浏览器页面。
- 插件不发送遥测、不上传余额、不写入任何远程数据库。
- 启动时只由 Host 读取 DeepSeek 官方公开价格页。

### 要求

- DSH Web 客户端（当前在 `0.2.1-rc.5` 上验证）。
- 已登录的 DeepSeek 账号（用于余额读取）。

---

## English

### What it is

A lightweight Web plugin for DeepSeek Harness (DSH). It combines the live wallet balance, published model prices, peak/off-peak tariffs, and the current Session's provider usage to estimate how many tokens the remaining balance can buy. The card sits above the sidebar avatar and never covers the workspace.

### Features

- **Live balance** — recharge and bonus wallets from the signed-in account, refreshed every 10 seconds and immediately on focus/open/manual refresh.
- **Use session actuals** — reads the current Session's provider `tokenUsage` and fills the real cumulative input/output split and cache-hit rate.
- **Auto calibration** — recalibrates on session switch and re-reads the current Session every 60 seconds. Editing either slider turns Auto off; the button re-enables it.
- **Startup model catalog** — the Host reads DeepSeek's official pricing Markdown once at DSH startup, parses model names, versions, and CNY/USD prices, then serves it to the page. A built-in table is used if the fetch fails.
- **Model × effort × tariff** — Flash / V4 Pro and every catalog model, a five-stop horizontal reasoning slider, and current-vs-other tariff comparison.
- **Precise assumptions** — input share and cache-hit rate at 0.01% precision with direct numeric entry, avoiding the large error caused by 1% steps.
- **Balance delta animation** — a `−¥0.18` / `+¥0.18` chip drops away from the card when the balance changes.
- **Readable UI** — larger copy, model labels, and captions; automatic `K / M / B` token units; dark, light, and system-following themes.
- **Reduced motion** — honors `prefers-reduced-motion`.

### Install

1. Download and extract `dsh-deepseek-balance-1.0.0.zip` from the Release.
2. Add the `dsh-deepseek-balance` directory as a local bundle in DSH Plugin Manager, or run:

   ```bash
   dsh plugin --profile desktop add link:/absolute/path/to/dsh-deepseek-balance
   ```

3. Enable the bundle and refresh the Web page.

There is no build step and no `pnpm install`; the source is the loadable client bundle.

### Estimation model

```text
inputPrice = hitRate * cacheHitPrice + (1 - hitRate) * cacheMissPrice
cost/M     = inputShare * inputPrice + outputShare * effortFactor * outputPrice
```

- Defaults target long DSH agent Sessions: **99.75% input / 0.25% output, 99.7% cache hits**. Clicking **Use session actuals** is still recommended.
- The **High** effort level is the **1.0 baseline**, because the user-entered ratio already includes the thinking tokens actually billed. Other levels scale only the output side relative to that baseline.
- Off-peak is exactly half of peak.
- Chinese statutory-holiday adjustments and Search/Fetch fees are excluded; the DeepSeek platform bill is authoritative.

### Privacy

- Balance is read through DSH's authenticated `remote.account`; account tokens never enter the page.
- No telemetry, no balance uploads, no remote storage.
- At startup the Host reads only DeepSeek's public pricing page.

### Requirements

- DSH Web client (verified on `0.2.1-rc.5`).
- A signed-in DeepSeek account for balance reads.

---

## Credit

`GitHub-Assenters` links to <https://github.com/Assenters>. For a different
repository or account, update the `href` on `.dsb-credit` in `client.js`.

## License

MIT © 2026 Assenters
