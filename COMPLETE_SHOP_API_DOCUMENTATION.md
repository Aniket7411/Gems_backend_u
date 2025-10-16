# 📘 Complete Shop Page API Documentation

## 🎯 **Overview**

This document provides complete API specifications for the **Shop/Gems Listing Page** with all filters, pagination, search, and sorting functionality.

---

## 🌐 **Base URL**
```
http://localhost:5000/api
```

---

## 📄 **Gem Schema Structure**

Based on the `AddGem.js` form, each gem has the following structure:

```javascript
{
  "_id": "507f1f77bcf86cd799439011",         // MongoDB ObjectID
  "name": "Ruby",                             // Gem name (English)
  "hindiName": "Manik (माणिक)",              // Gem name (Hindi)
  "planet": "Sun (Surya)",                    // Associated planet
  "planetHindi": "सूर्य",                     // Planet in Hindi
  "color": "Red",                             // Gem color
  "description": "Ruby is the king of...",    // Full description
  "benefits": [                               // Array of benefits
    "Boosts confidence",
    "Enhances leadership"
  ],
  "suitableFor": [                            // Array of suitable groups
    "Aries",
    "Leo",
    "Politicians"
  ],
  "price": 50000,                             // Price in INR
  "sizeWeight": 5.5,                          // Weight value
  "sizeUnit": "carat",                        // Unit (carat/gram)
  "stock": 10,                                // Available quantity
  "availability": true,                       // In stock or not
  "certification": "Govt. Lab Certified",     // Certification details
  "origin": "Burma",                          // Origin country
  "deliveryDays": 7,                          // Delivery time
  "heroImage": "https://cloudinary.../ruby.jpg",      // Main image URL
  "additionalImages": [                       // Additional images array
    "https://cloudinary.../ruby2.jpg",
    "https://cloudinary.../ruby3.jpg"
  ],
  "seller": "507f1f77bcf86cd799439012",      // Seller ID (will be populated)
  "createdAt": "2024-10-09T10:30:00.000Z",   // Creation timestamp
  "updatedAt": "2024-10-09T10:30:00.000Z"    // Last update timestamp
}
```

---

## 🛒 **MAIN ENDPOINT: GET /api/gems**

### **Purpose**
Fetch paginated, filtered, and sorted list of gems for the shop page.

### **Access**
Public (no authentication required)

---

## 📡 **Query Parameters**

### **1️⃣ Pagination**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | Number | No | 1 | Current page number |
| `limit` | Number | No | 12 | Items per page |

**Example:**
```
GET /api/gems?page=2&limit=12
```

---

### **2️⃣ Search**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | String | No | Search keyword |

**Searches in:**
- `name` (case-insensitive)
- `hindiName` (case-insensitive)
- `description` (case-insensitive)
- `category` (if you have a category field)

**Example:**
```
GET /api/gems?search=ruby
GET /api/gems?search=माणिक
```

---

### **3️⃣ Category Filter (Multiple)**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | String | No | Comma-separated category names |

**Frontend sends:**
```javascript
category: ["Ruby", "Sapphire", "Diamond"]
```

**Converted to:**
```
GET /api/gems?category=Ruby,Sapphire,Diamond
```

**Backend receives:**
```javascript
const categories = req.query.category.split(','); // ["Ruby", "Sapphire", "Diamond"]
```

---

### **4️⃣ Price Range Filter**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `minPrice` | Number | No | Minimum price (INR) |
| `maxPrice` | Number | No | Maximum price (INR) |

**Example:**
```
GET /api/gems?minPrice=1000&maxPrice=50000
```

---

### **5️⃣ Sort**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `sort` | String | No | `newest` | Sort order |

**Options:**
- `newest` - Newest first (createdAt DESC)
- `oldest` - Oldest first (createdAt ASC)
- `price-low` - Price: Low to High
- `price-high` - Price: High to Low

**Example:**
```
GET /api/gems?sort=price-low
GET /api/gems?sort=newest
```

---

## 🎯 **Complete Example Requests**

### **Example 1: Basic Pagination**
```
GET /api/gems?page=1&limit=12
```

### **Example 2: Search**
```
GET /api/gems?search=sapphire&page=1&limit=12
```

### **Example 3: Single Category**
```
GET /api/gems?category=Ruby&page=1&limit=12
```

### **Example 4: Multiple Categories**
```
GET /api/gems?category=Ruby,Sapphire,Diamond&page=1&limit=12
```

### **Example 5: Price Range**
```
GET /api/gems?minPrice=10000&maxPrice=50000&page=1&limit=12
```

