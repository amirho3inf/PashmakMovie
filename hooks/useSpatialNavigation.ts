import { useEffect } from 'react';

// Helper function to get the geometry of an element
const getRect = (element: Element) => element.getBoundingClientRect();

// Find the best candidate element to move focus to in a given direction
const findBestCandidate = (
  currentElement: Element,
  allCandidates: HTMLElement[],
  direction: 'up' | 'down' | 'left' | 'right'
) => {
  const currentRect = getRect(currentElement);
  let bestCandidate: HTMLElement | null = null;
  let minDistance = Infinity;

  for (const candidate of allCandidates) {
    if (candidate === currentElement) continue;

    const candidateRect = getRect(candidate);
    let isCandidate = false;

    // Distances between the edges of the elements
    const verticalDist = candidateRect.top - currentRect.bottom;
    const horizontalDist = candidateRect.left - currentRect.right;
    
    // Check if candidate is in the correct direction
    switch (direction) {
      case 'down':
        if (candidateRect.top > currentRect.top) {
            // Must be primarily below the current element
            const overlap = Math.max(0, Math.min(currentRect.right, candidateRect.right) - Math.max(currentRect.left, candidateRect.left));
            if (overlap > 0 || verticalDist >= 0) isCandidate = true;
        }
        break;
      case 'up':
        if (candidateRect.top < currentRect.top) {
            // Must be primarily above the current element
            const overlap = Math.max(0, Math.min(currentRect.right, candidateRect.right) - Math.max(currentRect.left, candidateRect.left));
            if (overlap > 0 || currentRect.top - candidateRect.bottom >= 0) isCandidate = true;
        }
        break;
      case 'left': // RTL: Moves focus to the right (visually next)
        if (candidateRect.left > currentRect.left) {
            // Must be primarily to the right
            const overlap = Math.max(0, Math.min(currentRect.bottom, candidateRect.bottom) - Math.max(currentRect.top, candidateRect.top));
            if (overlap > 0 || horizontalDist >= 0) isCandidate = true;
        }
        break;
      case 'right': // RTL: Moves focus to the left (visually previous)
        if (candidateRect.left < currentRect.left) {
            // Must be primarily to the left
            const overlap = Math.max(0, Math.min(currentRect.bottom, candidateRect.bottom) - Math.max(currentRect.top, candidateRect.top));
            if (overlap > 0 || currentRect.left - candidateRect.right >= 0) isCandidate = true;
        }
        break;
    }

    if (isCandidate) {
        // Use a weighted distance. Prioritize alignment, then proximity.
        const verticalCenterDiff = Math.abs((currentRect.top + currentRect.height / 2) - (candidateRect.top + candidateRect.height / 2));
        const horizontalCenterDiff = Math.abs((currentRect.left + currentRect.width / 2) - (candidateRect.left + candidateRect.width / 2));
        
        const distance = (direction === 'up' || direction === 'down')
            ? horizontalCenterDiff + verticalCenterDiff * 3 // Prioritize vertical alignment
            : verticalCenterDiff + horizontalCenterDiff * 3; // Prioritize horizontal alignment

        if (distance < minDistance) {
            minDistance = distance;
            bestCandidate = candidate;
        }
    }
  }

  return bestCandidate;
};


export const useSpatialNavigation = (containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      const activeElement = document.activeElement;

      // Only act if an arrow key is pressed and focus is within our container
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key) || !activeElement || !container.contains(activeElement)) {
        return;
      }
      
      e.preventDefault();

      // Find all visible, focusable elements
      const focusableSelector = '[tabindex="0"], a[href], button, input, [role="button"]';
      const allFocusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => el.offsetParent !== null && !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1'
      );

      if (allFocusable.length === 0) return;
      
      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      switch(key) {
          case 'ArrowUp': direction = 'up'; break;
          case 'ArrowDown': direction = 'down'; break;
          case 'ArrowLeft': direction = 'left'; break;
          case 'ArrowRight': direction = 'right'; break;
      }

      if (direction) {
        const nextFocusable = findBestCandidate(activeElement, allFocusable, direction);

        if (nextFocusable) {
          nextFocusable.focus();
          nextFocusable.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      }
    };

    // The event listener is attached to the container itself
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef]);
};