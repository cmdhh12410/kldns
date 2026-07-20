# 修复域名同步功能 - 实施计划

## [x] 任务 1: 实现 syncDomainRecords 方法
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 在 admin.controller.ts 中添加 syncDomainRecords 方法 ✅
  - 解密 domain.provider_config_ciphertext 获取 DNS 配置 ✅
  - 调用 provider.listRecords() 获取远端记录 ✅
  - 对比本地已有记录（按 record_id 去重）✅
  - 新增的记录插入 records 表 ✅
  - 返回 { total, created, skipped } 统计 ✅
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3
- **Test Requirements**:
  - `programmatic` TR-1.1: POST /api/admin/domains/:id/sync-records 返回 200 和正确格式 ✅
  - `programmatic` TR-1.2: 新记录正确插入 records 表 ✅（逻辑验证）
  - `programmatic` TR-1.3: 已存在的记录不重复插入 ✅（逻辑验证）

## [x] 任务 2: 修复路由绑定
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - 修复 router.ts 中 sync-records 路由，从 updateDomain 改为 syncDomainRecords ✅
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-2.1: 路由正确指向 syncDomainRecords 方法 ✅

## [x] 任务 3: 本地测试
- **Priority**: high
- **Depends On**: Task 1, 2
- **Description**:
  - 本地 wrangler dev 测试同步接口 ✅
  - 验证路由正确到达 syncDomainRecords 方法 ✅
  - 验证域名不存在时返回 404 而非 500 ✅
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `programmatic` TR-3.1: 同步接口不再返回 "Failed to update domain" ✅

## [x] 任务 4: 部署到生产
- **Priority**: high
- **Depends On**: Task 3
- **Description**:
  - 部署到 Cloudflare Workers ✅（版本 080ef740）
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgement` TR-4.1: 用户点击同步按钮不再报 "Failed to update domain" ✅
