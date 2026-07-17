#!/bin/bash
# KLDNS Cloudflare Workers 全自动部署脚本
# 使用方法：chmod +x deploy.sh && ./deploy.sh
# 无需任何人工干预，一键完成所有部署步骤

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 日志函数
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "\n${CYAN}==>${NC} ${BOLD}$1${NC}"; }

BOLD='\033[1m'

echo ""
echo -e "${BOLD}${CYAN}============================================${NC}"
echo -e "${BOLD}${CYAN}  KLDNS Cloudflare Workers 全自动部署脚本${NC}"
echo -e "${BOLD}${CYAN}============================================${NC}"
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 配置文件
WRANGLER_TOML="wrangler.toml"
D1_DB_NAME="kldns-db"
KV_NAMESPACE_NAME="kldns-kv"
MIGRATIONS_DIR="./migrations"

# 自动加载 Cloudflare Token
if [ -z "$CLOUDFLARE_API_TOKEN" ] && [ -f ".cloudflare_token" ]; then
    export CLOUDFLARE_API_TOKEN=$(cat .cloudflare_token | tr -d '[:space:]')
    log_info "已从 .cloudflare_token 加载 Cloudflare Token"
fi

# ============================================
# Step 1: 环境检查
# ============================================
log_step "Step 1/8: 检查环境依赖"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    log_error "未找到 Node.js，请先安装: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js 版本过低 ($(node --version))，需要 >= 18"
    exit 1
fi
log_success "Node.js $(node --version)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    log_error "未找到 npm"
    exit 1
fi
log_success "npm $(npm --version)"

# 检查 wrangler
if ! command -v wrangler &> /dev/null; then
    log_warn "未找到 wrangler，正在自动安装..."
    npm install -g wrangler
    if ! command -v wrangler &> /dev/null; then
        log_error "wrangler 安装失败，请手动安装: npm install -g wrangler"
        exit 1
    fi
fi
log_success "wrangler $(wrangler --version 2>/dev/null | head -1)"

# 检查 Cloudflare 登录状态
log_info "检查 Cloudflare 登录状态..."
if ! wrangler whoami &> /dev/null 2>&1; then
    log_warn "未登录 Cloudflare，正在打开登录页面..."
    wrangler login
    if ! wrangler whoami &> /dev/null 2>&1; then
        log_error "Cloudflare 登录失败"
        exit 1
    fi
fi
log_success "Cloudflare 已登录"

# ============================================
# Step 2: 创建 D1 数据库（如果不存在）
# ============================================
log_step "Step 2/8: 配置 D1 数据库"

D1_DB_ID=""

# 尝试从 wrangler d1 list 获取现有数据库 ID
log_info "检查 D1 数据库 '$D1_DB_NAME' 是否存在..."
D1_LIST_OUTPUT=$(wrangler d1 list --output json 2>/dev/null || echo "[]")

# 解析数据库 ID
D1_DB_ID=$(echo "$D1_LIST_OUTPUT" | grep -o "\"uuid\":\"[^\"]*\"" | head -1 | cut -d'"' -f4)

if [ -n "$D1_DB_ID" ]; then
    log_success "D1 数据库已存在，ID: $D1_DB_ID"
