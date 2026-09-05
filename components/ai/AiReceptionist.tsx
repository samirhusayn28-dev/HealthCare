'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Calendar, Sparkles, AlertCircle, RefreshCw, Phone } from 'lucide-react'
import { CLINIC_NAME, CLINIC_PHONE, CLINIC_PHONE_TEL, CLINIC_PHONE_DISPLAY } from '@/lib/constants'
import { useBookingModal } from '@/context/BookingModalContext'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  'Who is on staff for cardiology?',
  'What are your operating hours?',
  'Do you accept Medicare & Blue Shield?',
  'How fast are MRI results ready?',
]

export function AiReceptionist() {
  const { openBookingModal } = useBookingModal()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello, I am the AI Clinical Assistant for ${CLINIC_NAME}. How may I help you with our specialists, diagnostics, or appointment scheduling?`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSend = async (text?: string) => {
    const messageToSend = text || input
    if (!messageToSend.trim() || loading) return

    setHasError(false)
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: messageToSend },
    ]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        console.error('[AI Receptionist API returned error status]:', res.status, data)
        const errMsg = data?.reply || `Unable to reach clinical assistant (${res.status}). Please call ${CLINIC_PHONE}.`
        setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }])
        setHasError(true)
        return
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data?.reply || 'How else may I assist you today?' },
      ])
    } catch (err: any) {
      console.error('[AI Receptionist Client Exception]:', err)
      setHasError(true)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Communication error: ${err?.message || 'Network disconnected'}. Please call reception directly at ${CLINIC_PHONE}.`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const resetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Hello, I am the AI Clinical Assistant for ${CLINIC_NAME}. How may I help you with our specialists, diagnostics, or appointment scheduling?`,
      },
    ])
    setHasError(false)
  }

  return (
    <>
      {/* Floating Trigger Pill on Bottom-Left */}
      <aside aria-label="AI Clinic Assistant" className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 h-11 rounded-full bg-white text-foreground border border-border shadow-elevated hover:bg-surface-50 active:scale-95 transition-all duration-200 text-xs sm:text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <Bot size={17} className="text-primary" />
          <span>AI Receptionist</span>
        </button>
      </aside>

      {/* Slide-in Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-chat-root"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-0 sm:p-6 pointer-events-none"
          >
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs pointer-events-auto cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto relative w-full sm:w-[420px] h-[85vh] sm:h-[600px] max-h-[85vh] sm:max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl border border-border shadow-elevated flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-surface-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-primary-50 text-primary flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-xs sm:text-sm text-foreground">
                      Clinical AI Assistant
                    </h3>
                    <p className="text-[10px] text-foreground-muted">
                      Groq LLaMA powered &bull; Instant clinic triage
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <a
                    href={`tel:${CLINIC_PHONE_TEL}`}
                    title={`Call Clinic Reception (${CLINIC_PHONE_DISPLAY})`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground-muted hover:text-primary hover:bg-surface-100 transition-colors"
                  >
                    <Phone size={15} />
                  </a>
                  <button
                    onClick={resetChat}
                    title="Reset conversation"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-surface-100 transition-colors"
                  >
                    <RefreshCw size={15} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-surface-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-xs sm:text-sm">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-wrap ${
                        m.role === 'user'
                          ? 'bg-primary text-white font-medium'
                          : 'bg-surface-100 text-foreground border border-border/70'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-surface-100 rounded-2xl px-4 py-2.5 text-foreground-muted text-xs flex items-center gap-2 border border-border/70">
                      <span className="text-xs">Thinking</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Banner to book or call */}
              <div className="px-4 py-2.5 bg-primary-50/50 border-t border-border flex items-center justify-between text-xs">
                <a
                  href={`tel:${CLINIC_PHONE_TEL}`}
                  className="font-semibold text-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                >
                  <Phone size={13} className="text-primary" />
                  <span>Call {CLINIC_PHONE_DISPLAY}</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    openBookingModal()
                  }}
                  className="font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Calendar size={13} />
                  <span>Book Online &rarr;</span>
                </button>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-4 py-2 border-t border-border/60 bg-surface-50/70 overflow-x-auto no-scrollbar flex gap-1.5">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full bg-white border border-border/80 text-foreground-secondary hover:text-foreground hover:border-primary/40 transition-colors shadow-2xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Footer */}
              <div className="p-3 sm:p-3.5 border-t border-border bg-white flex items-center gap-2 pb-safe">
                <input
                  type="text"
                  placeholder="Ask about physicians, hours, or tests..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 text-xs sm:text-sm h-11 px-4 rounded-xl border border-border bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0 hover:bg-primary-800"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