### **Example 6: Sort Only**
```
GET /api/gems?sort=price-low&page=1&limit=12
```

### **Example 7: ALL FILTERS COMBINED**
```
GET /api/gems?page=2&limit=10&search=blue&category=Ruby,Sapphire&minPrice=1000&maxPrice=5000&sort=newest
```

---

## 📥 **Response Format**

### **Success Response (200)**

```json
{
  "success": true,
  "gems": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Ruby",
      "hindiName": "Manik (माणिक)",
      "planet": "Sun (Surya)",
      "planetHindi": "सूर्य",
      "color": "Red",
      "description": "Ruby is the king of gemstones...",
      "benefits": ["Boosts confidence", "Enhances leadership"],
      "suitableFor": ["Aries", "Leo", "Politicians"],
      "price": 50000,
      "sizeWeight": 5.5,
      "sizeUnit": "carat",
      "stock": 10,
      "availability": true,
      "certification": "Govt. Lab Certified",
      "origin": "Burma",
      "deliveryDays": 7,
      "heroImage": "https://cloudinary.com/.../ruby.jpg",
      "additionalImages": [
        "https://cloudinary.com/.../ruby2.jpg"
      ],
      "seller": {
        "_id": "507f1f77bcf86cd799439012",
        "fullName": "Raj Kumar Gems",
        "shopName": "Raj Kumar Gems & Jewels",
        "isVerified": true
      },
      "createdAt": "2024-10-09T10:30:00.000Z",
      "updatedAt": "2024-10-09T10:30:00.000Z"
    }
    // ... more gems
  ],
  "pagination": {
    "currentPage": 2,
    "totalPages": 5,
    "totalItems": 58,
    "limit": 12,
    "hasNext": true,
    "hasPrev": true
  }
}
```

### **Empty Response (No gems found)**

```json
{
  "success": true,
  "gems": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 0,
    "totalItems": 0,
    "limit": 12,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### **Error Response (500)**

```json
{
  "success": false,
  "message": "Error fetching gems",
  "error": "Database connection failed"
}
```

---

## 💻 **Backend Implementation (Node.js + Express + MongoDB)**

### **Complete Route Handler**

```javascript
// routes/gems.js
const express = require('express');
const router = express.Router();
const Gem = require('../models/Gem');

// GET /api/gems - Fetch gems with filters
router.get('/gems', async (req, res) => {
    try {
        // Extract query parameters
        const {
            page = 1,
            limit = 12,
            search = '',
            category = '',
            minPrice = '',
            maxPrice = '',
            sort = 'newest'
        } = req.query;

        // Build query object
        let query = {};

        // 1️⃣ SEARCH FILTER
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { hindiName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // 2️⃣ CATEGORY FILTER (Multiple)
        if (category) {
            const categories = category.split(',').map(cat => cat.trim());
            // Assuming 'name' field contains the category
            // Or use a separate 'category' field if you have one
            query.name = { $in: categories };
        }

        // 3️⃣ PRICE RANGE FILTER
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // 4️⃣ BUILD SORT
        let sortOption = {};
        switch (sort) {
            case 'oldest':
                sortOption.createdAt = 1; // Ascending
                break;
            case 'price-low':
                sortOption.price = 1; // Low to High
                break;
            case 'price-high':
                sortOption.price = -1; // High to Low
                break;
            case 'newest':
            default:
                sortOption.createdAt = -1; // Descending (newest first)
                break;
        }

        // 5️⃣ PAGINATION
        const skip = (Number(page) - 1) * Number(limit);
        const total = await Gem.countDocuments(query);
        const totalPages = Math.ceil(total / Number(limit));

        // 6️⃣ FETCH GEMS
        const gems = await Gem.find(query)
            .populate('seller', 'fullName shopName email phone isVerified')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        // 7️⃣ SEND RESPONSE
        res.json({
            success: true,
            gems,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalItems: total,
                limit: Number(limit),
                hasNext: Number(page) < totalPages,
                hasPrev: Number(page) > 1
            }
        });

    } catch (error) {
        console.error('Error fetching gems:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gems',
            error: error.message
        });
    }
});

