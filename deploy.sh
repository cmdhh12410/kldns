#!/bin/bash
# KLDNS Cloudflare Workers 自动化部署脚本
# 使用方法：chmod +x deploy.sh && ./deploy.sh

set -e  # 遇到错误立即退出

echo "=========================================="
echo "KLDNS Cloudflare Workers 部署脚本"
echo "=========================================="
echo ""

# 检查 wrangler 是否已安装
if ! command -v wrangler &> /dev/null; then
    echo "❌ 错误：未找到 wrangler CLI"
    echo "请先安装：npm install -g wrangler"
    exit 1
fi

# 检查是否已登录 Cloudflare
echo "🔐 检查 Cloudflare 登录状态..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ 未登录 Cloudflare，请先执行：wrangler login"
    exit 1
fi
echo "✅ Cloudflare 登录成功"
echo ""

# 安装后端依赖
echo "📦 安装后端依赖..."
npm install
echo "✅ 后端依赖安装完成"
echo ""

# 安装前端依赖
echo "📦 安装前端依赖..."
cd web
npm install
cd ..
echo "✅ 前端依赖安装完成"
echo ""

# 构建前端
echo "🔨 构建前端..."
npm run build:frontend
echo "✅ 前端构建完成"
echo ""

# 检查 D1 数据库是否存在
echo "🗄️  检查 D1 数据库..."
D1_DB_NAME="kldns-db"
if ! wrangler d1 list | grep -q "$D1_DB_NAME"; then
    echo "⚠️  D1 数据库不存在，正在创建..."
    wrangler d1 create "$D1_DB_NAME"
    echo "✅ D1 数据库创建完成"
    echo ""
    echo "⚠️  重要：请更新 wrangler.toml 中的 database_id"
    echo "   运行以下命令获取数据库 ID："
    echo "   wrangler d1 list"
    echo ""
    read -p "按回车继续部署（请确保已更新 wrangler.toml）..."
else
    echo "✅ D1 数据库已存在"
fi
echo ""

# 执行数据库迁移
echo "🗄️  执行数据库迁移..."
MIGRATION_COUNT=$(ls -1 ./migrations/*.sql 2>/dev/null | wc -l)
if [ "$MIGRATION_COUNT" -gt 0 ]; then
    for sql_file in ./migrations/*.sql; do
        echo "  执行迁移: $(basename "$sql_file")"
        wrangler d1 execute "$D1_DB_NAME" --remote --file="$sql_file"
    done
    echo "✅ 数据库迁移完成（共 $MIGRATION_COUNT 个文件）"
else
    echo "⚠️  未找到迁移文件，跳过"
fi
echo ""

# 检查 KV 命名空间是否存在
echo "💾 检查 KV 命名空间..."
KV_NAMESPACE="kldns-kv"
if ! wrangler kv:namespace list | grep -q "$KV_NAMESPACE"; then
    echo "⚠️  KV 命名空间不存在，正在创建..."
    wrangler kv:namespace create "$KV_NAMESPACE"
    echo "✅ KV 命名空间创建完成"
    echo ""
    echo "⚠️  重要：请更新 wrangler.toml 中的 kv_namespaces.id"
    echo "   运行以下命令获取命名空间 ID："
    echo "   wrangler kv:namespace list"
    echo ""
    read -p "按回车继续部署（请确保已更新 wrangler.toml）..."
else
    echo "✅ KV 命名空间已存在"
fi
echo ""

# 设置环境变量（secrets）
echo "🔒 配置环境变量..."
if [ -f ".env" ]; then
    echo "从 .env 文件读取环境变量..."
    export $(grep -v '^#' .env | xargs)
fi

# 设置 SECRET_KEY（如果未设置）
if [ -z "$SECRET_KEY" ] || [ "$SECRET_KEY" = "change-me-before-production-kldns-secret" ]; then
    echo "⚠️  SECRET_KEY 未设置或使用默认值"
    echo "建议生成随机密钥：openssl rand -hex 32"
    read -p "是否继续部署？(y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 部署到 Cloudflare Workers
echo "🚀 部署到 Cloudflare Workers..."
wrangler deploy
echo "✅ 部署完成"
echo ""

# 输出访问地址
echo "=========================================="
echo "🎉 部署成功！"
echo "=========================================="
echo ""
echo "📍 访问地址："
echo "   https://kldns-workers.your-subdomain.workers.dev"
echo ""
echo "📝 下一步："
echo "   1. 访问上述地址测试应用"
echo "   2. 首次访问需要初始化管理员账号"
echo "   3. 在管理后台配置 DNS 提供商"
echo ""
echo "📚 更多信息请查看 README.md"
echo ""
