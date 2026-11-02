# DeepSeek Balance for DSH — v1.0.0

## 中文简介

DSH 侧边栏的实时 DeepSeek 余额与 token 容量估算插件。余额、模型价格、时段和会话实际用量一起工作：切换会话自动校准，每 60 秒读取一次当前会话的 provider 用量；按模型、推理强度、输入占比与缓存命中率估算还能用多少 tokens。所有数据仅在本机运行，Token 不进入页面。

### 亮点

- 头像上方的实时余额卡片，余额变化显示 `−¥0.xx` 掉落动画
- **用会话实际值** + **自动**：按当前 Session 的真实 `tokenUsage` 校准
- 模型目录启动时从 DeepSeek 官方 pricing Markdown 更新一次
- 输入占比 / 缓存命中率 0.01% 精度，支持数字输入
- 推理强度横向滑条；`K / M / B` 自动单位
- 深色 / 浅色 / 跟随系统；减少动态效果适配

## English summary

Live DeepSeek wallet balance and token-capacity estimator for the DSH sidebar. Balance, pricing, tariff window, and the current Session's provider usage work together: switching conversations recalibrates automatically, and the current Session is re-read every 60 seconds. Estimates cover model, reasoning effort, input share, and cache-hit rate. Everything runs locally; no token is exposed to the page.

### Highlights

- Live balance card above the avatar, with a `−¥0.xx` drop animation on spend
- **Use session actuals** + **Auto** calibration from the current Session's `tokenUsage`
- Model catalog refreshed once at DSH startup from the official pricing Markdown
- Input share / cache-hit rate at 0.01% precision, with numeric entry
- Horizontal reasoning slider; automatic `K / M / B` token units
- Dark / light / system themes; reduced-motion aware

## Install / 安装

1. Download and extract `dsh-deepseek-balance-1.0.0.zip`.
2. Add the extracted `dsh-deepseek-balance` directory as a local bundle in DSH Plugin Manager, or run:
   `dsh plugin --profile desktop add link:/absolute/path/to/dsh-deepseek-balance`
3. Enable the bundle and refresh the Web page.

## Notes / 说明

- Prices come from the official DeepSeek pricing page; off-peak is half price.
- Search/Fetch fees and Chinese statutory-holiday adjustments are not included.
- Requires a signed-in DeepSeek account for balance reads.
