# 🚀 Aurelane Gems E-Commerce - Complete Backend API Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Base URL & Setup](#base-url--setup)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Environment Variables](#environment-variables)

---

## Overview

This document provides complete API specifications for the Aurelane Gems E-Commerce platform. All endpoints follow RESTful conventions and return JSON responses.

**Current Backend URL**: `https://gems-backend-u.onrender.com/api`

**Response Format**: All API responses follow this structure:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { ... },
  "error": "Error details (if applicable)"
}
```

---

## Base URL & Setup

```javascript
const API_BASE_URL = 'https://gems-backend-u.onrender.com/api';
// or for local development
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## Authentication

### Authentication Flow
- JWT token-based authentication
- Token stored in `localStorage` with key: `token`
- Token sent in request headers: `Authorization: Bearer <token>`

### Headers Required
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>'
}
```

---

## API Endpoints

### 🔐 Authentication APIs

#### 1. **POST** `/auth/signup`
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phoneNumber": "9876543210",
  "role": "buyer" // or "seller"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer",
    "phoneNumber": "9876543210"
  }
}
```

---

#### 2. **POST** `/auth/login`
Login existing user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

---

#### 3. **POST** `/auth/forgot-password`
Send password reset email

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

---

#### 4. **POST** `/auth/reset-password/:token`
Reset password using token

**Request Body:**
```json
{
  "password": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

#### 5. **GET** `/auth/verify-email/:token`
Verify user email

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### 💎 Gem/Product APIs

#### 6. **POST** `/gems`
Add a new gem (Requires authentication - seller/admin only)

**Request Body:**
```json
{
  "name": "Natural Blue Sapphire",
  "category": "Sapphire",
  "description": "Premium quality natural blue sapphire",
  "price": 75000,
  "discount": 10,
  "discountType": "percentage", // or "fixed"
  "sizeWeight": 6.2,
  "sizeUnit": "carat",
  "stock": 5,
  "images": ["url1", "url2", "url3"],
  "availability": "available", // or "out_of_stock"
  "whomToUse": ["Taurus", "Libra"],
  "benefits": ["Brings wisdom", "Enhances focus"],
  "origin": "Ceylon",
  "certification": "GIA Certified"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Gem added successfully",
  "data": {
    "id": "gem_id",
    "name": "Natural Blue Sapphire",
    // ... all gem data
    "seller": "seller_id",
    "createdAt": "2025-10-16T..."
  }
}
```

---

#### 7. **GET** `/gems`
Get all gems with filters and pagination

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `search` - Search by name
- `category` - Filter by category (comma-separated for multiple)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `sort` - Sort by: `newest`, `oldest`, `price-low`, `price-high`

**Example Request:**
```
GET /gems?page=1&limit=12&category=Sapphire,Ruby&minPrice=10000&maxPrice=100000&sort=price-low
```

**Response:**
```json
{
  "success": true,
  "gems": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

#### 8. **GET** `/gems/:id`
Get gem by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "gem_id",
    "name": "Natural Blue Sapphire",
    "category": "Sapphire",
    "price": 75000,
    "discount": 10,
    "discountType": "percentage",
    "images": ["url1", "url2"],
    "seller": {
      "id": "seller_id",
      "name": "Diamond Dreams",
      "rating": 4.8
    },
    // ... all gem details
  }
}
```

---

#### 9. **PUT** `/gems/:id`
Update gem (Requires authentication - owner/admin only)

**Request Body:** (Same as POST /gems, partial updates allowed)

**Response:**
```json
{
  "success": true,
  "message": "Gem updated successfully",
  "data": { /* updated gem data */ }
}
```

---

#### 10. **DELETE** `/gems/:id`
Delete gem (Requires authentication - owner/admin only)

**Response:**
```json
{
  "success": true,
  "message": "Gem deleted successfully"
}
```

---

#### 11. **GET** `/gems/categories`
Get all gem categories

**Response:**
```json
{
  "success": true,
  "data": [
    "Ruby", "Sapphire", "Emerald", "Diamond", "Pearl",
    "Coral", "Yellow Sapphire", "Hessonite", "Cat's Eye",
    "Moonstone", "Opal", "Turquoise"
  ]
}
```

---

#### 12. **GET** `/gems/category/:category`
Get gems by specific category

**Response:**
```json
{
  "success": true,
  "data": [...gems array]
}
```

---

#### 13. **GET** `/gems/zodiac/:zodiacSign`
Get gems suitable for a zodiac sign

**Response:**
```json
{
  "success": true,
  "data": [...gems array]
}
```

---

### 🛒 Cart APIs

#### 14. **POST** `/cart/add`
Add item to cart (Requires authentication)

**Request Body:**
```json
{
  "gemId": "gem_id",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "cart": {
    "items": [...],
    "totalItems": 3,
    "totalAmount": 150000
  }
}
```

---

#### 15. **GET** `/cart`
Get user's cart (Requires authentication)

**Response:**
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "gemId": "gem_id",
        "gem": { /* gem details */ },
        "quantity": 2,
        "price": 75000
      }
    ],
    "totalItems": 2,
    "subtotal": 150000
  }
}
```

