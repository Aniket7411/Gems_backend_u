# 👤 User/Buyer Profile API - Backend Documentation

## Date: October 16, 2025
## For: Backend Developer

---

## 🎯 Overview

This document contains the API endpoints needed for buyer/user profile management in the Aurelane Gems e-commerce platform.

**Current Issue**: Buyer profile page (`/user-detail`) uses dummy data  
**Required**: Real API integration for profile view and update

---

## 📋 Required API Endpoints

### 1. **GET** `/api/user/profile`
Get current user's profile information

**Headers Required**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "role": "buyer",
    "address": {
      "street": "123 Main Street",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apartment 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "isEmailVerified": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-10-16T11:00:00Z"
  }
}
```

**Backend Implementation**:
```javascript
// GET /api/user/profile
async getUserProfile(req, res) {
  try {
    const userId = req.user._id; // From JWT token
    
    const user = await User.findById(userId)
      .select('-password') // Exclude password
      .lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

---

### 2. **PUT** `/api/user/profile`
Update current user's profile

**Headers Required**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "John Doe Updated",
  "phoneNumber": "9876543210",
  "address": {
    "street": "123 Main Street",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "address": {
      "street": "123 Main Street",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apartment 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "updatedAt": "2025-10-16T12:00:00Z"
  }
}
```

**Backend Implementation**:
```javascript
// PUT /api/user/profile
async updateUserProfile(req, res) {
  try {
    const userId = req.user._id; // From JWT token
    const { name, phoneNumber, address } = req.body;
    
    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        phoneNumber,
        address,
        updatedAt: new Date()
      },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    ).select('-password'); // Exclude password from response
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
```

---

## 📊 Database Schema

### User Model - Required Fields
```javascript
const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false // Don't include in queries by default
  },
  
  // Contact Info
  phoneNumber: {
    type: String,
    trim: true
  },
  
  // Address (Flexible structure)
  address: {
    street: String,          // Main address
    addressLine1: String,    // Alternative field
    addressLine2: String,    // Apartment/Suite/etc
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  
  // User Type
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  },
  
  // Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });
```

---

## 🔐 Security Considerations

### 1. Authentication Middleware
```javascript
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};
```

### 2. Input Validation
```javascript
const validateProfileUpdate = (req, res, next) => {
  const { name, phoneNumber, address } = req.body;
  
  // Validate name
  if (name && name.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters'
    });
  }
  
  // Validate phone (if provided)
  if (phoneNumber && !/^\d{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number format'
    });
  }
  
  // Validate pincode (if provided)
  if (address?.pincode && !/^\d{6}$/.test(address.pincode)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid pincode format (must be 6 digits)'
    });
  }
  
  next();
};
```

---

## 🚀 API Routes Setup

```javascript
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validation');
const userController = require('../controllers/userController');

// User Profile Routes
router.get('/user/profile', authenticateUser, userController.getUserProfile);
router.put('/user/profile', authenticateUser, validateProfileUpdate, userController.updateUserProfile);

module.exports = router;
```

---

## 🧪 Testing

### Test 1: Get User Profile
```bash
GET https://gems-backend-u.onrender.com/api/user/profile

Headers:
  Authorization: Bearer YOUR_JWT_TOKEN

Expected Response:
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "address": {...}
  }
}
```

### Test 2: Update User Profile
```bash
PUT https://gems-backend-u.onrender.com/api/user/profile

Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

Body:
{
  "name": "John Doe Updated",
  "phoneNumber": "9876543210",
  "address": {
    "street": "456 New Street",
    "addressLine1": "456 New Street",
    "addressLine2": "Suite 5C",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "country": "India"
  }
}

Expected Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {...updated user object}
}
```

---

## 📝 Frontend Integration (Already Done)

The frontend is already updated and ready! It will:

1. **Load profile** from `GET /user/profile`
2. **Update profile** using `PUT /user/profile`
3. **Show orders** from existing `GET /orders` endpoint
4. **Handle errors** gracefully
5. **Update localStorage** when profile changes

---

## 🔄 Data Flow

### Profile Load:
```
User visits /user-detail
  ↓
Frontend calls GET /user/profile
  ↓
Backend returns user data
  ↓
Frontend displays in form
  ↓
User can edit and save
```

### Profile Update:
```
User clicks Edit
  ↓
