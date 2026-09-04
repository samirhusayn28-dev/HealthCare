'use client'

import { usePathname } from 'next/navigation'
import { MessageCircle, Phone, ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import {
  CLINIC_NAME,
  CLINIC_WHATSAPP_NUMBER,
  WHATSAPP_MESSAGE,
  CLINIC_PHONE,
  CLINIC_PHONE_TEL,
  CLINIC_PHONE_DISPLAY,
} from '@/lib/constants'

export default function WhatsAppCTA() {
  const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

  return (
    <section className="py-20 bg-surface-100 border-t border-border/70">
      <Container>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary block mb-2">
              Direct Access
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Have questions prior to booking?
            </h2>
            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed mt-2">
              Message our clinic reception directly on WhatsApp for immediate scheduling guidance, insurance verification, or specialist recommendations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-xs font-semibold text-white bg-primary hover:bg-primary-800 transition-colors shadow-sm"
            >
              <MessageCircle size={16} />
              <span>Message on WhatsApp</span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href={`tel:${CLINIC_PHONE_TEL}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-medium text-foreground-secondary hover:text-foreground border border-border bg-white transition-colors"
            >
              <Phone size={14} />
              <span>Call Reception ({CLINIC_PHONE_DISPLAY})</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}

/**
 * Minimalist Floating Action Button (FAB)
 */
export function WhatsAppFAB() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

  return (
    <aside aria-label="Direct WhatsApp Contact" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-primary border border-border shadow-elevated hover:bg-surface-50 hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="Direct WhatsApp assistance"
        title="Direct WhatsApp assistance"
      >
        <MessageCircle size={22} />
      </a>
    </aside>
  )
}
