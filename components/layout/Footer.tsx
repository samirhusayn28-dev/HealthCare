'use client'

import Link from 'next/link'
import { Container } from './Container'
import { CLINIC_NAME, CLINIC_EMAIL, CLINIC_PHONE_TEL, CLINIC_PHONE_DISPLAY } from '@/lib/constants'
import { useBookingModal } from '@/context/BookingModalContext'

const FOOTER_LINKS = {
  Specialties: [
    { label: 'Primary Care', href: '/#services' },
    { label: 'Cardiology', href: '/#services' },
    { label: 'Diagnostic Radiology', href: '/#services' },
    { label: 'Neurology', href: '/#services' },
    { label: 'Pediatrics', href: '/#services' },
  ],
  Patient: [
    { label: 'Book Appointment', href: '/booking' },
    { label: 'Our Specialists', href: '/doctors' },
    { label: 'Patient Portal', href: '/portal' },
    { label: 'Telehealth Consults', href: '/video-consult' },
  ],
  Practice: [
    { label: 'Care Philosophy', href: '/#about' },
    { label: 'Pharmacy & Fulfillment', href: '/pharmacy' },
    { label: 'Insurance & Billing', href: '/insurance' },
    { label: 'Privacy Policy', href: '#' },
  ],
}

export function Footer() {
  const { openBookingModal } = useBookingModal()
  return (
    <footer className="bg-white border-t border-border py-16 md:py-24 text-foreground-secondary">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="font-heading font-semibold text-base text-foreground tracking-tight">
                {CLINIC_NAME}
              </span>
            </div>
            <p className="text-xs text-foreground-muted leading-relaxed max-w-sm">
              Compassionate, evidence-based outpatient medicine. Serving patients and families across San Francisco.
            </p>
            <div className="pt-2 text-xs text-foreground-muted space-y-1">
              <p>123 Wellness Blvd, Suite 100, San Francisco, CA</p>
              <p>
                <a href={`tel:${CLINIC_PHONE_TEL}`} className="hover:text-primary transition-colors">
                  {CLINIC_PHONE_DISPLAY}
                </a>{' '}
                &bull;{' '}
                <a href={`mailto:${CLINIC_EMAIL}`} className="hover:text-primary transition-colors">
                  {CLINIC_EMAIL}
                </a>
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className="space-y-3">
                <span className="font-semibold text-foreground tracking-wider uppercase text-[10px] block">
                  {category}
                </span>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={(e) => {
                          if (link.label === 'Book Appointment') {
                            e.preventDefault()
                            openBookingModal()
                          }
                        }}
                        className="text-foreground-secondary hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-muted">
          <p>&copy; {new Date().getFullYear()} {CLINIC_NAME}. All rights reserved.</p>
          <p>HIPAA Compliant Electronic Records &bull; California Medical Board Certified</p>
        </div>
      </Container>
    </footer>
  )
}
