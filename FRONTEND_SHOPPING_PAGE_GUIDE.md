# 🛍️ Shopping Page - Complete Frontend Integration Guide

## 🎯 **Overview**
This guide shows you EXACTLY how to implement the shopping page with search, filters, and autocomplete suggestions (like Amazon).

---

## 📡 **API Endpoints for Shopping Page**

### **Base URL:**
```javascript
const API_BASE_URL = 'https://gems-backend-zfpw.onrender.com/api';
// or for local: 'http://localhost:5000/api'
```

---

## 🔍 **1. SEARCH WITH AUTOCOMPLETE SUGGESTIONS**

### **Endpoint:**
```
GET /gems/search-suggestions?q={searchText}
```

### **When to Call:**
Call this when user types in search box (with debounce of 300ms)

### **Example Request:**
```javascript
// When user types "emer"
GET /gems/search-suggestions?q=emer
```

### **Response:**
```json
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

### **Implementation:**
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/gems/search-suggestions?q=${searchQuery}`
        );
        
        if (response.data.success) {
          setSuggestions(response.data.suggestions);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Search suggestions error:', error);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'name') {
      // Navigate to gem detail page
      navigate(`/gems/${suggestion.gemId}`);
    } else if (suggestion.type === 'planet') {
      // Filter by planet
      navigate(`/shop?planet=${suggestion.value}`);
    } else if (suggestion.type === 'zodiac') {
      // Filter by zodiac
      navigate(`/shop?zodiac=${suggestion.value}`);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search gems by name, planet, or zodiac..."
        className="search-input"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.icon && <span>{suggestion.icon}</span>}
              <span>{suggestion.label}</span>
              {suggestion.type === 'name' && (
                <span className="badge">{suggestion.type}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 📋 **2. GET ALL GEMS WITH FILTERS**

### **Endpoint:**
```
GET /gems
```

### **Query Parameters:**
All parameters are optional

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | Number | Page number | 1 |
| `limit` | Number | Items per page | 12 |
| `search` | String | Search in name/hindi/description | "emerald" |
| `planet` | String | Filter by planet | "Mercury" |
| `minPrice` | Number | Minimum price | 10000 |
| `maxPrice` | Number | Maximum price | 100000 |
| `availability` | Boolean | Only available gems | true |

### **Example Requests:**
```javascript
// Get all gems (first page)
GET /gems?page=1&limit=12

// Search by name
GET /gems?search=emerald

// Filter by planet
GET /gems?planet=Mercury

// Filter by price range
GET /gems?minPrice=10000&maxPrice=100000

// Combine filters
GET /gems?search=ruby&planet=Sun&minPrice=50000&maxPrice=200000&page=1&limit=12
```

### **Response:**
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
      "planetHindi": "बुध ग्रह",
      "color": "Green",
      "description": "Beautiful natural emerald with excellent clarity...",
      "benefits": ["Enhances intelligence", "Improves communication"],
      "suitableFor": ["Teachers", "Lawyers", "Writers", "Gemini", "Virgo"],
      "price": 50000,
      "sizeWeight": 5.5,
      "sizeUnit": "carat",
      "stock": 10,
      "availability": true,
      "certification": "Govt. Lab Certified",
      "origin": "Sri Lanka",
      "deliveryDays": 7,
      "heroImage": "https://res.cloudinary.com/.../emerald.jpg",
      "additionalImages": ["https://..."],
      "seller": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Raj Kumar Gems"
      },
      "createdAt": "2024-10-09T10:30:00.000Z",
      "updatedAt": "2024-10-09T10:30:00.000Z"
    }
  ]
}
```

### **Implementation:**
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const ShoppingPage = () => {
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    planet: '',
    minPrice: '',
    maxPrice: '',
    zodiac: '',
    availability: true
  });

  // Fetch gems
  const fetchGems = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {
        page: currentPage,
        limit: 12
      };

      if (filters.search) params.search = filters.search;
      if (filters.planet) params.planet = filters.planet;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.availability !== undefined) params.availability = filters.availability;

      const response = await axios.get(`${API_BASE_URL}/gems`, { params });

      if (response.data.success) {
        setGems(response.data.gems);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching gems:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when filters or page changes
  useEffect(() => {
    fetchGems();
  }, [currentPage, filters]);

  // Handle search
  const handleSearch = (searchText) => {
    setFilters({ ...filters, search: searchText });
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
    setCurrentPage(1);
  };

  return (
    <div className="shopping-page">
      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Filters */}
      <div className="filters">
        <select 
          value={filters.planet} 
          onChange={(e) => handleFilterChange('planet', e.target.value)}
        >
          <option value="">All Planets</option>
          <option value="Mercury">Mercury</option>
          <option value="Sun">Sun</option>
          <option value="Moon">Moon</option>
          <option value="Mars">Mars</option>
          <option value="Jupiter">Jupiter</option>
          <option value="Venus">Venus</option>
          <option value="Saturn">Saturn</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
        />
      </div>

      {/* Gems Grid */}
      <div className="gems-grid">
        {loading ? (
          <p>Loading...</p>
        ) : (
          gems.map(gem => (
            <div key={gem._id} className="gem-card">
              <img src={gem.heroImage} alt={gem.name} />
              <h3>{gem.name}</h3>
              <p>{gem.hindiName}</p>
              <p>₹{gem.price.toLocaleString()}</p>
              <p>{gem.planet}</p>
              <button onClick={() => navigate(`/gems/${gem._id}`)}>
                View Details
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
```

