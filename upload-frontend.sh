#!/bin/bash

# 上传前端文件到 Cloudflare KV
# KV 命名空间 ID: 0c18af9cfa804fa587589f2441f1671d

set -e

KV_NAMESPACE_ID="0c18af9cfa804fa587589f2441f1671d"
FRONTEND_DIR="web/dist"

echo "📤 开始上传前端文件到 KV..."
echo "KV 命名空间 ID: $KV_NAMESPACE_ID"
echo "前端目录: $FRONTEND_DIR"
echo ""

# 检查目录是否存在
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ 错误: 前端目录不存在: $FRONTEND_DIR"
    exit 1
fi

# 统计文件数量
TOTAL_FILES=$(find "$FRONTEND_DIR" -type f | wc -l)
echo "找到 $TOTAL_FILES 个文件需要上传"
echo ""

# 上传每个文件
CURRENT=0
find "$FRONTEND_DIR" -type f | while read -r file; do
    CURRENT=$((CURRENT + 1))
    
    # 获取相对路径
    relative_path="${file#$FRONTEND_DIR/}"
    
    # KV key 格式: static:path/to/file
    kv_key="static:$relative_path"
    
    echo "[$CURRENT/$TOTAL_FILES] 上传: $relative_path -> $kv_key"
    
    # 上传到 KV（从项目根目录执行，使用绝对路径）
    wrangler kv key put "$kv_key" --namespace-id="$KV_NAMESPACE_ID" --path="$(pwd)/$file"
    
    if [ $? -eq 0 ]; then
        echo "  ✅ 成功"
    else
        echo "  ❌ 失败"
        exit 1
    fi
done

echo ""
echo "✅ 所有前端文件已上传到 KV！"
echo ""
echo "现在可以访问: https://kldns-workers.hryzdan.workers.dev"
