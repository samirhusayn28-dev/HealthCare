import type { Metadata } from 'next'
import DoctorsList from '@/components/sections/DoctorsList'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: 'Our Specialists — Medica Wellness Clinic',
  description:
    'Board-certified specialists across Cardiology, Neurology, Pediatrics, Orthopedics, and Internal Medicine in San Francisco.',
}

export default function DoctorsPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 bg-surface-50">
      <Container className="pt-8 pb-4">
        <div className="max-w-2xl">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary block mb-3">
            Physicians & Specialists
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-[1.08] mb-4">
            Meet our attending specialists.
          </h1>
          <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
            All physicians at Medica Wellness are board-certified and hold clinical appointments at premier medical faculties.
          </p>
        </div>
      </Container>
      <DoctorsList />
    </div>
  )
}
