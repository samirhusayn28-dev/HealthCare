'use client'

import Link from 'next/link'
import { Video, Shield, Clock, Users, ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function VideoConsultPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface-50">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Video size={32} />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-4 border border-primary-200">
            <span>Telehealth Virtual Care</span>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Secure Video Consultation
          </h1>

          <p className="text-base text-foreground-secondary leading-relaxed mb-8">
            Connect with board-certified physicians from the comfort of your home. End-to-end encrypted, HIPAA-compliant HD video visits with electronic prescription delivery.
          </p>

          <Card padding="lg" className="bg-white shadow-card border-border mb-8 text-left">
            <h3 className="font-heading font-semibold text-base text-foreground mb-3">
              How Virtual Visits Work:
            </h3>
            <ol className="space-y-3 text-xs sm:text-sm text-foreground-secondary list-decimal list-inside">
              <li>Book an appointment and select &ldquo;Telehealth Consultation&rdquo;</li>
              <li>Receive a secure meeting link via SMS & email 15 minutes before the session</li>
              <li>Join from your phone or laptop with no app download required</li>
              <li>Consultations include digital prescriptions sent directly to your pharmacy</li>
            </ol>
          </Card>

          <div className="flex justify-center gap-4">
            <Link href="/booking">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Book a Telehealth Slot
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
