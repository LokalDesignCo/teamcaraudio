// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// Master page code - runs on every page
// This includes Adobe Fonts loader (temporary until site upgrade)

import wixWindow from 'wix-window';

// ============================================
// ADOBE FONTS LOADER
// Temporary workaround until Custom Code available
// TODO: Move to Custom Code after site upgrade + domain connection
// ============================================

function loadAdobeFonts() {
  // Only run in browser (not during SSR)
  if (wixWindow.rendering.env === 'browser') {
    console.log('Loading Adobe Fonts (Gamay Condensed)...');
    
    // Inject Adobe Fonts stylesheet
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://use.typekit.net/sxz6cod.css';
    
    fontLink.onload = () => {
      console.log('✅ Adobe Fonts loaded successfully!');
      applyFontStyles();
    };
    
    fontLink.onerror = () => {
      console.error('❌ Failed to load Adobe Fonts');
    };
    
    document.head.appendChild(fontLink);
  }
}

function applyFontStyles() {
  // Check if styles already applied
  if (document.getElementById('adobe-fonts-styles')) {
    return;
  }
  
  // Inject CSS styles
  const style = document.createElement('style');
  style.id = 'adobe-fonts-styles';
  style.textContent = `
    /* ============================================
       GAMAY CONDENSED TYPOGRAPHY
       ============================================ */
    
    /* Headers - Gamay Condensed */
    h1, h2, h3, h4, h5, h6,
    [class*="heading"],
    [class*="title"] {
      font-family: "gamay-condensed", sans-serif !important;
    }
    
    /* Light weight for large headers */
    h1, h2 {
      font-weight: 200 !important;
    }
    
    /* Regular weight for smaller headers */
    h3, h4, h5, h6 {
      font-weight: 400 !important;
    }
    
    /* Buttons - Gamay Condensed - Target all Wix button classes */
    button,
    [class*="button"],
    .wix-button,
    .wixui-button,
    .wixui-button__label,
    .w4Vxx6,
    [role="button"],
    [data-testid="linkElement"],
    input[type="submit"],
    input[type="button"],
    a[role="button"],
    span[class*="wixui-button__label"] {
      font-family: "gamay-condensed", sans-serif !important;
      font-weight: 400 !important;
    }
    
    /* Rich Text Elements */
    .richtext__text,
    [class*="richtext"] {
      font-family: "gamay-condensed", sans-serif !important;
      font-weight: 400 !important;
    }
    
    /* Navigation */
    nav,
    [class*="nav"],
    [class*="menu"],
    [role="navigation"] {
      font-family: "gamay-condensed", sans-serif !important;
      font-weight: 400 !important;
    }
    
    /* Utility Classes */
    .font-gamay-light {
      font-family: "gamay-condensed", sans-serif !important;
      font-weight: 200 !important;
      font-style: normal !important;
    }
    
    .font-gamay-regular {
      font-family: "gamay-condensed", sans-serif !important;
      font-weight: 400 !important;
      font-style: normal !important;
    }
    
    /* Text weight utilities */
    .text-light {
      font-weight: 200 !important;
    }
    
    .text-regular {
      font-weight: 400 !important;
    }
    
    /* Mobile Responsive Adjustments */
    @media (max-width: 768px) {
      h1 {
        font-size: 2rem !important;
      }
      
      h2 {
        font-size: 1.5rem !important;
      }
      
      h3 {
        font-size: 1.25rem !important;
      }
    }
  `;
  
  document.head.appendChild(style);
  console.log('✅ Adobe Fonts styles applied');
}

// ============================================
// MASTER PAGE READY
// ============================================

$w.onReady(function () {
  console.log('🚀 Master Page: Ready');
  
  // Load Adobe Fonts on every page
  loadAdobeFonts();
  
  // Add any other site-wide initialization here
  // To select an element by ID use: $w('#elementID')
});

// ============================================
// EXPORTS
// ============================================

// Export function to reload fonts if needed
export function reloadFonts() {
  console.log('🔄 Reloading Adobe Fonts...');
  loadAdobeFonts();
}

// Export function to apply fonts to specific element
export function applyFontToElement(selector, weight = '400') {
  if (wixWindow.rendering.env === 'browser') {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.fontFamily = '"gamay-condensed", sans-serif';
      el.style.fontWeight = weight;
    });
  }
}

$w.onReady(function () {
  const currentYear = new Date().getFullYear();
  const html = `© ${currentYear} CAR Audio & Security. <a href="https://www.lokaldesignco.com/" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;">A Lokal Site</a>.`;
  
  $w('#copyrighttext').html = `<p>${html}</p>`;
});

