# KLDNS

KLDNS 是一个二级域名分发和 DNS 解析管理系统，支持用户注册二级域名、积分扣费、域名审核、解析记录管理和后台运维管理。

当前版本：`1.0.5`

## 技术栈

- 后端：Go、Gin、GORM、SQLite3
- 前端：Vite、Vue 3、TypeScript、Element Plus
- DNS 平台：Cloudflare、DNSPod、阿里云、DNS.com、DNSLA、DnsDun、西部数码、华为云、百度云、Route53、Google Cloud DNS

## 目录

```text
main.go                  # 程序入口
config.yaml              # 运行配置
controllers/             # HTTP 控制器
middleware/              # 中间件
models/                  # 数据模型
repositories/            # 数据访问
routes/                  # 路由注册
services/                # 业务逻辑
pkg/dns/                 # DNS 平台适配器
migrations/              # SQLite 迁移
web/                     # 前端工程
```

## 配置

默认读取根目录 `config.yaml`，也可以通过 `KLDNS_CONFIG` 指定配置文件。

```yaml
app:
  name: kldns
  port: 8004
  mode: dev

database:
  path: data/kldns.db
  busy_timeout_ms: 5000
  wal: true

security:
  secret_key: change-me-before-production-kldns-secret
```

生产环境必须修改 `security.secret_key`。不要提交数据库文件、私钥、Token 或 DNS 平台密钥。

## 开发

后端：

```powershell
go test ./...
go run .
```

前端：

```powershell
cd web
npm run typecheck
npm run lint
npm run build
npm run dev
```

前端开发服务器会代理到 `127.0.0.1:8004`。

## 打包

```powershell
cd web
npm run build
cd ..
go build -o kldns.exe .
```

二进制会内嵌迁移文件和前端构建产物。`config.yaml` 和 `data/kldns.db` 仍为外部运行文件。

## 数据库迁移

程序启动时会自动执行内嵌的 `migrations/` 迁移，并记录到 `schema_migrations`。修改表结构时必须新增迁移文件。

## Cloudflare Workers 部署

本项目支持部署到 Cloudflare Workers，使用 Hono 框架运行，数据存储在 Cloudflare D1（SQLite 兼容）和 KV 中。

### 前置要求

- [Cloudflare 账号](https://dash.cloudflare.com/sign-up)
- [Node.js](https://nodejs.org/) >= 18
- Wrangler CLI（Cloudflare Workers 官方命令行工具）

```bash
npm install -g wrangler
wrangler login
```

### 环境变量配置

复制 `.env.example` 为 `.dev.vars`（本地开发）或直接配置到 Cloudflare：

```bash
cp .env.example .dev.vars
```

需要配置的关键环境变量：

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `SECRET_KEY` | JWT 签名密钥，生产环境必须修改为随机字符串 | 是 |
| `APP_NAME` | 应用名称，默认 `kldns` | 否 |
| `APP_MODE` | 运行模式：`dev` 或 `production` | 否 |
| `D1_DATABASE_ID` | D1 数据库 ID | 是 |
| `KV_NAMESPACE_ID` | KV 命名空间 ID | 是 |

生产环境通过 `wrangler secret put` 设置敏感变量：

```bash
wrangler secret put SECRET_KEY
```

### D1 数据库创建和迁移

1. 创建 D1 数据库：

```bash
wrangler d1 create kldns-db
```

创建后会输出数据库 ID，将其填入 `wrangler.toml` 的 `database_id` 字段。

2. 执行数据库迁移（初始化表结构）：

```bash
# 远程（生产）
wrangler d1 execute kldns-db --remote --file=./migrations/0001_initial_schema.sql

# 本地开发
wrangler d1 execute kldns-db --local --file=./migrations/0001_initial_schema.sql
```

### KV 命名空间创建

```bash
wrangler kv:namespace create kldns-kv
```

创建后会输出命名空间 ID，将其填入 `wrangler.toml` 的 `kv_namespaces` 的 `id` 字段。

### 部署

可以使用自动化部署脚本：

```bash
chmod +x deploy.sh
./deploy.sh
```

或手动执行部署流程：

```bash
# 1. 安装依赖
npm install
cd web && npm install && cd ..

# 2. 构建前端
npm run build:frontend

# 3. 部署到 Cloudflare Workers
wrangler deploy
```

### 访问地址

部署成功后，应用可通过以下地址访问：

```
https://kldns-workers.<your-subdomain>.workers.dev
```

首次访问需要初始化管理员账号，之后可在管理后台配置 DNS 提供商。
