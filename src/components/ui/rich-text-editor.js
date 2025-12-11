"use client"

import { useEffect, useRef, useState } from 'react'
import { Bold, Eraser, Italic, List, ListOrdered, Underline } from 'lucide-react'
import { cn } from '@/lib/utils'

const toolbarActions = [
  { key: 'bold', command: 'bold', icon: Bold, label: 'Bold', trackState: true },
  { key: 'italic', command: 'italic', icon: Italic, label: 'Italic', trackState: true },
  { key: 'underline', command: 'underline', icon: Underline, label: 'Underline', trackState: true },
  { key: 'unordered', command: 'insertUnorderedList', icon: List, label: 'Bullet list' },
  { key: 'ordered', command: 'insertOrderedList', icon: ListOrdered, label: 'Numbered list' },
  { key: 'clear', command: 'removeFormat', icon: Eraser, label: 'Clear formatting' },
]

export function RichTextEditor({
  value = '',
  onChange,
  placeholder,
  className,
  minHeight = 140,
}) {
  const editorRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [activeStates, setActiveStates] = useState({})

  // Keep editor content in sync when value changes externally
  useEffect(() => {
    if (!editorRef.current) return
    const currentHtml = editorRef.current.innerHTML
    const nextHtml = value || ''
    if (currentHtml !== nextHtml) {
      editorRef.current.innerHTML = nextHtml
    }
  }, [value])

  const refreshStates = () => {
    if (typeof document === 'undefined') return
    const next = {}
    toolbarActions.forEach((action) => {
      if (action.trackState) {
        next[action.key] = document.queryCommandState(action.command)
      }
    })
    setActiveStates(next)
  }

  const execCommand = (command) => {
    if (!editorRef.current || typeof document === 'undefined') return
    editorRef.current.focus()
    document.execCommand(command, false, null)
    refreshStates()
    emitChange()
  }

  const emitChange = () => {
    const html = editorRef.current?.innerHTML || ''
    const cleaned = html === '<br>' ? '' : html
    onChange?.(cleaned)
  }

  return (
    <div className={cn('rounded-md border border-zinc-700 bg-zinc-900 text-white', className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-800 px-2 py-2">
        {toolbarActions.map((action) => {
          const Icon = action.icon
          const isActive = !!activeStates[action.key]
          return (
            <button
              key={action.key}
              type="button"
              aria-label={action.label}
              title={action.label}
              onMouseDown={(event) => {
                event.preventDefault()
                execCommand(action.command)
              }}
              className={cn(
                'flex items-center gap-1 rounded-md border border-transparent px-2 py-1 text-xs transition-colors hover:bg-zinc-800',
                isActive && 'border-primary/40 bg-zinc-800 text-primary'
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
      </div>

      <div className="relative">
        {!value && !isFocused && placeholder ? (
          <div className="pointer-events-none absolute left-3 top-2 text-sm text-zinc-500">
            {placeholder}
          </div>
        ) : null}

        <div
          ref={editorRef}
          contentEditable
          className="min-h-[140px] w-full bg-transparent px-3 py-2 leading-relaxed outline-none"
          style={{ minHeight }}
          onInput={emitChange}
          onFocus={() => {
            setIsFocused(true)
            refreshStates()
          }}
          onBlur={() => setIsFocused(false)}
          suppressContentEditableWarning
        />
      </div>
    </div>
  )
}




