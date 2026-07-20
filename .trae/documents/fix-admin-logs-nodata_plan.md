# 修复日志审计页面 No Data 问题

## 问题诊断

日志审计页面 `/admin/logs` 访问时表格显示 "No Data"，可能原因经代码审查发现以下 bug：

### Bug 1（核心）：getOperationLogs SQL 字段别名错误且缺少 source 字段
**影响文件**：[src/repositories/admin.repository.ts](file:///workspace/src/repositories/admin.repository.ts#L322-L333)

当前 SQL：
```sql
SELECT l.id, l.uid, l.admin_uid, l.action, l.target_type, l.target_id, l.message, l.created_at,
       u.username as user_name, a.username as admin_name
FROM operation_logs l ...
```

问题：
- 缺少 `l.source` 字段（前端 LogItem 需要 source）
- 别名 `user_name` 应为 `username`（匹配前端 `LogItem.username`）
- 别名 `admin_name` 应为 `admin_username`（匹配前端 `LogItem.admin_username`）

虽然别名错误不会直接导致 SQL 失败或 "No Data"（数据会返回但用户名字段为 undefined），但前端 `operatorName()` 使用这些字段时显示异常。

### Bug 2：getOperationLogs 不支持过滤参数
**影响文件**：[src/controllers/admin.controller.ts](file:///workspace/src/controllers/admin.controller.ts#L538-L563)、[src/repositories/admin.repository.ts](file:///workspace/src/repositories/admin.repository.ts#L322-L340)

前端发送 `source/action/keyword` 查询参数，但后端 controller 不读取这些参数，repo 层也没有 WHERE 条件实现。这导致筛选功能失效，但不会导致 "No Data"。

### Bug 3（导致 No Data 的关键）：getOperationLogs 的 catch 不输出错误详情，前端 load() 无 catch
- **后端** catch 块返回 `message: 'Failed to get operation logs'` 但**不包含 error.message**，无法诊断 SQL 错误
- **前端** [AdminLogList.vue:70-79](file:///workspace/web/src/pages/admin/AdminLogList.vue#L70-L79) `load()` 函数有 try/finally 但没有 catch，API 返回 500 时错误被吞掉，logs 保持空数组 → 用户只看到 "No Data"，不知道请求失败了

如果后端 SQL 有任何错误（比如字段名错误），前端无法知道具体错误。

### Bug 4：后台管理 CRUD 操作不记录操作日志
之前添加的 `createRecord/updateRecord/deleteRecord`（管理员操作）没有写入 operation_logs。

### 潜在 SQL 错误风险
由于之前对 records 表的查询曾因字段不匹配出过问题，getOperationLogs 也需要检查字段是否与 operation_logs 表结构完全匹配。已确认表结构（id, uid, admin_uid, source, target_type, target_id, ip, action, message, extra, created_at, updated_at），SQL 中漏了 `source` 字段。

---

## 修改方案

### 1. 修复后端 Repository：[admin.repository.ts](file:///workspace/src/repositories/admin.repository.ts)
- 修复 `getOperationLogs` SQL：
  - 添加 `l.source` 字段
  - 修正别名：`u.username as username`，`a.username as admin_username`
  - 增加过滤支持（source、action、keyword 三个可选条件，keyword 对 message 和 target_id 做 LIKE 模糊匹配）
- 修改 `getOperationLogs` 方法签名，接收 filter 参数
- 新增/修改 `getOperationLogsCount` 方法，同样支持过滤参数

### 2. 修复后端 Controller：[admin.controller.ts](file:///workspace/src/controllers/admin.controller.ts)
- 修改 `getOperationLogs` 方法：读取 `source/action/keyword` 查询参数，传递给 repo
- catch 块中添加错误详情：`message: 'Failed to get operation logs: ' + error.message`
- 在 `createRecord/updateRecord/deleteRecord` 方法中添加操作日志写入（获取 admin 用户信息后插入 operation_logs）

### 3. 修复前端日志列表页：[AdminLogList.vue](file:///workspace/web/src/pages/admin/AdminLogList.vue)
- 在 `load()` 函数中添加 catch 块，使用 ElMessage 显示错误信息
- 添加 Array.isArray 防御性检查

### 4. 构建并部署
- 执行 `npm run build:frontend` 构建前端
- 执行 `npx wrangler@3 deploy`（使用之前有效的 token）部署到 Cloudflare Workers
- 验证日志页面正确显示数据

---

## 需要修改的文件清单
1. `src/repositories/admin.repository.ts` - 修复 SQL 和添加过滤
2. `src/controllers/admin.controller.ts` - 传递过滤参数、增加错误详情、添加操作日志
3. `web/src/pages/admin/AdminLogList.vue` - 添加 catch 错误处理

---

## 风险与注意事项
- SQL LIKE 查询需要防止注入，使用参数化查询（`?` 占位符）
- keyword 为空时不应添加 LIKE 条件
- 管理员操作日志应记录 admin_uid 和 source='admin'
- 前端错误处理使用 apiErrorMessage 工具函数保持一致的错误提示风格
