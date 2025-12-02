'use client'

import { useEffect, useRef } from 'react'

const INTERACTIVE_SELECTORS = 'a, button, img, [role="button"], [data-cursor="interactive"], .cursor-target'
const POINTER_CURSOR_VALUES = new Set(['pointer', 'link'])
const GRAB_CURSOR_VALUES = new Set(['grab', 'grabbing'])
const ACTIVE_CURSOR_VALUES = new Set([...POINTER_CURSOR_VALUES, ...GRAB_CURSOR_VALUES, 'move', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize'])

export function CursorFollower() {
  const cursorRef = useRef(null)
  const rafRef = useRef(0)
  const targetRef = useRef({ x: -100, y: -100 })
  const currentRef = useRef({ x: -100, y: -100 })
  const smoothingRef = useRef(0.8)
  const scaleRef = useRef(1)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Use transform instead of CSS variables for better performance
    const smoothFollow = () => {
      if (!cursor) return
      
      try {
        currentRef.current.x += (targetRef.current.x - currentRef.current.x) * smoothingRef.current
        currentRef.current.y += (targetRef.current.y - currentRef.current.y) * smoothingRef.current
        
        // Get scale from computed style
        const computedStyle = getComputedStyle(cursor)
        const scaleValue = computedStyle.getPropertyValue('--cursor-scale')?.trim() || '1'
        scaleRef.current = parseFloat(scaleValue) || 1
        
        // Use transform3d for GPU acceleration - center the cursor (28px / 2 = 14px)
        cursor.style.transform = `translate3d(${currentRef.current.x - 14}px, ${currentRef.current.y - 14}px, 0) scale(${scaleRef.current})`
        
        rafRef.current = requestAnimationFrame(smoothFollow)
      } catch (error) {
        console.error('Cursor follower error:', error)
      }
    }

    rafRef.current = requestAnimationFrame(smoothFollow)

    const handlePointerMove = (event) => {
      targetRef.current = { x: event.clientX, y: event.clientY }
      cursor.classList.remove('is-hidden')

      const target = event.target
      const targetElement = target instanceof Element ? target : null
      const closestInteractive = targetElement?.closest(INTERACTIVE_SELECTORS)
      const computedCursor = targetElement ? window.getComputedStyle(targetElement).cursor : ''
      const isPointerLike = closestInteractive || ACTIVE_CURSOR_VALUES.has(computedCursor)

      cursor.classList.toggle('is-active', Boolean(isPointerLike))
      cursor.classList.toggle('is-grab', GRAB_CURSOR_VALUES.has(computedCursor))
    }

    const handlePointerEnter = () => cursor.classList.remove('is-hidden')
    const handlePointerLeave = () => cursor.classList.add('is-hidden')
    const handlePointerDown = () => cursor.classList.add('is-press')
    const handlePointerUp = () => cursor.classList.remove('is-press')

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerenter', handlePointerEnter)
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerenter', handlePointerEnter)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  return <div ref={cursorRef} className="cursor-follower is-hidden" aria-hidden="true" />
}
