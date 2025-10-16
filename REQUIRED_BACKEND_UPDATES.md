# 🔄 Required Backend Updates for Aurelane Gems E-Commerce

## 📋 Overview

This document contains all the backend API updates and fixes required to complete the e-commerce platform functionality, including admin features, seller dashboard, and stock management.

**Priority**: HIGH  
**Deadline**: Before Diwali 2024  
**Status**: Ready for Implementation

---

## 🆕 New API Endpoints Needed

### 1. Get Seller's Gems (For Seller Dashboard)
**Endpoint**: `GET /api/gems?seller={sellerId}`

**Description**: Allow filtering gems by seller ID

**Query Parameters**:
```javascript
{
  seller: String, // Seller's user ID
  page: Number,
  limit: Number
}
```

**Response**:
```json
{
  "success": true,
  "gems": [
    {
      "_id": "gem_id",
      "name": "Blue Sapphire",
      "category": "Sapphire",
      "price": 75000,
      "stock": 5,
      "sizeWeight": 6.2,
      "sizeUnit": "carat",
      "images": ["url1", "url2"],
      "seller": "seller_id",
      "createdAt": "2025-10-16T..."
    }
  ],
  "pagination": {...}
}
```

---

### 2. Enhanced Admin - Get Seller with Gems
**Endpoint**: `GET /api/admin/sellers/:sellerId`

**Current Issue**: Gems array is not properly returned

**Required Fix**: Include seller's gems in response

**Updated Response**:
```json
{
  "success": true,
  "seller": {
    "_id": "seller_id",
    "fullName": "Diamond Dreams",
    "email": "seller@example.com",
    "shopName": "Diamond Dreams Jewellers",
    "phone": "9876543210",
    "address": {...},
    "status": "approved",
    "isVerified": true,
    "totalGems": 25,
    "totalOrders": 150,
    "rating": 4.8,
    "createdAt": "2023-01-15T..."
  },
  "gems": [
    {
      "_id": "gem_id",
      "name": "Natural Blue Sapphire",
      "category": "Sapphire",
      "price": 75000,
      "stock": 5,
      "images": ["url1"],
      "seller": "seller_id",
      "createdAt": "2025-10-16T..."
    }
  ]
}
```

