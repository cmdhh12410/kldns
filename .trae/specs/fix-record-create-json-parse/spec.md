# 修复解析记录创建 JSON 解析错误 - Spec

## Why
用户在用户中心 → 域名解析页面点击"新增记录"并保存时，页面顶部弹出红色错误提示：
`Unexpected non-whitespace character after JSON at position 6 (line 1 column 7)`。
该错误导致用户无法成功添加 DNS 解析记录。

## What Changes
- **修复** `record.service.ts` 中对 `domain.provider_config_ciphertext` 的错误使用：
  当前代码直接 `JSON.parse(domain.provider_config_ciphertext || '{}')`，但该字段是加密密文，不是 JSON 字符串。
- **改为** 从 `dns_providers` 表读取对应 `provider_key` 的 `config_ciphertext`，解密后再 `JSON.parse`。
- **保持** 现有 provider 配置流程不变；若解密失败或配置缺失，给出清晰的中文错误提示。

## Impact
- 受影响能力：用户创建/更新/删除 DNS 解析记录。
- 受影响代码：
  - `src/services/record.service.ts`（`submitRecord` / `updateRecord` / `deleteRecord`）
  - 可能需要在 `src/repositories/record.repository.ts` 中新增查询 provider 配置的方法。

## ADDED Requirements
### Requirement: 正确的 Provider 配置读取
The system SHALL 在创建/更新/删除 DNS 记录时，使用对应 DNS 服务商的正确配置（从 `dns_providers` 表读取并解密），而不是直接使用 `domains` 表中的 `provider_config_ciphertext`。

#### Scenario: 成功创建解析记录
- **WHEN** 用户在域名解析页面填写完整的主机记录、记录类型、记录值并点击保存
- **THEN** 系统成功解密 provider 配置，调用对应 DNS 服务商 API 创建记录，并在本地数据库保存记录

## MODIFIED Requirements
### Requirement: 解析记录 CRUD 的 Provider 配置来源
**原行为**：`record.service.ts` 各方法直接 `JSON.parse(domain.provider_config_ciphertext || '{}')` 并调用 `provider.configure(...)`。
**新行为**：各方法先通过 `provider_key` 从 `dns_providers` 表读取并解密 provider 配置，再调用 `provider.configure(...)`。

## REMOVED Requirements
无。
