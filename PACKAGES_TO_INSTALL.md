# 📦 Complete Package Installation Guide

## 🚀 **Quick Install (Recommended)**

Just run this command:
```bash
npm install
```

This will install all dependencies from `package.json`

---

## 📋 **All Packages (Automatic)**

When you run `npm install`, these will be installed:

### **Core Dependencies:**
```json
{
  "express": "^4.18.2",           // Web framework
  "mongoose": "^7.5.0",           // MongoDB ODM
  "bcryptjs": "^2.4.3",           // Password hashing
  "jsonwebtoken": "^9.0.2",       // JWT authentication
  "cors": "^2.8.5",               // CORS handling
  "dotenv": "^16.3.1",            // Environment variables
  "express-validator": "^7.0.1",  // Input validation
  "helmet": "^7.0.0",             // Security headers
  "express-rate-limit": "^6.10.0",// Rate limiting
  "multer": "^1.4.5-lts.1",       // File uploads
  "nodemailer": "^6.9.4"          // Email sending
}
```

### **Development Dependencies:**
```json
{
  "nodemon": "^3.0.1"             // Auto-restart server
}
```

---

## 🔧 **Manual Installation (If Needed)**

If `npm install` doesn't work, install one by one:

```bash
# Core packages
npm install express
npm install mongoose
npm install bcryptjs
npm install jsonwebtoken
npm install cors
npm install dotenv
npm install express-validator
npm install helmet
npm install express-rate-limit
npm install multer
npm install nodemailer

# Development package
npm install --save-dev nodemon
```

---

## ✅ **Verify Installation**

After installation, check:
```bash
# Check if node_modules folder exists
ls node_modules

# Or on Windows
dir node_modules

# Verify package.json has all dependencies
cat package.json
```

---

## 🚀 **After Installation**

### **1. Create .env file:**
```bash
# Copy example file
copy env.example .env
```

### **2. Update .env with your values:**
```env
MONGODB_URI=mongodb://localhost:27017/jewellery
JWT_SECRET=9e120d5295e12f34e59466606fe10e4c
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### **3. Create admin user:**
```bash
node createAdmin.js
```

### **4. Add dummy gems:**
```bash
node addDummyGems.js
```

### **5. Start server:**
```bash
npm run dev
```

---

## 📊 **Package Purposes**

| Package | Why We Need It |
|---------|---------------|
| `express` | Web server framework |
| `mongoose` | Connect to MongoDB database |
| `bcryptjs` | Hash passwords securely |
| `jsonwebtoken` | Create & verify JWT tokens |
| `cors` | Allow frontend to connect |
| `dotenv` | Read .env file |
| `express-validator` | Validate user inputs |
| `helmet` | Add security headers |
| `express-rate-limit` | Prevent spam/abuse |
| `multer` | Handle file uploads |
| `nodemailer` | Send emails |
| `nodemon` | Auto-restart during development |

---

## ⚠️ **Common Issues**

### **Issue: "Cannot find module 'express'"**
**Solution:**
```bash
npm install
```

### **Issue: "ENOENT: no such file or directory, open '.env'"**
**Solution:**
```bash
copy env.example .env
# Then edit .env file
```

### **Issue: "Module version mismatch"**
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🎉 **You're All Set!**

After installing packages:
1. ✅ Run `node createAdmin.js`
2. ✅ Run `node addDummyGems.js`
3. ✅ Run `npm run dev`
4. ✅ Test at `http://localhost:5000/api/health`

**Backend ready for development!** 🚀
