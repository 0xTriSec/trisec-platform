'use client'

import { useEffect, useRef, useState } from 'react'

const lines = [
  { prefix: 'root@0xtrisec:~$ ', text: 'whoami', delay: 400 },
  { prefix: '', text: '0xTrisec', delay: 500 },
  { prefix: 'root@0xtrisec:~$ ', text: 'id', delay: 400 },
  { prefix: '', text: 'uid=1000(security) groups=pentest,osint', delay: 500 },
  { prefix: 'root@0xtrisec:~$ ', text: 'cat /profile', delay: 400 },
  { prefix: '', text: 'pentester | OSINT | cybersecurity', delay: 500 },
  { prefix: 'root@0xtrisec:~$ ', text: 'status', delay: 400 },
  { prefix: '', text: 'secure', delay: 2500 },
]

// Tính sẵn chiều cao: 8 dòng * line-height (1.5rem = 24px) + spacing (0.25rem = 4px mỗi dòng)
const LINE_HEIGHT = '1.75rem' // ~28px cho font-mono text-sm
const TOTAL_LINES = lines.length

export default function TerminalIntro() {
  const [displayedLines, setDisplayedLines] = useState<{ prefix: string; text: string }[]>([])
  const [activeText, setActiveText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isTyping, setIsTyping] = useState(true)

  const lineIndexRef = useRef(0)
  const charIndexRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isCompleteRef = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((v) => !v)
    }, 400)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const type = () => {
      if (isCompleteRef.current) return

      const lineIndex = lineIndexRef.current

      if (lineIndex >= lines.length) {
        isCompleteRef.current = true
        setIsTyping(false)
        setTimeout(() => {
          lineIndexRef.current = 0
          charIndexRef.current = 0
          isCompleteRef.current = false
          setDisplayedLines([])
          setActiveText('')
          setIsTyping(true)
          timeoutRef.current = setTimeout(type, 500)
        }, 2500)
        return
      }

      const line = lines[lineIndex]
      const charIndex = charIndexRef.current

      if (charIndex < line.text.length) {
        setActiveText(line.text.slice(0, charIndex + 1))
        charIndexRef.current += 1

        const speed = 40 + Math.random() * 30
        timeoutRef.current = setTimeout(type, speed)
      } else {
        setDisplayedLines((prev) => [...prev, { prefix: line.prefix, text: line.text }])
        setActiveText('')

        timeoutRef.current = setTimeout(() => {
          lineIndexRef.current += 1
          charIndexRef.current = 0
          type()
        }, line.delay)
      }
    }

    timeoutRef.current = setTimeout(type, 500)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const currentLine = lines[lineIndexRef.current]

  return (
    <div className="dark:border-primary-500/30 dark:shadow-primary-500/10 mb-8 max-w-2xl rounded-xl border bg-white shadow-lg dark:bg-[#0b0f14]">
      {/* Header với nút close */}
      <div className="dark:border-primary-500/20 mb-3 flex items-center gap-3 border-b border-gray-200 px-5 pt-4 pb-3">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400 dark:bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-400 dark:bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-400 dark:bg-green-500/80" />
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">bash</span>
      </div>

      {/* Content area - chiều cao cố định */}
      <div
        className="space-y-1 px-5 pb-4 font-mono text-sm"
        style={{
          minHeight: `calc(${LINE_HEIGHT} * ${TOTAL_LINES} + 1rem)`, // Chiều cao cố định cho 8 dòng
        }}
      >
        {/* Render tất cả 8 dòng sẵn - text sẽ được ẩn/hiện tùy theo trạng thái */}
        {lines.map((line, i) => {
          const isCompleted = i < displayedLines.length
          const isCurrent = i === displayedLines.length && isTyping
          const isFuture = i > displayedLines.length

          return (
            <div
              key={i}
              className="dark:text-primary-400 text-gray-800"
              style={{
                visibility: isFuture ? 'hidden' : 'visible',
                minHeight: LINE_HEIGHT,
              }}
            >
              <span className="dark:text-primary-500/60 text-gray-500">{line.prefix}</span>
              {isCompleted && <span>{line.text}</span>}
              {isCurrent && (
                <>
                  <span>{activeText}</span>
                  <span
                    style={{ opacity: showCursor ? 1 : 0 }}
                    className="dark:text-primary-500/60 text-gray-500"
                  >
                    █
                  </span>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
