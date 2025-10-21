# 🔐 Frontend Password Reset Implementation Guide

## Complete End-to-End Password Reset Flow

---

## 🎯 Overview

This guide provides the complete frontend implementation for password reset functionality that works with your backend.

**Backend Endpoints Available:**
- `POST /api/auth/forgot-password` - Send reset email
- `GET /api/auth/reset-password/:token` - Verify token & redirect
- `PUT /api/auth/reset-password/:token` - Reset password

---

## 📁 File Structure

```
src/
├── components/
│   └── auth/
│       ├── ForgotPassword.js
│       └── ResetPassword.js
├── pages/
│   └── ResetPasswordPage.js
├── services/
│   └── api.js
└── App.js (routing)
```

---

## 🔧 1. API Service (src/services/api.js)

```javascript
// Add these functions to your existing api.js file

const API_BASE_URL = 'http://localhost:5000/api'; // or your backend URL

export const authAPI = {
  // Existing functions...
  
  // Forgot Password
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // Reset Password
  async resetPassword(token, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'Network error' };
    }
  }
};
```

---

## 🔧 2. Forgot Password Component (src/components/auth/ForgotPassword.js)

```javascript
import React, { useState } from 'react';
import { authAPI } from '../../services/api';

const ForgotPassword = ({ onSuccess, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      const result = await authAPI.forgotPassword(email);
      
      if (result.success) {
        setMessage('Password reset email sent! Check your inbox.');
        setTimeout(() => {
          onSuccess && onSuccess();
        }, 2000);
      } else {
        setError(result.message || 'Failed to send reset email');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>🔐 Forgot Password?</h2>
        <p>Enter your email address and we'll send you a link to reset your password.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              ✅ {message}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="back-to-login">
          <button 
            onClick={onBackToLogin}
            className="btn-link"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
```

---

## 🔧 3. Reset Password Component (src/components/auth/ResetPassword.js)

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // Check if token exists
    if (!token) {
      setError('Invalid reset link');
      setTokenValid(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validation
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await authAPI.resetPassword(token, password);
      
      if (result.success) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <h2>❌ Invalid Reset Link</h2>
          <p>The password reset link is invalid or has expired.</p>
          <button 
            onClick={() => navigate('/forgot-password')}
            className="btn-primary"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>🔐 Reset Your Password</h2>
        <p>Enter your new password below.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              ✅ {message}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="back-to-login">
          <button 
            onClick={() => navigate('/login')}
            className="btn-link"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
```

---

## 🔧 4. Reset Password Page (src/pages/ResetPasswordPage.js)

```javascript
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const errorParam = searchParams.get('error');
    
    if (errorParam) {
      if (errorParam === 'invalid_token') {
        setError('Invalid or expired reset token');
      } else if (errorParam === 'server_error') {
        setError('Server error. Please try again later.');
      }
    } else if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('No reset token provided');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validation
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('No reset token available');
      setLoading(false);
      return;
    }

    try {
      const result = await authAPI.resetPassword(token, password);
      
      if (result.success) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !token) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-card">
          <h2>❌ Invalid Reset Link</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/forgot-password')}
            className="btn-primary"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <h2>🔐 Reset Your Password</h2>
        <p>Enter your new password below.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              ✅ {message}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="back-to-login">
          <button 
            onClick={() => navigate('/login')}
            className="btn-link"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
```

---

## 🔧 5. App.js Routing

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPasswordPage from './pages/ResetPasswordPage';
// ... other imports

function App() {
  return (
    <Router>
      <Routes>
        {/* Other routes */}
        
        {/* Password Reset Routes */}
        <Route 
          path="/forgot-password" 
          element={<ForgotPassword />} 
        />
        <Route 
          path="/reset-password" 
          element={<ResetPasswordPage />} 
        />
        <Route 
          path="/reset-password/:token" 
          element={<ResetPasswordPage />} 
        />
        
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
```

---

## 🎨 6. CSS Styles

```css
/* Add these styles to your CSS file */

.forgot-password-container,
.reset-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.forgot-password-card,
.reset-password-card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.forgot-password-card h2,
.reset-password-card h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
}

.forgot-password-card p,
.reset-password-card p {
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-link {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}

.btn-link:hover {
  color: #764ba2;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 14px;
}

.success-message {
  background: #efe;
  color: #3c3;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 14px;
}

.back-to-login {
  margin-top: 20px;
}
```

---

## 🔄 Complete Flow

### 1. **User Flow:**
1. User clicks "Forgot Password" on login page
2. User enters email → `POST /api/auth/forgot-password`
3. User receives email with link: `http://localhost:5000/api/auth/reset-password/TOKEN`
4. User clicks link → Backend redirects to: `http://localhost:3000/reset-password?token=TOKEN`
5. User enters new password → `PUT /api/auth/reset-password/TOKEN`
6. Success → Redirect to login page

### 2. **Backend Flow:**
1. `POST /forgot-password` → Generate token, send email
2. `GET /reset-password/:token` → Verify token, redirect to frontend
3. `PUT /reset-password/:token` → Reset password

---

## ✅ Testing Checklist

- [ ] Forgot password sends email
- [ ] Email link redirects to frontend
- [ ] Reset password form loads with token
- [ ] Password validation works
- [ ] Success redirects to login
- [ ] Error handling works
- [ ] Invalid token shows error
- [ ] Expired token shows error

---

## 🚀 Ready to Use!

This implementation provides a complete, production-ready password reset flow that works seamlessly with your backend!

**Key Features:**
- ✅ Complete end-to-end flow
- ✅ Proper error handling
- ✅ Token validation
- ✅ Responsive design
- ✅ Loading states
- ✅ Success/error messages
- ✅ Automatic redirects
