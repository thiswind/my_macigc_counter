# Flutter + TiDB 每日按钮应用

这是一个 Flutter 应用，通过 Node.js 后端连接到 TiDB 云数据库，实现每日按钮点击记录功能。

## 功能特性

- ✅ **真实数据库连接**: 连接到 TiDB 云数据库
- ✅ **自动建表**: 启动时自动检查并创建必要的数据表
- ✅ **按钮点击记录**: 每次点击都会在数据库中插入一条记录
- ✅ **实时反馈**: 显示操作成功/失败状态
- ✅ **主题切换**: 支持深色/浅色主题切换

## 技术栈

### 前端
- **Flutter**: 跨平台 UI 框架
- **Dart**: 编程语言
- **HTTP**: 网络请求

### 后端
- **Node.js**: 服务器运行时
- **Express**: Web 框架
- **MySQL2**: 数据库连接器
- **CORS**: 跨域支持

### 数据库
- **TiDB Cloud**: 云原生分布式数据库

## 项目结构

```
my_macigc_counter/
├── lib/
│   └── main.dart          # Flutter 主应用
├── server.js              # Node.js 后端服务器
├── package.json           # Node.js 依赖配置
├── pubspec.yaml           # Flutter 依赖配置
├── start.sh               # 一键启动脚本
└── README.md              # 项目说明
```

## 数据库表结构

```sql
CREATE TABLE press_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message VARCHAR(255) NOT NULL,
  timestamp DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 快速开始

### 方法一：使用启动脚本（推荐）

```bash
./start.sh
```

### 方法二：手动启动

1. **启动后端服务器**
```bash
npm install
node server.js
```

2. **启动 Flutter 应用**（新终端窗口）
```bash
flutter run -d chrome
```

## API 接口

### 后端服务器运行在 `http://localhost:3000`

- **POST /api/press** - 记录按钮点击
- **GET /api/records** - 获取所有记录
- **GET /health** - 健康检查

### 示例请求

```bash
# 记录按钮点击
curl -X POST http://localhost:3000/api/press

# 查看所有记录
curl http://localhost:3000/api/records

# 健康检查
curl http://localhost:3000/health
```

## 数据库配置

数据库连接信息在 `server.js` 中配置：

```javascript
const dbConfig = {
  host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '41CJWSEtMf9x4Bs.root',
  password: 'otB5UyJvqsgoYQjN',
  database: 'test',
  ssl: { rejectUnauthorized: false }
};
```

## 使用说明

1. 启动应用后，在浏览器中会打开 Flutter Web 应用
2. 点击「每日按钮」会向数据库插入一条记录
3. 成功后会显示绿色提示消息，包含记录 ID
4. 失败时会显示红色错误消息
5. 可以通过主题切换开关改变应用外观

## 故障排除

### 常见问题

1. **后端服务器启动失败**
   - 检查 Node.js 是否安装
   - 检查端口 3000 是否被占用
   - 检查数据库连接信息是否正确

2. **Flutter 应用无法连接后端**
   - 确保后端服务器正在运行
   - 检查 CORS 配置
   - 确认 API 地址是否正确

3. **数据库连接失败**
   - 检查网络连接
   - 验证数据库凭据
   - 确认 TiDB 服务状态

## 开发者信息

- **前端**: Flutter Web 应用
- **后端**: Node.js + Express API 服务器
- **数据库**: TiDB Cloud 云数据库
- **部署**: 本地开发环境

## 许可证

MIT License
