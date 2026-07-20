# 修复管理后台运行概览空白 + 新增解析按钮失效 + Authentication Error

## 问题诊断总结

经过代码审查，发现以下根本原因：

### 问题1（最核心）：非分页 API 返回格式与前端期望不匹配
**影响文件**：[web/src/api/admin.ts](file:///workspace/web/src/api/admin.ts)

后端所有 list 接口（getUsers/getDomains/getSubdomains/getRecords/getOperationLogs）**始终**返回分页格式：
```json
{ "code": "OK", "data": { "items": [...], "total": N, "page": 1, "page_size": 100 } }
```

但前端5个非分页 API 函数期望 `data` 是纯数组：
- `listAdminUsers()` 类型声明为 `ApiEnvelope<AdminUser[]>`，实际取 `.data` 得到的是 `{items, total,...}` 对象
- `listAdminDomains()` 同上
- `listAdminRecords()` 同上
- `listAdminSubdomains()` 同上
- `listLogs()` 同上

**后果**：
- Dashboard: `users.value = {items:[...],total:N,...}` 对象赋给数组 ref → `.length` 为 undefined → 所有统计卡片显示错误/空白
- AdminRecordList: `domains.value = {...}` 对象 → `domains[0]` 为 undefined → `openCreate()` 中 `form.did = 0` → 点击"新增解析"虽然能弹窗，但保存时因缺 did/uid 无法正常工作（按钮实际能点，但表单字段空导致看起来"按不了"或保存失败）

### 问题2：getRecords SQL 缺少 line_id 字段
**影响文件**：[src/repositories/admin.repository.ts](file:///workspace/src/repositories/admin.repository.ts#L244-L256)

SQL 只选了 `r.line` 但未选 `r.line_id`，导致编辑解析时 `line_id` 为 undefined，下拉选项异常。

### 问题3：createRecord 违反 records.record_id NOT NULL 约束
**影响文件**：[src/repositories/admin.repository.ts](file:///workspace/src/repositories/admin.repository.ts#L291-L298)

`records` 表定义 `record_id TEXT NOT NULL`，但 admin createRecord 方法传 `record.record_id || null` 作为 null，会触发 NOT NULL 约束错误。后台创建的本地记录没有远端 record_id，需要用空字符串占位。

### 问题4：getRecords SQL 子域名别名为 subdomain_name 而非 subdomain
**影响文件**：[src/repositories/admin.repository.ts](file:///workspace/src/repositories/admin.repository.ts#L246)

SQL 中 `s.name as subdomain_name`，但前端模板 [AdminRecordList.vue:44](file:///workspace/web/src/pages/admin/AdminRecordList.vue#L44) 使用 `row.subdomain`，导致子域名列显示 "-"。

### 问题5：前端 AdminSubdomain 类型包含不存在字段
**影响文件**：[web/src/api/admin.ts](file:///workspace/web/src/api/admin.ts#L33-L49)

类型声明了 `reject_reason/reviewed_by/reviewed_at` 字段（数据库已不存在），虽不影响运行但会引起 TS 混淆。需要移除。

### Authentication error 说明
用户提到的 "Authentication error" 大概率是之前 Cloudflare DNS API 调用时出现的 403 错误（域名 provider_config 中 API token 问题），不属于本次管理后台渲染问题的核心。但会在必要时一并确认后端 500 错误都被正确捕获并返回可读错误消息。

---

## 修改方案

### 方案选择
最干净的修复方式：**修正前端非分页 API 函数，让它们正确从分页响应中提取 `.items`**，同时修复后端 SQL 字段问题和 NOT NULL 约束问题。

不修改后端 controller 的返回格式（分页格式对所有 GET 列表接口是统一的，改后端会波及分页页面和其他调用方）。

### 需要修改的文件和具体改动

#### 1. [web/src/api/admin.ts](file:///workspace/web/src/api/admin.ts)
- 修正5个非分页 API 函数的返回值处理：调用 http 后从 `.data.items` 取数组，或改用 transformer
- 移除 `AdminSubdomain` 类型中不存在的 `reject_reason/reviewed_by/reviewed_at` 字段
- 具体方法：
  - `listAdminUsers`：改为返回 `.then(r => ({ ...r, data: r.data.items }))` 或直接在 response interceptor 之外手动处理？最简洁方式是修改这5个函数，将 `.data` 替换为 `.data.items`
  - 实际上 `http.interceptors.response.use((response) => response.data)` 已经解包了一层 axios response，所以函数拿到的是 `ApiEnvelope<PageResult<T>>`，需要取 `envelope.data.items`

#### 2. [web/src/pages/admin/AdminDashboard.vue](file:///workspace/web/src/pages/admin/AdminDashboard.vue)
- 因为 API 函数修正后 `.data` 就已经是数组了，Dashboard 的赋值 `users.value = userResponse.data` 等无需再改
- 增加防御：检查 recordResponse 等是否为数组，必要时降级为空数组

#### 3. [src/repositories/admin.repository.ts](file:///workspace/src/repositories/admin.repository.ts)
- **修复 getRecords SQL**（行244-256）：添加 `r.line_id` 到 SELECT 列；将 `s.name as subdomain_name` 改为同时提供 `s.name as subdomain` 和保留 subdomain_name（或直接改为 subdomain，因为 AdminRecordList.vue 使用 subdomain）
- **修复 createRecord**（行291-298）：将 `record.record_id || null` 改为 `record.record_id || ''`（空字符串满足 NOT NULL，代表本地记录无远端ID）

#### 4. 部署验证
- 运行 `npx wrangler@3 deploy` 部署（wrangler.toml 中 build 命令会自动构建前端）
- 验证 Dashboard 四个统计卡片、最新域名、操作日志正常显示
- 验证"新增解析"弹窗能正常打开、保存成功、列表刷新

---

## 修改步骤（Tasks）

1. **修复后端 admin.repository.ts**
   - getRecords SQL 添加 `r.line_id`，修正子域名字段别名为 `subdomain`
   - createRecord 用空字符串替代 null 作为 record_id 默认值

2. **修复前端 admin.ts 非分页 API 函数**
   - listAdminUsers / listAdminDomains / listAdminRecords / listAdminSubdomains / listLogs 五个函数改为正确解包 `.data.items`
   - 移除 AdminSubdomain 中不存在的 reject_reason/reviewed_by/reviewed_at 字段

3. **（防御性）AdminDashboard.vue 数据校验**
   - 确保即使某个 API 异常，其他已成功数据仍能正常渲染
   - （当前已有 try/catch，API 修复后大概率不需要额外改动，但会在验证时确认）

4. **构建并部署到 Cloudflare Workers**
   - 执行 `npm install`（如果需要）
   - 执行 `npx wrangler@3 deploy`，记录新版本 ID

5. **验证**
   - 运行概览页面显示正确统计数字
   - 解析管理页面"新增解析"按钮可正常弹窗、保存、刷新
   - 编辑/删除解析正常工作

---

## 风险与注意事项

- **后端分页格式统一**：所有 GET 列表接口都统一返回分页格式，未来前端非分页场景应一律从 `.data.items` 取数据
- **record_id 空字符串语义**：使用空字符串 `''` 作为本地创建记录的 record_id，表示该记录尚未同步到任何 DNS 提供商；之后若需要同步，可在同步逻辑中填充真实 remote_id
- **UNIQUE 约束**：records 表有 `UNIQUE(did, name, type)` 约束，后台创建重复记录会触发数据库错误，createRecord 的 catch 已经能捕获并返回 500（含错误消息）
- **构建部署**：wrangler.toml 的 build.command 会自动执行 `npm run build:frontend`，确保 web 目录依赖已安装
