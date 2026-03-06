// 钢结构学习平台 - 后端API
// 运行命令: node server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 数据库初始化
const db = new sqlite3.Database('./steel.db');

// 初始化数据库表
db.serialize(() => {
    // 术语表
    db.run(`CREATE TABLE IF NOT EXISTS terms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        english TEXT NOT NULL,
        chinese TEXT NOT NULL,
        category TEXT,
        example_en TEXT,
        example_zh TEXT,
        image TEXT,
        difficulty INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 听力课程表
    db.run(`CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        title_en TEXT,
        level TEXT,
        duration TEXT,
        content_en TEXT,
        content_zh TEXT,
        vocabulary TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 用户学习进度
    db.run(`CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT DEFAULT 'default',
        term_id INTEGER,
        status TEXT DEFAULT 'learning',
        next_review DATE,
        review_count INTEGER DEFAULT 0,
        last_review DATETIME,
        FOREIGN KEY(term_id) REFERENCES terms(id)
    )`);

    // 每日学习记录
    db.run(`CREATE TABLE IF NOT EXISTS daily_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT DEFAULT 'default',
        date DATE UNIQUE,
        new_terms INTEGER DEFAULT 0,
        review_terms INTEGER DEFAULT 0,
        quiz_score INTEGER,
        time_spent INTEGER DEFAULT 0
    )`);

    console.log('✅ 数据库初始化完成');
});

// ============ API 路由 ============

// 获取所有术语
app.get('/api/terms', (req, res) => {
    const { category, difficulty, limit } = req.query;
    let sql = 'SELECT * FROM terms WHERE 1=1';
    const params = [];

    if (category) {
        sql += ' AND category = ?';
        params.push(category);
    }
    if (difficulty) {
        sql += ' AND difficulty <= ?';
        params.push(difficulty);
    }
    if (limit) {
        sql += ' LIMIT ?';
        params.push(limit);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, data: rows });
    });
});

// 获取今日复习任务 (基于艾宾浩斯记忆曲线)
app.get('/api/review/today', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    
    const sql = `
        SELECT t.*, p.next_review, p.review_count 
        FROM terms t
        LEFT JOIN progress p ON t.id = p.term_id
        WHERE p.next_review <= ? OR p.next_review IS NULL
        ORDER BY RANDOM()
        LIMIT 20
    `;
    
    db.all(sql, [today], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, data: rows });
    });
});

// 更新学习进度
app.post('/api/progress', (req, res) => {
    const { term_id, status, next_review } = req.body;
    
    const sql = `
        INSERT OR REPLACE INTO progress (term_id, status, next_review, last_review, review_count)
        VALUES (?, ?, ?, datetime('now'), 
            COALESCE((SELECT review_count FROM progress WHERE term_id = ?), 0) + 1)
    `;
    
    db.run(sql, [term_id, status, next_review, term_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID });
    });
});

// 获取学习统计
app.get('/api/stats', (req, res) => {
    const stats = {};
    
    db.get('SELECT COUNT(*) as total FROM terms', (err, row) => {
        stats.totalTerms = row.total;
        
        db.get('SELECT COUNT(*) as learned FROM progress WHERE status = "known"', (err, row) => {
            stats.learnedTerms = row.learned;
            
            db.get(`SELECT COUNT(*) as streak FROM (
                SELECT date FROM daily_records 
                WHERE date >= date('now', '-30 days')
                ORDER BY date DESC
            )`, (err, row) => {
                stats.streakDays = row.streak;
                res.json({ success: true, data: stats });
            });
        });
    });
});

// 获取所有课程
app.get('/api/lessons', (req, res) => {
    const { level } = req.query;
    let sql = 'SELECT * FROM lessons';
    const params = [];
    
    if (level) {
        sql += ' WHERE level = ?';
        params.push(level);
    }
    
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, data: rows });
    });
});

// 添加新术语 (管理员)
app.post('/api/terms', (req, res) => {
    const { english, chinese, category, example_en, example_zh, difficulty } = req.body;
    
    const sql = `
        INSERT INTO terms (english, chinese, category, example_en, example_zh, difficulty)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [english, chinese, category, example_en, example_zh, difficulty || 1], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID });
    });
});

// 记录每日学习
app.post('/api/daily', (req, res) => {
    const { new_terms, review_terms, quiz_score, time_spent } = req.body;
    const today = new Date().toISOString().split('T')[0];
    
    const sql = `
        INSERT INTO daily_records (date, new_terms, review_terms, quiz_score, time_spent)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(date) DO UPDATE SET
            new_terms = new_terms + excluded.new_terms,
            review_terms = review_terms + excluded.review_terms,
            quiz_score = COALESCE(excluded.quiz_score, quiz_score),
            time_spent = time_spent + excluded.time_spent
    `;
    
    db.run(sql, [today, new_terms || 0, review_terms || 0, quiz_score, time_spent || 0], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🏗️ 钢结构学习平台 API 服务         ║
║   端口: ${PORT}                          ║
║   前端: http://localhost:${PORT}/         ║
╚═══════════════════════════════════════╝
    `);
});
