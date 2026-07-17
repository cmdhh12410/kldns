#!/bin/bash
# KLDNS D1 数据库初始化脚本
# 用于在本地开发环境或远程环境初始化数据库

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MIGRATION_FILE="$PROJECT_ROOT/migrations/0001_initial_schema.sql"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}KLDNS D1 数据库初始化脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查 wrangler 是否安装
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}错误: wrangler 未安装${NC}"
    echo "请先安装: npm install -g wrangler"
    exit 1
fi

# 检查迁移文件是否存在
if [ ! -f "$MIGRATION_FILE" ]; then
    echo -e "${RED}错误: 迁移文件不存在${NC}"
    echo "文件路径: $MIGRATION_FILE"
    exit 1
fi

# 选择环境
echo "请选择要初始化的环境:"
echo "1) 本地开发环境 (local)"
echo "2) 生产环境 (remote)"
read -p "请输入选项 [1-2]: " env_choice

case $env_choice in
    1)
        ENV="local"
        ENV_FLAG="--local"
        echo -e "${YELLOW}将初始化本地开发环境数据库${NC}"
        ;;
    2)
        ENV="remote"
        ENV_FLAG="--remote"
        echo -e "${RED}警告: 将初始化生产环境数据库${NC}"
        read -p "确认继续? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "操作已取消"
            exit 0
        fi
        ;;
    *)
        echo -e "${RED}无效的选项${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}开始执行数据库迁移...${NC}"
echo "迁移文件: $MIGRATION_FILE"
echo "环境: $ENV"
echo ""

# 执行迁移
if wrangler d1 execute kldns-db $ENV_FLAG --file="$MIGRATION_FILE"; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ 数据库初始化成功!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "下一步:"
    echo "1. 启动开发服务器: npm run dev"
    echo "2. 运行 API 测试: ./scripts/test-api.sh"
    echo ""
else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}✗ 数据库初始化失败${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo "请检查:"
    echo "- wrangler.toml 中的 D1 数据库配置"
    echo "- 数据库是否已创建: wrangler d1 create kldns-db"
    echo "- 迁移文件是否完整"
    exit 1
fi
