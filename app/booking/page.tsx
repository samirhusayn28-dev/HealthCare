import type { Metadata } from 'next'
import { Suspense } from 'react'
import BookingPageClient from './BookingPageClient'

export const metadata: Metadata = {
  title: 'Book Appointment',
  description: 'Book an appointment online with any of our specialist doctors at Medica Wellness Clinic.',
}

export default function BookingPage() {
  return (
    <div className="min-h-screen pt-16 bg-surface-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }>
        <BookingPageClient />
      </Suspense>
    </div>
  )
}
