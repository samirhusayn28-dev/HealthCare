'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MessageCircle } from 'lucide-react'
import { Container } from './Container'
import { Button } from '@/components/ui/Button'
import { CLINIC_NAME, CLINIC_WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '@/lib/constants'
import { useBookingModal } from '@/context/BookingModalContext'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/#services', label: 'Services' },
  { href: '/doctors', label: 'Physicians' },
  { href: '/portal', label: 'Patient Portal' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { openBookingModal } = useBookingModal()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface-50/90 backdrop-blur-md border-b border-border/70 py-3.5'
          : 'bg-transparent py-5'
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="font-heading font-semibold text-base text-foreground tracking-tight">
              {CLINIC_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-xs font-medium tracking-wide uppercase transition-colors duration-150',
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-foreground-secondary hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-foreground-muted hover:text-foreground transition-colors"
              aria-label="Direct WhatsApp message"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={17} />
            </a>

            <Button
              variant="primary"
              size="sm"
              onClick={() => openBookingModal()}
              className="text-xs font-medium tracking-wide px-4 py-2"
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-foreground-secondary hover:text-foreground hover:bg-surface-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer & Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[65px] z-40 md:hidden flex flex-col"
          >
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-[65px] bg-black/25 backdrop-blur-xs cursor-pointer"
            />
            <motion.div
              key="mobile-menu-drawer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative z-50 bg-surface-50 border-b border-border px-5 py-6 shadow-elevated"
            >
              <nav className="flex flex-col gap-1 mb-6">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'min-h-[44px] flex items-center px-3 rounded-xl text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-primary-50 text-primary font-semibold'
                        : 'text-foreground hover:bg-surface-100 hover:text-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    openBookingModal()
                  }}
                  className="w-full h-12 text-sm font-semibold justify-center"
                >
                  Book Appointment
                </Button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] flex items-center justify-center gap-2 px-4 rounded-xl border border-border bg-white text-xs font-semibold text-foreground-secondary hover:bg-surface-100 hover:text-foreground transition-colors shadow-xs"
                >
                  <MessageCircle size={17} className="text-primary" />
                  <span>Chat via WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
