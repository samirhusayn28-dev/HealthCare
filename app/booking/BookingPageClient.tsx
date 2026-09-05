'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useBookingModal } from '@/context/BookingModalContext'

export default function BookingPageClient() {
  const router = useRouter()
  const params = useSearchParams()
  const doctorId = params.get('doctor') || undefined
  const { openBookingModal } = useBookingModal()

  useEffect(() => {
    openBookingModal(doctorId)
    router.replace('/')
  }, [doctorId, openBookingModal, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-sm font-medium text-foreground-secondary">Opening appointment concierge...</p>
    </div>
  )
}
