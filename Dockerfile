# 多階段構建過程
# 階段 1: 建置應用
FROM node:18-alpine AS build

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安裝依賴
RUN npm ci

# 複製所有源碼
COPY . .

# 構建應用
RUN npm run build

# 階段 2: 使用輕量級的 Nginx 提供靜態文件
FROM nginx:alpine

# 複製 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 從建置階段複製構建的文件
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 啟動 Nginx 服務
CMD ["nginx", "-g", "daemon off;"]