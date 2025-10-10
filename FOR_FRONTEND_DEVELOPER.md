# 📘 For Frontend Developer - Shopping Page Implementation

## 🌐 **Backend API Base URL**
```javascript
const API_URL = 'https://gems-backend-zfpw.onrender.com/api';
// Local: 'http://localhost:5000/api'
```

---

## 🎯 **What You Need to Implement**

### ✅ **1. Search Bar with Autocomplete (Like Amazon)**
### ✅ **2. Filter by Planet**
### ✅ **3. Filter by Zodiac Sign**
### ✅ **4. Filter by Price Range**
### ✅ **5. Display Gems in Grid**
### ✅ **6. Pagination**

---

## 📡 **API Endpoints You'll Use**

### **1. Search Autocomplete Suggestions**
```
GET /gems/search-suggestions?q={searchText}
```

**When user types** → Call this (with 300ms debounce)

**Example:**
```
User types: "emer"
API Call: GET /gems/search-suggestions?q=emer

Response:
{
  "success": true,
  "suggestions": [
    {
      "type": "name",
      "value": "Emerald",
      "label": "Emerald (Panna (पन्ना))",
      "gemId": "507f1f77bcf86cd799439011"
    },
    {
      "type": "planet",
      "value": "Mercury (Budh)",
      "label": "Planet: Mercury (Budh)",
      "icon": "🪐"
    },
    {
      "type": "zodiac",
      "value": "Gemini",
      "label": "Zodiac: Gemini",
      "icon": "♈"
    }
  ]
}
```

**Show these in dropdown below search bar**

---

### **2. Get All Gems with Filters**
```
GET /gems?page=1&limit=12&search=&planet=&minPrice=&maxPrice=
```

**All parameters are optional**

**Examples:**
```
// Get first 12 gems
GET /gems?page=1&limit=12

// Search for "emerald"
GET /gems?search=emerald&page=1&limit=12

// Filter by planet
GET /gems?planet=Mercury&page=1&limit=12

// Filter by price
GET /gems?minPrice=10000&maxPrice=100000&page=1&limit=12

// Combine all
GET /gems?search=ruby&planet=Sun&minPrice=50000&maxPrice=200000&page=1&limit=12
```

**Response:**
```json
{
  "success": true,
  "count": 45,
  "totalPages": 4,
  "currentPage": 1,
  "gems": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Emerald",
      "hindiName": "Panna (पन्ना)",
      "planet": "Mercury (Budh)",
      "color": "Green",
      "price": 50000,
      "sizeWeight": 5.5,
      "sizeUnit": "carat",
      "stock": 10,
      "availability": true,
      "deliveryDays": 7,
      "heroImage": "https://res.cloudinary.com/.../emerald.jpg",
      "seller": {
        "_id": "507f...",
        "name": "Raj Kumar Gems"
      }
    }
  ]
}
```

---

### **3. Filter by Zodiac Sign**
```
GET /gems/filter/zodiac/{zodiacSign}?page=1&limit=12
```

**Examples:**
```
GET /gems/filter/zodiac/Gemini
GET /gems/filter/zodiac/Leo
GET /gems/filter/zodiac/Aries
```

---

### **4. Filter by Planet**
```
GET /gems/filter/planet/{planetName}?page=1&limit=12
```

**Examples:**
```
GET /gems/filter/planet/Mercury
GET /gems/filter/planet/Sun
GET /gems/filter/planet/Moon
```

---

## 💻 **Copy-Paste Ready Code**

### **Step 1: Create API Service File**

Create file: `src/services/gemAPI.js`

