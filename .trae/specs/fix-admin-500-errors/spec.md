# 修复管理后台 500 错误与 DNS 平台为空问题 - PRD

## Overview
- **Summary**: 修复 KLDNS 管理后台部署后多个 API 接口返回 500 错误、DNS 平台下拉列表为空、以及页面刷新显示 Not Found 的问题，使管理后台所有核心功能（域名管理、子域名管理、DNS 平台选择、用户分组）正常可用。
- **Purpose**: 解决部署到 Cloudflare Workers 后管理后台无法正常使用的阻断性问题，让管理员可以正常添加主域、配置 DNS 平台、管理用户。
- **Target Users**: 系统管理员（使用 `/admin` 后台的用户）

## Goals
- 修复 `/api/admin/domains` 接口 500 错误
- 修复 `/api/admin/subdomains` 接口 500 错误
- 修复 `/api/subdomains` 接口 500 错误
- 修复 DNS 平台下拉列表为空的问题
- 修复管理后台页面刷新显示 Not Found 的问题
- 修复 `/api/admin/groups` 接口返回错误数据的问题
- 确保后端返回数据结构与前端期望一致

## Non-Goals (Out of Scope)
- 不新增功能模块
- 不重构现有数据库表结构
- 不修改前端 UI 样式
- 不涉及用户注册/登录流程的改动（已修复）

## Background & Context
- 项目部署在 Cloudflare Workers + D1 + KV 上
- 使用 Hono 框架 + TypeScript
- 前端使用 Vue 3 + Element Plus + Vite
- 已知上一轮修复了 `authMiddleware` 中 `hashBearerToken` 缺少 `await` 的问题
- 已知上一轮添加了 SPA fallback 和自动 migrations
- 当前所有管理后台列表类接口均返回 500，导致页面不可用

## Functional Requirements
- **FR-1**: 管理后台主域列表接口 `/api/admin/domains` 正常返回 200 和正确格式的数据
- **FR-2**: 管理后台子域名列表接口 `/api/admin/subdomains` 正常返回 200 和正确格式的数据
- **FR-3**: 用户侧子域名列表接口 `/api/subdomains` 正常返回 200
- **FR-4**: DNS 平台列表接口 `/api/admin/dns-providers` 正常返回已注册的 provider 列表（10+ 个平台）
- **FR-5**: 管理后台分组列表接口 `/api/admin/groups` 正常返回分组数据
- **FR-6**: 刷新 `/admin` 及其子路由时返回 index.html（SPA fallback），不显示 Not Found
- **FR-7**: 所有列表分页接口返回格式需与前端期望一致（`{ items, total }` 或 `{ domains, count }` 等）

## Non-Functional Requirements
- **NFR-1**: 所有 API 响应时间应小于 500ms（D1 查询）
- **NFR-2**: 错误时返回明确的错误信息，便于调试

## Constraints
- **技术栈**: TypeScript, Hono, Cloudflare Workers, D1, KV
- **数据库**: 不能破坏现有 D1 表结构，只能修复查询逻辑
- **兼容性**: 前端代码已存在且不做大改，后端需适配前端期望的数据格式

## Assumptions
- 数据库表结构（migrations）是正确的，问题出在查询逻辑或响应格式
- 前端期望的数据格式以 `web/src/api/admin.ts` 和 `web/src/api/*.ts` 中的类型定义为准
- DNS provider 注册逻辑（`registerProvider`）本身是正确的，问题在路由或响应格式

## Acceptance Criteria

### AC-1: 主域列表接口正常
- **Given**: 管理员已登录并持有有效 token
- **When**: 调用 `GET /api/admin/domains?page=1&page_size=10`
- **Then**: 返回 200，响应格式为 `{ code: "OK", data: { items: [...], total: number } }`，每个 domain 对象包含 `id, domain, provider_key, provider_label, points_cost` 等字段
- **Verification**: `programmatic`

### AC-2: 子域名列表接口正常
- **Given**: 管理员已登录并持有有效 token
- **When**: 调用 `GET /api/admin/subdomains?page=1&page_size=10`
- **Then**: 返回 200，响应格式与前端 `AdminSubdomain` 类型匹配
- **Verification**: `programmatic`

### AC-3: 用户侧子域名列表正常
- **Given**: 普通用户已登录
- **When**: 调用 `GET /api/subdomains?status=1`
- **Then**: 返回 200，响应格式为 `{ code: "OK", data: [...] }`
- **Verification**: `programmatic`

### AC-4: DNS 平台下拉有数据
- **Given**: 管理员已登录并打开新增主域对话框
- **When**: 点击 DNS 平台下拉框
- **Then**: 显示至少 10 个 DNS 平台选项（Cloudflare、DNSPod、阿里云等）
- **Verification**: `programmatic`

### AC-5: 分组列表接口正常
- **Given**: 管理员已登录
- **When**: 调用 `GET /api/admin/groups`
- **Then**: 返回 200，包含至少「管理组」和「默认组」
- **Verification**: `programmatic`

### AC-6: SPA 路由刷新正常
- **Given**: 无
- **When**: 直接访问 `/admin`、`/admin/domains`、`/login` 等前端路由
- **Then**: 返回 200 和 index.html 内容，页面正常渲染
- **Verification**: `programmatic`

### AC-7: 仪表盘页面正常加载
- **Given**: 管理员已登录并进入 `/admin`
- **When**: 仪表盘加载完成
- **Then**: 所有 API 请求均返回 200，页面无报错
- **Verification**: `human-judgment`

## Open Questions
- 无
