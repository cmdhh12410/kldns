# Tasks

## Phase 1: 项目结构初始化
- [x] Task 1: 创建 Cloudflare Workers 项目基础结构
  - [x] 1.1 创建 package.json，添加 wrangler、hono、typescript 等依赖
  - [x] 1.2 创建 wrangler.toml 配置文件，配置 D1 数据库绑定和 KV 命名空间绑定
  - [x] 1.3 创建 tsconfig.json，配置 TypeScript 编译选项
  - [x] 1.4 创建 src/ 目录结构：src/api/, src/controllers/, src/services/, src/repositories/, src/middleware/, src/dns/, src/utils/

## Phase 2: 数据库迁移与模型定义
- [x] Task 2: 创建 D1 数据库迁移脚本
  - [x] 2.1 将 migrations/*.sql 转换为 D1 兼容的迁移脚本
  - [x] 2.2 创建 migrations/ 目录，包含初始化 SQL 文件
  - [x] 2.3 创建数据库初始化逻辑，在 Workers 启动时自动执行迁移
  
- [x] Task 3: 定义 TypeScript 数据模型
  - [x] 3.1 创建 src/models/user.ts，定义 User 接口
  - [x] 3.2 创建 src/models/domain.ts，定义 Domain 接口
  - [x] 3.3 创建 src/models/record.ts，定义 Record 接口
  - [x] 3.4 创建 src/models/subdomain.ts，定义 Subdomain 接口
  - [x] 3.5 创建 src/models/settings.ts，定义 Settings 接口
  - [x] 3.6 创建 src/models/index.ts，导出所有模型

## Phase 3: 核心工具模块
- [x] Task 4: 实现认证和密码工具
  - [x] 4.1 创建 src/utils/passwords.ts，使用 Web Crypto API 实现密码哈希和验证
  - [x] 4.2 创建 src/utils/tokens.ts，实现 Bearer Token 生成和哈希
  - [x] 4.3 创建 src/utils/secrets.ts，使用 Web Crypto API 实现 AES-GCM 加密解密
  
- [x] Task 5: 实现配置管理
  - [x] 5.1 创建 src/config/env.ts，从环境变量读取配置
  - [x] 5.2 创建 src/config/settings.ts，从 KV 读取应用配置
  - [x] 5.3 创建 src/config/index.ts，统一配置导出

## Phase 4: 数据访问层
- [x] Task 6: 实现 D1 数据库访问层
  - [x] 6.1 创建 src/repositories/database.ts，封装 D1 数据库操作
  - [x] 6.2 创建 src/repositories/auth.repository.ts，实现用户认证相关查询
  - [x] 6.3 创建 src/repositories/api.repository.ts，实现 API 相关查询（域名、记录、子域名等）
  - [x] 6.4 创建 src/repositories/admin.repository.ts，实现管理后台相关查询
  - [x] 6.5 创建 src/repositories/settings.repository.ts，实现设置相关查询
  - [x] 6.6 创建 src/repositories/points.repository.ts，实现积分相关查询
  - [x] 6.7 创建 src/repositories/records.repository.ts，实现记录相关查询
  - [x] 6.8 创建 src/repositories/subdomains.repository.ts，实现子域名相关查询
  - [x] 6.9 创建 src/repositories/migrations.ts，实现数据库迁移执行逻辑

## Phase 5: DNS 提供商集成
- [x] Task 7: 实现 DNS 提供商接口和 Cloudflare 提供商
  - [x] 7.1 创建 src/dns/provider.ts，定义 Provider 接口
  - [x] 7.2 创建 src/dns/providers/cloudflare.ts，实现 Cloudflare DNS API 集成
  - [x] 7.3 创建 src/dns/providers/dnspod.ts，实现 DNSPod API 集成
  - [x] 7.4 创建 src/dns/providers/aliyun.ts，实现阿里云 DNS API 集成
  - [x] 7.5 创建 src/dns/registry.ts，实现提供商注册和工厂模式
  
- [x] Task 8: 实现其他 DNS 提供商
  - [x] 8.1 创建 src/dns/providers/dnscom.ts
  - [x] 8.2 创建 src/dns/providers/dnsla.ts
  - [x] 8.3 创建 src/dns/providers/dnsdun.ts
  - [x] 8.4 创建 src/dns/providers/west.ts
  - [x] 8.5 创建 src/dns/providers/huawei.ts
  - [x] 8.6 创建 src/dns/providers/baidu.ts
  - [x] 8.7 创建 src/dns/providers/route53.ts
  - [x] 8.8 创建 src/dns/providers/google.ts

## Phase 6: 业务逻辑层
- [x] Task 9: 实现业务服务
  - [x] 9.1 创建 src/services/record.service.ts，实现记录提交、更新、删除逻辑
  - [x] 9.2 创建 src/services/subdomain.service.ts，实现子域名注册和管理逻辑
  - [x] 9.3 创建 src/services/points.service.ts，实现积分调整逻辑
  - [x] 9.4 创建 src/services/provider.resolver.ts，实现 DNS 提供商解析
  - [x] 9.5 创建 src/services/record.workflow.ts，实现记录工作流（远程+本地事务）

## Phase 7: HTTP 控制器和路由
- [x] Task 10: 实现中间件
  - [x] 10.1 创建 src/middleware/auth.ts，实现 Bearer Token 认证中间件
  - [x] 10.2 创建 src/middleware/admin.ts，实现管理员权限中间件
  - [x] 10.3 创建 src/middleware/cors.ts，实现 CORS 中间件
  
- [x] Task 11: 实现控制器
  - [x] 11.1 创建 src/controllers/auth.controller.ts，实现注册、登录、修改密码
  - [x] 11.2 创建 src/controllers/api.controller.ts，实现用户 API（域名、记录、子域名、积分、令牌）
  - [x] 11.3 创建 src/controllers/admin.controller.ts，实现管理后台 API
  - [x] 11.4 创建 src/controllers/health.controller.ts，实现健康检查
  - [x] 11.5 创建 src/controllers/install.controller.ts，实现初始化管理员
  - [x] 11.6 创建 src/controllers/settings.controller.ts，实现设置查询
  
- [x] Task 12: 实现路由和入口
  - [x] 12.1 创建 src/routes/router.ts，使用 Hono 定义所有 API 路由
  - [x] 12.2 创建 src/index.ts，Workers 入口点，初始化 Hono 应用
  - [x] 12.3 创建 src/static.ts，处理前端静态资源服务

## Phase 8: 前端集成
- [x] Task 13: 调整前端构建配置
  - [x] 13.1 修改 web/vite.config.ts，配置输出到 Workers 可识别的格式
  - [x] 13.2 修改 web/package.json，添加构建脚本
  - [x] 13.3 创建 web/wrangler.toml，配置 Pages 或 Workers 静态资源部署
  
- [x] Task 14: 集成前端到 Workers
  - [x] 14.1 修改主 wrangler.toml，配置静态资源目录
  - [x] 14.2 创建部署脚本，自动构建前端并集成到 Workers

## Phase 9: 部署和测试
- [x] Task 15: 创建部署配置和脚本
  - [x] 15.1 创建 .env.example，列出所有需要的环境变量
  - [x] 15.2 创建 deploy.sh，自动化部署流程
  - [x] 15.3 更新 README.md，添加 Cloudflare Workers 部署说明
  
- [x] Task 16: 创建测试和验证
  - [x] 16.1 创建本地开发环境配置
  - [x] 16.2 创建数据库初始化脚本
  - [x] 16.3 验证所有 API 端点功能正常

## Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1
- Task 4 依赖 Task 1
- Task 5 依赖 Task 3
- Task 6 依赖 Task 2, Task 3
- Task 7 依赖 Task 4, Task 5
- Task 8 依赖 Task 7
- Task 9 依赖 Task 6, Task 7
- Task 10 依赖 Task 6
- Task 11 依赖 Task 9, Task 10
- Task 12 依赖 Task 11
- Task 13 可并行
- Task 14 依赖 Task 12, Task 13
- Task 15 依赖 Task 14
- Task 16 依赖 Task 14
