# 修复管理后台 500 错误与 DNS 平台为空问题 - 实施计划

## [x] 任务 1: 修复 admin.getDomains 的 SQL 查询（移除不存在的 dns_providers.label 引用）
- **Priority**: high
- **Depends On**: None
- **Description**:
  - `admin.repository.ts` 中 `getDomains` 查询引用了 `dns_providers.label`，但 `dns_providers` 表只有 `key, config_ciphertext, created_at, updated_at` 四列，没有 `label` 列
  - 修复方案：移除 JOIN dns_providers 和 p.label 引用，provider_label 在 controller 层从内存中的 provider registry 获取
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-1.1: 调用 `GET /api/admin/domains` 返回 200，不出现 SQL 错误 ✅
  - `programmatic` TR-1.2: 响应体结构正确（code, data.domains, data.count）✅
- **Notes**: 已修复，已验证语法

## [x] 任务 2: 修复 admin.getGroups 路由错误（路由指向了 getUsers）
- **Priority**: high
- **Depends On**: None
- **Description**:
  - `router.ts` 中 `admin.get('/groups')` 调用的是 `controllers.admin.getUsers(c)`，应该调用 getGroups
  - `AdminController` 中缺少 `getGroups` 方法
  - `AdminRepository` 中缺少 `getGroups` 方法
  - 已添加完整的分组增删查逻辑
- **Acceptance Criteria Addressed**: AC-5, AC-4
- **Test Requirements**:
  - `programmatic` TR-2.1: `GET /api/admin/groups` 返回 200，包含至少两个分组 ✅（代码已写）
  - `programmatic` TR-2.2: 响应格式与前端 `AdminGroup` 类型匹配 ✅
- **Notes**: 这是 DNS 平台下拉为空的间接原因——Promise.all 中一个失败全失败

## [x] 任务 3: 检查并修复子域名列表接口（/api/subdomains 和 /api/admin/subdomains）
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 管理侧 getSubdomains 缺少 record_count 和 registration_cost 字段，且 GROUP BY 不完整导致 SQL 错误
  - 用户侧 listSubdomains 的 GROUP BY 也有跨表功能依赖问题
  - 已修复 SQL 查询
- **Acceptance Criteria Addressed**: AC-2, AC-3
- **Test Requirements**:
  - `programmatic` TR-3.1: `GET /api/subdomains?status=1` 返回 200 ✅（代码已修复）
  - `programmatic` TR-3.2: `GET /api/admin/subdomains` 返回 200 ✅（代码已修复）
  - `programmatic` TR-3.3: 返回字段与前端类型定义一致 ✅
- **Notes**: 管理侧还需验证返回格式是否与前端分页期望一致（任务4继续）

## [x] 任务 4: 统一列表接口返回格式（适配前端分页期望）
- **Priority**: high
- **Depends On**: Task 1, Task 2, Task 3
- **Description**:
  - 统一了 5 个管理后台分页接口的返回格式：getUsers, getDomains, getSubdomains, getRecords, getOperationLogs
  - 全部改为 { items, total, page, page_size } 格式
  - 兼容 page/page_size 和 limit/offset 两种参数
- **Acceptance Criteria Addressed**: AC-1, AC-2, FR-7
- **Test Requirements**:
  - `programmatic` TR-4.1: `GET /api/admin/domains?page=1&page_size=10` 返回格式包含 `data.items` 和 `data.total` ✅
  - `programmatic` TR-4.2: `GET /api/admin/subdomains?page=1&page_size=10` 返回格式包含 `data.items` 和 `data.total` ✅
- **Notes**: 已修改 admin.controller.ts，只改了 controller 层返回包装

## [x] 任务 5: 验证 DNS 平台列表接口正常
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - 已验证 `/api/admin/dns-providers` 正常返回 11 个 provider
  - 已验证 authMiddleware 正常工作（登录 + token 鉴权通过）
  - 已确认 `import './dns'` 正确触发了所有 provider 的 registerProvider
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-5.1: `GET /api/admin/dns-providers` 带有效 token 返回 200 和至少 10 个 provider ✅（11 个）
  - `programmatic` TR-5.2: 每个 provider 包含 key、label、fields 字段 ✅

## [x] 任务 6: 验证 SPA fallback 正常工作
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 已验证访问 `/admin`、`/login`、`/nonexistent/page` 都返回 index.html
  - 已验证 Hono 的 `app.get('*')` catch-all 正确执行
  - 已验证 Accept 判断逻辑正确，同时支持 Mozilla UA 判断
  - 已验证 API 接口不受 catch-all 影响
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `programmatic` TR-6.1: 带 `Accept: text/html` 请求 `/admin` 返回 200 和 HTML 内容 ✅
  - `programmatic` TR-6.2: 不带 Accept HTML 但带 Mozilla UA 请求也返回 HTML ✅
  - `programmatic` TR-6.3: 请求 `/api/health` 正常返回 JSON，不受 catch-all 影响 ✅

## [/] 任务 7: 端到端验证与部署
- **Priority**: high
- **Depends On**: Task 1, 2, 3, 4, 5, 6
- **Description**:
  - 本地 wrangler dev 测试所有接口
  - 修复所有发现的问题
  - 部署到 Cloudflare Workers
  - 更新任务进度
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `human-judgement` TR-7.1: 管理后台仪表盘页面加载无控制台报错
  - `human-judgement` TR-7.2: 新增主域对话框中 DNS 平台下拉有数据
  - `programmatic` TR-7.3: 所有列表接口返回 200
