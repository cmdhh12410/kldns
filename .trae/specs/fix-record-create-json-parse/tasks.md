# 修复解析记录创建 JSON 解析错误 - Tasks

- [x] Task 1: 调研 Provider 配置的加密与解密机制
  - 已确认 `src/services/provider.resolver.ts` 负责读取 domain 的 `provider_config_ciphertext` 并解密。
  - 已确认解密工具函数为 `src/utils/secrets.ts` 中的 `decrypt`。

- [x] Task 2: 确保 RecordService 通过 ProviderResolver 获取解密后的 Provider 配置
  - `src/services/record.service.ts` 已在构造时传入 `secretKey` 并创建 `ProviderResolver`。
  - `submitRecord` / `updateRecord` / `deleteRecord` 均通过 `this.providerResolver.resolve(domain)` 获取已配置好的 Provider。

- [x] Task 3: 修复代码中的运行时错误
  - 修复 `src/services/provider.resolver.ts` 中 `decrypt` 缺少 `await` 的问题（之前返回 Promise 导致配置解密失败）。
  - 修复 `src/services/record.service.ts` 中 `getSubdomainForUser` 返回结构未解构的问题。
  - 修复 `src/controllers/api.controller.ts` 中 `newAPIToken` 的 `hashBearerToken` 调用缺少 `await` 的问题。
  - 修复 `src/controllers/api.controller.ts` 中 `updateRecord` 返回变量名错误（`record` → `updated`）。

- [ ] Task 4: 构建并部署到 Cloudflare Workers
  - [x] 运行 `npm install` 安装依赖。
  - [x] 运行 `npm run build:frontend` 构建前端，构建成功。
  - [ ] 运行 `wrangler deploy` 部署 Worker：当前环境缺少 `CLOUDFLARE_API_TOKEN`，无法在非交互式环境中完成部署。

- [ ] Task 5: 验证修复结果
  - 在 Worker 部署成功后，在用户中心 → 域名解析页面新增一条 A 记录，确认不再出现 JSON 解析错误。

# Task Dependencies
- Task 5 依赖 Task 4
