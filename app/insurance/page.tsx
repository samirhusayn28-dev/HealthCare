'use client'

import Link from 'next/link'
import { ShieldCheck, FileCheck2, HelpCircle, ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CLINIC_NAME } from '@/lib/constants'

export default function InsurancePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface-50">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-success-50 text-success-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShieldCheck size={32} />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-50 text-success-700 text-xs font-semibold mb-4 border border-success-200">
            <span>Insurance & Billing Concierge</span>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Direct Insurance Claims
          </h1>

          <p className="text-base text-foreground-secondary leading-relaxed mb-8">
            {CLINIC_NAME} accepts major private PPO & HMO networks, Medicare, and HSA/FSA funds. We manage the paperwork directly with your payer to maximize your coverage.
          </p>

          <Card padding="lg" className="bg-white shadow-card border-border mb-8 text-left space-y-4">
            <h3 className="font-heading font-semibold text-sm text-foreground">Accepted Providers Include:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-foreground-secondary font-medium">
              <div className="p-2.5 rounded-lg bg-surface-50 border border-border text-center">Blue Shield / Blue Cross</div>
              <div className="p-2.5 rounded-lg bg-surface-50 border border-border text-center">Aetna Healthcare</div>
              <div className="p-2.5 rounded-lg bg-surface-50 border border-border text-center">Cigna Global</div>
              <div className="p-2.5 rounded-lg bg-surface-50 border border-border text-center">UnitedHealthcare</div>
              <div className="p-2.5 rounded-lg bg-surface-50 border border-border text-center">Medicare Part B</div>
              <div className="p-2.5 rounded-lg bg-surface-50 border border-border text-center">Kaiser Permanente (PPO)</div>
            </div>
          </Card>

          <div className="flex justify-center gap-4">
            <Link href="/booking">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Book with Insurance
              </Button>
            </Link>
            <Link href="/portal">
              <Button variant="outline" size="lg">
                View Past Invoices
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
