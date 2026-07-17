# KLDNS 迁移至 Cloudflare Workers 无服务器架构 Spec

## Why
KLDNS 当前基于 Go + Gin + SQLite3 架构，需要服务器部署。用户希望迁移到 Cloudflare Workers + D1 + KV 的无服务器架构，实现零服务器运维成本。

## What Changes
- **BREAKING**: 后端从 Go + Gin 迁移到 Cloudflare Workers (TypeScript/JavaScript)
- **BREAKING**: 数据库从 SQLite3 文件迁移到 Cloudflare D1 (SQLite 兼容)
- **BREAKING**: 配置从 config.yaml 文件迁移到 Workers 环境变量 + KV 存储
- **BREAKING**: 前端静态资源从 Go embed 迁移到 Workers 静态资源或独立部署
- **BREAKING**: DNS 提供商集成从 Go HTTP 客户端迁移到 Workers fetch API
- 保留所有业务逻辑、数据模型和 API 接口不变
- 保留前端 Vue 3 应用代码不变，仅调整构建和部署方式

## Impact
- Affected specs: 整个后端架构、数据库访问层、配置管理、认证系统、DNS 提供商集成
- Affected code: 
  - 后端: main.go, config/, controllers/, middleware/, models/, repositories/, routes/, services/, pkg/
  - 前端: web/ (构建配置调整)
  - 部署: 新增 wrangler.toml, package.json (Workers 项目)

## ADDED Requirements
### Requirement: Cloudflare Workers 运行时
系统 SHALL 在 Cloudflare Workers 运行时环境中运行，使用 Hono 或类似轻量级框架处理 HTTP 请求。

#### Scenario: Workers 入口点
- **WHEN** HTTP 请求到达 Workers
- **THEN** 路由到对应的控制器处理函数

#### Scenario: D1 数据库访问
- **WHEN** 需要数据库操作
- **THEN** 通过 D1 API 执行 SQL 查询，保持与原 SQLite 查询逻辑一致

#### Scenario: KV 存储使用
- **WHEN** 需要存储配置、缓存或会话数据
- **THEN** 通过 Workers KV API 读写键值对

### Requirement: 环境变量配置
系统 SHALL 通过 Workers 环境变量获取敏感配置（如 SECRET_KEY、DNS 提供商密钥），非敏感配置存储在 KV 中。

#### Scenario: 配置加载
- **WHEN** Workers 启动
- **THEN** 从环境变量读取 SECRET_KEY 等敏感信息，从 KV 读取应用配置

### Requirement: 前端资源部署
系统 SHALL 将前端构建产物部署到 Workers 静态资源或 Cloudflare Pages。

#### Scenario: 静态资源服务
- **WHEN** 请求前端资源
- **THEN** 从 Workers 静态资源或 Pages 返回文件

## MODIFIED Requirements
### Requirement: 数据库访问层
原 `repositories/database.go` 使用 GORM + SQLite3，现改为直接使用 D1 API 执行 SQL。

**完整修改后需求**:
- 所有 SQL 查询保持与原 SQLite 兼容
- 使用 D1 的 `db.prepare().bind().run()` 等方法
- 事务使用 D1 的 batch API
- 迁移脚本在 Workers 启动时自动执行

### Requirement: HTTP 路由
原 `routes/router.go` 使用 Gin，现改为 Hono 或类似 Workers 框架。

**完整修改后需求**:
- 保持所有 API 路由路径不变
- 使用 Hono 的路由语法
- 中间件改为 Hono middleware
- 控制器改为 Hono handler

### Requirement: DNS 提供商集成
原 `pkg/dns/providers/*.go` 使用 Go HTTP 客户端，现改为 Workers fetch API。

**完整修改后需求**:
- 使用 Workers 原生 fetch API
- 保持 Provider 接口定义不变
- 各提供商实现改为 TypeScript 类
- 支持 Cloudflare、DNSPod、阿里云等所有原支持的提供商

### Requirement: 认证系统
原 `pkg/auth/` 使用 Go 实现，现改为 TypeScript 实现。

**完整修改后需求**:
- 密码哈希使用 Web Crypto API
- JWT 令牌生成和验证使用 Workers 原生实现
- 会话管理使用 D1 数据库

## REMOVED Requirements
### Requirement: Go 运行时依赖
**Reason**: 迁移到 Workers 无服务器架构
**Migration**: 所有 Go 代码重写为 TypeScript

### Requirement: SQLite 文件数据库
**Reason**: 迁移到 Cloudflare D1
**Migration**: 使用 D1 迁移脚本创建表结构

### Requirement: config.yaml 配置文件
**Reason**: Workers 使用环境变量和 KV
**Migration**: 敏感配置迁移到环境变量，应用配置迁移到 KV