User modifies fields
  ↓
User clicks Save
  ↓
Frontend calls PUT /user/profile
  ↓
Backend validates and updates
  ↓
Backend returns updated user
  ↓
Frontend updates localStorage
  ↓
Profile view updated
```

---

## 💡 Optional Enhancements

### 1. Profile Picture Upload
```javascript
PUT /api/user/profile/picture

Body: FormData with image file

// Backend
const cloudinary = require('cloudinary').v2;

async updateProfilePicture(req, res) {
  const file = req.file;
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'user_profiles'
  });
  
  await User.findByIdAndUpdate(req.user._id, {
    profilePicture: result.secure_url
  });
  
  res.json({ success: true, profilePicture: result.secure_url });
}
```

### 2. Email Change with Verification
```javascript
POST /api/user/change-email

Body: { newEmail: "newemail@example.com" }

// Send verification email to new address
// Update email after verification
```

### 3. Password Change
```javascript
PUT /api/user/change-password

Body: {
  currentPassword: "old_pass",
  newPassword: "new_pass"
}

// Verify current password
// Hash and update new password
```

---

## ⚠️ Important Notes

1. **Never return password** in API responses (use `.select('-password')`)
2. **Validate all inputs** before updating database
3. **Use transactions** if updating multiple collections
4. **Log profile updates** for audit trail
5. **Rate limit** profile update endpoint (max 10 updates per hour)

---

## 📦 Quick Implementation Checklist

- [x] Create `/api/user/profile` GET endpoint
- [x] Create `/api/user/profile` PUT endpoint
- [x] Add authentication middleware
- [x] Add input validation
- [x] Test with Postman
- [x] Ensure password is never returned
- [x] Handle errors properly
- [x] Update timestamps on changes

---

## 🎊 Summary

**2 Simple Endpoints** = **Complete User Profile Management**!

1. `GET /user/profile` - Fetch user data
2. `PUT /user/profile` - Update user data

Frontend is **ready** and waiting for these endpoints!

---

## 📞 Frontend Developer Notes

**Files Updated**:
- `src/pages/buyerprofile.js` - Now uses real API
- `src/services/api.js` - Added `updateBuyerProfile()` and `getBuyerProfile()`

**What it does**:
- ✅ Loads user data from API
- ✅ Shows loading state
- ✅ Allows editing name, phone, address
- ✅ Saves to backend API
- ✅ Updates localStorage
- ✅ Shows recent orders (top 3)
- ✅ Link to view all orders

---

**Ready for implementation!** 🚀

**Last Updated**: October 16, 2025  
**Status**: ✅ **FULLY IMPLEMENTED - Frontend & Backend Complete**

---

## 🎉 Implementation Summary

### ✅ Completed Changes:

1. **User Model** (`models/User.js`):
   - ✅ Added `street` field to address schema
   - ✅ Added `country` default value ('India')
   - ✅ Existing fields: `phoneNumber`, address (all sub-fields), `emailVerified`

2. **User Routes** (`routes/user.js`):
   - ✅ `GET /api/user/profile` - Returns complete user profile
   - ✅ `PUT /api/user/profile` - Updates user profile with validation
   - ✅ Removed buyer-only restriction (works for all authenticated users)
   - ✅ Added input validation (name length, phone format, pincode format)
   - ✅ Response includes `isEmailVerified` (mapped from `emailVerified`)
   - ✅ Supports both `phoneNumber` and `phone` parameters
   - ✅ Password excluded from all responses

3. **Authentication**:
   - ✅ Using existing `protect` middleware from `middleware/auth.js`
   - ✅ JWT token verification
   - ✅ Proper error handling

### 📍 Endpoints Ready:

**Base URL**: `https://gems-backend-u.onrender.com`

1. **GET** `/api/user/profile`
   - Headers: `Authorization: Bearer <token>`
   - Returns: Complete user profile

2. **PUT** `/api/user/profile`
   - Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
   - Body: `{ name, phoneNumber, address }`
   - Returns: Updated user profile

### 🔧 Technical Notes:

- Both endpoints work for all authenticated users (buyer, seller, admin)
- Automatic validation for phone (10 digits) and pincode (6 digits)
- Timestamps automatically updated on profile changes
- Compatible with existing User schema (handles both `phone` and `phoneNumber`)
- All security best practices implemented

