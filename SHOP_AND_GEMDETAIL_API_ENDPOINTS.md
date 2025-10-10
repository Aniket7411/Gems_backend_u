# 📘 Shop & Gem Detail Pages - API Endpoints Documentation

## 🌐 **Base URL**
```
http://localhost:5000/api
```

---

## 📄 **Pages Covered**
1. **Shop Page** - `src/pages/Shop.js` (`/shop`)
2. **Gem Detail Page** - `src/pages/GemDetail.js` (`/gems/:id`)

---

# 🛒 **SHOP PAGE API**

## **Endpoint**: `GET /api/gems`

**Access**: Public  
**Frontend File**: `src/pages/Shop.js`

---

## 📡 **Query Parameters**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `page` | Number | No | Page number (default: 1) | `1` |
| `limit` | Number | No | Items per page (default: 12) | `12` |
| `search` | String | No | Search by gem name | `ruby` |
| `category` | String | No | Filter by category | `Ruby` |
| `zodiac` | String | No | Filter by zodiac sign | `Aries` |
| `sortBy` | String | No | Sort order | `price-low` |

---

## 🔍 **Search Parameter**

**Field**: `search`  
**Searches in**:
- Gem name (English)
- Gem name (Hindi)
- Category
- Description

**Example**:
```
GET /gems?search=ruby&page=1&limit=12
```

---

## 🗂️ **Category Filter**

**Field**: `category`  
**Options**:
```
Ruby, Emerald, Sapphire, Diamond, Pearl, Yellow Sapphire, 
Blue Sapphire, Coral, Gomed, Cat's Eye, Moonstone, Turquoise, etc.
```

**Example**:
```
GET /gems?category=Ruby&page=1&limit=12
```

---

## ♈ **Zodiac Filter**

**Field**: `zodiac`  
**Options**:
```
Aries, Taurus, Gemini, Cancer, Leo, Virgo, 
Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces
```

**Example**:
```
GET /gems?zodiac=Aries&page=1&limit=12
```

---

## 📊 **Sort Options**

**Field**: `sortBy`  
**Options**:
- `newest` - Newest first (default)
- `price-low` - Price: Low to High
- `price-high` - Price: High to Low
- `name` - Name A-Z

**Example**:
```
GET /gems?sortBy=price-low&page=1&limit=12
```

---

## 📥 **Response Format**

### **Success (200)**:
```json
{
  "success": true,
  "count": 45,
  "totalPages": 4,
  "currentPage": 1,
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
      "suitableFor": ["Aries", "Leo", "Sagittarius"],
      "price": 50000,
      "sizeWeight": 5.5,
      "sizeUnit": "carat",
      "stock": 10,
      "availability": true,
      "certification": "Govt. Lab Certified",
      "origin": "Burma",
      "deliveryDays": 7,
      "heroImage": "https://res.cloudinary.com/.../ruby.jpg",
      "additionalImages": [
        "https://res.cloudinary.com/.../ruby2.jpg",
        "https://res.cloudinary.com/.../ruby3.jpg"
      ],
      "seller": {
        "_id": "507f1f77bcf86cd799439012",
        "fullName": "Raj Kumar Gems",
        "shopName": "Raj Kumar Gems & Jewels"
      },
      "createdAt": "2024-10-09T10:30:00.000Z",
      "updatedAt": "2024-10-09T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 4,
    "totalItems": 45,
    "limit": 12,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### **Error (400/500)**:
```json
{
  "success": false,
  "message": "Error fetching gems"
}
```

---

## 🎯 **Example API Calls**

### **1. Get All Gems (Default)**
```
GET /api/gems?page=1&limit=12
```

### **2. Search by Name**
```
GET /api/gems?search=ruby&page=1&limit=12
```

### **3. Filter by Category**
```
GET /api/gems?category=Ruby&page=1&limit=12
```

### **4. Filter by Zodiac**
```
GET /api/gems?zodiac=Aries&page=1&limit=12
```

### **5. Sort by Price (Low to High)**
```
GET /api/gems?sortBy=price-low&page=1&limit=12
```

### **6. Combined Filters**
```
GET /api/gems?search=sapphire&category=Sapphire&zodiac=Gemini&sortBy=price-low&page=1&limit=12
```

---

## 🔧 **Axios Implementation**

```javascript
// In src/services/api.js

