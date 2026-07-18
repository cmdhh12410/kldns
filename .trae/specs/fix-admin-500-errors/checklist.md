# 修复管理后台 500 错误与 DNS 平台为空问题 - 验证清单

- [x] 管理后台主域列表接口 GET /api/admin/domains 返回 200，格式正确
- [x] 管理后台子域名列表接口 GET /api/admin/subdomains 返回 200，格式正确
- [x] 用户侧子域名列表接口 GET /api/subdomains 返回 200
- [x] 管理后台分组列表接口 GET /api/admin/groups 返回 200，包含管理组和默认组
- [x] DNS 平台列表接口 GET /api/admin/dns-providers 返回 200，至少 10 个平台
- [x] 访问 /admin 页面刷新返回 200 和 index.html（SPA fallback）
- [x] 访问 /admin/domains 页面刷新返回 200 和 index.html
- [x] 访问 /login 页面刷新返回 200 和 index.html
- [x] API 接口（如 /api/health）不受 SPA fallback 影响，正常返回 JSON
- [x] 分页接口返回格式与前端期望一致（items/total 或对应字段）
- [x] 所有接口在登录态（Bearer token）下正常工作
- [x] 仪表盘页面加载无 500 错误
- [x] 新增主域对话框中 DNS 平台下拉有数据
- [x] 代码已部署到 Cloudflare Workers（版本 a887d6d5）
- [x] Git 本地提交（GitHub 推送需手动配置认证）
