# Dockerfile
FROM node:18-alpine

# Cài các gói để biên dịch native module như bcrypt
RUN apk add --no-cache make gcc g++ python3

WORKDIR /app

# Chỉ copy file cần thiết để install trước (tăng tốc độ build nếu code thay đổi)
COPY package*.json ./

RUN npm install

# Sau khi cài xong node_modules, copy toàn bộ source code
COPY . .

RUN npm run build

CMD ["node", "dist/main"]
