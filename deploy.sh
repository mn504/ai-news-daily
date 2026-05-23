#!/bin/bash
set -e

echo "========================================"
echo "  AI News Daily 一键部署脚本"
echo "========================================"
echo ""

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否 root
if [ "$EUID" -eq 0 ]; then
   echo -e "${RED}请不要用 root 用户运行此脚本${NC}"
   echo "请用 ubuntu 用户登录后执行"
   exit 1
fi

# 获取用户输入
echo -e "${YELLOW}请设置数据库密码（记下来！）:${NC}"
read -s DB_PASSWORD
echo ""
echo -e "${YELLOW}请再次输入确认:${NC}"
read -s DB_PASSWORD_CONFIRM
echo ""

if [ "$DB_PASSWORD" != "$DB_PASSWORD_CONFIRM" ]; then
    echo -e "${RED}两次密码不一致，请重新运行脚本${NC}"
    exit 1
fi

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}密码不能为空${NC}"
    exit 1
fi

# 1. 更新系统
echo -e "${GREEN}[1/10] 更新系统...${NC}"
sudo apt update -qq && sudo apt upgrade -y -qq

# 2. 安装 Node.js 20
echo -e "${GREEN}[2/10] 安装 Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - >/dev/null 2>&1
sudo apt install -y -qq nodejs
node -v
npm -v

# 3. 安装 Git
echo -e "${GREEN}[3/10] 安装 Git...${NC}"
sudo apt install -y -qq git

# 4. 安装 PostgreSQL
echo -e "${GREEN}[4/10] 安装 PostgreSQL...${NC}"
sudo apt install -y -qq postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 5. 创建数据库和用户
echo -e "${GREEN}[5/10] 创建数据库...${NC}"
sudo -u postgres psql <<EOF
CREATE DATABASE ai_news;
CREATE USER ai_user WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE ai_news TO ai_user;
\q
EOF

# 6. 下载代码
echo -e "${GREEN}[6/10] 下载代码...${NC}"
cd ~
if [ -d "ai-news-daily" ]; then
    echo "代码已存在，更新中..."
    cd ai-news-daily
    git pull origin main
else
    git clone https://github.com/mn504/ai-news-daily.git
    cd ai-news-daily
fi

# 7. 安装依赖并构建
echo -e "${GREEN}[7/10] 安装依赖并构建...${NC}"
npm install
npm run build

# 8. 创建环境变量文件
echo -e "${GREEN}[8/10] 配置环境变量...${NC}"
cat > .env <<EOF
DATABASE_URL=postgresql://ai_user:$DB_PASSWORD@localhost:5432/ai_news
JWT_SECRET=ainews-jwt-secret-key-2024-$(openssl rand -hex 8)
CRON_SECRET=ainews-cron-key
VITE_APP_ID=255202
VITE_KIMI_AUTH_URL=https://kimi.com/login/oauth/authorize
PORT=3000
EOF

# 9. 初始化数据库
echo -e "${GREEN}[9/10] 初始化数据库...${NC}"
npx drizzle-kit push --config=drizzle.config.ts 2>/dev/null || npm run db:push 2>/dev/null || echo "数据库表已存在或需要手动执行"
npx tsx db/seed.ts 2>/dev/null || echo "种子数据可能已存在"

# 10. 安装 PM2 并启动
echo -e "${GREEN}[10/10] 启动服务...${NC}"
sudo npm install -g pm2
pm2 delete ai-news 2>/dev/null || true
pm2 start npm --name "ai-news" -- start
pm2 startup
pm2 save

echo ""
echo "========================================"
echo -e "${GREEN}  ✅ 部署完成！${NC}"
echo "========================================"
echo ""
echo -e "${YELLOW}你的数据库密码:${NC} $DB_PASSWORD"
echo -e "${YELLOW}你的服务器公网IP:${NC}"
curl -s ifconfig.me || echo "请在腾讯云控制台查看"
echo ""
echo -e "${GREEN}网站访问地址:${NC}"
echo -e "  http://你的公网IP:3000"
echo ""
echo -e "${GREEN}管理后台:${NC}"
echo -e "  http://你的公网IP:3000/admin"
echo ""
echo -e "${YELLOW}记得在腾讯云防火墙开放 3000 端口！${NC}"
echo ""
echo -e "${GREEN}cron-job 定时抓取 URL:${NC}"
echo -e "  http://你的公网IP:3000/api/cron/scrape?secret=ainews-cron-key"
echo ""
