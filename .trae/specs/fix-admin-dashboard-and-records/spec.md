# 修复管理后台运行概览空白与新增解析按钮失效 - 产品需求文档

## Overview
- **Summary**: 修复 KLDNS 管理后台两个 P1 级问题：(1) /admin 运行概览页面空白，无任何数据展示；(2) /admin/records 页面"新增解析"按钮无响应。
- **Purpose**: 让管理员能正常使用后台查看统计指标、注册域名、解析记录和操作日志，并能正常创建/编辑/删除解析记录。
- **Target Users**: KLDNS 平台超级管理员（group_id = 99）。

## Goals
- 修复 /admin 运行概览页面：四个指标卡片（主域/用户/子域/解析记录）正确显示数字
- 修复"最新注册域名"和"操作日志"两个面板：显示数据
- 修复"新增解析"按钮：点击后弹出对话框，可成功保存
- 修复"编辑解析"和"删除解析"功能

## Non-Goals (Out of Scope)
- 不修改其他管理后台页面（用户管理、域名管理、设置等）
- 不修改用户侧功能
- 不重构现有代码架构
- 不修改数据库 schema（已对齐 subdomains 表结构）

## Background & Context
- KLDNS 已从 Go 迁移到 Cloudflare Workers (Hono + D1)
- 之前的 fix-admin-500-errors spec 已修复了主域管理页面的多个 500 错误
- 当前运行概览页面和解析管理页面的后端接口仍存在以下问题：
  1. `AdminDashboard.vue` 的 `onMounted` 中 `Promise.all` 失败时无 catch 错误处理，导致任何一个 API 失败整个页面都空白
  2. 解析管理页面后端缺少 `createRecord` / `updateRecord` / `deleteRecord` controller 方法
  3. `router.ts` 中 POST/PUT/DELETE `/api/admin/records` 路由被错误地绑定到 `getRecords` 方法
  4. `AdminRepository` 缺少对应的数据库操作方法

## Functional Requirements
- **FR-1**: AdminDashboard 页面在 API 失败时显示空状态或占位数据，不应整页空白
- **FR-2**: AdminDashboard 页面在 API 成功时正确展示四个统计数字和两个面板
- **FR-3**: AdminRecordList 页面"新增解析"按钮点击后弹出对话框，对话框能保存并显示在列表中
- **FR-4**: AdminRecordList 页面"编辑"按钮能弹出编辑对话框，保存后更新列表
- **FR-5**: AdminRecordList 页面"删除"按钮能弹出确认对话框，确认后删除记录
- **FR-6**: 后端 `POST /api/admin/records` 接收 `{uid, did, name, type, value, line_id}` 并插入数据库
- **FR-7**: 后端 `PUT /api/admin/records/:id` 接收 `{name, type, value, line_id}` 并更新数据库
- **FR-8**: 后端 `DELETE /api/admin/records/:id` 删除指定记录

## Non-Functional Requirements
- **NFR-1**: 错误信息使用中文，便于管理员理解
- **NFR-2**: 部署后所有 API 在 Bearer token 鉴权下正常工作
- **NFR-3**: 修复后所有 500 错误应被消除或转换为带可读消息的 5xx

## Constraints
- **Technical**: Cloudflare Workers (Hono v4) + D1 (SQLite) + Vue 3 + Element Plus + Axios
- **Business**: 不能破坏现有数据（已同步的 DNS 记录、用户、子域等）
- **Dependencies**: 依赖 `subdomains` 表已有字段（不含 `reject_reason/reviewed_by/reviewed_at`）

## Assumptions
- `records` 表包含必需字段：`id, uid, did, subdomain_id, record_id, name, type, value, line_id, line, created_at, updated_at`
- 管理员通过 `Authorization: Bearer <token>` 访问接口
- 前端 `RecordItem` 类型与后端返回字段一致

## Acceptance Criteria

### AC-1: 运行概览页面正确显示
- **Given**: 管理员已登录并访问 /admin
- **When**: 页面加载完成
- **Then**: 四个指标卡片（主域/用户/子域/解析记录）显示正确数字；"最新注册域名"和"操作日志"两个面板有数据或显示"暂无"
- **Verification**: `programmatic`

### AC-2: API 失败不导致页面空白
- **Given**: 任意一个 Dashboard 调用的 API 返回 500
- **When**: 页面加载
- **Then**: 控制台输出错误日志，但页面其他部分仍正常渲染
- **Verification**: `human-judgment`

### AC-3: 新增解析按钮可点击
- **Given**: 管理员在 /admin/records 页面
- **When**: 点击"新增解析"按钮
- **Then**: 弹出新增解析对话框，可以填写表单并保存
- **Verification**: `programmatic`

### AC-4: 新增解析接口正常
- **Given**: 管理员填写完整的解析表单（用户、主域、主机记录、类型、解析值）
- **When**: 点击保存
- **Then**: 返回 201，记录插入数据库，列表刷新显示新记录
- **Verification**: `programmatic`

### AC-5: 编辑/删除解析功能正常
- **Given**: 列表中存在解析记录
- **When**: 点击编辑/删除
- **Then**: 弹出对应对话框，确认后数据库更新或删除
- **Verification**: `programmatic`

## Open Questions
- (已解决) 运行概览页面 subdomains 接口是否需要修复 count 字段？ — 不在本次范围
- (已解决) 是否需要实现 DNS 平台同步（同步到 Cloudflare/DNSPod）？ — 否，仅本地数据库操作
