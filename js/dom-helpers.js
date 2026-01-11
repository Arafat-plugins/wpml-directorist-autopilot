// ========= FIND TEXTAREAS NEAR CLICKED ELEMENT =========
function findTextareasNearElement(element) {
  // Strategy 1: Find the closest row/container - be more specific
  let container = element.closest('tr, .row, [class*="row"], [class*="string"], [class*="translation"]');
  
  if (!container) {
    container = element.closest('tbody, table, [class*="table"], [class*="list"]');
  }
  
  if (!container) {
    container = element.parentElement;
  }

  let allTextareas = [];
  
  if (container) {
    // First, try to find textareas in the exact same row (most specific)
    const exactRow = element.closest('tr, [class*="row"]');
    if (exactRow) {
      const rowTextareas = Array.from(exactRow.querySelectorAll('textarea'));
      if (rowTextareas.length >= 1) {
        allTextareas = rowTextareas;
      }
    }
    
    // If we didn't find enough in the exact row, search in the container
    if (allTextareas.length < 2) {
      const containerTextareas = Array.from(container.querySelectorAll('textarea'));
      if (containerTextareas.length > 0) {
        allTextareas = containerTextareas;
      }
    }
  }

  // Strategy 2: If still not found, use positional search (more precise)
  if (allTextareas.length < 2) {
    const clickedRect = element.getBoundingClientRect();
    const pageTextareas = Array.from(document.querySelectorAll('textarea'));
    
    // Find textareas very close to the clicked element (within same row - 200px)
    const nearbyTextareas = pageTextareas.filter(ta => {
      const taRect = ta.getBoundingClientRect();
      const verticalDistance = Math.abs(taRect.top - clickedRect.top);
      const horizontalDistance = Math.abs(taRect.left - clickedRect.left);
      // Same row: similar Y position and reasonable X distance
      return verticalDistance < 200 && horizontalDistance < 1000;
    });
    
    if (nearbyTextareas.length >= 1) {
      allTextareas = nearbyTextareas;
    }
  }

  // Remove duplicates and return
  return Array.from(new Set(allTextareas));
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