module.exports = router;
```

---

## 🗄️ **MongoDB Query Examples**

### **1. Search Query**
```javascript
{
  $or: [
    { name: { $regex: 'ruby', $options: 'i' } },
    { hindiName: { $regex: 'ruby', $options: 'i' } },
    { description: { $regex: 'ruby', $options: 'i' } }
  ]
}
```

### **2. Category Filter (Multiple)**
```javascript
{
  name: { $in: ['Ruby', 'Sapphire', 'Diamond'] }
}
```

### **3. Price Range**
```javascript
{
  price: { $gte: 1000, $lte: 50000 }
}
```

### **4. Combined Query**
```javascript
{
  $or: [
    { name: { $regex: 'blue', $options: 'i' } },
    { hindiName: { $regex: 'blue', $options: 'i' } },
    { description: { $regex: 'blue', $options: 'i' } }
  ],
  name: { $in: ['Ruby', 'Sapphire'] },
  price: { $gte: 1000, $lte: 5000 }
}
```

---

## 🔧 **Frontend Axios Implementation**

### **In `src/services/api.js`**

```javascript
import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptors (for token, error handling)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error.response?.data || error);
    }
);

export const gemAPI = {
    // Get gems with filters
    getGems: async (params = {}) => {
        // Remove empty values
        const filteredParams = Object.keys(params).reduce((acc, key) => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                acc[key] = params[key];
            }
            return acc;
        }, {});

        return apiClient.get('/gems', { params: filteredParams });
    },

    // Get gem by ID
    getGemById: async (id) => {
        return apiClient.get(`/gems/${id}`);
    },

    // Get gem categories (for filter dropdown)
    getGemCategories: async () => {
        return apiClient.get('/gems/categories');
    }
};
```

---

## 🎨 **Frontend Usage in Shop.js**

```javascript
// Simplified version showing key parts

const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    category: [], // Array for multiple categories
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
});

const fetchGems = async () => {
    setLoading(true);
    try {
        const params = {};
        if (filters.page) params.page = filters.page;
        if (filters.limit) params.limit = filters.limit;
        if (filters.search) params.search = filters.search;
        if (filters.category.length > 0) {
            params.category = filters.category.join(','); // Convert to comma-separated
        }
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.sort) params.sort = filters.sort;

        const response = await gemAPI.getGems(params);
        
        if (response.success) {
            setGems(response.gems || []);
            setPagination(response.pagination || {});
        }
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchGems();
}, [filters]); // Re-fetch when filters change
```

---

## 🧪 **Testing Examples**

### **Using cURL**

```bash
# 1. Get all gems
curl "http://localhost:5000/api/gems?page=1&limit=12"

# 2. Search
curl "http://localhost:5000/api/gems?search=ruby"

# 3. Category filter
curl "http://localhost:5000/api/gems?category=Ruby,Sapphire"

# 4. Price range
curl "http://localhost:5000/api/gems?minPrice=1000&maxPrice=50000"

# 5. Sort
curl "http://localhost:5000/api/gems?sort=price-low"

# 6. All filters combined
curl "http://localhost:5000/api/gems?page=2&limit=10&search=blue&category=Ruby,Sapphire&minPrice=1000&maxPrice=5000&sort=newest"
```

### **Using Postman**

1. **Method**: GET
2. **URL**: `http://localhost:5000/api/gems`
3. **Params**:
   - page: 1
   - limit: 12
   - search: ruby
   - category: Ruby,Sapphire
   - minPrice: 1000
   - maxPrice: 50000
   - sort: newest

---

## 📋 **Categories Endpoint**

### **GET /api/gems/categories**

**Purpose**: Get unique list of gem categories for filter dropdown

**Response:**
```json
{
  "success": true,
  "data": [
    "Ruby",
    "Emerald",
    "Sapphire",
    "Diamond",
    "Pearl",
    "Yellow Sapphire",
    "Blue Sapphire",
    "Coral",
    "Gomed",
    "Cat's Eye",
    "Moonstone",
    "Turquoise"
  ]
}
```

**Backend Implementation:**
```javascript
router.get('/gems/categories', async (req, res) => {
    try {
        // Get unique gem names (or use a category field if you have one)
        const categories = await Gem.distinct('name');
        
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
});
```

---

## 🎯 **Shop Page Features Checklist**

### **1️⃣ Pagination** ✅
- [x] Page number in query params
- [x] Limit (items per page)
- [x] Display page buttons
- [x] Next/Previous buttons
- [x] Total pages & items count

### **2️⃣ Search** ✅
- [x] Search input field
- [x] Submit button
- [x] Search in name, hindiName, description
- [x] Case-insensitive search

### **3️⃣ Category Filter** ✅
- [x] Multiple category selection (checkboxes)
- [x] Send as comma-separated string
- [x] Backend splits and queries with $in

### **4️⃣ Price Range** ✅
- [x] Min price input
- [x] Max price input
- [x] Send as minPrice & maxPrice params