---

## 🎯 **3. FILTER BY ZODIAC SIGN**

### **Endpoint:**
```
GET /gems/filter/zodiac/:zodiacSign
```

### **Example:**
```
GET /gems/filter/zodiac/Gemini?page=1&limit=12
GET /gems/filter/zodiac/Leo
GET /gems/filter/zodiac/Aries
```

### **Response:**
```json
{
  "success": true,
  "count": 5,
  "totalPages": 1,
  "currentPage": 1,
  "zodiacSign": "Gemini",
  "gems": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Emerald",
      "hindiName": "Panna (पन्ना)",
      "planet": "Mercury (Budh)",
      "suitableFor": ["Teachers", "Lawyers", "Gemini", "Virgo"],
      "price": 50000,
      "heroImage": "https://...",
      // ... all gem fields
    }
  ]
}
```

---

## 🪐 **4. FILTER BY PLANET**

### **Endpoint:**
```
GET /gems/filter/planet/:planet
```

### **Example:**
```
GET /gems/filter/planet/Mercury
GET /gems/filter/planet/Sun
GET /gems/filter/planet/Moon
```

### **Response:**
```json
{
  "success": true,
  "count": 8,
  "totalPages": 1,
  "currentPage": 1,
  "planet": "Mercury",
  "gems": [
    // Array of gems for this planet
  ]
}
```

---

## 📊 **COMPLETE API ENDPOINTS SUMMARY**

| Endpoint | Method | Purpose | Example |
|----------|--------|---------|---------|
| `/gems/search-suggestions?q=emer` | GET | Autocomplete suggestions | Search dropdown |
| `/gems?search=emerald` | GET | Search gems | Main search |
| `/gems?planet=Mercury` | GET | Filter by planet | Filter dropdown |
| `/gems?minPrice=10000&maxPrice=100000` | GET | Price range filter | Price slider |
| `/gems/filter/zodiac/Gemini` | GET | Filter by zodiac | Zodiac filter |
| `/gems/filter/planet/Mercury` | GET | Filter by planet | Planet filter |
| `/gems/:id` | GET | Get single gem | Gem detail page |

---

## 💻 **COMPLETE AXIOS SERVICE FILE**

Copy this entire file to your frontend:

