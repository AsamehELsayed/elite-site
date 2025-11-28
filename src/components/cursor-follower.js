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

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const smoothFollow = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * smoothingRef.current
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * smoothingRef.current
      cursor.style.setProperty('--cursor-x', `${currentRef.current.x}px`)
      cursor.style.setProperty('--cursor-y', `${currentRef.current.y}px`)
      rafRef.current = requestAnimationFrame(smoothFollow)
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
