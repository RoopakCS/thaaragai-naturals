const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const axios = require('axios');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


const register = async (req, res) => {
  try {
    const { name, email, password, phone, wantsNewsletter } = req.body;

    // Input validate
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user (unverified)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      wantsNewsletter: wantsNewsletter || false,
      isVerified: false,
      verificationOTP: otp,
      otpExpiresAt
    });

    await newUser.save();

    // Send email
    try {
      await sendEmail({
        email: newUser.email,
        subject: 'Verify your Thaaragai Naturals Account',
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; max-width: 500px; margin: auto;">
            <h2 style="color: #1a3a28;">Welcome to Thaaragai Naturals!</h2>
            <p>Please use the following 6-digit code to verify your email address. This code expires in 10 minutes.</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2D6A2D; margin: 20px 0;">${otp}</div>
            <p style="color: #888;">If you didn't request this, please ignore this email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // We still return success but maybe log it.
    }

    res.status(201).json({ message: 'Registration successful. Please verify your email.', requiresVerification: true, email: newUser.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Check if verified
    if (!user.isVerified) {
      // Auto resend OTP if expired, or just send a new one
      const otp = generateOTP();
      user.verificationOTP = otp;
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      try {
        await sendEmail({
          email: user.email,
          subject: 'Verify your Thaaragai Naturals Account',
          html: `
            <div style="font-family: Arial, sans-serif; text-align: center; max-width: 500px; margin: auto;">
              <h2 style="color: #1a3a28;">Welcome back!</h2>
              <p>Please use the following 6-digit code to verify your email address before logging in. This code expires in 10 minutes.</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2D6A2D; margin: 20px 0;">${otp}</div>
            </div>
          `
        });
      } catch (e) {
        console.error('Email sending failed:', e);
      }
      return res.status(403).json({ message: 'Please verify your email address to log in.', requiresVerification: true, email: user.email });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    }).json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });

    if (user.verificationOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    }).json({ message: 'Email verified successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    const otp = generateOTP();
    user.verificationOTP = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your new OTP for Thaaragai Naturals',
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; max-width: 500px; margin: auto;">
            <h2 style="color: #1a3a28;">New Verification Code</h2>
            <p>Here is your new 6-digit code. It expires in 10 minutes.</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2D6A2D; margin: 20px 0;">${otp}</div>
          </div>
        `
      });
    } catch (e) {
      console.error('Email sending failed:', e);
    }

    res.json({ message: 'A new OTP has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    // Input validation
    if (!name && phone === undefined && address === undefined) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    const updatedUser = await user.save();
    
    const userWithoutPassword = { ...updatedUser._doc };
    delete userWithoutPassword.password;

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  }).json({ message: 'Logged out successfully' });
};

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    let email, name, picture, googleId;

    if (credential.startsWith('ey')) {
      // It's a JWT ID Token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
      googleId = payload.sub;
    } else {
      // It's an Access Token
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${credential}` }
      });
      email = response.data.email;
      name = response.data.name;
      picture = response.data.picture;
      googleId = response.data.sub;
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with random password since they use Google
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        name,
        email,
        password: hashedPassword,
        isVerified: true // Google accounts are implicitly verified
      });
      await user.save();
    } else if (!user.isVerified) {
      // If they had an unverified account, verify it now
      user.isVerified = true;
      user.verificationOTP = undefined;
      user.otpExpiresAt = undefined;
      await user.save();
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    }).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

module.exports = { register, login, logout, getProfile, updateProfile, verifyOTP, resendOTP, googleAuth };