export const gemAPI = {
    // Get all gems with filters
    getGems: async (params = {}) => {
        // Filter out empty values
        const filteredParams = Object.keys(params).reduce((acc, key) => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                acc[key] = params[key];
            }
            return acc;
        }, {});

        return apiClient.get('/gems', { params: filteredParams });
    },
    
    // ... other methods
};
```

---

## 💻 **Frontend Usage**

```javascript
// In Shop.js

const fetchGems = async () => {
    setLoading(true);
    try {
        const params = {};
        if (filters.page) params.page = filters.page;
        if (filters.limit) params.limit = filters.limit;
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.zodiac) params.zodiac = filters.zodiac;
        if (filters.sortBy) params.sortBy = filters.sortBy;

        const response = await gemAPI.getGems(params);
        
        if (response.success) {
            setGems(response.gems || []);
            setPagination(response.pagination || {});
        }
    } catch (error) {
        console.error('Error:', error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
};
```

---

# 💎 **GEM DETAIL PAGE API**

## **Endpoint**: `GET /api/gems/:id`

**Access**: Public  
**Frontend File**: `src/pages/GemDetail.js`

---

## 📡 **URL Parameter**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | Yes | Gem MongoDB ObjectID |

---

## 📥 **Response Format**

### **Success (200)**:
```json
{
  "success": true,
  "gem": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ruby",
    "hindiName": "Manik (माणिक)",
    "planet": "Sun (Surya)",
    "planetHindi": "सूर्य",
    "color": "Red",
    "description": "Ruby is the king of gemstones, known for its deep red color and powerful astrological properties. It is associated with the Sun and is believed to bring success, confidence, and vitality to the wearer.",
    "benefits": [
      "Boosts confidence and leadership qualities",
      "Enhances creativity and passion",
      "Improves blood circulation",
      "Brings success in career and business",
      "Strengthens father-son relationship"
    ],
    "suitableFor": [
      "Aries", 
      "Leo", 
      "Sagittarius",
      "Politicians",
      "Government officials",
      "Leaders"
    ],
    "price": 50000,
    "sizeWeight": 5.5,
    "sizeUnit": "carat",
    "stock": 10,
    "availability": true,
    "certification": "Govt. Lab Certified with Originality Certificate",
    "origin": "Burma (Myanmar)",
    "deliveryDays": 7,
    "heroImage": "https://res.cloudinary.com/defgskoxv/image/upload/v1728123456/gems/ruby-hero.jpg",
    "additionalImages": [
      "https://res.cloudinary.com/defgskoxv/image/upload/v1728123457/gems/ruby-2.jpg",
      "https://res.cloudinary.com/defgskoxv/image/upload/v1728123458/gems/ruby-3.jpg",
      "https://res.cloudinary.com/defgskoxv/image/upload/v1728123459/gems/ruby-4.jpg"
    ],
    "seller": {
      "_id": "507f1f77bcf86cd799439012",
      "fullName": "Raj Kumar Gems",
      "email": "raj@gemstore.com",
      "phone": "9876543210",
      "shopName": "Raj Kumar Gems & Jewels",
      "isVerified": true,
      "rating": 4.8
    },
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "rating": 5,
        "comment": "Excellent quality ruby! Highly recommended.",
        "createdAt": "2024-10-01T10:30:00.000Z"
      }
    ],
    "averageRating": 4.8,
    "totalReviews": 15,
    "createdAt": "2024-09-15T10:30:00.000Z",
    "updatedAt": "2024-10-09T10:30:00.000Z"
  }
}
```

### **Error (404)**:
```json
{
  "success": false,
  "message": "Gem not found"
}
```

---

## 🎯 **Example API Calls**

### **Get Gem by ID**
```
GET /api/gems/507f1f77bcf86cd799439011
```

---

## 🔧 **Axios Implementation**

```javascript
// In src/services/api.js

export const gemAPI = {
    // Get gem by ID
    getGemById: async (id) => {
        return apiClient.get(`/gems/${id}`);
    },
    
    // ... other methods
};
```

---

## 💻 **Frontend Usage**

```javascript
// In GemDetail.js

