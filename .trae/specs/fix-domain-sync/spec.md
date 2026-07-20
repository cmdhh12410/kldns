# 修复域名同步功能（Failed to update domain）- 产品需求文档

## Overview
- **Summary**: 修复管理后台主域列表中「同步」按钮点击后报 "Failed to update domain" 错误的问题，实现正确的 DNS 记录同步功能。
- **Purpose**: 管理员需要从 DNS 服务商拉取已有的解析记录同步到本地数据库，但当前路由绑定错误且没有实现同步方法，导致功能完全不可用。
- **Target Users**: KLDNS 系统管理员

## Goals
- 修复 sync-records 路由，调用正确的同步方法
- 实现从 DNS 服务商拉取解析记录并同步到本地数据库的功能
- 返回同步统计（总数、新增数、跳过数）给前端展示

## Non-Goals (Out of Scope)
- 不修改 DNS provider 的 API 调用逻辑
- 不改变前端 UI
- 不实现反向同步（本地 → 远端）

## Background & Context
当前问题：
1. `POST /admin/domains/:id/sync-records` 路由错误地调用了 `updateDomain` 方法
2. `AdminController` 中根本没有 `syncDomainRecords` 方法
3. 前端期望返回 `{ total, created, skipped }` 格式

## Functional Requirements
- **FR-1**: 同步接口能正确调用 DNS provider API 获取远端记录
- **FR-2**: 同步时跳过本地已存在的记录（按 record_id 匹配）
- **FR-3**: 新增的记录保存到 records 表，并关联到对应的子域名（或创建占位子域名）
- **FR-4**: 返回同步统计：total（远端总数）、created（本地新增数）、skipped（已存在跳过数）

## Non-Functional Requirements
- **NFR-1**: 同步操作响应时间 < 10s（受 DNS 服务商 API 影响）
- **NFR-2**: 不重复创建已存在的记录

## Constraints
- **Technical**: Cloudflare Workers + D1 + TypeScript + Hono
- **Dependencies**: 已有的 Provider.listRecords() 方法、RecordRepository

## Assumptions
- 同步是单向的：远端 → 本地
- record_id 是唯一匹配键
- 没有对应 subdomain 的记录可以先归到一个默认/系统子域下，或者直接存入 records 表并尝试匹配已有子域

## Acceptance Criteria

### AC-1: 同步接口不再报错
- **Given**: 管理员已登录且有已配置好 DNS 的主域
- **When**: 点击「同步」按钮
- **Then**: 接口返回 200 和同步统计数据，不再显示 "Failed to update domain"
- **Verification**: `programmatic`

### AC-2: 返回正确的统计格式
- **Given**: 同步完成
- **When**: 前端收到响应
- **Then**: data 包含 total、created、skipped 三个数字字段
- **Verification**: `programmatic`

### AC-3: 记录正确保存到数据库
- **Given**: 远端有新的解析记录
- **When**: 执行同步
- **Then**: 新记录被插入到 records 表，已存在的记录不重复
- **Verification**: `programmatic`

## Open Questions
- [ ] 同步过来的记录如果没有对应的 subdomain 怎么处理？（直接存 records 表，uid 设为 0 或系统用户？）