```javascript
// src/services/gemAPI.js

import axios from 'axios';

const API_BASE_URL = 'https://gems-backend-zfpw.onrender.com/api';
// For local development: 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Something went wrong');
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.message || 'Something went wrong');
    }
  }
);

// ========================================
// GEM APIs - Shopping Page
// ========================================

export const gemAPI = {
  /**
   * Get search suggestions for autocomplete
   * @param {string} query - Search query (min 2 chars)
   * @returns {Promise} Suggestions array
   */
  getSearchSuggestions: async (query) => {
    if (!query || query.length < 2) {
      return { success: true, suggestions: [] };
    }
    return await apiClient.get(`/gems/search-suggestions?q=${query}`);
  },

  /**
   * Get all gems with filters
   * @param {Object} filters - Filter options
   * @returns {Promise} Gems array with pagination
   */
  getGems: async (filters = {}) => {
    const params = {};
    
    // Add only non-empty filters
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.search) params.search = filters.search;
    if (filters.planet) params.planet = filters.planet;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.availability !== undefined) params.availability = filters.availability;

    return await apiClient.get('/gems', { params });
  },

  /**
   * Get single gem by ID
   * @param {string} gemId - Gem ID
   * @returns {Promise} Gem object
   */
  getGemById: async (gemId) => {
    return await apiClient.get(`/gems/${gemId}`);
  },

  /**
   * Filter gems by zodiac sign
   * @param {string} zodiacSign - Zodiac sign name
   * @param {Object} options - Pagination options
   * @returns {Promise} Gems array
   */
  getGemsByZodiac: async (zodiacSign, options = {}) => {
    const params = {
      page: options.page || 1,
      limit: options.limit || 12
    };
    return await apiClient.get(`/gems/filter/zodiac/${zodiacSign}`, { params });
  },

  /**
   * Filter gems by planet
   * @param {string} planet - Planet name
   * @param {Object} options - Pagination options
   * @returns {Promise} Gems array
   */
  getGemsByPlanet: async (planet, options = {}) => {
    const params = {
      page: options.page || 1,
      limit: options.limit || 12
    };
    return await apiClient.get(`/gems/filter/planet/${planet}`, { params });
  }
};

export default gemAPI;
```

---

## 🎨 **COMPLETE SHOPPING PAGE COMPONENT**