```javascript
import axios from 'axios';

const API_BASE_URL = 'https://gems-backend-zfpw.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const gemAPI = {
  // Autocomplete suggestions
  getSuggestions: async (query) => {
    if (!query || query.length < 2) return { success: true, suggestions: [] };
    const response = await apiClient.get(`/gems/search-suggestions?q=${query}`);
    return response.data;
  },

  // Get all gems with filters
  getGems: async (filters = {}) => {
    const params = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.search) params.search = filters.search;
    if (filters.planet) params.planet = filters.planet;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    
    const response = await apiClient.get('/gems', { params });
    return response.data;
  },

  // Filter by zodiac
  getByZodiac: async (zodiacSign, page = 1) => {
    const response = await apiClient.get(`/gems/filter/zodiac/${zodiacSign}?page=${page}&limit=12`);
    return response.data;
  },

  // Filter by planet
  getByPlanet: async (planet, page = 1) => {
    const response = await apiClient.get(`/gems/filter/planet/${planet}?page=${page}&limit=12`);
    return response.data;
  },

  // Get single gem
  getById: async (id) => {
    const response = await apiClient.get(`/gems/${id}`);
    return response.data;
  }
};
```

---

### **Step 2: Shopping Page Component**

Create file: `src/pages/ShoppingPage.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gemAPI } from '../services/gemAPI';

const ShoppingPage = () => {
  const navigate = useNavigate();

  // State
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    planet: '',
    minPrice: '',
    maxPrice: '',
    zodiac: ''
  });

  // Fetch gems
  const fetchGems = async () => {
    setLoading(true);
    try {
      let response;
      
      if (filters.zodiac) {
        response = await gemAPI.getByZodiac(filters.zodiac, currentPage);
      } else {
        response = await gemAPI.getGems({
          page: currentPage,
          limit: 12,
          search: searchQuery,
          planet: filters.planet,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        });
      }

      setGems(response.gems);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestions
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const response = await gemAPI.getSuggestions(searchQuery);
      setSuggestions(response.suggestions);
      setShowSuggestions(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch gems when filters change
  useEffect(() => {
    fetchGems();
  }, [currentPage, filters, searchQuery]);

  return (
    <div className="shopping-page">
      {/* Search with Autocomplete */}
      <div className="search-section">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search gems..."
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((s, i) => (
              <div key={i} onClick={() => {
                if (s.type === 'name') navigate(`/gems/${s.gemId}`);
                else if (s.type === 'planet') setFilters({...filters, planet: s.value});
                else if (s.type === 'zodiac') setFilters({...filters, zodiac: s.value});
                setShowSuggestions(false);
              }}>
                {s.icon} {s.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="filters">
        <select value={filters.planet} onChange={(e) => setFilters({...filters, planet: e.target.value})}>
          <option value="">All Planets</option>
          <option value="Mercury">Mercury</option>
          <option value="Sun">Sun</option>
          <option value="Moon">Moon</option>
        </select>

        <select value={filters.zodiac} onChange={(e) => setFilters({...filters, zodiac: e.target.value})}>
          <option value="">All Zodiac</option>
          <option value="Aries">Aries</option>
          <option value="Gemini">Gemini</option>
          <option value="Leo">Leo</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
        />
      </div>

      {/* Gems Grid */}
      <div className="gems-grid">
        {loading ? <p>Loading...</p> : (
          gems.map(gem => (
            <div key={gem._id} className="gem-card">
              <img src={gem.heroImage} alt={gem.name} />
              <h3>{gem.name}</h3>
              <p>{gem.hindiName}</p>
              <p>₹{gem.price.toLocaleString()}</p>
              <button onClick={() => navigate(`/gems/${gem._id}`)}>
                View
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ShoppingPage;
```

---

## 🎯 **QUICK REFERENCE**

### **Search Suggestions:**
- **Endpoint**: `GET /gems/search-suggestions?q=emer`
- **When**: User types (debounce 300ms)
- **Shows**: Dropdown with gem names, planets, zodiac signs
- **On Click**: Navigate or apply filter

### **Get All Gems:**
- **Endpoint**: `GET /gems?page=1&limit=12`
- **When**: Page load, filter change, page change
- **Shows**: Grid of gems with pagination

### **Filter by Zodiac:**
- **Endpoint**: `GET /gems/filter/zodiac/Gemini`
- **When**: User selects zodiac filter
- **Shows**: Gems suitable for that zodiac

### **Filter by Planet:**
- **Endpoint**: `GET /gems/filter/planet/Mercury`
- **When**: User selects planet filter
- **Shows**: Gems for that planet

---

## 🧪 **Testing**

