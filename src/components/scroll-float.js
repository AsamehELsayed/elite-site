"use client"
import { useEffect, useRef, useCallback } from 'react';

// Native easing functions
const easingFunctions = {
  'back.inOut(2)': (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return t < 0.5
      ? (t * t * ((c3 + 1) * 2 * t - c3)) / 2
      : ((t - 1) * (t - 1) * ((c3 + 1) * 2 * (t - 1) + c3) + 2) / 2;
  },
  'easeInOut': (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  'easeOut': (t) => t * (2 - t),
  'easeIn': (t) => t * t,
  'linear': (t) => t,
};

// Parse scroll position string (e.g., 'center bottom+=50%')
// Format: 'triggerPosition viewportPosition'
// Returns the scroll position when trigger should activate
// GSAP format: 'center bottom+=50%' means when center of element reaches bottom of viewport + 50%
const parseScrollPosition = (position, elementRect, viewportHeight) => {
  if (!position) return 0;
  
  const parts = position.split(' ');
  let triggerPoint = 0;
  let viewportPoint = viewportHeight; // default to bottom of viewport
  let viewportOffset = 0;
  
  // Parse viewport offset (e.g., 'bottom+=50%' or 'bottom-=40%')
  if (parts.length > 1 && parts[1]) {
    const viewportPart = parts[1];
    if (viewportPart.includes('bottom')) {
      viewportPoint = viewportHeight;
    } else if (viewportPart.includes('center')) {
      viewportPoint = viewportHeight / 2;
    } else if (viewportPart.includes('top')) {
      viewportPoint = 0;
    }
    
    if (viewportPart.includes('+=')) {
      const match = viewportPart.match(/\+=\s*(\d+)%/);
      if (match) viewportOffset = (parseFloat(match[1]) / 100) * viewportHeight;
    } else if (viewportPart.includes('-=')) {
      const match = viewportPart.match(/-=\s*(\d+)%/);
      if (match) viewportOffset = -(parseFloat(match[1]) / 100) * viewportHeight;
    }
  }
  
  // Calculate trigger point on element (relative to document)
  if (parts[0] && parts[0].includes('center')) {
    triggerPoint = elementRect.top + elementRect.height / 2;
  } else if (parts[0] && parts[0].includes('top')) {
    triggerPoint = elementRect.top;
  } else if (parts[0] && parts[0].includes('bottom')) {
    triggerPoint = elementRect.bottom;
  } else {
    triggerPoint = elementRect.top;
  }
  
  // Return scroll position: scrollTop when triggerPoint - scrollTop = viewportPoint + viewportOffset
  // So: scrollTop = triggerPoint - viewportPoint - viewportOffset
  return triggerPoint - viewportPoint - viewportOffset;
};

const ScrollFloat = ({
  children,
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03
}) => {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const elementsRef = useRef([]);
  const isInitializedRef = useRef(false);

  // Get easing function
  const easingFn = easingFunctions[ease] || easingFunctions['easeInOut'];

  // Check if an element or its ancestors are motion components or have motion-related props
  const isMotionComponent = (element) => {
    if (!element || !element.hasAttribute) return false;
    
    // Check if element has motion-related attributes or data attributes
    const motionAttrs = [
      'data-framer-name',
      'data-framer-component-type',
      'data-framer-appear-id'
    ];
    
    const hasMotionAttrs = motionAttrs.some(attr => element.hasAttribute(attr));
    if (hasMotionAttrs) return true;
    
    // Check React internal props (framer-motion sets these)
    const reactKey = element.getAttribute('data-reactroot') || 
                     element.getAttribute('data-reactrootid');
    if (reactKey && element.getAttribute('style')?.includes('transform')) {
      // Could be a motion component, be safe and skip
      return true;
    }
    
    // Check parent chain for motion components
    let parent = element.parentElement;
    let depth = 0;
    const maxDepth = 15; // Prevent infinite loops
    
    while (parent && parent !== containerRef.current && depth < maxDepth) {
      if (parent.hasAttribute) {
        const hasParentMotionAttrs = motionAttrs.some(attr => parent.hasAttribute(attr));
        if (hasParentMotionAttrs) return true;
        
        // Check if parent has motion-related class names
        const classList = Array.from(parent.classList || []);
        if (classList.some(cls => cls.includes('motion') || cls.startsWith('framer-'))) {
          return true;
        }
      }
      parent = parent.parentElement;
      depth++;
    }
    
    return false;
  };

  // Initialize elements for animation - process text nodes
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isInitializedRef.current) return;

    const processTextNodes = (node) => {
      const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        },
        false
      );

      const textNodes = [];
      let textNode;
      while (textNode = walker.nextNode()) {
        textNodes.push(textNode);
      }

      textNodes.forEach((textNode) => {
        const parent = textNode.parentNode;
        
        // Skip if already processed
        if (!parent || parent.hasAttribute('data-scroll-float-processed')) {
          return;
        }
        
        // Skip if parent or any ancestor is a motion component
        if (isMotionComponent(parent)) {
          return;
        }
        
        const text = textNode.textContent;
        if (!text.trim()) return;
        
        // Split text into characters
        const chars = text.split('');
        const fragment = document.createDocumentFragment();
        
        chars.forEach((char) => {
          const span = document.createElement('span');
          span.className = 'scroll-float-char';
          span.style.display = 'inline-block';
          span.style.willChange = 'opacity, transform';
          span.style.transformOrigin = '50% 0%';
          span.textContent = char === ' ' ? '\u00A0' : char;
          fragment.appendChild(span);
          elementsRef.current.push(span);
        });
        
        parent.replaceChild(fragment, textNode);
        parent.setAttribute('data-scroll-float-processed', 'true');
      });

      isInitializedRef.current = true;
    };

    // Wait for DOM to be ready and React to finish rendering
    const timeoutId = setTimeout(() => {
      processTextNodes(container);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [children]);

  // Scroll-based animation
  const updateAnimation = useCallback(() => {
    const container = containerRef.current;
    if (!container || elementsRef.current.length === 0) {
      animationFrameRef.current = requestAnimationFrame(updateAnimation);
      return;
    }

    const viewportHeight = window.innerHeight;
    const containerRect = container.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calculate scroll start and end positions (absolute scroll positions)
    const startPos = parseScrollPosition(scrollStart, containerRect, viewportHeight);
    const endPos = parseScrollPosition(scrollEnd, containerRect, viewportHeight);
    
    // Current scroll position
    const currentScroll = scrollTop;
    
    // Calculate progress (0 to 1)
    const range = endPos - startPos;
    let progress = range !== 0 ? (currentScroll - startPos) / range : 0;
    progress = Math.max(0, Math.min(1, progress));
    
    // Apply easing
    const easedProgress = easingFn(progress);
    
    // Animate each element with stagger
    elementsRef.current.forEach((element, index) => {
      if (!element || !element.parentNode) return;
      
      // Calculate element-specific progress with stagger
      const elementStart = index * stagger;
      const elementProgress = Math.max(0, Math.min(1, (easedProgress - elementStart) / animationDuration));
      const elementEased = easingFn(elementProgress);
      
      // Calculate transform values
      const yPercent = (1 - elementEased) * 120;
      const scaleY = 1 + (1 - elementEased) * 1.3;
      const scaleX = 0.7 + (elementEased * 0.3);
      const opacity = elementEased;
      
      // Apply transforms using CSS custom properties and direct style
      // This ensures isolation from other animation libraries
      element.style.setProperty('--scroll-float-y', `${yPercent}%`);
      element.style.setProperty('--scroll-float-scale-y', scaleY.toString());
      element.style.setProperty('--scroll-float-scale-x', scaleX.toString());
      element.style.setProperty('--scroll-float-opacity', opacity.toString());
      
      // Apply transform - isolated from framer-motion
      element.style.transform = `translateY(var(--scroll-float-y)) scaleY(var(--scroll-float-scale-y)) scaleX(var(--scroll-float-scale-x))`;
      element.style.opacity = `var(--scroll-float-opacity)`;
    });

    animationFrameRef.current = requestAnimationFrame(updateAnimation);
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger, easingFn]);

  useEffect(() => {
    // Start animation loop
    updateAnimation();

    // Listen to scroll events
    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      updateAnimation();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateAnimation]);

  return (
    <div ref={containerRef} style={{ overflow: 'hidden', display: 'contents' }}>
      {children}
    </div>
  );
};

export default ScrollFloat;
