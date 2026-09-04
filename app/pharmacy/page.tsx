'use client'

import Link from 'next/link'
import { Pill, PackageCheck, Truck, ShieldCheck, ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function PharmacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface-50">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Pill size={32} />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-4 border border-primary-200">
            <span>In-House & Partner Pharmacy</span>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mb-4">
            Pharmacy & Medication Fulfillment
          </h1>

          <p className="text-base text-foreground-secondary leading-relaxed mb-8">
            Same-day prescription dispensation, cold-chain medication storage, and door-to-door delivery throughout the San Francisco Bay Area.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
            <Card padding="md" className="bg-white">
              <PackageCheck size={20} className="text-primary mb-2" />
              <h3 className="font-heading font-semibold text-xs text-foreground">Fast Processing</h3>
              <p className="text-[11px] text-foreground-muted mt-1">Rx filled within 30 minutes of physician sign-off.</p>
            </Card>

            <Card padding="md" className="bg-white">
              <Truck size={20} className="text-primary mb-2" />
              <h3 className="font-heading font-semibold text-xs text-foreground">Home Delivery</h3>
              <p className="text-[11px] text-foreground-muted mt-1">Free delivery for recurring maintenance medication.</p>
            </Card>

            <Card padding="md" className="bg-white">
              <ShieldCheck size={20} className="text-primary mb-2" />
              <h3 className="font-heading font-semibold text-xs text-foreground">Pharmacist Review</h3>
              <p className="text-[11px] text-foreground-muted mt-1">Rigorous drug-interaction safety audits on every order.</p>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/portal">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                View Active Prescriptions
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
