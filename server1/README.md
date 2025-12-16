# Tadreej Server API Documentation

## 📁 Project Structure

```
server/
├── config/              # Configuration files
│   ├── db.js           # MongoDB connection
│   └── mailer.js       # Nodemailer configuration
├── controllers/         # Business logic layer
│   ├── authController.js
│   └── postController.js
├── middlewares/         # Express middlewares
│   ├── errorHandler.js
│   └── validateRequest.js
├── models/             # Mongoose schemas
│   ├── UserModel.js
│   └── PostModel.js
├── routes/             # API route definitions
│   ├── authRoutes.js
│   └── postRoutes.js
├── services/           # Reusable business logic
│   └── emailService.js
├── .env                # Environment variables
├── package.json
└── server.js           # Main entry point
```

## 🚀 Getting Started

### Installation
```bash
cd server
npm install
```

### Environment Variables
Create a `.env` file in the server root:

```env
# MongoDB
MONGO_URI=mongodb+srv://your-connection-string

# Server
PORT=5000
NODE_ENV=development

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@tadreej.com
```

### Run the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Base URL
```
http://localhost:5000
```

### Health Check
```http
GET /
```
Response:
```json
{
  "message": "Tadreej API Server",
  "status": "Running",
  "version": "1.0.0"
}
```

---

### Authentication Routes (`/api/auth`)

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "uname": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "profilepic": "profile.jpg" // optional
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400`: Missing required fields
- `409`: User already exists

---

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "user": {
    "_id": "user-id",
    "uname": "John Doe",
    "email": "john@example.com",
    "profilepic": "profile.jpg"
  },
  "message": "Login successful"
}
```

**Error Responses:**
- `401`: Invalid credentials
- `404`: User not found

---

#### 3. Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Reset code sent to your email"
}
```

**Note:** OTP expires in 2 minutes.

---

#### 4. Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "OTP verified successfully"
}
```

**Error Responses:**
- `400`: Invalid or expired code
- `404`: User not found

---

#### 5. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

---

### Post Routes (`/api/posts`)

#### Save Post
```http
POST /api/posts/save
Content-Type: application/json

{
  "postMsg": "This is a test post",
  "email": "john@example.com",
  "lat": 40.7128,     // optional
  "lng": -74.0060     // optional
}
```

**Success Response (201):**
```json
{
  "message": "Post saved successfully",
  "post": {
    "_id": "post-id",
    "postMsg": "This is a test post",
    "email": "john@example.com",
    "lat": 40.7128,
    "lng": -74.0060,
    "createdAt": "2025-12-10T...",
    "updatedAt": "2025-12-10T..."
  }
}
```

---

## 🏗️ Architecture Patterns

### MVC (Model-View-Controller)
- **Models**: Database schemas (Mongoose)
- **Controllers**: Business logic for each route
- **Routes**: API endpoint definitions

### Separation of Concerns
- **Config**: Database and external service configuration
- **Services**: Reusable business logic (e.g., email sending)
- **Middlewares**: Request validation and error handling

### Benefits
1. **Scalability**: Easy to add new features without touching existing code
2. **Maintainability**: Clear structure makes debugging easier
3. **Testability**: Each layer can be tested independently
4. **Reusability**: Services and middlewares can be reused across routes

---

## 🔐 Security Best Practices

1. **Password Hashing**: Using bcrypt with salt rounds
2. **OTP Expiration**: Reset codes expire in 2 minutes
3. **Input Validation**: Middleware validates all requests
4. **Error Handling**: Consistent error responses, no sensitive info leaked
5. **CORS**: Configured to accept requests from frontend

---

## 📝 Future Enhancements

1. **JWT Authentication**: Add token-based auth for session management
2. **Rate Limiting**: Prevent brute force attacks
3. **Logging**: Add Winston or Morgan for request logging
4. **File Upload**: Add multer for profile picture uploads
5. **API Versioning**: e.g., `/api/v1/auth`, `/api/v2/auth`
6. **Database Indexing**: Optimize queries with proper indexes
7. **Caching**: Add Redis for frequently accessed data
8. **Testing**: Add Jest/Mocha for unit and integration tests

---

## 🐛 Error Handling

All endpoints follow a consistent error response format:

```json
{
  "message": "Error description"
}
```

HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

---

## 📞 Support

For issues or questions, please contact the development team.