```javascript
// src/pages/ShoppingPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import gemAPI from '../services/gemAPI';
import './ShoppingPage.css';

const ShoppingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [filters, setFilters] = useState({
    planet: searchParams.get('planet') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    zodiac: searchParams.get('zodiac') || '',
  });

  // Fetch gems
  const fetchGems = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        search: searchQuery
      };

      if (filters.planet) params.planet = filters.planet;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.zodiac) {
        // If zodiac filter, use zodiac endpoint
        const response = await gemAPI.getGemsByZodiac(filters.zodiac, { page: currentPage, limit: 12 });
        setGems(response.gems);
        setTotalPages(response.totalPages);
        setTotalCount(response.count);
        setLoading(false);
        return;
      }

      const response = await gemAPI.getGems(params);
      
      setGems(response.gems);
      setTotalPages(response.totalPages);
      setTotalCount(response.count);
    } catch (error) {
      console.error('Error fetching gems:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestions for autocomplete
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await gemAPI.getSearchSuggestions(searchQuery);
        setSuggestions(response.suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch gems when filters change
  useEffect(() => {
    fetchGems();
  }, [currentPage, filters, searchQuery]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'name') {
      navigate(`/gems/${suggestion.gemId}`);
    } else if (suggestion.type === 'planet') {
      setFilters({ ...filters, planet: suggestion.value });
      setSearchQuery('');
    } else if (suggestion.type === 'zodiac') {
      setFilters({ ...filters, zodiac: suggestion.value });
      setSearchQuery('');
    }
    setShowSuggestions(false);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setShowSuggestions(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      planet: '',
      minPrice: '',
      maxPrice: '',
      zodiac: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="shopping-page">
      {/* Header */}
      <div className="page-header">
        <h1>Browse Gemstones</h1>
        <p>{totalCount} gems available</p>
      </div>

      {/* Search Bar with Autocomplete */}
      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search by gem name, planet, or zodiac sign..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍 Search
            </button>

            {/* Autocomplete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`suggestion-item suggestion-${suggestion.type}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.icon && (
                      <span className="suggestion-icon">{suggestion.icon}</span>
                    )}
                    <span className="suggestion-label">{suggestion.label}</span>
                    <span className="suggestion-type">{suggestion.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Active Filters Display */}
      {(filters.planet || filters.zodiac || searchQuery || filters.minPrice) && (
        <div className="active-filters">
          <span>Active Filters:</span>
          {searchQuery && <span className="filter-tag">Search: {searchQuery}</span>}
          {filters.planet && <span className="filter-tag">Planet: {filters.planet}</span>}
          {filters.zodiac && <span className="filter-tag">Zodiac: {filters.zodiac}</span>}
          {filters.minPrice && <span className="filter-tag">Min: ₹{filters.minPrice}</span>}
          {filters.maxPrice && <span className="filter-tag">Max: ₹{filters.maxPrice}</span>}
          <button onClick={clearFilters} className="clear-filters">Clear All</button>
        </div>
      )}

      {/* Filters Sidebar */}
      <div className="content-wrapper">
        <aside className="filters-sidebar">
          <h3>Filters</h3>

          {/* Planet Filter */}
          <div className="filter-group">
            <label>Filter by Planet</label>
            <select 
              value={filters.planet}
              onChange={(e) => setFilters({ ...filters, planet: e.target.value })}
            >
              <option value="">All Planets</option>
              <option value="Sun">Sun (Surya)</option>
              <option value="Moon">Moon (Chandra)</option>
              <option value="Mars">Mars (Mangal)</option>
              <option value="Mercury">Mercury (Budh)</option>
              <option value="Jupiter">Jupiter (Guru)</option>
              <option value="Venus">Venus (Shukra)</option>
              <option value="Saturn">Saturn (Shani)</option>
            </select>
          </div>

          {/* Zodiac Filter */}
          <div className="filter-group">
            <label>Filter by Zodiac Sign</label>
            <select 
              value={filters.zodiac}
              onChange={(e) => setFilters({ ...filters, zodiac: e.target.value })}
            >
              <option value="">All Zodiac Signs</option>
              <option value="Aries">♈ Aries (Mesh)</option>
              <option value="Taurus">♉ Taurus (Vrishabh)</option>
              <option value="Gemini">♊ Gemini (Mithun)</option>
              <option value="Cancer">♋ Cancer (Kark)</option>
              <option value="Leo">♌ Leo (Singh)</option>
              <option value="Virgo">♍ Virgo (Kanya)</option>
              <option value="Libra">♎ Libra (Tula)</option>
              <option value="Scorpio">♏ Scorpio (Vrishchik)</option>
              <option value="Sagittarius">♐ Sagittarius (Dhanu)</option>
              <option value="Capricorn">♑ Capricorn (Makar)</option>
              <option value="Aquarius">♒ Aquarius (Kumbh)</option>
              <option value="Pisces">♓ Pisces (Meen)</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>

          {/* Quick Price Filters */}
          <div className="filter-group">
            <label>Quick Price Filters</label>
            <button onClick={() => setFilters({ ...filters, minPrice: '', maxPrice: 25000 })}>
              Under ₹25,000
            </button>
            <button onClick={() => setFilters({ ...filters, minPrice: 25000, maxPrice: 50000 })}>
              ₹25,000 - ₹50,000
            </button>
            <button onClick={() => setFilters({ ...filters, minPrice: 50000, maxPrice: 100000 })}>
              ₹50,000 - ₹1,00,000
            </button>
            <button onClick={() => setFilters({ ...filters, minPrice: 100000, maxPrice: '' })}>
              Above ₹1,00,000
            </button>
          </div>
        </aside>

        {/* Gems Grid */}
        <main className="gems-main">
          {loading ? (
            <div className="loading">Loading gems...</div>
          ) : gems.length === 0 ? (
            <div className="no-results">
              <p>No gems found</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="gems-grid">
                {gems.map((gem) => (
                  <div key={gem._id} className="gem-card">
                    <div className="gem-image">
                      <img src={gem.heroImage} alt={gem.name} />
                      {gem.stock < 5 && gem.stock > 0 && (
                        <span className="stock-badge">Only {gem.stock} left!</span>
                      )}
                      {gem.stock === 0 && (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </div>

                    <div className="gem-details">
                      <h3>{gem.name}</h3>
                      <p className="hindi-name">{gem.hindiName}</p>
                      <p className="planet">🪐 {gem.planet}</p>
                      
                      <div className="price-section">
                        <span className="price">₹{gem.price.toLocaleString('en-IN')}</span>
                        <span className="size">{gem.sizeWeight} {gem.sizeUnit}</span>
                      </div>

                      <p className="delivery">🚚 {gem.deliveryDays} days delivery</p>

                      <div className="card-actions">
                        <button 
                          onClick={() => navigate(`/gems/${gem._id}`)}
                          className="view-details-btn"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => handleAddToCart(gem._id)}
                          className="add-to-cart-btn"
                          disabled={!gem.availability || gem.stock === 0}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>

                  <div className="page-numbers">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShoppingPage;
```

---

## 🎨 **SUGGESTED CSS FOR AUTOCOMPLETE**

```css
/* ShoppingPage.css */

.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
}

.search-input {
  width: 100%;
  padding: 15px 50px 15px 20px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  margin-top: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-icon {
  font-size: 20px;
}

.suggestion-label {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.suggestion-type {
  font-size: 11px;
  padding: 2px 8px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  text-transform: uppercase;
}

.suggestion-name {
  background: #e8f5e9;
  color: #2e7d32;
}

.suggestion-planet {
  background: #fff3e0;
  color: #e65100;
}

.suggestion-zodiac {
  background: #f3e5f5;
  color: #6a1b9a;
}

.active-filters {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
}

.filter-tag {
  padding: 5px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 13px;
}

.clear-filters {
  margin-left: auto;
  padding: 5px 15px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}
```

---

## 📱 **USAGE EXAMPLES**

### **Example 1: Search Autocomplete**
```javascript
// When user types "emer"
const response = await gemAPI.getSearchSuggestions('emer');

// Response:
{
  "success": true,
  "suggestions": [
    {
      "type": "name",
      "value": "Emerald",
      "label": "Emerald (Panna (पन्ना))",
      "gemId": "507f1f77bcf86cd799439011"
    }
  ]
}

// Show in dropdown, when clicked → navigate to /gems/507f1f77bcf86cd799439011
```

### **Example 2: Get All Gems**
```javascript
const response = await gemAPI.getGems({ page: 1, limit: 12 });
// Display gems in grid
```

### **Example 3: Filter by Planet**
```javascript
const response = await gemAPI.getGems({ planet: 'Mercury', page: 1 });
// or
const response = await gemAPI.getGemsByPlanet('Mercury');
// Display filtered gems
```

### **Example 4: Filter by Zodiac**
```javascript
const response = await gemAPI.getGemsByZodiac('Gemini');
// Display gems suitable for Gemini
```

### **Example 5: Search with Multiple Filters**
```javascript
const response = await gemAPI.getGems({
  search: 'emerald',
  planet: 'Mercury',
  minPrice: 10000,
  maxPrice: 100000,
  page: 1,
  limit: 12
});
```

---

## 🚀 **TO ADD DUMMY DATA**

Run this command to add 2 sample gems:
```bash
node addDummyGems.js
```

This will create:
1. **Emerald** - ₹50,000 - Mercury - For Gemini/Virgo
2. **Ruby** - ₹75,000 - Sun - For Leo/Aries/Sagittarius

---

## ✅ **CHECKLIST FOR FRONTEND DEVELOPER**

- [ ] Copy `gemAPI.js` service file
- [ ] Implement search bar with autocomplete
- [ ] Add filter dropdowns (Planet, Zodiac, Price)
- [ ] Display gems in grid layout
- [ ] Add pagination controls
- [ ] Show active filters with clear option
- [ ] Handle loading states
- [ ] Handle empty results
- [ ] Make gem cards clickable to detail page
- [ ] Add to cart functionality

---

## 🎉 **READY TO USE!**

All endpoints are tested and working. Share this file with your frontend developer and they'll have everything they need to implement the shopping page with search and filters! 🚀
