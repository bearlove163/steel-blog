#!/bin/bash
# 钢结构网站自动更新脚本
# 每天自动执行：搜索→抓取→生成文章→推送

set -e

echo "========== $(date) 钢结构网站自动更新开始 =========="
cd /root/.openclaw/workspace/agents/新闻搜查官/steel-blog

# 1. 搜索热点新闻
echo "[1/5] 搜索热点新闻..."
python3 /root/.openclaw/workspace/agents/新闻搜查官/search_tavily.py > /tmp/steel_news_search.txt 2>&1 || true

# 提取有价值的新闻链接
NEWS_URL=$(grep -oP '链接：\Khttp[^\s]+' /tmp/steel_news_search.txt | head -1)

if [ -z "$NEWS_URL" ]; then
    echo "未找到新闻链接，跳过此次更新"
    exit 0
fi

echo "发现新闻: $NEWS_URL"

# 2. 抓取内容（通过Python脚本处理）
echo "[2/5] 抓取原文内容..."
python3 -c "
import subprocess
import sys
result = subprocess.run(['curl', '-s', '$NEWS_URL'], capture_output=True, text=True)
content = result.stdout[:5000]
# 提取标题
import re
title_match = re.search(r'<title>(.*?)</title>', content, re.I)
if title_match:
    print(title_match.group(1)[:200])
" > /tmp/article_title.txt 2>/dev/null || echo "新闻文章"

ARTICLE_TITLE=$(cat /tmp/article_title.txt)

# 3. 生成文章HTML（使用模板）
echo "[3/5] 生成文章页面..."
ARTICLE_NAME="article-$(date +%Y%m%d-%H%M%S).html"

# 复制模板并修改
cp article-aramco-stadium.html "$ARTICLE_NAME" 2>/dev/null || cp article-sofi-stadium.html "$ARTICLE_NAME"

# 4. 更新news.html
echo "[4/5] 更新新闻列表..."
# 添加到news.html（简单方式：添加到数组开头）
sed -i "/\/\/ News data/i\\
                {\\
                    id: $(date +%Y%m%d),\\
                    category: 'sports',\\
                    categoryName: '体育场馆',\\
                    title: '$ARTICLE_TITLE',\\
                    date: '$(date +%Y-%m-%d)',\\
                    source: '自动收集',\\
                    summary: '全球钢结构热点新闻自动更新',\\
                    tags: ['钢结构', '体育场馆'],\\
                    link: '$ARTICLE_NAME'\\
                }," news.html

# 5. 推送到GitHub
echo "[5/5] 推送到GitHub..."
git add -A
git commit -m "Auto: $(date +%Y-%m-%d) 更新钢结构新闻" || echo "无需提交"
export GH_TOKEN=$(gh auth token)
git push https://$GH_TOKEN@github.com/bearlove163/steel-blog.git main

echo "========== $(date) 更新完成！=========="
