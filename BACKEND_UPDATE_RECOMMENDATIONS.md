# Backend Update Recommendations and Recent Changes

## Recent Updates (Completed)

### ✅ Related Products Feature (Implemented)
- **Date:** Latest update
- **Endpoint:** `GET /api/gems/:id`
- **Status:** ✅ Implemented

The single gem endpoint now returns related products based on:
1. Same gem name (highest priority)
2. Same planet
3. Same color
4. Similar price range (within 30% of current price)

**Response Format:**
```json
{
  "success": true,
  "gem": { ... },
  "relatedProducts": [
    {
      "_id": "...",
      "name": "...",
      "hindiName": "...",
      "planet": "...",
      "color": "...",
      "price": 1000,
      "heroImage": "...",
      "seller": { ... },
      ...
    }
  ]
}
```

**Features:**
- Returns up to 8 related products
- Only includes available products
- Excludes the current gem
- Falls back to other available gems if not enough matches
- Includes seller information for each related product

### ✅ Reviews Endpoint Fix (Implemented)
- **Date:** Latest update
- **Endpoint:** `GET /api/reviews/gem/:gemId`
- **Status:** ✅ Fixed

**Issue Fixed:**
- Added missing `mongoose` import in `routes/reviews.js`
- Added ObjectId validation before processing requests
- Fixed 500 Internal Server Error

---

## Issue Identified
There's confusion between `name` and `category` fields when adding gems:
- Frontend sends `name` (which contains category values like "Emerald", "Ruby", etc.)
- Frontend now also sends `category` (automatically set to same as name)
- Backend should ensure both fields are properly handled

## Recommended Backend Changes

### 1. Update Gem Creation Endpoint (`POST /gems`)

**Current Issue:**
- If `category` is not provided, it might be undefined
- `name` field contains category values

**Recommended Fix:**
```javascript
// In your gem creation controller (e.g., gemsController.js or gemRoutes.js)

// When creating a new gem:
const gemData = {
    name: req.body.name,
    category: req.body.category || req.body.name, // Use category if provided, otherwise use name
    // ... other fields
};

// Or add middleware to normalize:
const normalizeGemData = (req, res, next) => {
    if (req.body.name && !req.body.category) {
        req.body.category = req.body.name;
    }
    next();
};

// Apply middleware to gem creation route
router.post('/gems', normalizeGemData, createGem);
```

### 2. Update Gem Schema Validation

**Recommended:**
```javascript
// In your gem schema/model (e.g., Gem.js or gemModel.js)

const gemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Gem name is required'],
        trim: true,
        maxlength: [255, 'Name cannot be more than 255 characters']
    },
    category: {
        type: String,
        trim: true,
        maxlength: [100, 'Category cannot be more than 100 characters'],
        // Set default to name if not provided
        default: function() {
            return this.name;
        }
    },
    // ... rest of schema
}, {
    timestamps: true
});

// Pre-save hook to ensure category is set
gemSchema.pre('save', function(next) {
    if (!this.category && this.name) {
        this.category = this.name;
    }
    next();
});
```

### 3. Update Gem Update Endpoint (`PUT /gems/:id`)

**Recommended:**
```javascript
// In your gem update controller

const updateGem = async (req, res) => {
    try {
        const { name, category, ...otherFields } = req.body;
        
        // Ensure category is set if name is updated
        const updateData = {
            ...otherFields
        };
        
        if (name) {
            updateData.name = name;
            // If category not provided, set it to name
            updateData.category = category || name;
        } else if (category) {
            updateData.category = category;
        }
        
        const gem = await Gem.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        // ... rest of update logic
    } catch (error) {
        // ... error handling
    }
};
```

### 4. Related Products Query (✅ IMPLEMENTED)

**Current Implementation:**
The related products feature has been implemented in `routes/gems.js` for the `GET /api/gems/:id` endpoint.

**Implementation Details:**
- Uses multi-criteria matching: same name, planet, color, or similar price range
- Returns up to 8 related products
- Only includes available products
- Includes seller information for each product
- Falls back to other available gems if not enough matches

**Code Location:** `routes/gems.js` (lines 436-510)

**Future Enhancement (Optional):**
If you want to use category for related products instead:
```javascript
// Alternative approach using category
const relatedProducts = await Gem.find({
    _id: { $ne: gem._id },
    category: gem.category || gem.name, // Fallback to name if category not set
    availability: true
})
.select('name hindiName planet color price discount discountType heroImage images stock availability rating reviews seller createdAt')
.limit(8)
.populate('seller', 'fullName shopName isVerified rating');
```

## Summary

### Completed Updates:
1. ✅ **Related Products Feature** - Implemented in `GET /api/gems/:id` endpoint
2. ✅ **Reviews Endpoint Fix** - Fixed mongoose import and added ObjectId validation

### Pending Recommendations:
1. ⏳ Frontend now sends both `name` and `category` fields
2. ⏳ Backend should ensure `category` defaults to `name` if not provided
3. ⏳ Add pre-save hook or middleware to normalize category
4. ✅ Related products query implemented (uses multi-criteria matching)
5. ⏳ Ensure existing gems without category get category set to name

**Migration Script (if needed):**
```javascript
// One-time migration to set category for existing gems
const migrateGems = async () => {
    const gems = await Gem.find({ $or: [{ category: { $exists: false } }, { category: '' }] });
    
    for (const gem of gems) {
        gem.category = gem.name;
        await gem.save();
    }
    
    console.log(`Migrated ${gems.length} gems`);
};
```

## Testing Checklist

### Related Products Feature:
- [x] Single gem endpoint returns related products
- [x] Related products exclude the current gem
- [x] Related products only include available items
- [x] Related products include seller information
- [ ] Test with gems that have same name
- [ ] Test with gems that have same planet
- [ ] Test with gems that have same color
- [ ] Test with gems in similar price range

### Reviews Endpoint:
- [x] Reviews endpoint no longer returns 500 error
- [x] ObjectId validation works correctly
- [ ] Test with invalid gem ID format
- [ ] Test with non-existent gem ID

### Category/Name Handling (Pending):
- [ ] Create gem with only name → category should be set automatically
- [ ] Create gem with both name and category → both should be saved
- [ ] Update gem name → category should update if not explicitly set
- [ ] Seller dashboard should display both name and category correctly