### **Add Dummy Gems First:**
```bash
node addDummyGems.js
```

### **Then Test APIs:**
```bash
# Get all gems
curl http://localhost:5000/api/gems

# Search suggestions
curl http://localhost:5000/api/gems/search-suggestions?q=emer

# Filter by zodiac
curl http://localhost:5000/api/gems/filter/zodiac/Gemini

# Filter by planet
curl http://localhost:5000/api/gems/filter/planet/Mercury
```

---

## 📋 **Gem Object Structure**

Each gem in the response has:

```javascript
{
  _id: "507f...",                    // Unique ID
  name: "Emerald",                   // English name
  hindiName: "Panna (पन्ना)",       // Hindi name
  planet: "Mercury (Budh)",          // Associated planet
  planetHindi: "बुध ग्रह",          // Hindi planet
  color: "Green",                    // Gem color
  description: "Beautiful...",       // Full description
  benefits: ["Intelligence", ...],   // Array of benefits
  suitableFor: ["Teachers", ...],    // Professions & zodiac signs
  price: 50000,                      // Price in INR
  sizeWeight: 5.5,                   // Weight value
  sizeUnit: "carat",                 // Unit
  stock: 10,                         // Available quantity
  availability: true,                // Is available
  certification: "Govt. Lab...",     // Certification
  origin: "Sri Lanka",               // Country
  deliveryDays: 7,                   // Delivery time
  heroImage: "https://...",          // Main image URL
  additionalImages: ["https://..."], // More images
  seller: {                          // Seller info
    _id: "507f...",
    name: "Raj Kumar Gems"
  },
  createdAt: "2024-10-09...",       // Created date
  updatedAt: "2024-10-09..."        // Updated date
}
```

---

## 🎨 **UI Flow**

### **Search Flow:**
```
1. User types in search box
   ↓
2. After 300ms, call /gems/search-suggestions?q=...
   ↓
3. Show dropdown with suggestions
   ↓
4. User clicks suggestion:
   - If "name" → Navigate to gem detail page
   - If "planet" → Apply planet filter
   - If "zodiac" → Apply zodiac filter
   ↓
5. Fetch filtered gems and display
```

### **Filter Flow:**
```
1. User selects filter (planet/zodiac/price)
   ↓
2. Update filter state
   ↓
3. Reset page to 1
   ↓
4. Call /gems with filters
   ↓
5. Display filtered gems
```

---

## ✅ **Implementation Checklist**

**Search & Autocomplete:**
- [ ] Input field with onChange handler
- [ ] Debounce search (300ms)
- [ ] Call `/gems/search-suggestions?q=...`
- [ ] Show dropdown with suggestions
- [ ] Handle click on each suggestion type
- [ ] Close dropdown on selection

**Filters:**
- [ ] Planet dropdown (Mercury, Sun, Moon, etc.)
- [ ] Zodiac dropdown (Aries, Gemini, Leo, etc.)
- [ ] Min price input
- [ ] Max price input
- [ ] Clear filters button
- [ ] Show active filters

**Display:**
- [ ] Gems grid layout (3-4 columns)
- [ ] Show gem card with image, name, price
- [ ] Loading state
- [ ] Empty state (no results)
- [ ] Pagination controls

**Functionality:**
- [ ] Fetch gems on page load
- [ ] Fetch gems when filters change
- [ ] Fetch gems when page changes
- [ ] Handle errors gracefully

---

## 🚀 **Quick Start**

1. **Copy `gemAPI.js`** service file to your project
2. **Create Shopping Page** component
3. **Add search bar** with autocomplete
4. **Add filter dropdowns** (Planet, Zodiac, Price)
5. **Display gems** in grid
6. **Add pagination**

**That's it! Your shopping page is ready** 🎉

---

## 📞 **Need Help?**

All endpoints are documented in:
- `FRONTEND_SHOPPING_PAGE_GUIDE.md` - Detailed guide
- `ALL_ENDPOINTS.md` - All available endpoints
- `GEM_API_ENDPOINTS.md` - Gem-specific endpoints

**Backend is ready and tested. Start building! 🚀**