---

#### 16. **PUT** `/cart/update/:gemId`
Update cart item quantity (Requires authentication)

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart updated",
  "cart": { /* updated cart */ }
}
```

---

#### 17. **DELETE** `/cart/remove/:gemId`
Remove item from cart (Requires authentication)

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

#### 18. **DELETE** `/cart/clear`
Clear entire cart (Requires authentication)

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

### 📦 Order APIs

#### 19. **POST** `/orders`
Create new order (Requires authentication)

**Request Body:**
```json
{
  "items": [
    {
      "gemId": "gem_id",
      "quantity": 2,
      "price": 75000
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main Street, Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "cod", // or "online"
  "orderNotes": "Please deliver after 6 PM",
  "totalAmount": 150500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "ORD123456",
    "order": {
      "id": "order_id",
      "items": [...],
      "totalAmount": 150500,
      "status": "pending",
      "paymentMethod": "cod",
      "createdAt": "2025-10-16T..."
    }
  }
}
```

---

#### 20. **GET** `/orders`
Get user's orders (Requires authentication)

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_id",
      "orderId": "ORD123456",
      "items": [...],
      "totalAmount": 150500,
      "status": "Processing",
      "paymentMethod": "cod",
      "shippingAddress": {...},
      "createdAt": "2025-10-16T...",
      "updatedAt": "2025-10-16T..."
    }
  ]
}
```

---

#### 21. **GET** `/orders/:orderId`
Get specific order details (Requires authentication)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "orderId": "ORD123456",
    "items": [
      {
        "gemId": "gem_id",
        "gem": { /* gem details */ },
        "quantity": 2,
        "price": 75000
      }
    ],
    "totalAmount": 150500,
    "status": "Processing",
    "paymentMethod": "cod",
    "shippingAddress": {...},
    "createdAt": "2025-10-16T..."
  }
}
```

---

#### 22. **PUT** `/orders/:orderId/cancel`
Cancel order (Requires authentication)

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": {
    "id": "order_id",
    "status": "Cancelled",
    "cancelReason": "Changed my mind"
  }
}
```

---

#### 23. **GET** `/orders/:orderId/track`
Get order tracking details (Requires authentication)

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_id",
    "status": "Shipped",
    "trackingHistory": {
      "placed": "2025-10-16T10:00:00Z",
      "confirmed": "2025-10-16T11:00:00Z",
      "processing": "2025-10-16T14:00:00Z",
      "shipped": "2025-10-17T09:00:00Z"
    },
    "expectedDelivery": "2025-10-22T...",
    "shippingAddress": {...},
    "items": [...]
  }
}
```

---

#### 24. **GET** `/orders/:orderId/invoice`
Download order invoice (Requires authentication)

**Response:** Binary PDF file

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="Invoice_ORD123456.pdf"
```

---

### 📱 OTP APIs

#### 25. **POST** `/otp/send`
Send OTP to phone number

**Request Body:**
```json
{
  "phoneNumber": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otpId": "otp_session_id"
}
```

---

#### 26. **POST** `/otp/verify`
Verify OTP

**Request Body:**
```json
{
  "phoneNumber": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "verified": true
}
```

---

### ❤️ Wishlist APIs

#### 27. **POST** `/wishlist/add`
Add item to wishlist (Requires authentication)

**Request Body:**
```json
{
  "gemId": "gem_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to wishlist"
}
```

---

#### 28. **GET** `/wishlist`
Get user's wishlist (Requires authentication)

**Response:**
```json
{
  "success": true,
  "wishlist": [
    {
      "id": "gem_id",
      "name": "Natural Blue Sapphire",
      "price": 75000,
      "images": ["url1"],
      "category": "Sapphire",
      // ... other gem details
    }
  ]
}
```

---

#### 29. **DELETE** `/wishlist/remove/:gemId`
Remove item from wishlist (Requires authentication)

**Response:**
```json
{
  "success": true,
  "message": "Item removed from wishlist"
}
```

---

#### 30. **DELETE** `/wishlist/clear`
Clear entire wishlist (Requires authentication)

**Response:**
```json
{
  "success": true,
  "message": "Wishlist cleared"
}
```

---

#### 31. **GET** `/wishlist/check/:gemId`
Check if item is in wishlist (Requires authentication)

