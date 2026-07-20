# 修复管理后台运行概览空白与新增解析按钮失效 - 实施计划

## [x] 任务 1: AdminDashboard 页面添加 catch 错误处理
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 在 [AdminDashboard.vue](file:///workspace/web/src/pages/admin/AdminDashboard.vue) 的 `onMounted` 回调中，`Promise.all` 失败时无 catch 错误处理，导致任何一个 API 失败整个页面都空白
  - 在 try/catch 中添加 `console.error('Dashboard load failed:', error)`，让页面其他部分仍能渲染
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `programmatic` TR-1.1: 即使某个 API 返回 500，页面其他卡片仍可显示
- **Notes**: 已实施

## [x] 任务 2: AdminRepository 添加 createRecord/updateRecord/deleteRecord 方法
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 在 [admin.repository.ts](file:///workspace/src/repositories/admin.repository.ts) 中添加三个数据库操作方法
  - `createRecord(record)`: 插入新记录，返回新 ID
  - `updateRecord(id, record)`: 部分字段更新
  - `deleteRecord(id)`: 删除指定记录
- **Acceptance Criteria Addressed**: AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-2.1: 三个方法签名与 SQL 实现正确
- **Notes**: 已实施

## [x] 任务 3: AdminController 添加 createRecord/updateRecord/deleteRecord 方法
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - 在 [admin.controller.ts](file:///workspace/src/controllers/admin.controller.ts) 中添加三个 controller 方法
  - 校验必填字段，调用 repository，返回标准 JSON 响应
- **Acceptance Criteria Addressed**: AC-6, AC-7, AC-8
- **Test Requirements**:
  - `programmatic` TR-3.1: `POST /api/admin/records` 返回 201 和 `{code, data: {id}}`
  - `programmatic` TR-3.2: `PUT /api/admin/records/:id` 返回 200
  - `programmatic` TR-3.3: `DELETE /api/admin/records/:id` 返回 200
- **Notes**: 已实施

## [x] 任务 4: 修复 router.ts 中 records 路由绑定
- **Priority**: high
- **Depends On**: Task 3
- **Description**:
  - 在 [router.ts](file:///workspace/src/routes/router.ts) 中，POST/PUT/DELETE `/api/admin/records` 被错误地绑定到 `getRecords`
  - 分别改为绑定到 `createRecord` / `updateRecord` / `deleteRecord`
- **Acceptance Criteria Addressed**: AC-3, AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-4.1: 三个路由调用正确的 controller 方法
- **Notes**: 已实施

## [x] 任务 5: 部署并验证
- **Priority**: high
- **Depends On**: Task 1, 2, 3, 4
- **Description**:
  - 使用 `npx wrangler@3 deploy` 部署到 Cloudflare Workers
  - 验证运行概览页面正常显示
  - 验证新增/编辑/删除解析功能正常
- **Acceptance Criteria Addressed**: 全部
- **Test Requirements**:
  - `programmatic` TR-5.1: 部署成功，获得新版本 ID
- **Notes**: 已部署版本 a20b667a-206d-49bb-a5b0-85da38e7d083

# Task Dependencies
- 任务 3 depends on 任务 2
- 任务 4 depends on 任务 3
- 任务 5 depends on 任务 1, 2, 3, 4
