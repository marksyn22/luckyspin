# 实战案例分享：Winbox 幸运大转盘 (Spin Wheel) 抽奖页面

最近有幸受 **[Winbox](https://login.winboxmalay.com)** 委托，为其开发并上线了一款幸运大转盘（Spin Wheel）交互页面。该项目已在生产环境稳定运行了一段时间，并取得了预期的业务反馈。实时业务页面 **[Winbox Lucky Wheel](https://login.winboxmalay.com/lucky-wheel)**

为了回馈社区，我决定将其中核心的实现逻辑与代码进行精简分享。

### 项目亮点
* **生产环境验证**：方案经过实际业务场景跑通，具备高可用性。
* **交互体验**：平滑的旋转动画与自适应布局。
* **简洁高效**：逻辑清晰，易于二次开发与快速集成。

# Spin Wheel Project

从 **Winbox / wblogin** 主站拆出的 **每日幸运轮盘** 参考实现：**Next.js App Router** 全栈（页面 + API Routes + Supabase RPC + 可选 Redis 缓存），便于单独开源或接入你自己的站点。

## 功能概览

- 三语 UI（英 / 中 / 马）：`/lucky-wheel`、`/zh/lucky-wheel`、`/ms/lucky-wheel`
- 马来西亚时间 **MYT** 两场开放窗口（具体时刻见 `supabase/sql/lucky-wheel.sql` 与前端 `components/LuckyWheelPage.tsx`）
- **Cloudflare Turnstile** 人机验证（`/api/turnstile-verify`）
- **Supabase**：`lucky_wheel_status` / `lucky_wheel_spin` / `lucky_wheel_submit_redeem` 等（SQL 见 `supabase/sql/lucky-wheel.sql`）
- 可选 **Upstash Redis**：状态接口短缓存与限流（`lib/redis.ts`）

## 快速开始

```bash
cd SpinWheelProject
cp .env.example .env
# 编辑 .env，填入 Supabase、Turnstile 等
npm install
npm run dev
```

浏览器访问 <http://localhost:3000>（会重定向到 `/lucky-wheel`）。

生产环境请设置 **`NEXT_PUBLIC_SITE_URL`**（用于 canonical / SEO）。

## 环境变量

见根目录 **`.env.example`**。要点：

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 客户端可读（若策略允许） |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | 服务端 RPC（推荐生产） |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Turnstile |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | 可选；不配则跳过缓存 |
| `NEXT_PUBLIC_LUCKY_WHEEL_DEV_MODE=true` | 本地开发忽略时段（仍受每日次数等逻辑约束，以 SQL 为准） |

也支持沿用 **`VITE_*` 前缀**（由 `next.config.ts` 映射到 `NEXT_PUBLIC_*`）。

## 数据库

1. 在 Supabase（或自建 Postgres）执行 **`supabase/sql/lucky-wheel.sql`**（含表、函数、权限）。
2. 确保 Edge/API 能带上 **Service Role** 或具备执行这些 RPC 的权限。

## API 路由

| 路径 | 用途 |
|------|------|
| `POST /api/lucky-wheel-status` | 当前窗口、是否已抽、兑奖状态等 |
| `POST /api/lucky-wheel-spin` | 抽奖 |
| `POST /api/lucky-wheel-redeem` | 提交兑奖 |
| `POST /api/lucky-wheel-dev-reset` | 开发清当日数据（需 dev 模式） |
| `POST /api/lucky-wheel-cron` | 日切等（可接 Vercel Cron） |
| `POST /api/turnstile-verify` | 校验 Turnstile token |

## 目录结构（摘录）

```
app/                    # 三语页面 + API routes
components/
  LuckyWheelPage.tsx    # 主页面（客户端）
  lucky-wheel/          # SlotCard、RedeemPopup 等
lib/                    # 类型、i18n、API 客户端、Redis、Supabase 等
server-api/             # 供 Route Handler 调用的 Node 处理函数
public/images/          # FAQ 示意图（可替换为你的品牌素材）
supabase/sql/           # 完整 SQL
```

## 与主站集成时注意

- 底部导航与 CTA 使用 **`getHomePathForLocale` / `getRegisterPathForLocale`**（`lib/site-locale.ts`），默认指向 `/`、`/register` 等；接入主站时请改成你的真实路径或域名。
- 「查推荐人」弹层内嵌了示例 H5 登录页，开源仓库中仅作演示，**请替换为你的合规链接**。
- 转盘扇区文案与奖励 ID 在 **`lib/lucky-wheel-types.ts`**（`FIXED_WHEEL_REWARD_IDS`）等处，需与数据库奖池配置一致。

## 许可

代码自 wblogin 抽取后单独发布时，请在本目录添加你选择的开源许可证（如 MIT），并注意第三方依赖（`@mertercelik/react-prize-wheel` 等）的许可证要求。

## 依赖说明

`@mertercelik/react-prize-wheel` 声明的 React peer 为 18；本项目使用 React 19 时通过 **`.npmrc` 中 `legacy-peer-deps=true`** 安装（与多数 Next 15 项目一致）。若你希望严格 peer，可改用 React 18 锁定版本。
