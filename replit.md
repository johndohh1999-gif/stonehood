# Stonehood - E-commerce Website

## Overview
Stonehood is a modern streetwear e-commerce website built with HTML, CSS, and JavaScript. The site features a clean, responsive design with product catalogs for men's and women's clothing, an interactive shopping cart, and smooth animations.

## Project Architecture

### Frontend
- **Technology Stack**: Pure HTML5, CSS3, and Vanilla JavaScript
- **No Build Process**: Static files served directly
- **No Framework**: No React, Vue, or other frontend frameworks

### Structure
```
/
├── index.html              # Homepage with hero carousel
├── styles.css              # Global styles
├── script.js               # Main JavaScript for homepage
├── cart.js                 # Shopping cart functionality
├── contact.html            # Contact page
├── /men                    # Men's product pages
│   ├── men.html
│   ├── men-hoodies.html
│   ├── men-jackets.html
│   ├── men-shirts.html
│   ├── men-footwear.html
│   ├── men.css
│   └── men.js
├── /women                  # Women's product pages
│   ├── women.html
│   ├── women-shirts.html
│   ├── women-jeans&trousers.html
│   ├── women-outerwear.html
│   ├── women-footwear.html
│   ├── women.css
│   └── women.js
├── /juniors                # Juniors product pages
│   ├── juniors.html
│   ├── juniors-tshirts.html
│   ├── juniors-hoodies.html
│   ├── juniors-shorts.html
│   ├── juniors-sneakers.html
│   ├── juniors.css
│   └── juniors.js
└── /images                 # Product and UI images
```

### Key Features
- **Interactive Hero Carousel**: Auto-playing carousel with swipe/drag support
- **Shopping Cart System**: LocalStorage-based cart with add/remove/quantity controls
- **Product Catalog**: Separate pages for men's, women's, and juniors categories
- **Responsive Menu**: Full-screen navigation with category submenus
- **Login/Signup Modal**: Flip card animation for authentication forms
- **GSAP Animations**: Smooth scroll-based animations (vertical sliding)

### External Dependencies (CDN)
- Font Awesome 6.5.0 (icons)
- Google Fonts (Playfair Display, Montserrat, Anton)
- GSAP 3.10.0 (animations)
- ScrollTrigger plugin

## Development Setup

### Current Configuration
- **Web Server**: Python HTTP server on port 5000
- **Host**: 0.0.0.0 (allows Replit proxy access)
- **Workflow**: Single "Server" workflow serving static files

### Running Locally
The server automatically starts via the configured workflow. The site is served on port 5000.

## Recent Changes
- October 21, 2025: Completed Replit environment import and accessibility improvements
  - Successfully migrated project to Replit environment
  - Python 3.11 already installed (no additional packages required)
  - Added autocomplete attributes to all form inputs across all pages
  - Fixed browser console warnings about missing autocomplete attributes
  - Verified server running correctly on port 5000
  - All pages (index, men, women, juniors) now have proper form accessibility


- October 16, 2025: Fixed Women's section navigation and content accuracy
  - Renamed women-dresses.html to women-jeans&trousers.html to better reflect actual content
  - Updated all content references from "jackets/dresses" to "jeans/trousers"
  - Fixed women-shirts.html title from "Men's Hoodies" to "Women's Shirts"
  - Changed CSS class names (hoodie-display → shirt-display, jacket-display → jeans-display)
  - Updated ALL navigation menus across site to use consistent "Shirts" terminology
  - Fixed ALL product URLs in products.js to point to correct pages
  - Eliminated all references to obsolete women-dresses.html and women-tops.html files
  - Ensured terminology consistency across all navigation menus

- September 30, 2025: Added complete Juniors section
  - Created juniors directory with main page (juniors.html) featuring vertical scroll navigation
  - Built 4 subcategory pages: T-Shirts, Hoodies, Shorts, and Sneakers
  - Implemented same functionality and design as Men's and Women's sections
  - Added shopping cart integration to all juniors pages
  - Updated main navigation menu to include Juniors category
  - Added image placeholder comments for future image additions

- September 30, 2025: Initial Replit environment setup
  - Installed Python 3.11 for HTTP server
  - Configured workflow to serve on port 5000
  - Updated .gitignore for Python cache files
  - Created project documentation

## User Preferences
None specified yet.

## Notes
- This is a frontend-only project with no backend
- Shopping cart data is stored in browser localStorage
- All product images are stored locally in /images/products/
- The site uses CDN resources for fonts and icons
