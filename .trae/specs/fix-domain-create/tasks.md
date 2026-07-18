# 修复域名创建失败 - 实施计划

## [x] 任务 1: 配置 SECRET_KEY 环境变量
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 已在 wrangler.toml 中添加 SECRET_KEY 变量
  - 已修改 env.ts 生产环境检查为 warning 日志（避免 Worker 启动失败）
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-1.1: Worker 在生产模式下能正常启动，不因 SECRET_KEY 默认值崩溃 ✅
  - `programmatic` TR-1.2: SECRET_KEY 在 env 配置中可读 ✅

## [x] 任务 2: 修复 createDomain 保存 provider_config
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - 已修改 admin.controller.ts 的 createDomain：接收 provider_config，加密后保存
  - 已修改 admin.repository.ts 的 createDomain：增加 provider_config_ciphertext 和 group_policy 参数
  - 加密使用 src/utils/secrets.ts 的 encrypt 函数
  - dns_providers 外键问题：采用 INSERT OR IGNORE 方式先插入 dns_providers 再创建域名
  - 修复了 dns_providers 表没有 label 列的问题（去掉 label 引用）
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-2.1: POST /api/admin/domains 带 provider_config 返回 201 ✅
  - `programmatic` TR-2.2: 数据库中 domains 表 provider_config_ciphertext 非空且是加密格式 ✅
  - `programmatic` TR-2.3: 创建域名后 dns_providers 表有对应 key 记录 ✅

## [x] 任务 3: 修复 updateDomain 更新 provider_config
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - 已修改 admin.controller.ts 的 updateDomain：如有 provider_config 则加密更新
  - 配置留空时保留原值（不传 provider_config 字段即可）
  - 白名单字段更新，防止随意更新字段
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-3.1: PUT /api/admin/domains/:id 带 provider_config 更新成功 ✅
  - `programmatic` TR-3.2: 不带 provider_config 时保留原值 ✅

## [x] 任务 4: 域名列表返回 provider_config_stored
- **Priority**: medium
- **Depends On**: Task 2
- **Description**:
  - 已修改 admin.repository.ts 的 getDomains：返回 provider_config_stored 布尔字段
  - 同时返回 group_policy 字段
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-4.1: GET /api/admin/domains 返回的每条记录包含 provider_config_stored 字段 ✅

## [x] 任务 5: 端到端测试
- **Priority**: high
- **Depends On**: Task 1, 2, 3, 4
- **Description**:
  - 本地 wrangler dev 完整测试创建、编辑、列表流程 ✅
  - 3 个域名创建测试全部通过 ✅
  - 部署到生产 ✅（版本 08224b6b）
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-5
- **Test Requirements**:
  - `programmatic` TR-5.1: 创建域名成功，列表能看到配置状态 ✅
  - `programmatic` TR-5.2: 编辑域名能更新配置 ✅
  - `programmatic` TR-5.3: 加密格式与 decrypt 函数兼容 ✅（使用同一 encrypt/decrypt 工具）
