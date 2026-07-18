# 修复管理后台 500 错误与 DNS 平台为空问题 - 验证清单

- [ ] 管理后台主域列表接口 GET /api/admin/domains 返回 200，格式正确
- [ ] 管理后台子域名列表接口 GET /api/admin/subdomains 返回 200，格式正确
- [ ] 用户侧子域名列表接口 GET /api/subdomains 返回 200
- [ ] 管理后台分组列表接口 GET /api/admin/groups 返回 200，包含管理组和默认组
- [ ] DNS 平台列表接口 GET /api/admin/dns-providers 返回 200，至少 10 个平台
- [ ] 访问 /admin 页面刷新返回 200 和 index.html（SPA fallback）
- [ ] 访问 /admin/domains 页面刷新返回 200 和 index.html
- [ ] 访问 /login 页面刷新返回 200 和 index.html
- [ ] API 接口（如 /api/health）不受 SPA fallback 影响，正常返回 JSON
- [ ] 分页接口返回格式与前端期望一致（items/total 或对应字段）
- [ ] 所有接口在登录态（Bearer token）下正常工作
- [ ] 仪表盘页面加载无 500 错误
- [ ] 新增主域对话框中 DNS 平台下拉有数据
- [ ] 代码已部署到 Cloudflare Workers
- [ ] Git 提交并推送到仓库