**Backend Implementation**:
```javascript
// In admin controller
async getSellerById(req, res) {
  try {
    const { sellerId } = req.params;
    
    // Get seller details
    const seller = await Seller.findById(sellerId)
      .populate('user', 'name email')
      .lean();
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    // Get seller's gems
    const gems = await Gem.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .lean();
    
    return res.status(200).json({
      success: true,
      seller,
      gems // Include gems array
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

### 3. Update Seller Status (Admin)
**Endpoint**: `PUT /api/admin/sellers/:sellerId/status`

**Request Body**:
```json
{
  "status": "approved" // or "rejected", "suspended", "active"
}
```

**Supported Status Values**:
- `approved` - Seller is approved and can sell
- `rejected` - Seller application rejected
- `suspended` - Seller temporarily suspended
- `active` - Seller reinstated after suspension

**Response**:
```json
{
  "success": true,
  "message": "Seller status updated successfully",
  "seller": {
    "_id": "seller_id",
    "status": "approved",
    "isVerified": true
  }
}
```

**Backend Implementation**:
```javascript
async updateSellerStatus(req, res) {
  try {
    const { sellerId } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['approved', 'rejected', 'suspended', 'active'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    // Update seller
    const seller = await Seller.findByIdAndUpdate(
      sellerId,
      { 
        status,
        isVerified: status === 'approved' || status === 'active',
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    // Send notification email to seller
    await sendStatusUpdateEmail(seller.email, status);
    
    return res.status(200).json({
      success: true,
      message: `Seller ${status} successfully`,
      seller
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

### 4. Delete Seller (Admin)
**Endpoint**: `DELETE /api/admin/sellers/:sellerId`

**Description**: Permanently delete seller and their gems

**Response**:
```json
{
  "success": true,
  "message": "Seller and all associated data deleted successfully"
}
```

**Backend Implementation**:
```javascript
async deleteSeller(req, res) {
  try {
    const { sellerId } = req.params;
    
    // Delete all gems by this seller
    await Gem.deleteMany({ seller: sellerId });
    
    // Delete seller profile
    const seller = await Seller.findByIdAndDelete(sellerId);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }
    
    // Optionally delete user account
    await User.findByIdAndDelete(seller.user);
    
    return res.status(200).json({
      success: true,
      message: 'Seller and all associated data deleted successfully'
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

## 📊 Database Schema Updates

### 1. Gem Model - Add Stock Management
```javascript
const gemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  
  // ✅ STOCK MANAGEMENT FIELDS
  stock: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  lowStockThreshold: {
    type: Number,
    default: 5 // Alert when stock reaches this level
  },
  
  discount: Number,
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed'],
    default: 'percentage' 
  },
  
  sizeWeight: Number,
  sizeUnit: String,
  images: [String],
  availability: { 
    type: String, 
    enum: ['available', 'out_of_stock'],
    default: 'available'
  },
  
  whomToUse: [String],
  benefits: [String],
  origin: String,
  certification: String,
  
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // ✅ TRACKING FIELDS
  views: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
}, {
  timestamps: true
});

// ✅ AUTOMATIC AVAILABILITY UPDATE
gemSchema.pre('save', function(next) {
  if (this.stock === 0) {
    this.availability = 'out_of_stock';
  } else {
    this.availability = 'available';
  }
  next();
});
```

---

### 2. Seller Model - Enhanced Status Management
```javascript
const sellerSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  fullName: { type: String, required: true },
  shopName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  
  description: String,
  businessLicense: String,
  
  // ✅ STATUS MANAGEMENT
  status: { 
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended', 'active'],
    default: 'pending'
  },
  isVerified: { type: Boolean, default: false },
  
  // ✅ SUSPENSION DETAILS
  suspensionReason: String,
  suspendedAt: Date,
  suspendedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  // Stats
  rating: { type: Number, default: 0 },
  totalGems: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
}, {
  timestamps: true
});
```

---

### 3. Order Model - Stock Management Integration
```javascript
const orderSchema = new mongoose.Schema({
  // ... existing fields ...
  
  items: [{
    gemId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Gem', 
      required: true 
    },
    gem: Object, // Populated gem data
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    
    // ✅ STOCK TRACKING
    stockReserved: { type: Boolean, default: false },
    stockReservedAt: Date
  }],
  
  // ... rest of schema ...
});

// ✅ AUTOMATIC STOCK REDUCTION ON ORDER PLACEMENT
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    for (const item of this.items) {
      await Gem.findByIdAndUpdate(item.gemId, {
        $inc: { 
          stock: -item.quantity,
          sales: item.quantity
        }
      });
    }
  }
  next();
});

// ✅ RESTORE STOCK ON ORDER CANCELLATION
orderSchema.methods.restoreStock = async function() {
  for (const item of this.items) {
    await Gem.findByIdAndUpdate(item.gemId, {
      $inc: { 
        stock: item.quantity,
        sales: -item.quantity
      }
    });
  }
};
```

---

## 🔧 API Endpoint Updates

### 1. Enhanced Gem APIs

#### GET /api/gems
**Add Query Parameters**:
```javascript
{
  seller: String,      // Filter by seller ID
  inStock: Boolean,    // Filter by stock availability
  lowStock: Boolean,   // Get low stock items (stock <= 5)
  outOfStock: Boolean  // Get out of stock items
}
```

---

#### PUT /api/gems/:id
**Update Gem with Stock Management**:
```javascript
// Backend validation
async updateGem(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Check ownership
    const gem = await Gem.findById(id);
    if (!gem) {
      return res.status(404).json({
        success: false,
        message: 'Gem not found'
      });
    }
    
    if (gem.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own gems'
      });
    }
    
    // Update gem
    const updatedGem = await Gem.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Gem updated successfully',
      data: updatedGem
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

### 2. Order Management - Stock Integration

