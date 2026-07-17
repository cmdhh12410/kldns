#!/usr/bin/env bash
# 部署脚本：构建前端并集成到 Cloudflare Workers
# 用法: ./scripts/deploy.sh [--remote]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WEB_DIR="$PROJECT_ROOT/web"
DIST_DIR="$WEB_DIR/dist"

REMOTE_FLAG=""
if [[ "${1:-}" == "--remote" ]]; then
  REMOTE_FLAG="--remote"
  echo "==> 模式: 远程部署"
else
  echo "==> 模式: 本地预览"
fi

# 1. 安装根目录依赖（确保 wrangler 等工具可用）
echo "==> 安装根目录依赖..."
cd "$PROJECT_ROOT"
npm install

# 2. 构建前端
echo "==> 安装前端依赖..."
cd "$WEB_DIR"
npm install

echo "==> 构建前端..."
npm run build

if [[ ! -d "$DIST_DIR" ]]; then
  echo "错误: 前端构建失败，未找到 $DIST_DIR 目录" >&2
  exit 1
fi

echo "==> 前端构建完成: $DIST_DIR"

# 2. 上传静态资源到 KV
echo "==> 上传静态资源到 KV..."
cd "$PROJECT_ROOT"

# 遍历 dist 目录，将每个文件上传到 KV，key 格式为 static:<relative-path>
# 使用 wrangler kv:key put 配合 --binding KV
find "$DIST_DIR" -type f | while read -r file; do
  rel_path="${file#$DIST_DIR/}"
  kv_key="static:${rel_path}"

  # 推断 content-type
  ext="${rel_path##*.}"
  case "$ext" in
    html) content_type="text/html; charset=utf-8" ;;
    js)   content_type="application/javascript; charset=utf-8" ;;
    css)  content_type="text/css; charset=utf-8" ;;
    json) content_type="application/json; charset=utf-8" ;;
    svg)  content_type="image/svg+xml" ;;
    png)  content_type="image/png" ;;
    jpg|jpeg) content_type="image/jpeg" ;;
    gif)  content_type="image/gif" ;;
    ico)  content_type="image/x-icon" ;;
    woff) content_type="font/woff" ;;
    woff2) content_type="font/woff2" ;;
    ttf)  content_type="font/ttf" ;;
    *)    content_type="application/octet-stream" ;;
  esac

  echo "    上传: $kv_key ($content_type)"
  wrangler kv:key put "$kv_key" --path "$file" --binding KV --content-type "$content_type" $REMOTE_FLAG
done

echo "==> 静态资源上传完成"

# 3. 部署 Workers
echo "==> 部署 Workers..."
wrangler deploy $REMOTE_FLAG

echo "==> 部署完成"
