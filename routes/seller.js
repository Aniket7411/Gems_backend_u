const express = require('express');
const { body, validationResult } = require('express-validator');
const Seller = require('../models/Seller');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/role');

const router = express.Router();

// @route   GET /api/seller/profile
// @desc    Get seller profile
// @access  Private (Seller only)
router.get('/profile', protect, checkRole('seller'), async (req, res) => {
  try {
    let seller = await Seller.findOne({ user: req.user._id });

    if (!seller) {
      // Return empty profile structure if not found
      return res.json({
        success: true,
        seller: {
          user: req.user._id,
          fullName: req.user.name || '',
          email: req.user.email,
          phone: '',
          alternatePhone: '',
          shopName: '',
          shopType: '',
          businessType: '',
          yearEstablished: '',
          address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
          },
          gstNumber: '',
          panNumber: '',
          aadharNumber: '',
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          accountHolderName: '',
          businessDescription: '',
          specialization: [],
          gemTypes: [],
          website: '',
          instagram: '',
          facebook: '',
          isVerified: false,
          documentsUploaded: false
        }
      });
    }

    res.json({
      success: true,
      seller
    });

  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile retrieval'
    });
  }
});

// @route   PUT /api/seller/profile
// @desc    Create or Update seller profile
// @access  Private (Seller only)
router.put('/profile', protect, checkRole('seller'), async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      alternatePhone,
      shopName,
      shopType,
      businessType,
      yearEstablished,
      address,
      gstNumber,
      panNumber,
      aadharNumber,
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName,
      businessDescription,
      specialization,
      gemTypes,
      website,
      instagram,
      facebook,
      documentsUploaded,
      isVerified
    } = req.body;

    // Find existing seller profile
    let seller = await Seller.findOne({ user: req.user._id });

    if (!seller) {
      // Create new seller profile
      seller = new Seller({
        user: req.user._id,
        fullName: fullName || req.user.name,
        email: email || req.user.email,
        phone,
        alternatePhone,
        shopName,
        shopType,
        businessType,
        yearEstablished,
        address,
        gstNumber,
        panNumber,
        aadharNumber,
        bankName,
        accountNumber,
        ifscCode,
        accountHolderName,
        businessDescription,
        specialization,
        gemTypes,
        website,
        instagram,
        facebook,
        documentsUploaded: documentsUploaded || false,
        isVerified: isVerified || false
      });

      await seller.save();

      return res.json({
        success: true,
        message: 'Seller profile created successfully',
        seller
      });
    }

    // Update existing seller profile
    const updateData = {
      fullName,
      email,
      phone,
      alternatePhone,
      shopName,
      shopType,
      businessType,
      yearEstablished,
      address,
      gstNumber,
      panNumber,
      aadharNumber,
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName,
      businessDescription,
      specialization,
      gemTypes,
      website,
      instagram,
      facebook,
      documentsUploaded
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedSeller = await Seller.findByIdAndUpdate(
      seller._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Seller profile updated successfully',
      seller: updatedSeller
    });

  } catch (error) {
    console.error('Update seller profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during profile update'
    });
  }
});

module.exports = router;