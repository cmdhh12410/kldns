# 修复域名创建失败 - 验证清单

- [x] 生产环境 Worker 正常启动，不因 SECRET_KEY 报错
- [x] POST /api/admin/domains 带 provider_config 返回 201 和 id
- [x] domains 表中 provider_config_ciphertext 非空且为加密格式
- [x] dns_providers 表中有对应 key 的记录（外键约束满足）
- [x] GET /api/admin/domains 返回的记录包含 provider_config_stored 字段
- [x] PUT /api/admin/domains/:id 带 provider_config 能更新配置
- [x] PUT /api/admin/domains/:id 不带 provider_config 时保留原配置
- [x] 加密后的数据使用同一套 encrypt/decrypt 工具，兼容
- [x] 多个域名共享同一个 provider_key 时创建正常
- [x] 代码已部署到 Cloudflare Workers（版本 08224b6b）
