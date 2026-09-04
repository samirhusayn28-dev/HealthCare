'use client'

import Link from 'next/link'
import { MessageSquare, ShieldCheck, Lock, ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CLINIC_WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '@/lib/constants'

export default function ChatPage() {
  const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface-50">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-accent-50 text-accent flex items-center justify-center mx-auto mb-6 shadow-sm">
            <MessageSquare size={32} />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-50 text-accent-700 text-xs font-semibold mb-4 border border-accent-200">
            <span>Direct Clinical Messaging</span>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Chat with Your Care Team
          </h1>

          <p className="text-base text-foreground-secondary leading-relaxed mb-8">
            Asynchronous messaging for follow-up questions, lab inquiries, and medication refill requests. Securely routed to your attending physician&apos;s clinical inbox.
          </p>

          <Card padding="lg" className="bg-white shadow-card border-border mb-8 text-left space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-semibold text-foreground">HIPAA-Compliant Patient Portal</p>
                <p className="text-foreground-muted mt-0.5">Encrypted communication directly integrated with your Electronic Medical Records.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-border">
              <Lock size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-semibold text-foreground">For Instant Inquiries</p>
                <p className="text-foreground-muted mt-0.5">Need immediate assistance right now? Connect directly with our front-desk concierge via WhatsApp.</p>
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap justify-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Chat on WhatsApp Now
              </Button>
            </a>
            <Link href="/portal">
              <Button variant="outline" size="lg">
                View Patient Portal
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
