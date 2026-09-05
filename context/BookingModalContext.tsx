'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface BookingModalContextType {
  isOpen: boolean
  selectedDoctorId?: string
  openBookingModal: (doctorId?: string) => void
  closeBookingModal: () => void
}

const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined)

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined)

  const openBookingModal = useCallback((doctorId?: string) => {
    setSelectedDoctorId(doctorId)
    setIsOpen(true)
  }, [])

  const closeBookingModal = useCallback(() => {
    setIsOpen(false)
    setSelectedDoctorId(undefined)
  }, [])

  return (
    <BookingModalContext.Provider
      value={{ isOpen, selectedDoctorId, openBookingModal, closeBookingModal }}
    >
      {children}
    </BookingModalContext.Provider>
  )
}

export function useBookingModal() {
  const context = useContext(BookingModalContext)
  if (!context) {
    throw new Error('useBookingModal must be used within a BookingModalProvider')
  }
  return context
}