#### POST /api/orders
**Enhanced with Stock Validation**:
```javascript
async createOrder(req, res) {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    
    // ✅ VALIDATE STOCK AVAILABILITY
    for (const item of items) {
      const gem = await Gem.findById(item.gemId);
      
      if (!gem) {
        return res.status(404).json({
          success: false,
          message: `Gem ${item.gemId} not found`
        });
      }
      
      if (gem.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${gem.name}. Available: ${gem.stock}, Requested: ${item.quantity}`
        });
      }
    }
    
    // Create order
    const order = new Order({
      user: req.user.id,
      orderId: generateOrderId(),
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'pending'
    });
    
    await order.save(); // This will automatically reduce stock
    
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order.orderId,
        order
      }
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

#### PUT /api/orders/:orderId/cancel
**Enhanced with Stock Restoration**:
```javascript
async cancelOrder(req, res) {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order can be cancelled
    if (!['pending', 'confirmed', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }
    
    // ✅ RESTORE STOCK
    await order.restoreStock();
    
    // Update order status
    order.status = 'cancelled';
    order.cancelReason = reason;
    order.cancelledAt = new Date();
    await order.save();
    
    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
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

## 🔔 New Features to Implement

### 1. Low Stock Notifications

Create a notification system for sellers when stock is low:

```javascript
// Notification Service
async function checkLowStockAndNotify() {
  const lowStockGems = await Gem.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] }
  }).populate('seller');
  
  for (const gem of lowStockGems) {
    // Send email/SMS to seller
    await sendLowStockNotification(gem.seller.email, {
      gemName: gem.name,
      currentStock: gem.stock,
      threshold: gem.lowStockThreshold
    });
  }
}