const { id } = useParams();
const [gem, setGem] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchGemDetail = async () => {
        setLoading(true);
        try {
            const response = await gemAPI.getGemById(id);
            
            if (response.success && response.gem) {
                setGem(response.gem);
            } else {
                setError('Gem not found');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (id) {
        fetchGemDetail();
    }
}, [id]);
```

---

# 🎨 **SHOP PAGE FILTERS SUMMARY**

## ✅ **Simple Filters (As Requested)**

### **1. Search by Name** 🔍
- Search box in sidebar
- Searches gem name (English & Hindi)
- Updates on form submit

### **2. Filter by Category** 📂
- Category buttons in sidebar
- Click to toggle category
- One category at a time

### **3. Filter by Zodiac Sign** ♈
- Dropdown in sidebar
- Select zodiac sign
- Shows suitable gems

### **4. Sort by Price** 💰
- Dropdown in sidebar
- Options:
  - Newest First
  - Price: Low to High ← **Requested**
  - Price: High to Low
  - Name A-Z

---

## 🎯 **User Flow**

```
Shop Page (/shop)
  ↓
User interacts with filters:
  - Enter search term → Submit → API call
  - Click category → API call
  - Select zodiac → API call
  - Select sort → API call
  ↓
API: GET /gems?search=...&category=...&zodiac=...&sortBy=...
  ↓
Display gems in grid
  ↓
User clicks eye icon on gem card
  ↓
Navigate to: /gems/:id
  ↓
API: GET /gems/:id
  ↓
Display gem details
```

---

## 📋 **Backend Implementation Guide**

### **1. GET /api/gems** (Shop Page)

```javascript
// routes/gems.js
router.get('/gems', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 12, 
            search = '', 
            category = '', 
            zodiac = '',
            sortBy = 'newest'
        } = req.query;

        // Build query
        let query = {};

        // Search
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { hindiName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            query.name = category; // or query.category if you have a category field
        }

        // Zodiac filter
        if (zodiac) {
            query.suitableFor = { $in: [zodiac] };
        }

        // Build sort
        let sort = {};
        switch (sortBy) {
            case 'price-low':
                sort.price = 1;
                break;
            case 'price-high':
                sort.price = -1;
                break;
            case 'name':
                sort.name = 1;
                break;
            case 'newest':
            default:
                sort.createdAt = -1;
                break;
        }

        // Pagination
        const skip = (page - 1) * limit;
        const total = await Gem.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        // Fetch gems
        const gems = await Gem.find(query)
            .populate('seller', 'fullName shopName email phone isVerified')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            count: gems.length,
            totalPages,
            currentPage: parseInt(page),
            gems,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                limit: parseInt(limit),
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching gems'
        });
    }
});
```

---

### **2. GET /api/gems/:id** (Gem Detail Page)

```javascript
// routes/gems.js
router.get('/gems/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid gem ID'
            });
        }

        // Fetch gem with seller details
        const gem = await Gem.findById(id)
            .populate('seller', 'fullName email phone shopName address isVerified rating');

        if (!gem) {
            return res.status(404).json({
                success: false,
                message: 'Gem not found'
            });
        }

        // Optionally fetch reviews
        const reviews = await Review.find({ gem: id })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        // Calculate average rating
        const totalReviews = await Review.countDocuments({ gem: id });
        const avgRating = reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
            : 0;

        res.json({
            success: true,
            gem: {
                ...gem.toObject(),
                reviews,
                averageRating: avgRating,
                totalReviews
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching gem details'
        });
    }
});
```

---

## 📊 **MongoDB Query Examples**

### **Search Query**:
```javascript
{
  $or: [
    { name: { $regex: 'ruby', $options: 'i' } },
    { hindiName: { $regex: 'ruby', $options: 'i' } },
    { description: { $regex: 'ruby', $options: 'i' } }
  ]
}
```

### **Category Filter**:
```javascript
{ name: 'Ruby' }
// Or if you have a separate category field:
{ category: 'Ruby' }
```

### **Zodiac Filter**:
```javascript
{ suitableFor: { $in: ['Aries'] } }
```

### **Combined**:
```javascript
{
  $or: [
    { name: { $regex: 'sapphire', $options: 'i' } },
    { hindiName: { $regex: 'sapphire', $options: 'i' } }
  ],
  name: 'Sapphire',
  suitableFor: { $in: ['Gemini'] }
}
```

---

## 🧪 **Testing**

### **Test Shop Page**:
```bash
# Get all gems
curl http://localhost:5000/api/gems?page=1&limit=12

