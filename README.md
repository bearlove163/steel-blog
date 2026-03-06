# 钢结构学习平台 - 架构说明

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────┐
│                 前端 (GitHub Pages)              │
│  - index.html (闪卡学习)                       │
│  - listening.html (听力)                      │
│  - glossary.html (术语表)                     │
│  - news.html (新闻)                           │
└─────────────────────┬───────────────────────────┘
                      │ API Calls
                      ↓
┌─────────────────────────────────────────────────┐
│              后端 API (Node.js)                 │
│  - /api/terms      - 术语管理                  │
│  - /api/lessons    - 课程管理                  │
│  - /api/progress   - 学习进度                  │
│  - /api/stats      - 学习统计                  │
│  - /api/review     - 智能复习                  │
└─────────────────────┬───────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────┐
│              数据库 (SQLite)                     │
│  - terms          - 术语表                      │
│  - lessons        - 课程表                      │
│  - progress       - 学习进度                    │
│  - daily_records  - 每日记录                    │
└─────────────────────────────────────────────────┘
```

## 🚀 部署指南

### 开发环境 (本地运行)

```bash
# 1. 安装依赖
npm install

# 2. 启动后端API
npm start

# 3. 访问
# 前端: http://localhost:3000
# API: http://localhost:3000/api/terms
```

### 生产环境 (推荐)

#### 方案1: Vercel + Railway (免费)
- 前端: Vercel (自动部署)
- 后端: Railway (Node.js)
- 数据库: Railway (SQLite)

#### 方案2: 阿里云
- 前端: OSS + CDN
- 后端: ECS / 函数计算
- 数据库: RDS MySQL

#### 方案3: Docker部署
```bash
docker build -t steel-learning .
docker run -p 3000:3000 steel-learning
```

## 📊 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/terms | 获取所有术语 |
| GET | /api/terms?category=structure | 按分类筛选 |
| GET | /api/review/today | 获取今日复习 |
| POST | /api/progress | 更新学习进度 |
| GET | /api/stats | 获取学习统计 |
| GET | /api/lessons | 获取课程列表 |
| POST | /api/terms | 添加新术语 |

## 🗃️ 数据库表

### terms (术语表)
```sql
id, english, chinese, category, 
example_en, example_zh, image, difficulty
```

### lessons (课程表)
```sql
id, title, title_en, level, duration,
content_en, content_zh, vocabulary
```

### progress (学习进度)
```sql
id, user_id, term_id, status,
next_review, review_count, last_review
```

## 🎯 后续功能

- [ ] 用户登录/注册
- [ ] 艾宾浩斯记忆曲线
- [ ] 每日学习提醒
- [ ] 学习报告生成
- [ ] 闯关模式
- [ ] 社区分享

## 📝 许可证

MIT License
