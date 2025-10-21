# 🚀 Render Email Setup Guide

## Issue: Email Not Working in Production

**Problem**: Email works locally but not on Render production server.

**Root Cause**: Environment variables not set in Render dashboard.

---

## 🔧 Solution Steps

### **Step 1: Set Environment Variables in Render**

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Login to your account
   - Select your backend service

2. **Navigate to Environment Tab**
   - Click on your service
   - Go to "Environment" tab
   - Click "Add Environment Variable"

3. **Add These Variables** (one by one):

```bash
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = auralanegt@gmail.com
EMAIL_PASS = pmsh lmzg pejq fqcz
CLIENT_URL = https://auralaneweb.vercel.app
NODE_ENV = production
```

### **Step 2: Redeploy Your Service**

After adding environment variables:
1. Click "Save Changes"
2. Your service will automatically redeploy
3. Wait for deployment to complete

### **Step 3: Test Email Functionality**

Test the forgot password endpoint:
```bash
POST https://gems-backend-u.onrender.com/api/auth/forgot-password
Content-Type: application/json

{
  "email": "auralanegt@gmail.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset email sent successfully! Check your inbox."
}
```

---

## 🔍 Debugging Steps

### **Check Environment Variables**

Add this endpoint to debug environment variables:

```javascript
// Add this to your routes/auth.js for debugging
router.get('/debug/env', (req, res) => {
  res.json({
    EMAIL_HOST: process.env.EMAIL_HOST || 'Not set',
    EMAIL_PORT: process.env.EMAIL_PORT || 'Not set',
    EMAIL_USER: process.env.EMAIL_USER || 'Not set',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set',
    CLIENT_URL: process.env.CLIENT_URL || 'Not set'
  });
});
```

Test: `GET https://gems-backend-u.onrender.com/api/auth/debug/env`

### **Check Render Logs**

1. Go to your Render service
2. Click "Logs" tab
3. Look for email configuration logs
4. Check for any error messages

---

## 🎯 Expected Behavior

### **Before Fix (Current):**
```json
{
  "success": true,
  "message": "Password reset token generated (email not configured)",
  "resetToken": "865006f1488eafec830c98adc3415a41a8296033"
}
```

### **After Fix (Expected):**
```json
{
  "success": true,
  "message": "Password reset email sent successfully! Check your inbox."
}
```

---

## 🔐 Gmail App Password Setup

If you haven't set up Gmail App Password:

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Turn on 2-Step Verification

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app
   - Copy the 16-character password

3. **Use in Render**
   - Set `EMAIL_PASS` to the 16-character password (no spaces)

---

## 🚀 Quick Fix Checklist

- [ ] Add `EMAIL_HOST` to Render environment
- [ ] Add `EMAIL_PORT` to Render environment  
- [ ] Add `EMAIL_USER` to Render environment
- [ ] Add `EMAIL_PASS` to Render environment
- [ ] Add `CLIENT_URL` to Render environment
- [ ] Add `NODE_ENV=production` to Render environment
- [ ] Save changes and redeploy
- [ ] Test forgot password endpoint
- [ ] Check email inbox

---

## 🧪 Testing Commands

### **Test Forgot Password:**
```bash
curl -X POST https://gems-backend-u.onrender.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "auralanegt@gmail.com"}'
```

### **Test Environment Variables:**
```bash
curl https://gems-backend-u.onrender.com/api/auth/debug/env
```

---

## ✅ Success Indicators

When working correctly, you'll see:

1. **Console Logs:**
   ```
   📧 Email Configuration:
     Host: smtp.gmail.com
     Port: 587
     User: auralanegt@gmail.com
     Has Password: true
     Environment: production
   ```

2. **API Response:**
   ```json
   {
     "success": true,
     "message": "Password reset email sent successfully! Check your inbox."
   }
   ```

3. **Email Received:**
   - Professional HTML email in your inbox
   - Reset link that works properly

---

## 🆘 Troubleshooting

### **Still Getting Token Instead of Email?**

1. Check Render environment variables are set
2. Verify Gmail App Password is correct
3. Check Render logs for errors
4. Ensure service has been redeployed

### **Email Sending But Not Received?**

1. Check spam/junk folder
2. Verify email address is correct
3. Wait a few minutes (delivery can be delayed)
4. Check Gmail security settings

### **Connection Errors?**

1. Verify `EMAIL_HOST` and `EMAIL_PORT` are correct
2. Check if Gmail is blocking the connection
3. Try different email provider (Outlook, Yahoo)

---

## 🎉 Expected Result

After following these steps:

- ✅ **Local Development**: Works with `.env` file
- ✅ **Production (Render)**: Works with environment variables
- ✅ **Email Sending**: Professional HTML emails
- ✅ **Password Reset**: Complete end-to-end flow
- ✅ **Security**: No tokens exposed in production

**Your email system will work perfectly in both development and production!** 🚀
