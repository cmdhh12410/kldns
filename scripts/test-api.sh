#!/bin/bash
# KLDNS API 端点测试脚本
# 用于验证所有关键 API 端点功能正常

set -e

# 配置
BASE_URL="${BASE_URL:-http://localhost:8787}"
TEST_USERNAME="testuser_$(date +%s)"
TEST_EMAIL="test@example.com"
TEST_PASSWORD="Test12345678"
ADMIN_USERNAME="admin_$(date +%s)"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin12345678"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 测试计数器
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试函数
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local expected_status=$4
    local data=$5
    local auth_token=$6
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "测试 $description... "
    
    # 构建 curl 命令
    local curl_cmd="curl -s -w '\n%{http_code}' -X $method"
    curl_cmd="$curl_cmd -H 'Content-Type: application/json'"
    
    if [ -n "$auth_token" ]; then
        curl_cmd="$curl_cmd -H 'Authorization: Bearer $auth_token'"
    fi
    
    if [ -n "$data" ]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi
    
    curl_cmd="$curl_cmd '$BASE_URL$endpoint'"
    
    # 执行请求
    response=$(eval $curl_cmd)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # 检查状态码
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ 通过${NC} (HTTP $http_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo "$body" > /tmp/test_response.json
        return 0
    else
        echo -e "${RED}✗ 失败${NC} (期望: $expected_status, 实际: $http_code)"
        echo "响应: $body"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# 提取 JSON 值
extract_json() {
    local key=$1
    cat /tmp/test_response.json | grep -o "\"$key\":[^,}]*" | sed 's/.*:"\([^"]*\)".*/\1/' | head -1
}

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}KLDNS API 端点测试${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "测试环境: $BASE_URL"
echo "开始时间: $(date)"
echo ""

# 检查服务是否运行
echo -e "${YELLOW}检查服务状态...${NC}"
if ! curl -s "$BASE_URL/api/health" > /dev/null 2>&1; then
    echo -e "${RED}错误: 无法连接到服务${NC}"
    echo "请确保服务正在运行: npm run dev"
    exit 1
fi
echo -e "${GREEN}✓ 服务正常运行${NC}"
echo ""

# 1. 健康检查
echo -e "${BLUE}[1/7] 健康检查${NC}"
test_endpoint "GET" "/api/health" "健康检查" "200" || true
echo ""

# 2. 初始化管理员
echo -e "${BLUE}[2/7] 初始化管理员${NC}"
test_endpoint "POST" "/api/install/admin" "创建管理员" "201" \
    "{\"username\":\"$ADMIN_USERNAME\",\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" || true
echo ""

# 3. 用户注册
echo -e "${BLUE}[3/7] 用户注册${NC}"
test_endpoint "POST" "/api/auth/register" "注册新用户" "201" \
    "{\"username\":\"$TEST_USERNAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" || true
echo ""

# 4. 用户登录
echo -e "${BLUE}[4/7] 用户登录${NC}"
test_endpoint "POST" "/api/auth/login" "用户登录" "200" \
    "{\"username\":\"$TEST_USERNAME\",\"password\":\"$TEST_PASSWORD\"}" || true

# 提取 token
USER_TOKEN=$(extract_json "token")
if [ -z "$USER_TOKEN" ]; then
    echo -e "${RED}警告: 无法提取用户 token${NC}"
else
    echo -e "${GREEN}✓ 获取用户 token: ${USER_TOKEN:0:20}...${NC}"
fi
echo ""

# 5. 获取公开域名列表
echo -e "${BLUE}[5/7] 公开 API${NC}"
test_endpoint "GET" "/api/public/domains" "获取公开域名列表" "200" || true
echo ""

# 6. 认证用户 API
echo -e "${BLUE}[6/7] 认证用户 API${NC}"
if [ -n "$USER_TOKEN" ]; then
    test_endpoint "GET" "/api/auth/me" "获取当前用户信息" "200" "" "$USER_TOKEN" || true
    test_endpoint "GET" "/api/domains" "获取可用域名列表" "200" "" "$USER_TOKEN" || true
    test_endpoint "GET" "/api/subdomains" "获取子域名列表" "200" "" "$USER_TOKEN" || true
    test_endpoint "GET" "/api/records" "获取记录列表" "200" "" "$USER_TOKEN" || true
    test_endpoint "GET" "/api/points" "获取积分信息" "200" "" "$USER_TOKEN" || true
    test_endpoint "GET" "/api/tokens" "获取 API 令牌列表" "200" "" "$USER_TOKEN" || true
else
    echo -e "${YELLOW}跳过认证 API 测试 (无 token)${NC}"
fi
echo ""

# 7. 管理员 API
echo -e "${BLUE}[7/7] 管理员 API${NC}"
echo -e "${YELLOW}管理员 API 测试需要管理员 token，跳过自动测试${NC}"
echo "如需测试管理员 API，请手动登录管理员账户并测试以下端点:"
echo "  - GET /api/admin/users"
echo "  - GET /api/admin/domains"
echo "  - GET /api/admin/records"
echo "  - GET /api/admin/subdomains"
echo "  - GET /api/admin/settings"
echo ""

# 测试总结
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}测试总结${NC}"
echo -e "${BLUE}========================================${NC}"
echo "总测试数: $TOTAL_TESTS"
echo -e "通过: ${GREEN}$PASSED_TESTS${NC}"
echo -e "失败: ${RED}$FAILED_TESTS${NC}"
echo "结束时间: $(date)"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ 所有测试通过!${NC}"
    exit 0
else
    echo -e "${RED}✗ 部分测试失败${NC}"
    echo ""
    echo "调试建议:"
    echo "1. 检查数据库是否已初始化: ./scripts/init-db.sh"
    echo "2. 查看服务日志"
    echo "3. 检查 wrangler.toml 配置"
    exit 1
fi
