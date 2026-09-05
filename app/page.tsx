import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import PinnedShowcase from '@/components/sections/PinnedShowcase'
import Services from '@/components/sections/Services'
import DoctorsList from '@/components/sections/DoctorsList'
import Testimonials from '@/components/sections/Testimonials'
import WhatsAppCTA from '@/components/sections/WhatsAppCTA'

export const metadata: Metadata = {
  title: 'Medica Wellness Clinic — Outpatient Specialists',
  description:
    'Unhurried, evidence-based healthcare with board-certified physicians and on-site diagnostic suites in San Francisco.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <PinnedShowcase />
      <Services />
      <DoctorsList limit={4} />
      <Testimonials />
      <WhatsAppCTA />
    </>
  )
}
