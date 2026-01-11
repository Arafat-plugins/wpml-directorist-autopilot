// ========= FIND TEXTAREAS NEAR CLICKED ELEMENT =========
function findTextareasNearElement(element) {
  // Strategy 1: Find in closest container (row, div, etc.)
  let container = element.closest('tr, .row, [class*="row"], [class*="string"], [class*="translation"], tbody, table');
  
  if (!container) {
    // If no container, search from parent
    container = element.parentElement;
  }

  // Strategy 2: Search in container and nearby elements
  let allTextareas = [];
  
  if (container) {
    // Get all textareas in container
    allTextareas = Array.from(container.querySelectorAll('textarea'));
    
    // Also check siblings
    const siblings = [
      container.previousElementSibling,
      container.nextElementSibling,
      container.parentElement?.previousElementSibling,
      container.parentElement?.nextElementSibling
    ].filter(Boolean);
    
    siblings.forEach(sibling => {
      const siblingTextareas = sibling.querySelectorAll('textarea');
      allTextareas = allTextareas.concat(Array.from(siblingTextareas));
    });
  }

  // Strategy 3: If still not found, search entire page but prioritize nearby
  if (allTextareas.length < 2) {
    const pageTextareas = Array.from(document.querySelectorAll('textarea'));
    
    // Find textareas near the clicked element (within same section/container)
    const clickedRect = element.getBoundingClientRect();
    const nearbyTextareas = pageTextareas.filter(ta => {
      const taRect = ta.getBoundingClientRect();
      // Check if textarea is in similar vertical position (within 500px)
      return Math.abs(taRect.top - clickedRect.top) < 500;
    });
    
    if (nearbyTextareas.length >= 2) {
      allTextareas = nearbyTextareas;
    } else if (pageTextareas.length >= 2) {
      // Fallback: use all textareas on page
      allTextareas = pageTextareas;
    }
  }

  return allTextareas;
}

// ========= TRIGGER WPML EVENTS =========
function triggerWPMLChange(textarea) {
  // Trigger multiple events to ensure WPML detects the change
  ['input', 'change', 'keyup', 'blur'].forEach(eventType => {
    textarea.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
  });
  
  // Also try React synthetic events if WPML uses React
  if (textarea._valueTracker) {
    textarea._valueTracker.setValue('');
  }
  textarea.value = textarea.value; // Force update
}
