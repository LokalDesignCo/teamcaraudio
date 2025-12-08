$w.onReady(function () {
  // Initialize page
  setupCallTracking();
});

/**
 * Setup CallRail phone tracking
 */
function setupCallTracking() {
  // Add tracking class to phone elements
  if ($w("#headerPhone")) {
    $w("#headerPhone").html = '<a href="tel:+15551234567" class="callrail-phone">(555) 123-4567</a>';
  }
  
  if ($w("#footerPhone")) {
    $w("#footerPhone").html = '<a href="tel:+15551234567" class="callrail-phone">(555) 123-4567</a>';
  }
}