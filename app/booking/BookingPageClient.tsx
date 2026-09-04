'use client'

import { useSearchParams } from 'next/navigation'
import BookingForm from '@/components/sections/BookingForm'
import DoctorsList from '@/components/sections/DoctorsList'

export default function BookingPageClient() {
  const params = useSearchParams()
  const doctorId = params.get('doctor') || undefined

  return (
    <>
      <BookingForm defaultDoctorId={doctorId} />
      <DoctorsList limit={4} />
    </>
  )
}