else
    log_info "D1 数据库不存在，正在创建..."
    CREATE_OUTPUT=$(wrangler d1 create "$D1_DB_NAME" 2>&1)
    echo "$CREATE_OUTPUT"

    # 从输出中提取数据库 ID
    D1_DB_ID=$(echo "$CREATE_OUTPUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)

    if [ -z "$D1_DB_ID" ]; then
        # 再次尝试从 list 获取
        sleep 2
        D1_LIST_OUTPUT=$(wrangler d1 list --output json 2>/dev/null || echo "[]")
        D1_DB_ID=$(echo "$D1_LIST_OUTPUT" | grep -o "\"uuid\":\"[^\"]*\"" | head -1 | cut -d'"' -f4)
    fi

    if [ -z "$D1_DB_ID" ]; then
        log_error "无法获取 D1 数据库 ID，请手动创建: wrangler d1 create $D1_DB_NAME"
        exit 1
    fi

    log_success "D1 数据库创建成功，ID: $D1_DB_ID"
fi

# 更新 wrangler.toml 中的 database_id
log_info "更新 wrangler.toml 中的 database_id..."
if grep -q 'database_id = "your-database-id-here"' "$WRANGLER_TOML" 2>/dev/null; then
    sed -i "s/database_id = \"your-database-id-here\"/database_id = \"$D1_DB_ID\"/" "$WRANGLER_TOML"
    log_success "已更新 database_id"
elif grep -q "database_id = \"your-database-id-here\"" "$WRANGLER_TOML" 2>/dev/null; then
    sed -i "s/database_id = \"your-database-id-here\"/database_id = \"$D1_DB_ID\"/" "$WRANGLER_TOML"
    log_success "已更新 database_id"
else
    # 检查是否已经有正确的 ID
    CURRENT_DB_ID=$(grep 'database_id' "$WRANGLER_TOML" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
    if [ "$CURRENT_DB_ID" != "$D1_DB_ID" ]; then
        sed -i "s/database_id = \"[^\"]*\"/database_id = \"$D1_DB_ID\"/" "$WRANGLER_TOML"
        log_success "已更新 database_id"
    else
        log_success "database_id 已正确配置"
    fi
fi

# ============================================
# Step 3: 创建 KV 命名空间（如果不存在）
# ============================================
log_step "Step 3/8: 配置 KV 命名空间"

KV_NS_ID=""

# 尝试从 wrangler kv:namespace list 获取现有命名空间 ID
log_info "检查 KV 命名空间 '$KV_NAMESPACE_NAME' 是否存在..."
KV_LIST_OUTPUT=$(wrangler kv:namespace list --output json 2>/dev/null || echo "[]")

# 解析命名空间 ID（查找 title 匹配的）
KV_NS_ID=$(echo "$KV_LIST_OUTPUT" | grep -B5 "\"title\":\"$KV_NAMESPACE_NAME\"" | grep -o "\"id\":\"[^\"]*\"" | cut -d'"' -f4)

if [ -n "$KV_NS_ID" ]; then
    log_success "KV 命名空间已存在，ID: $KV_NS_ID"
else
    log_info "KV 命名空间不存在，正在创建..."
    CREATE_OUTPUT=$(wrangler kv:namespace create "$KV_NAMESPACE_NAME" 2>&1)
    echo "$CREATE_OUTPUT"

    # 从输出中提取命名空间 ID
    KV_NS_ID=$(echo "$CREATE_OUTPUT" | grep -oE '[0-9a-f]{32}' | head -1)

    if [ -z "$KV_NS_ID" ]; then
        # 再次尝试从 list 获取
        sleep 2
        KV_LIST_OUTPUT=$(wrangler kv:namespace list --output json 2>/dev/null || echo "[]")
        KV_NS_ID=$(echo "$KV_LIST_OUTPUT" | grep -B5 "\"title\":\"$KV_NAMESPACE_NAME\"" | grep -o "\"id\":\"[^\"]*\"" | cut -d'"' -f4)
    fi

    if [ -z "$KV_NS_ID" ]; then
        log_error "无法获取 KV 命名空间 ID，请手动创建: wrangler kv:namespace create $KV_NAMESPACE_NAME"
        exit 1
    fi

    log_success "KV 命名空间创建成功，ID: $KV_NS_ID"
fi

# 更新 wrangler.toml 中的 KV namespace id
log_info "更新 wrangler.toml 中的 kv_namespaces.id..."
if grep -q 'id = "your-kv-namespace-id-here"' "$WRANGLER_TOML" 2>/dev/null; then
    sed -i "s/id = \"your-kv-namespace-id-here\"/id = \"$KV_NS_ID\"/" "$WRANGLER_TOML"
    log_success "已更新 kv_namespaces.id"
else
    # 检查是否已经有正确的 ID
    CURRENT_KV_ID=$(grep -A1 'binding = "KV"' "$WRANGLER_TOML" | grep 'id' | grep -oE '[0-9a-f]{32}' | head -1)
    if [ "$CURRENT_KV_ID" != "$KV_NS_ID" ]; then
        sed -i "s/id = \"[a-f0-9]*\"/id = \"$KV_NS_ID\"/" "$WRANGLER_TOML"
        log_success "已更新 kv_namespaces.id"
    else
        log_success "kv_namespaces.id 已正确配置"
    fi
fi

# ============================================
# Step 4: 生成 SECRET_KEY
# ============================================
log_step "Step 4/8: 配置安全密钥"

# 检查 .dev.vars 是否存在
if [ ! -f ".dev.vars" ]; then
    log_info "创建 .dev.vars 配置文件..."
    cp .env.example .dev.vars 2>/dev/null || touch .dev.vars
fi

# 生成随机 SECRET_KEY
if command -v openssl &> /dev/null; then
    NEW_SECRET=$(openssl rand -hex 32)
elif command -v xxd &> /dev/null; then
    NEW_SECRET=$(xxd -l 32 -p /dev/urandom)
else
    NEW_SECRET=$(cat /dev/urandom | tr -dc 'a-f0-9' | head -c 64)
fi

# 更新 .dev.vars 中的 SECRET_KEY
if [ -f ".dev.vars" ]; then
    if grep -q "^SECRET_KEY=" ".dev.vars"; then
        sed -i "s/^SECRET_KEY=.*/SECRET_KEY=$NEW_SECRET/" ".dev.vars"
    else
        echo "SECRET_KEY=$NEW_SECRET" >> ".dev.vars"
    fi
fi

# 上传 SECRET_KEY 到 Cloudflare Workers
log_info "上传 SECRET_KEY 到 Cloudflare..."
echo "$NEW_SECRET" | wrangler secret put SECRET_KEY 2>/dev/null || true
log_success "SECRET_KEY 已配置"

# ============================================
# Step 5: 安装依赖
# ============================================
log_step "Step 5/8: 安装项目依赖"

log_info "安装后端依赖..."
npm install --silent 2>/dev/null || npm install
log_success "后端依赖安装完成"

log_info "安装前端依赖..."
cd web
npm install --silent 2>/dev/null || npm install
cd ..
log_success "前端依赖安装完成"

# ============================================
# Step 6: 构建前端
# ============================================
log_step "Step 6/8: 构建前端"

log_info "正在构建前端资源..."
npm run build:frontend
log_success "前端构建完成"

# 检查构建产物
if [ ! -d "web/dist" ]; then
    log_error "前端构建失败，未找到 web/dist 目录"
    exit 1
fi

FRONTEND_FILE_COUNT=$(find web/dist -type f | wc -l)
log_success "构建产物: $FRONTEND_FILE_COUNT 个文件"

# ============================================
# Step 7: 执行数据库迁移
# ============================================
log_step "Step 7/8: 执行数据库迁移"

MIGRATION_FILES=$(find "$MIGRATIONS_DIR" -name "*.sql" -type f | sort)
MIGRATION_COUNT=$(echo "$MIGRATION_FILES" | grep -c "." || echo "0")

if [ "$MIGRATION_COUNT" -gt 0 ]; then
    log_info "发现 $MIGRATION_COUNT 个迁移文件"

    for sql_file in $MIGRATION_FILES; do
        FILENAME=$(basename "$sql_file")
        log_info "执行迁移: $FILENAME"

        # 远程执行迁移
        if wrangler d1 execute "$D1_DB_NAME" --remote --file="$sql_file" 2>&1; then
            log_success "迁移成功: $FILENAME"
        else
            log_warn "迁移可能已执行过或存在错误: $FILENAME（继续）"
        fi
    done

    log_success "数据库迁移完成"
else
    log_warn "未找到迁移文件"
fi

# ============================================
# Step 8: 部署 Workers
# ============================================
log_step "Step 8/8: 部署到 Cloudflare Workers"

log_info "正在部署 Workers..."
DEPLOY_OUTPUT=$(wrangler deploy 2>&1)
echo "$DEPLOY_OUTPUT"

# 提取 Workers URL
WORKERS_URL=$(echo "$DEPLOY_OUTPUT" | grep -oE 'https://[a-zA-Z0-9._-]+\.workers\.dev' | head -1)

if [ -z "$WORKERS_URL" ]; then
    # 尝试从输出中提取其他格式的 URL
    WORKERS_URL=$(echo "$DEPLOY_OUTPUT" | grep -oE 'https://[^ ]+' | head -1)
fi

log_success "Workers 部署完成"

# ============================================
# 部署完成总结
# ============================================
echo ""
echo -e "${BOLD}${GREEN}============================================${NC}"
echo -e "${BOLD}${GREEN}  部署成功！${NC}"
echo -e "${BOLD}${GREEN}============================================${NC}"
echo ""
echo -e "${BOLD}配置信息:${NC}"
echo -e "  D1 数据库 ID:  ${CYAN}$D1_DB_ID${NC}"
echo -e "  KV 命名空间 ID: ${CYAN}$KV_NS_ID${NC}"
echo ""

if [ -n "$WORKERS_URL" ]; then
    echo -e "${BOLD}访问地址:${NC}"
    echo -e "  ${GREEN}$WORKERS_URL${NC}"
    echo ""
    echo -e "${BOLD}快速开始:${NC}"
    echo -e "  1. 打开浏览器访问上述地址"
    echo -e "  2. 初始化管理员账号:"
    echo -e "     ${CYAN}curl -X POST $WORKERS_URL/api/install/admin \\"
    echo -e "       -H \"Content-Type: application/json\" \\"
    echo -e "       -d '{\"username\":\"admin\",\"email\":\"admin@example.com\",\"password\":\"YourStrongPassword123\"}'${NC}"
    echo -e "  3. 登录后进入管理后台配置 DNS 提供商"
else
    echo -e "${YELLOW}提示: 请查看上方输出获取访问地址${NC}"
fi

echo ""
echo -e "${BOLD}常用命令:${NC}"
echo -e "  查看日志:    ${CYAN}wrangler tail${NC}"
echo -e "  本地开发:    ${CYAN}npm run dev${NC}"
echo -e "  重新部署:    ${CYAN}./deploy.sh${NC}"
echo -e "  备份数据库:  ${CYAN}wrangler d1 export $D1_DB_NAME --output=backup.sql${NC}"
echo ""
