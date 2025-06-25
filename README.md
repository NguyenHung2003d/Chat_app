# Chat App 💬

Ứng dụng chat real-time được xây dựng với công nghệ hiện đại, cho phép người dùng trò chuyện trực tuyến một cách dễ dàng và tiện lợi.

## 🚀 Tính năng

- **Chat real-time**: Tin nhắn được gửi và nhận ngay lập tức
- **Giao diện thân thiện**: Thiết kế đơn giản, dễ sử dụng
- **Đa thiết bị**: Hoạt động tốt trên desktop và mobile
- **Bảo mật**: Mã hóa tin nhắn an toàn
- **Emoji & Media**: Hỗ trợ emoji và chia sẻ hình ảnh

## 🛠️ Công nghệ sử dụng

- **Frontend**: Vite + Vanilla JavaScript/React
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Build Tool**: Vite (cho frontend)

## 📋 Yêu cầu hệ thống

- Node.js (phiên bản 14 trở lên)
- MongoDB
- npm hoặc yarn
- Browser hiện đại (Chrome, Firefox, Safari, Edge)

## 🔧 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/NguyenHung2003d/Chat_app.git
cd Chat_app
```

### 2. Cài đặt dependencies

#### Backend
```bash
cd backend
pnpm install
```

#### Frontend
```bash
cd frontend
pnpm install
```

### 4. Chạy ứng dụng

#### Backend
```bash
cd backend
# Development mode
npm run dev
# hoặc
npm start
```

#### Frontend
```bash
cd frontend
# Development mode với hot reload
pnpm run dev

# Build production
pnpm run build

# Preview production build
pnpm run preview
```

- Backend sẽ chạy tại `http://localhost:5000`
- Frontend sẽ chạy tại `http://localhost:5173`
- 
## 📖 Hướng dẫn sử dụng

### Đăng ký tài khoản
1. Truy cập trang chủ
2. Click "Đăng ký"
3. Điền thông tin cần thiết
4. Xác thực email (nếu có)

### Bắt đầu chat
1. Đăng nhập vào tài khoản
2. Chọn người dùng hoặc tạo nhóm chat
3. Bắt đầu trò chuyện

### Tính năng nâng cao
- Tạo nhóm chat
- Chia sẻ file và hình ảnh
- Tìm kiếm tin nhắn
- Thông báo real-time

## 🚀 Deployment
```bash
# Đăng nhập Heroku
heroku login

# Tạo app mới cho backend
heroku create your-chat-app-backend
