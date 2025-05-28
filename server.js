const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接配置
const dbConfig = {
  host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '41CJWSEtMf9x4Bs.root',
  password: 'otB5UyJvqsgoYQjN',
  database: 'test',
  ssl: {
    rejectUnauthorized: false
  }
};

// 创建表的函数
async function createTableIfNotExists() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS press_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        message VARCHAR(255) NOT NULL,
        timestamp DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createTableSQL);
    console.log('表 press_records 检查/创建完成');
    
  } catch (error) {
    console.error('创建表时出错:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// API 路由：插入按钮点击记录
app.post('/api/press', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const now = new Date();
    const insertSQL = 'INSERT INTO press_records (message, timestamp) VALUES (?, ?)';
    const [result] = await connection.execute(insertSQL, ['press', now]);
    
    console.log(`插入记录成功: ID=${result.insertId}, 时间=${now.toISOString()}`);
    
    res.json({
      success: true,
      message: '成功记录按钮点击！',
      data: {
        id: result.insertId,
        timestamp: now.toISOString()
      }
    });
    
  } catch (error) {
    console.error('插入数据时出错:', error);
    res.status(500).json({
      success: false,
      message: '数据库操作失败',
      error: error.message
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// API 路由：获取所有记录
app.get('/api/records', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM press_records ORDER BY timestamp DESC LIMIT 50'
    );
    
    res.json({
      success: true,
      data: rows
    });
    
  } catch (error) {
    console.error('查询数据时出错:', error);
    res.status(500).json({
      success: false,
      message: '查询失败',
      error: error.message
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 启动服务器
async function startServer() {
  try {
    // 启动时创建表
    await createTableIfNotExists();
    
    app.listen(port, () => {
      console.log(`服务器运行在 http://localhost:${port}`);
      console.log('API 端点:');
      console.log('  POST /api/press - 记录按钮点击');
      console.log('  GET /api/records - 获取所有记录');
      console.log('  GET /health - 健康检查');
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

startServer(); 