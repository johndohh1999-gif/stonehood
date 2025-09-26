const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for all origins (required for Replit proxy)
app.use(cors({
  origin: '*',
  credentials: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files with cache control (required for Replit proxy)
app.use(express.static('.', {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// Serve the main HTML file at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Import email utility
const { sendContactEmail } = require('./utils/replitmail');

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stonehood API is running' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }
    
    // ⚠️  SET YOUR EMAIL HERE ⚠️
    // Replace this with your actual email address where you want to receive contact form submissions
    const YOUR_EMAIL = 'your-email@example.com';
    
    // TODO: User should replace YOUR_EMAIL with their actual email address
    if (YOUR_EMAIL === 'your-email@example.com') {
      console.log('⚠️  WARNING: Please set your email address in server.js line 37');
      console.log('📧 Contact form data:', { name, email, subject, message });
      
      // For now, just log the message and return success
      return res.json({ 
        success: true, 
        message: 'Message received! (Currently in demo mode - check server console for details)' 
      });
    }
    
    // Send email using Replit Mail integration
    const result = await sendContactEmail({
      name,
      email, 
      subject,
      message
    }, YOUR_EMAIL = 'muhmdusm@gmail.com');
    
    console.log('✅ Contact email sent successfully:', result.messageId);
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully! We\'ll get back to you soon.' 
    });
    
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

// Handle client-side routing - serve index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;

// Bind to 0.0.0.0 for Replit environment (required for frontend access)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Stonehood server running at http://0.0.0.0:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database available: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
});