// Run daily or on stock update
```

---

### 2. Seller Dashboard Stats API

**Endpoint**: `GET /api/seller/dashboard/stats`

```javascript
async getSellerStats(req, res) {
  try {
    const sellerId = req.user.id;
    
    // Get gems stats
    const totalGems = await Gem.countDocuments({ seller: sellerId });
    const lowStockGems = await Gem.countDocuments({
      seller: sellerId,
      stock: { $gt: 0, $lte: 5 }
    });
    const outOfStock = await Gem.countDocuments({
      seller: sellerId,
      stock: 0
    });
    
    // Get inventory value
    const gems = await Gem.find({ seller: sellerId });
    const totalValue = gems.reduce((sum, gem) => {
      return sum + (gem.price * gem.stock);
    }, 0);
    
    // Get orders stats
    const totalOrders = await Order.countDocuments({
      'items.gem.seller': sellerId
    });
    
    const totalSales = await Order.aggregate([
      { $match: { 'items.gem.seller': mongoose.Types.ObjectId(sellerId) } },
      { $unwind: '$items' },
      { $group: {
          _id: null,
          total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      }
    ]);
    
    return res.status(200).json({
      success: true,
      stats: {
        totalGems,
        lowStockGems,
        outOfStock,
        totalValue,
        totalOrders,
        totalSales: totalSales[0]?.total || 0
      }
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

## 🛡️ Security & Validation

### 1. Seller Ownership Validation

Ensure sellers can only edit their own gems:

```javascript
// Middleware
async function validateGemOwnership(req, res, next) {
  try {
    const gemId = req.params.id;
    const gem = await Gem.findById(gemId);
    
    if (!gem) {
      return res.status(404).json({
        success: false,
        message: 'Gem not found'
      });
    }
    
    if (gem.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this gem'
      });
    }
    
    req.gem = gem;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Use in routes
router.put('/gems/:id', authenticateUser, validateGemOwnership, updateGem);
router.delete('/gems/:id', authenticateUser, validateGemOwnership, deleteGem);
```

---

### 2. Admin-Only Routes Protection

```javascript
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
}

// Apply to admin routes
router.get('/admin/sellers', authenticateUser, requireAdmin, getSellers);
router.put('/admin/sellers/:id/status', authenticateUser, requireAdmin, updateSellerStatus);
router.delete('/admin/sellers/:id', authenticateUser, requireAdmin, deleteSeller);
```

---

## 📝 Email Templates

### 1. Low Stock Alert Email

```html
Subject: Low Stock Alert - {{gemName}}

Dear {{sellerName}},

Your gem "{{gemName}}" is running low on stock.

Current Stock: {{currentStock}} units
Threshold: {{threshold}} units

Please restock soon to continue selling.

Best regards,
Aurelane Gems Team
```

---

### 2. Seller Status Update Email

```html
Subject: Your Seller Account Status Update

Dear {{sellerName}},

Your seller account status has been updated to: {{status}}

{{#if approved}}
Congratulations! You can now start listing your gems.
{{/if}}

{{#if suspended}}
Your account has been temporarily suspended due to: {{reason}}
Please contact support for more information.
{{/if}}

{{#if rejected}}
Unfortunately, your seller application has been rejected.
Reason: {{reason}}
{{/if}}

Best regards,
Aurelane Gems Team
```

---

## 🧪 Testing Checklist

### Admin Features
- [ ] View seller details with all gems listed
- [ ] Approve seller
- [ ] Suspend seller
- [ ] Reject seller
- [ ] Delete seller (removes gems too)
- [ ] View seller statistics

### Seller Dashboard
- [ ] View all listed gems
- [ ] See stock status for each gem
- [ ] Edit gem details
- [ ] Delete gems
- [ ] View low stock alerts
- [ ] See dashboard statistics

### Stock Management
- [ ] Stock reduces when order placed
- [ ] Stock restored when order cancelled
- [ ] Out of stock gems can't be ordered
- [ ] Low stock threshold notifications work
- [ ] Stock validation on order creation

---

## 🚀 Deployment Steps

1. **Backup Database**
   ```bash
   mongodump --uri="mongodb://..." --out=backup
   ```

2. **Run Migrations**
   ```bash
   node migrations/add-stock-fields.js
   node migrations/update-seller-status.js
   ```

3. **Update Environment Variables**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   LOW_STOCK_THRESHOLD=5
   ```

4. **Deploy Backend**
   ```bash
   git pull origin main
   npm install
   npm run build
   pm2 restart aurelane-api
   ```

5. **Test All Endpoints**
   - Use Postman collection provided
   - Test with real data
   - Verify email notifications

---

## 📊 API Routes Summary

```javascript
// Admin Routes
GET    /api/admin/sellers                    - Get all sellers
GET    /api/admin/sellers/:id                - Get seller with gems
PUT    /api/admin/sellers/:id/status         - Update seller status
DELETE /api/admin/sellers/:id                - Delete seller
GET    /api/admin/dashboard/stats            - Admin dashboard stats

// Seller Routes
GET    /api/seller/profile                   - Get seller profile
PUT    /api/seller/profile                   - Update seller profile
GET    /api/seller/dashboard/stats           - Seller dashboard stats

// Gem Routes (Enhanced)
GET    /api/gems?seller={id}                 - Get seller's gems
PUT    /api/gems/:id                         - Update gem (with ownership check)
DELETE /api/gems/:id                         - Delete gem (with ownership check)

// Order Routes (Enhanced)
POST   /api/orders                           - Create order (with stock validation)
PUT    /api/orders/:id/cancel                - Cancel order (restore stock)
```

---

## 🎯 Priority Implementation Order

1. **CRITICAL** - Stock management in Gem model
2. **CRITICAL** - Admin seller detail gems display fix
3. **CRITICAL** - Seller status management (approve/suspend/reject)
4. **HIGH** - Seller dashboard stats
5. **HIGH** - Stock validation in orders
6. **MEDIUM** - Low stock notifications
7. **MEDIUM** - Delete seller functionality
8. **LOW** - Email templates

---

## 💡 Additional Recommendations

1. **Add Bulk Operations**: Allow admin to approve/suspend multiple sellers at once
2. **Add Audit Logs**: Track who approved/suspended sellers and when
3. **Add Seller Analytics**: Show sales trends, best-selling gems
4. **Add Inventory Reports**: Generate PDF reports of inventory
5. **Add Stock History**: Track stock changes over time

---

## 📞 Support

**Frontend Developer**: Naman  
**Backend Integration**: To be completed by backend team  
**Documentation Version**: 2.0  
**Last Updated**: October 16, 2025

---

## ✅ Summary

All backend changes are documented above. The frontend is ready and waiting for these backend implementations. Once these are complete, the platform will have:

✅ Full admin control over sellers  
✅ Seller dashboard with stock management  
✅ Low stock alerts  
✅ Proper gem display in admin panel  
✅ Stock validation on orders  
✅ Automatic stock updates  
✅ Seller status management  

**Ready for Diwali launch!** 🪔✨

