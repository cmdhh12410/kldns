# 修复域名同步功能 - 验证清单

- [x] sync-records 路由指向正确的 controller 方法（syncDomainRecords）
- [x] syncDomainRecords 方法能解密 provider_config
- [x] 同步接口返回 { total, created, skipped } 格式
- [x] 新记录正确插入 records 表（uid=0, subdomain_id=NULL）
- [x] 已存在的记录按 record_id 去重不重复插入
- [x] 域名不存在时返回 404 而非 500
- [x] 没有配置时返回合理错误
- [x] 代码已部署到 Cloudflare Workers（版本 080ef740）
