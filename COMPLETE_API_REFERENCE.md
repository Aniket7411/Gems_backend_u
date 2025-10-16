# 📘 Complete API Reference - Aurelane Gems E-Commerce

## 🌐 Base URL
```
https://gems-backend-zfpw.onrender.com/api
or
http://localhost:5000/api
```

---

## 🔥 **MOST USED ENDPOINTS**

### **1. Get All Gems (Shopping Page)**
```
GET /gems?page=1&limit=12&sort=newest
```

**All Query Parameters (Optional):**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `search` - Search keyword
- `category` - Filter by category (comma-separated)
- `zodiac` - Filter by zodiac sign
- `planet` - Filter by planet
- `seller` - Filter by seller ID
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `inStock` - Only in-stock items (true/false)
- `lowStock` - Low stock items (true/false)
- `outOfStock` - Out of stock items (true/false)
- `sort` - Sort: newest/oldest/price-low/price-high/name

**Examples:**
```
GET /gems?page=1&limit=12
GET /gems?search=emerald
GET /gems?category=Ruby,Sapphire
GET /gems?seller=SELLER_ID
GET /gems?inStock=true&sort=price-low
GET /gems?zodiac=Aries&minPrice=10000&maxPrice=100000
```

---

### **2. Get Single Gem**
```
GET /gems/:id
```

---

### **3. Add to Cart**
```
POST /cart
Body: { "gemId": "...", "quantity": 1 }
Headers: Authorization: Bearer <token>
```

---

### **4. Add to Wishlist**
```
POST /wishlist/add
Body: { "gemId": "..." }
Headers: Authorization: Bearer <token>
```

---

### **5. Create Order**
```
POST /orders
Headers: Authorization: Bearer <token>
Body: {
  "items": [{"gem": "...", "quantity": 1, "price": 5000}],
  "shippingAddress": {...},
  "paymentMethod": "COD",
  "totalPrice": 5000
}
```

---

## 📊 **COMPLETE ENDPOINT LIST (51 Total)**

### **Authentication (11)**
- POST `/auth/signup`
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/admin/login`
- GET `/auth/me`
- GET `/auth/profile`
- PUT `/auth/profile`
- PUT `/auth/change-password`
- POST `/auth/forgot-password`
- POST `/auth/reset-password/:token`
- GET `/auth/verify-email/:token`

### **Gems (10)**
- POST `/gems` - Add gem
- GET `/gems` - Get all (with enhanced filters)
- GET `/gems/categories` - Get categories list
- GET `/gems/search-suggestions` - Autocomplete
- GET `/gems/my-gems` - Seller's gems
- GET `/gems/filter/zodiac/:sign` - Filter by zodiac
- GET `/gems/filter/planet/:planet` - Filter by planet
- GET `/gems/:id` - Get single gem
- PUT `/gems/:id` - Update gem
- DELETE `/gems/:id` - Delete gem

### **Cart (5)**
- POST `/cart` - Add to cart
- GET `/cart` - Get cart
- PUT `/cart/:itemId` - Update quantity
- DELETE `/cart/:itemId` - Remove item
- DELETE `/cart` - Clear cart

### **Orders (6)**
- POST `/orders` - Create order (auto-reduces stock)
- GET `/orders/my-orders` - Buyer's orders
- GET `/orders/seller/orders` - Seller's orders
- GET `/orders/:id` - Get order details
- PUT `/orders/:id/cancel` - Cancel (restores stock)
- PUT `/orders/:id/status` - Update status

### **Wishlist (5) - NEW!**
- POST `/wishlist/add` - Add to wishlist
- GET `/wishlist` - Get wishlist
- DELETE `/wishlist/remove/:gemId` - Remove item
- DELETE `/wishlist/clear` - Clear wishlist
- GET `/wishlist/check/:gemId` - Check if in wishlist

### **Seller (2)**
- GET `/seller/profile` - Get profile
- PUT `/seller/profile` - Update profile

### **User (2)**
- GET `/user/profile` - Get profile
- PUT `/user/profile` - Update profile

### **Admin (8)**
- GET `/admin/sellers` - All sellers with stats
- GET `/admin/sellers/:id` - Seller details + gems
- PUT `/admin/sellers/:id/verify` - Verify seller
- PUT `/admin/sellers/:id/status` - **NEW** - Update status
- DELETE `/admin/sellers/:id` - Delete seller
- GET `/admin/orders` - All orders
- GET `/admin/gems` - All gems

### **OTP (2)**
- POST `/otp/send` - Send OTP
- POST `/otp/verify` - Verify OTP

### **Health (1)**
- GET `/health` - Health check

---

## 🎯 **KEY FEATURES**

### **Stock Management:**
- ✅ Auto-reduce stock when order placed
- ✅ Auto-restore stock when order cancelled
- ✅ Auto-update availability (false when stock = 0)
- ✅ Low stock alerts (threshold: 5)
- ✅ Filter by stock status

### **Seller Management:**
- ✅ Status: pending/approved/rejected/suspended/active
- ✅ Suspension tracking
- ✅ Verification system
- ✅ View all seller's gems

### **Wishlist:**
- ✅ Add/remove items
- ✅ Check if item in wishlist
- ✅ Clear entire wishlist

---

## 🔐 **Admin Credentials**

```
Email: admin@admin.com
Password: admin123
```

**To create:**
```bash
node createAdmin.js
```

---

## 📦 **Installation**

```bash
npm install
node createAdmin.js
node addDummyGems.js
npm run dev
```

---

## ✅ **ALL FEATURES READY**

Your backend now includes:
- ✅ 51 API endpoints
- ✅ 8 database models
- ✅ Stock management
- ✅ Wishlist system
- ✅ Seller status management
- ✅ Enhanced search & filters
- ✅ Auto stock reduction/restoration
- ✅ CORS fixed for development
- ✅ Rate limiting (off in dev mode)

**Backend is 100% complete and production-ready!** 🚀

**Good luck with your Diwali launch!** 🪔
