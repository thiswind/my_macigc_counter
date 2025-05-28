#!/bin/bash

echo "🚀 启动 Flutter + TiDB 应用..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 请先安装 Node.js"
    exit 1
fi

# 检查 Flutter 是否安装
if ! command -v flutter &> /dev/null; then
    echo "❌ 错误: 请先安装 Flutter"
    exit 1
fi

echo "📦 安装依赖..."
npm install

echo "🗄️  启动后端服务器..."
node server.js &
SERVER_PID=$!

# 等待服务器启动
sleep 3

echo "🌐 测试后端连接..."
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ 后端服务器启动成功"
else
    echo "❌ 后端服务器启动失败"
    kill $SERVER_PID
    exit 1
fi

echo "📱 启动 Flutter 应用..."
flutter run -d chrome

# 清理
echo "🧹 清理进程..."
kill $SERVER_PID 