# Search
curl http://localhost:5000/api/gems?search=ruby

# Filter by category
curl http://localhost:5000/api/gems?category=Ruby

# Filter by zodiac
curl http://localhost:5000/api/gems?zodiac=Aries

# Sort by price
curl http://localhost:5000/api/gems?sortBy=price-low

# Combined
curl "http://localhost:5000/api/gems?search=sapphire&zodiac=Gemini&sortBy=price-low"
```

### **Test Gem Detail**:
```bash
# Get gem by ID
curl http://localhost:5000/api/gems/507f1f77bcf86cd799439011
```

---

## ✅ **Frontend Features**

### **Shop Page**:
- ✅ Search by gem name (in sidebar)
- ✅ Filter by category (buttons)
- ✅ Filter by zodiac sign (dropdown)
- ✅ Sort by price (dropdown)
- ✅ Active filters display (removable badges)
- ✅ Pagination (next/previous)
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states

### **Gem Detail Page**:
- ✅ Display full gem information
- ✅ Show all images (hero + additional)
- ✅ Show seller information
- ✅ Add to cart functionality
- ✅ Reviews display (if available)
- ✅ Related gems (optional)
- ✅ Loading state
- ✅ Error handling

---

## 🔄 **Data Flow**

### **Shop Page**:
```
Component Mount
  ↓
Call: GET /gems?page=1&limit=12
  ↓
Display gems in grid
  ↓
User applies filter
  ↓
Update filters state
  ↓
Call: GET /gems?[filters]&page=1&limit=12
  ↓
Update gems display
  ↓
User clicks eye icon
  ↓
Navigate to: /gems/:id
```

### **Gem Detail Page**:
```
Component Mount
  ↓
Get ID from URL params
  ↓
Call: GET /gems/:id
  ↓
Display gem details
  ↓
User clicks "Add to Cart"
  ↓
Add to cart (local state or API)
  ↓
Show success message
```

---

## 📝 **Important Notes**

### **Gem ID Property**:
- Backend sends: `_id`
- Frontend uses: `gem._id` or `gem.id`
- GemCard link fixed: `/gems/${gem._id || gem.id}`

### **Image Paths**:
- Use Cloudinary URLs from backend
- heroImage: Main image
- additionalImages: Array of URLs

### **Seller Population**:
- Populate seller details in response
- Show seller name, shop, rating

### **Pagination**:
- Always include pagination object
- Include hasNext, hasPrev for navigation

---

## 🚀 **Quick Backend Setup**

### **1. Install Dependencies**:
```bash
npm install mongoose express cors dotenv
```

### **2. Create Gem Model**:
```javascript
const gemSchema = new mongoose.Schema({
    name: String,
    hindiName: String,
    planet: String,
    color: String,
    price: Number,
    sizeWeight: Number,
    sizeUnit: String,
    stock: Number,
    availability: Boolean,
    heroImage: String,
    additionalImages: [String],
    description: String,
    benefits: [String],
    suitableFor: [String],
    deliveryDays: Number,
    certification: String,
    origin: String,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }
}, { timestamps: true });
```

### **3. Create Routes**:
```javascript
router.get('/gems', getGems);        // Shop page
router.get('/gems/:id', getGemById);  // Detail page
```

### **4. Test**:
```bash
npm start
# Visit: http://localhost:3000/shop
```

---

## ✅ **Implementation Checklist**

### **Backend**:
- [ ] GET /gems endpoint with filters
- [ ] Support search, category, zodiac, sortBy params
- [ ] Pagination with count
- [ ] GET /gems/:id endpoint
- [ ] Populate seller details
- [ ] Error handling

### **Frontend** (Already Done):
- ✅ Shop page with filters
- ✅ Search by name
- ✅ Filter by category
- ✅ Filter by zodiac
- ✅ Sort by price
- ✅ Gem detail navigation fixed
- ✅ Active filters display
- ✅ Loading & error states

---

## 🎉 **Ready to Share with Backend Developer!**

**Share this file** with your backend developer. It has:
- ✅ All API endpoints needed
- ✅ Request/response formats
- ✅ Complete backend implementation examples
- ✅ MongoDB query examples
- ✅ Testing commands

---

Last Updated: October 10, 2025