### **5️⃣ Sort** ✅
- [x] Dropdown with options
- [x] Newest (default)
- [x] Oldest
- [x] Price: Low to High
- [x] Price: High to Low

### **6️⃣ No Gems Found** ✅
- [x] Show message when gems array is empty
- [x] Clear filters button

### **7️⃣ Loader** ✅
- [x] Show spinner during API call
- [x] Hide when data loaded

### **8️⃣ Active Filters Display** ✅
- [x] Show active search term
- [x] Show selected categories (badges)
- [x] Show price range
- [x] Remove individual filters (× button)

### **9️⃣ Responsive UI** ✅
- [x] Tailwind CSS
- [x] Mobile-friendly sidebar
- [x] Grid layout for gems

### **🔟 Error Handling** ✅
- [x] Try-catch blocks
- [x] Error message display
- [x] Retry button

---

## 🚀 **Quick Start Guide**

### **For Backend Developer:**

1. **Create Gem Model** (Mongoose):
```javascript
const gemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hindiName: String,
    planet: String,
    planetHindi: String,
    color: String,
    description: String,
    benefits: [String],
    suitableFor: [String],
    price: { type: Number, required: true },
    sizeWeight: Number,
    sizeUnit: String,
    stock: Number,
    availability: { type: Boolean, default: true },
    certification: String,
    origin: String,
    deliveryDays: Number,
    heroImage: String,
    additionalImages: [String],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }
}, { timestamps: true });

module.exports = mongoose.model('Gem', gemSchema);
```

2. **Create Route** (`routes/gems.js`):
   - Copy the complete route handler from above

3. **Register Route** (`server.js`):
```javascript
const gemRoutes = require('./routes/gems');
app.use('/api', gemRoutes);
```

4. **Test**:
```bash
npm start
# Visit: http://localhost:5000/api/gems?page=1&limit=12
```

---

## 📊 **Data Flow Diagram**

```
User Action                Frontend                 Backend                Database
──────────                ────────                 ───────                ────────
  Click                                                                    
  "Apply"     →     Build params object
                    { page, search, 
                      category, price,
                      sort }
                            ↓
                    axios.get('/gems',
                    { params })
                                        →    Extract query params
                                             Build MongoDB query
                                             { $or, $in, $gte, $lte }
                                                      ↓
                                             Apply sort & pagination
                                                                    →    Execute query
                                                                         Return docs
                                                      ↓
                                             Format response
                                             { success, gems,
                                               pagination }
                            ↓                        ←
                    Update state:
                    setGems(response.gems)
                    setPagination(...)
                            ↓
  Display          Render GemCards
  Gems             Show pagination
```

---

## 🎁 **Bonus: Optional Improvements**

### **1. Debounced Search**
```javascript
import { useCallback } from 'react';
import debounce from 'lodash.debounce';

const debouncedSearch = useCallback(
    debounce((query) => {
        setFilters(prev => ({ ...prev, search: query, page: 1 }));
    }, 500),
    []
);

// In input onChange:
onChange={(e) => {
    setTempFilters(prev => ({ ...prev, search: e.target.value }));
    debouncedSearch(e.target.value);
}}
```

### **2. URL Query Params (for shareable links)**
```javascript
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams();

// On filter change, update URL
setSearchParams({
    page: filters.page,
    search: filters.search,
    category: filters.category.join(','),
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: filters.sort
});
```

### **3. Loading Skeleton**
```javascript
{loading && (
    <div className="grid grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse" />
        ))}
    </div>
)}
```

---

## ✅ **Summary**

### **What Frontend Sends:**
```
GET /api/gems?page=2&limit=10&search=blue&category=Ruby,Sapphire&minPrice=1000&maxPrice=5000&sort=newest
```

### **What Backend Returns:**
```json
{
  "success": true,
  "gems": [...],
  "pagination": {
    "currentPage": 2,
    "totalPages": 5,
    "totalItems": 58,
    "limit": 10,
    "hasNext": true,
    "hasPrev": true
  }
}
```

### **Features:**
✅ Pagination  
✅ Search (name, hindiName, description)  
✅ Multiple category filter  
✅ Price range (min/max)  
✅ Sort (newest/oldest/price-low/price-high)  
✅ No gems found state  
✅ Loader  
✅ Responsive UI  
✅ Error handling  

---

**Last Updated**: October 13, 2025  
**Frontend File**: `src/pages/Shop.js`  
**Backend Route**: `routes/gems.js`  
**Database**: MongoDB with Mongoose

---

## 🎉 Ready to Share!

**Give this complete documentation to your backend developer.**  
Everything is explained with examples, code snippets, and test cases.

