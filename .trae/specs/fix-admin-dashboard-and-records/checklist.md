# 修复管理后台运行概览空白与新增解析按钮失效 - 验收清单

## AC-1: 运行概览页面正确显示
- [x] AdminDashboard 页面 onMounted 正确调用 listAdminUsers/listAdminDomains/listAdminRecords/listAdminSubdomains/listLogs
- [x] 五个 API 数据赋值到对应 ref（users/domains/records/subdomains/logs）
- [x] 页面模板引用 dashboardListLimit 限制预览数量为 6

## AC-2: API 失败不导致页面空白
- [x] AdminDashboard.vue onMounted 已包裹 try/catch/finally
- [x] catch 分支输出 `console.error('Dashboard load failed:', error)`，loading 状态正确置 false
- [x] 任一 API 失败时，其他卡片仍能渲染已成功获取的数据

## AC-3: 新增解析按钮可点击
- [x] router.ts 中 `admin.post('/records', ...)` 已绑定到 `controllers.admin.createRecord(c)`
- [x] controller `createRecord` 方法实现完整（解析 body、校验必填、调用 repo、返回 201）
- [x] 前端 AdminRecordList.vue 中"新增解析"按钮触发对话框

## AC-4: 新增解析接口正常
- [x] `POST /api/admin/records` 接收 `{uid, did, name, type, value, line_id}` 字段
- [x] AdminRepository.createRecord 正确插入 records 表并返回 lastInsertRowId
- [x] 响应格式为 `{code: 'OK', message: 'Record created', data: {id}}` 状态码 201

## AC-5: 编辑/删除解析功能正常
- [x] `PUT /api/admin/records/:id` 绑定到 `controllers.admin.updateRecord(c)`
- [x] `DELETE /api/admin/records/:id` 绑定到 `controllers.admin.deleteRecord(c)`
- [x] AdminRepository.updateRecord 支持部分字段更新
- [x] AdminRepository.deleteRecord 执行 DELETE FROM records WHERE id = ?

## 部署验证
- [x] 已通过 `npx wrangler@3 deploy` 部署到 Cloudflare Workers
- [x] 部署版本：a20b667a-206d-49bb-a5b0-85da38e7d083