**Response:**
```json
{
  "success": true,
  "isInWishlist": true
}
```

---

### 👤 Seller APIs

#### 32. **GET** `/seller/profile`
Get seller profile (Requires authentication - seller only)

**Response:**
```json
{
  "success": true,
  "seller": {
    "id": "seller_id",
    "fullName": "Diamond Dreams",
    "email": "seller@example.com",
    "shopName": "Diamond Dreams Jewellers",
    "phone": "9876543210",
    "address": {
      "street": "123 Gem Market",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "isVerified": true,
    "rating": 4.8,
    "totalGems": 25,
    "totalOrders": 150,
    "createdAt": "2023-01-15T..."
  }
}
```

---

#### 33. **PUT** `/seller/profile`
Update seller profile (Requires authentication - seller only)

**Request Body:**
```json
{
  "fullName": "Diamond Dreams Updated",
  "shopName": "Diamond Dreams Jewellers",
  "phone": "9876543210",
  "address": {
    "street": "123 Gem Market",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "description": "Premium gemstones seller",
  "businessLicense": "LICENSE123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "seller": { /* updated seller data */ }
}
```

---

### 👨‍💼 Admin APIs

#### 34. **GET** `/admin/sellers`
Get all sellers (Requires authentication - admin only)

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status: `pending`, `approved`, `rejected`
- `search` - Search by name or email

**Response:**
```json
{
  "success": true,
  "sellers": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25
  }
}
```

---

#### 35. **GET** `/admin/sellers/:sellerId`
Get seller by ID (Requires authentication - admin only)

**Response:**
```json
{
  "success": true,
  "seller": { /* seller details */ },
  "gems": [ /* seller's gems */ ]
}
```

---

#### 36. **PUT** `/admin/sellers/:sellerId/status`
Update seller status (Requires authentication - admin only)

**Request Body:**
```json
{
  "status": "approved" // or "rejected", "suspended"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Seller status updated",
  "seller": { /* updated seller */ }
}
```

---

#### 37. **DELETE** `/admin/sellers/:sellerId`
Delete seller (Requires authentication - admin only)

**Response:**
```json
{
  "success": true,
  "message": "Seller deleted successfully"
}
```

---

#### 38. **GET** `/admin/orders`
Get all orders (Requires authentication - admin only)

**Query Parameters:**
- `page`, `limit`
- `status` - Filter by order status
- `startDate`, `endDate` - Date range filter

**Response:**
```json
{
  "success": true,
  "orders": [...],
  "pagination": {...}
}
```

---

#### 39. **GET** `/admin/dashboard/stats`
Get dashboard statistics (Requires authentication - admin only)

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1500,
    "totalSellers": 85,
    "totalGems": 450,
    "totalOrders": 2340,
    "totalRevenue": 15600000,
    "pendingSellers": 12,
    "recentOrders": [...],
    "topSellingGems": [...]
  }
}
```

---

#### 40. **GET** `/health`
Health check endpoint

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-16T..."
}
```

---

## Data Models

