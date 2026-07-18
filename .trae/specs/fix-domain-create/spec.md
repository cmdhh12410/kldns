# 修复域名创建失败（Failed to create domain）- 产品需求文档

## Overview
- **Summary**: 修复管理后台创建主域时返回 "Failed to create domain" 500 错误的问题，确保 DNS 配置正确加密保存、外键约束不报错、SECRET_KEY 正确配置。
- **Purpose**: 用户配置好 Cloudflare API Token 并获取到平台域名列表后，点击保存却失败，无法添加任何主域，导致整个系统无法使用。
- **Target Users**: KLDNS 系统管理员

## Goals
- 创建主域时正确保存 provider_config（加密后存储）
- 解决 dns_providers 外键约束问题（domains.provider_key 引用 dns_providers.key）
- 配置正确的 SECRET_KEY 环境变量
- 编辑主域时也能正确更新 provider_config
- 主域列表能正确显示 provider_config 是否已保存

## Non-Goals (Out of Scope)
- 不修改 DNS provider 的 API 调用逻辑
- 不改变前端 UI 布局
- 不新增 DNS provider 类型

## Background & Context
当前创建域名时 `createDomain` 方法只保存了 `provider_key` 和基础字段，但：
1. `domains` 表有外键约束 `provider_key REFERENCES dns_providers(key)`，而 `dns_providers` 表是空的
2. 前端传了 `provider_config`（API Token 等敏感信息），后端完全没处理
3. `provider_config` 需要用 `SECRET_KEY` 加密后存储到 `provider_config_ciphertext` 字段
4. 生产环境 `wrangler.toml` 没有配置 `SECRET_KEY` 变量

## Functional Requirements
- **FR-1**: 创建主域时，将 provider_config 加密后保存到 domains.provider_config_ciphertext
- **FR-2**: 确保 dns_providers 外键约束不阻碍域名创建（UPSERT 到 dns_providers 表或移除外键约束）
- **FR-3**: 编辑主域时，如有新的 provider_config 则更新加密后的值
- **FR-4**: 主域列表接口返回 provider_config_stored 字段供前端显示
- **FR-5**: wrangler.toml 中配置 SECRET_KEY 环境变量（或使用 secrets）

## Non-Functional Requirements
- **NFR-1**: 敏感配置（API Token 等）必须加密存储，不能明文
- **NFR-2**: 加密使用 AES-GCM，与现有 decrypt 逻辑兼容
- **NFR-3**: 创建/更新操作响应时间 < 2s

## Constraints
- **Technical**: Cloudflare Workers + D1 + TypeScript + Hono
- **Business**: 不能泄露用户的 DNS API Token
- **Dependencies**: 现有的 encrypt/decrypt 工具函数 (src/utils/secrets.ts)

## Assumptions
- SECRET_KEY 使用随机生成的字符串，长度足够
- 每个域名独立保存自己的 provider_config（因为不同域名可能用不同的 DNS 账号）
- dns_providers 表的设计用途是全局 provider 配置，但当前业务是每个域名独立配置

## Acceptance Criteria

### AC-1: 创建主域成功
- **Given**: 管理员已选择 DNS 平台、填写 API Token、获取并选择了平台域名、填写了主域策略
- **When**: 点击「保存」按钮
- **Then**: 域名创建成功，返回 201 和域名 ID；provider_config 已加密存入 domains.provider_config_ciphertext
- **Verification**: `programmatic`

### AC-2: 域名列表显示配置状态
- **Given**: 系统中有已创建的域名
- **When**: 管理员查看主域列表
- **Then**: 每条域名记录包含 provider_config_stored 字段（布尔值），前端可据此显示配置状态
- **Verification**: `programmatic`

### AC-3: 编辑主域可更新配置
- **Given**: 域名已存在且有保存的配置
- **When**: 管理员编辑域名，修改 API Token 并保存
- **Then**: provider_config_ciphertext 被更新为新加密的值；如果留空则保留原值
- **Verification**: `programmatic`

### AC-4: SECRET_KEY 正确配置
- **Given**: 生产环境部署
- **When**: Worker 启动
- **Then**: 不会因默认 SECRET_KEY 报错退出；SECRET_KEY 有合理的默认值
- **Verification**: `programmatic`

### AC-5: DNS 解析功能正常使用新保存的配置
- **Given**: 域名已创建且 provider_config 已保存
- **When**: 用户创建解析记录
- **Then**: 系统能正确解密 provider_config 并调用 DNS provider API
- **Verification**: `programmatic`
- **Notes**: 间接验证 - 确保加密格式与现有 decrypt 逻辑兼容

## Open Questions
- [ ] dns_providers 表是用于全局共享配置还是每个域名独立配置？（当前看每个域名独立，外键约束可能是设计遗留）
