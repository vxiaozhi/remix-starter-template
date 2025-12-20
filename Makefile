.PHONY: help install dev build start preview deploy lint typecheck check clean

# 默认目标：显示帮助信息
help:
	@echo "可用命令："
	@echo "  make install      - 安装依赖"
	@echo "  make dev          - 启动开发服务器"
	@echo "  make build        - 构建生产版本"
	@echo "  make start        - 启动生产服务器（使用 wrangler dev）"
	@echo "  make preview      - 构建并预览生产版本"
	@echo "  make deploy       - 部署到 Cloudflare Workers"
	@echo "  make lint         - 运行 ESLint 检查"
	@echo "  make typecheck    - 运行 TypeScript 类型检查"
	@echo "  make check        - 运行完整检查（类型检查 + 构建 + 部署预演）"
	@echo "  make typegen       - 生成 Cloudflare Workers 类型"
	@echo "  make clean        - 清理构建产物和缓存"
	@echo "  make help         - 显示此帮助信息"

# 安装依赖
install:
	@echo "正在安装依赖..."
	npm install

# 启动开发服务器
dev:
	@echo "启动开发服务器..."
	npm run dev

# 构建生产版本
build:
	@echo "构建生产版本..."
	npm run build

# 启动生产服务器
start:
	@echo "启动生产服务器..."
	npm run start

# 构建并预览
preview:
	@echo "构建并预览生产版本..."
	npm run preview

# 部署到 Cloudflare Workers
deploy:
	@echo "部署到 Cloudflare Workers..."
	npm run deploy

# 运行 ESLint 检查
lint:
	@echo "运行 ESLint 检查..."
	npm run lint

# 运行 TypeScript 类型检查
typecheck:
	@echo "运行 TypeScript 类型检查..."
	npm run typecheck

# 运行完整检查
check:
	@echo "运行完整检查..."
	npm run check

# 生成 Cloudflare Workers 类型
typegen:
	@echo "生成 Cloudflare Workers 类型..."
	npm run typegen

# 清理构建产物和缓存
clean:
	@echo "清理构建产物和缓存..."
	rm -rf .cache
	rm -rf build
	rm -rf dist
	rm -rf node_modules/.cache
	rm -rf .remix
	@echo "清理完成！"

# 安装并启动开发服务器
setup: install dev

# 快速检查（类型检查 + lint）
quick-check: typecheck lint
	@echo "快速检查完成！"