### User Model
```javascript
{
  id: String,
  name: String,
  email: String (unique),
  password: String (hashed),
  phoneNumber: String,
  role: String (enum: ['buyer', 'seller', 'admin']),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Gem Model
```javascript
{
  id: String,
  name: String,
  category: String,
  description: String,
  price: Number,
  discount: Number,
  discountType: String (enum: ['percentage', 'fixed']),
  sizeWeight: Number,
  sizeUnit: String,
  stock: Number,
  images: [String],
  allImages: [String], // alias for images
  availability: String (enum: ['available', 'out_of_stock']),
  whomToUse: [String], // zodiac signs
  benefits: [String],
  origin: String,
  certification: String,
  seller: ObjectId (ref: User),
  rating: Number,
  reviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  id: String,
  orderId: String (unique),
  user: ObjectId (ref: User),
  items: [{
    gemId: ObjectId,
    gem: Object, // populated gem data
    quantity: Number,
    price: Number
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: String (enum: ['cod', 'online']),
  paymentStatus: String (enum: ['pending', 'paid', 'failed']),
  status: String (enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  subtotal: Number,
  shipping: Number,
  discount: Number,
  totalAmount: Number,
  orderNotes: String,
  cancelReason: String,
  trackingHistory: {
    placed: Date,
    confirmed: Date,
    processing: Date,
    shipped: Date,
    delivered: Date
  },
  expectedDelivery: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Seller Profile Model
```javascript
{
  id: String,
  user: ObjectId (ref: User),
  fullName: String,
  shopName: String,
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  description: String,
  businessLicense: String,
  isVerified: Boolean,
  status: String (enum: ['pending', 'approved', 'rejected', 'suspended']),
  rating: Number,
  totalGems: Number,
  totalOrders: Number,
  totalSales: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### HTTP Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **409** - Conflict (duplicate data)
- **500** - Internal Server Error

### Common Error Messages
```javascript
// Authentication Errors
"Invalid credentials"
"Token expired"
"Unauthorized access"

// Validation Errors
"Email already exists"
"Invalid email format"
"Password must be at least 6 characters"

// Resource Errors
"Gem not found"
"Order not found"
"Insufficient stock"

// Permission Errors
"Only seller can add gems"
"Admin access required"
"Cannot modify other user's data"
```

---

## Environment Variables

Create a `.env` file in your backend root:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aurelane_gems

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_EXPIRE=7d

# Email Configuration (for password reset, OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# SMS/OTP Service (Twilio, MSG91, etc.)
OTP_SERVICE_API_KEY=your_otp_service_key
OTP_SERVICE_SENDER_ID=AURELANE

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Stripe (if using Stripe)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

---

## Implementation Notes

### 1. **Authentication Middleware**
```javascript
// Protect routes that require authentication
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
```

### 2. **Role-Based Access Control**
```javascript
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access forbidden' 
      });
    }
    next();
  };
};
```

### 3. **Pagination Helper**
```javascript
const paginate = (query, page = 1, limit = 12) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};
```

### 4. **Payment Integration (Razorpay)**
```javascript
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
const razorpayOrder = await razorpay.orders.create({
  amount: totalAmount * 100, // amount in paise
  currency: 'INR',
  receipt: orderId
});
```

### 5. **Image Upload (Cloudinary)**
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image
const result = await cloudinary.uploader.upload(imagePath, {
  folder: 'aurelane_gems',
  transformation: [
    { width: 800, height: 800, crop: 'limit' }
  ]
});
```

---

## Testing the APIs

### Using Postman/Thunder Client

#### Example: Create Order
```
POST https://gems-backend-u.onrender.com/api/orders
Headers:
  Authorization: Bearer your_jwt_token
  Content-Type: application/json

Body:
{
  "items": [
    {
      "gemId": "67091234abcd5678ef901234",
      "quantity": 2,
      "price": 75000
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "cod",
  "totalAmount": 150500
}
```

---

## Database Indexes (Recommended)

```javascript
// User Collection
email: unique index
role: index

// Gem Collection
seller: index
category: index
price: index
createdAt: index (descending)

// Order Collection
user: index
orderId: unique index
status: index
createdAt: index (descending)

// Wishlist Collection (if separate)
user: index
gemId: index
compound index: [user, gemId]
```

---

## Security Best Practices

1. **Password Hashing**: Use bcrypt with salt rounds >= 10
2. **JWT Expiration**: Set reasonable expiration times (7 days)
3. **Rate Limiting**: Implement rate limiting for login/signup APIs
4. **Input Validation**: Validate all inputs using express-validator or joi
5. **SQL Injection**: Use parameterized queries (MongoDB is safe by default)
6. **CORS**: Configure CORS to allow only your frontend domain
7. **Helmet**: Use helmet middleware for security headers
8. **Data Sanitization**: Sanitize user inputs to prevent XSS

---

## Performance Optimization

1. **Database Queries**: Use `.select()` to fetch only required fields
2. **Pagination**: Always paginate large data sets
3. **Caching**: Implement Redis caching for frequently accessed data
4. **Image Optimization**: Compress and resize images before storing
5. **CDN**: Use CDN for serving static assets
6. **Database Indexes**: Create proper indexes on frequently queried fields

---

## Support & Contact

**Frontend Developer**: Naman
**Backend Implementation**: To be integrated by backend team
**Deadline**: Before Diwali 2024

**Frontend Repository**: [Your repository]
**API Base URL**: https://gems-backend-u.onrender.com/api

---

## Quick Start Checklist for Backend Developer

- [ ] Set up Node.js + Express server
- [ ] Connect MongoDB database
- [ ] Implement User authentication (JWT)
- [ ] Create Gem CRUD operations
- [ ] Implement Cart functionality
- [ ] Create Order management system
- [ ] Set up OTP service for guest checkout
- [ ] Integrate Razorpay payment gateway
- [ ] Implement Wishlist APIs
- [ ] Create Seller profile management
- [ ] Build Admin dashboard APIs
- [ ] Set up Cloudinary for image uploads
- [ ] Generate PDF invoices
- [ ] Configure email service
- [ ] Set up environment variables
- [ ] Deploy to production (Render/Heroku/AWS)
- [ ] Test all API endpoints

---

**Document Version**: 2.0
**Last Updated**: October 16, 2025
**Status**: ✅ Complete & Ready for Implementation

---

🎉 **All the best for your Diwali launch!** 🪔

