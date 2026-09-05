'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Star,
  AlertCircle,
  X,
  Stethoscope,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import {
  DOCTORS,
  CLINIC_NAME,
  CLINIC_PHONE_TEL,
  CLINIC_PHONE_DISPLAY,
  CLINIC_WHATSAPP_NUMBER,
} from '@/lib/constants'
import { submitBooking } from '@/lib/api'
import { generateTimeSlots } from '@/lib/utils'
import { useBookingModal } from '@/context/BookingModalContext'

const bookingSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full legal name is required' })
    .max(80, { message: 'Name must be under 80 characters' }),
  phone: z
    .string()
    .min(7, { message: 'Valid phone number is required' })
    .regex(/^[0-9+()\-.\s]{7,25}$/, { message: 'Please enter a valid phone number format' }),
  doctorId: z.string().min(1, { message: 'Please select a physician' }),
  date: z
    .string()
    .min(1, { message: 'Please select an appointment date' })
    .refine((val) => {
      const selected = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selected >= today
    }, { message: 'Date cannot be in the past' }),
  timeSlot: z.string().min(1, { message: 'Please select an appointment time slot' }),
  reason: z
    .string()
    .min(5, { message: 'Please provide at least a brief reason for your consultation' })
    .max(500, { message: 'Reason must be under 500 characters' }),
})

type BookingFormValues = z.infer<typeof bookingSchema>

export function BookingModal() {
  const { isOpen, selectedDoctorId, closeBookingModal } = useBookingModal()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [confirmedData, setConfirmedData] = useState<BookingFormValues | null>(null)
  const [appointmentId, setAppointmentId] = useState<string>('')
  const [copiedRef, setCopiedRef] = useState(false)
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('All')

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      doctorId: selectedDoctorId || (DOCTORS[0]?.id ?? ''),
      date: todayStr,
      timeSlot: '',
      reason: '',
    },
  })

  // Set doctor when selectedDoctorId changes or modal opens
  useEffect(() => {
    if (selectedDoctorId) {
      setValue('doctorId', selectedDoctorId)
      // Auto-advance to Step 2 if doctor was explicitly chosen
      setStep(2)
    } else {
      setValue('doctorId', DOCTORS[0]?.id ?? '')
      setStep(1)
    }
    setIsSuccess(false)
    setConfirmedData(null)
  }, [selectedDoctorId, isOpen, setValue])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeBookingModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeBookingModal])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const currentDoctorId = watch('doctorId')
  const currentDate = watch('date')
  const currentTimeSlot = watch('timeSlot')

  const selectedDoctor = useMemo(() => {
    return DOCTORS.find((d) => d.id === currentDoctorId) || DOCTORS[0]
  }, [currentDoctorId])

  const specialties = useMemo(() => {
    const list = Array.from(new Set(DOCTORS.map((d) => d.specialization)))
    return ['All', ...list]
  }, [])

  const doctorsFiltered = useMemo(() => {
    if (selectedSpecialtyFilter === 'All') return DOCTORS
    return DOCTORS.filter((d) => d.specialization === selectedSpecialtyFilter)
  }, [selectedSpecialtyFilter])

  const timeSlots = useMemo(() => {
    if (!selectedDoctor?.availableHours) return []
    return generateTimeSlots(selectedDoctor.availableHours)
  }, [selectedDoctor])

  const morningSlots = useMemo(() => {
    return timeSlots.filter((ts) => {
      const hour = parseInt(ts.value.split(':')[0], 10)
      return hour < 12
    })
  }, [timeSlots])

  const afternoonSlots = useMemo(() => {
    return timeSlots.filter((ts) => {
      const hour = parseInt(ts.value.split(':')[0], 10)
      return hour >= 12
    })
  }, [timeSlots])

  // Ensure valid slot is selected
  useEffect(() => {
    if (timeSlots.length > 0 && (!currentTimeSlot || !timeSlots.some((t) => t.value === currentTimeSlot))) {
      setValue('timeSlot', timeSlots[0].value)
    }
  }, [timeSlots, currentTimeSlot, setValue])

  const handleCopyRef = () => {
    if (!appointmentId) return
    navigator.clipboard.writeText(appointmentId)
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 2000)
  }

  const validateAndProceed = async (targetStep: 1 | 2 | 3) => {
    if (targetStep === 2) {
      const validDoctor = await trigger('doctorId')
      if (validDoctor) setStep(2)
    } else if (targetStep === 3) {
      const validDate = await trigger('date')
      const validSlot = await trigger('timeSlot')
      if (validDate && validSlot) setStep(3)
    } else {
      setStep(1)
    }
  }

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true)
    try {
      const doc = DOCTORS.find((d) => d.id === data.doctorId)
      const docName = doc?.name || data.doctorId
      const specialization = doc?.specialization || ''
      const timeSlotObj = timeSlots.find((t) => t.value === data.timeSlot)
      const timeLabel = timeSlotObj?.label || data.timeSlot

      const waText = [
        "Hi, I'd like to request an appointment.",
        "",
        `Specialist: ${docName}${specialization ? ` (${specialization})` : ''}`,
        `Date: ${data.date}`,
        `Time: ${timeLabel}`,
        `Patient Name: ${data.fullName}`,
        `Phone: ${data.phone}`,
        `Reason for Visit: ${data.reason}`,
        "",
        "Please confirm my slot. Thank you!"
      ].join('\n')

      const waUrl = `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`

      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank', 'noopener,noreferrer')
      }

      const result = await submitBooking(data)
      if (result.success) {
        setConfirmedData(data)
        setAppointmentId(result.appointmentId)
        setIsSuccess(true)
      }
    } catch (err) {
      console.error('Booking submission failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setIsSuccess(false)
    setConfirmedData(null)
    reset()
    setStep(1)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeBookingModal}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-white rounded-3xl border border-border shadow-2xl flex flex-col max-h-[92vh] z-10 overflow-hidden"
        >
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-border/70 flex items-center justify-between bg-surface-50/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                <Stethoscope size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
                  Book Dedicated Consultation
                </h3>
                <p className="text-xs text-foreground-secondary">
                  Step-by-step private clinic scheduling &bull; Zero prepayment
                </p>
              </div>
            </div>

            <button
              onClick={closeBookingModal}
              title="Close dialog"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-surface-200 transition-colors"
            >
              <X size={19} />
            </button>
          </div>

          {/* Stepper Progress Bar (Only visible during form entry) */}
          {!isSuccess && (
            <div className="px-6 pt-4 pb-2 bg-white border-b border-border/50 shrink-0">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* Step 1 Tab */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left ${
                    step === 1
                      ? 'bg-primary-50 text-primary border border-primary/20'
                      : 'text-foreground-muted hover:text-foreground hover:bg-surface-50'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center font-mono shrink-0 ${
                      step === 1 ? 'bg-primary text-white' : 'bg-surface-200 text-foreground-muted'
                    }`}
                  >
                    1
                  </span>
                  <span className="text-xs font-semibold truncate">1. Specialist</span>
                </button>

                {/* Step 2 Tab */}
                <button
                  type="button"
                  onClick={() => validateAndProceed(2)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left ${
                    step === 2
                      ? 'bg-primary-50 text-primary border border-primary/20'
                      : 'text-foreground-muted hover:text-foreground hover:bg-surface-50'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center font-mono shrink-0 ${
                      step === 2 ? 'bg-primary text-white' : 'bg-surface-200 text-foreground-muted'
                    }`}
                  >
                    2
                  </span>
                  <span className="text-xs font-semibold truncate">2. Date & Time</span>
                </button>

                {/* Step 3 Tab */}
                <button
                  type="button"
                  onClick={() => validateAndProceed(3)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left ${
                    step === 3
                      ? 'bg-primary-50 text-primary border border-primary/20'
                      : 'text-foreground-muted hover:text-foreground hover:bg-surface-50'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center font-mono shrink-0 ${
                      step === 3 ? 'bg-primary text-white' : 'bg-surface-200 text-foreground-muted'
                    }`}
                  >
                    3
                  </span>
                  <span className="text-xs font-semibold truncate">3. Your Details</span>
                </button>
              </div>
            </div>
          )}

          {/* Modal Body Container */}
          <div className="flex-1 overflow-y-auto p-6">
            {isSuccess && confirmedData ? (
              /* Success Screen */
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary flex items-center justify-center">
                  <CheckCircle2 size={30} />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Reservation Confirmed
                  </span>
                  <h3 className="font-heading font-bold text-2xl text-foreground">
                    You&apos;re scheduled, {confirmedData.fullName.split(' ')[0]}.
                  </h3>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    A confirmation message and booking summary have been dispatched to{' '}
                    <strong className="text-foreground">{confirmedData.phone}</strong>.
                  </p>
                </div>

                {/* Details Card */}
                <div className="p-5 rounded-2xl bg-surface-50 border border-border space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/80">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border shrink-0">
                        {selectedDoctor?.photoUrl && (
                          <Image
                            src={selectedDoctor.photoUrl}
                            alt={selectedDoctor.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground">{selectedDoctor?.name}</div>
                        <div className="text-xs text-foreground-muted">{selectedDoctor?.specialization}</div>
                      </div>
                    </div>

                    <button
                      onClick={handleCopyRef}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-border text-xs font-mono font-medium text-foreground hover:bg-surface-100 transition-colors shadow-xs"
                      title="Copy Reference"
                    >
                      {copiedRef ? <Check size={13} className="text-primary" /> : <Copy size={13} className="text-foreground-muted" />}
                      <span>{appointmentId}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-foreground">
                      <Calendar size={15} className="text-primary shrink-0" />
                      <span><strong>Date:</strong> {confirmedData.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Clock size={15} className="text-primary shrink-0" />
                      <span><strong>Time:</strong> {confirmedData.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground sm:col-span-2">
                      <MapPin size={15} className="text-primary shrink-0" />
                      <span>123 Wellness Blvd, Suite 100, San Francisco, CA</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent([
                      "Hi, I'd like to request an appointment.",
                      "",
                      `Specialist: ${selectedDoctor?.name || confirmedData.doctorId}${selectedDoctor?.specialization ? ` (${selectedDoctor.specialization})` : ''}`,
                      `Date: ${confirmedData.date}`,
                      `Time: ${confirmedData.timeSlot}`,
                      `Patient Name: ${confirmedData.fullName}`,
                      `Phone: ${confirmedData.phone}`,
                      `Reason for Visit: ${confirmedData.reason}`,
                      "",
                      "Please confirm my slot. Thank you!"
                    ].join('\n'))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25d366] text-white font-semibold text-sm hover:bg-[#20ba59] transition-all shadow-xs"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>Sent to WhatsApp &bull; Re-open Chat</span>
                  </a>

                  <div className="flex gap-3">
                    <Link
                      href="/portal"
                      onClick={closeBookingModal}
                      className="flex-1 block"
                    >
                      <Button
                        variant="primary"
                        size="md"
                        rightIcon={<ExternalLink size={15} />}
                        className="w-full justify-center text-xs sm:text-sm font-semibold h-11 rounded-xl"
                      >
                        Open in Patient Portal
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleReset}
                      className="text-xs sm:text-sm font-semibold h-11 rounded-xl"
                    >
                      Schedule Another
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Step-by-Step Form Content */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* STEP 1: SELECT SPECIALIST */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-5"
                  >
                    <div>
                      <h4 className="font-heading font-semibold text-sm sm:text-base text-foreground">
                        Step 1: Choose Your Physician
                      </h4>
                      <p className="text-xs text-foreground-secondary mt-0.5">
                        Filter by specialty or select from our board-certified clinical faculty.
                      </p>
                    </div>

                    {/* Department Filter Chips */}
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {specialties.map((spec) => (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => setSelectedSpecialtyFilter(spec)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                            selectedSpecialtyFilter === spec
                              ? 'bg-primary text-white shadow-xs'
                              : 'bg-surface-100 text-foreground-secondary hover:bg-surface-200'
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>

                    {/* Doctor Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                      {doctorsFiltered.map((doc) => {
                        const isSelected = currentDoctorId === doc.id
                        return (
                          <div
                            key={doc.id}
                            onClick={() => setValue('doctorId', doc.id, { shouldValidate: true })}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'border-primary bg-primary-50/40 ring-2 ring-primary/20 shadow-xs'
                                : 'border-border/80 hover:border-primary/40 bg-white hover:bg-surface-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shrink-0">
                                <Image
                                  src={doc.photoUrl}
                                  alt={doc.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-xs sm:text-sm text-foreground truncate">
                                  {doc.name}
                                </div>
                                <div className="text-[11px] text-primary font-medium truncate">
                                  {doc.specialization}
                                </div>
                                <div className="text-[10px] text-foreground-muted flex items-center gap-1.5 mt-0.5">
                                  <span>{doc.experience} yrs exp</span>
                                  <span>&bull;</span>
                                  <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                                    <Star size={10} className="fill-amber-400" />
                                    {doc.rating}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                isSelected ? 'bg-primary text-white' : 'border border-border'
                              }`}
                            >
                              {isSelected && <Check size={11} strokeWidth={3} />}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {errors.doctorId && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle size={13} />
                        {errors.doctorId.message}
                      </p>
                    )}

                    {/* Step 1 Footer Action */}
                    <div className="pt-4 border-t border-border flex justify-end">
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        rightIcon={<ArrowRight size={15} />}
                        onClick={() => validateAndProceed(2)}
                        className="text-xs sm:text-sm font-semibold px-6 h-11 rounded-xl"
                      >
                        Next: Choose Date & Time
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: DATE & TIME */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-5"
                  >
                    <div>
                      <h4 className="font-heading font-semibold text-sm sm:text-base text-foreground">
                        Step 2: Choose Consultation Date & Slot
                      </h4>
                      <p className="text-xs text-foreground-secondary mt-0.5">
                        Selected physician:{' '}
                        <strong className="text-primary">{selectedDoctor?.name}</strong> ({selectedDoctor?.specialization})
                      </p>
                    </div>

                    {/* Date Input */}
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-2">
                        Preferred Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          min={todayStr}
                          {...register('date')}
                          className="w-full text-xs sm:text-sm h-11 px-4 rounded-xl border border-border bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans"
                        />
                      </div>
                      {errors.date && (
                        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={13} />
                          {errors.date.message}
                        </p>
                      )}
                    </div>

                    {/* Available Time Slots */}
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-foreground block">
                        Available Clinical Time Slots
                      </label>

                      {morningSlots.length > 0 && (
                        <div>
                          <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block mb-2">
                            Morning Slots
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {morningSlots.map((slot) => {
                              const isSelected = currentTimeSlot === slot.value
                              return (
                                <button
                                  key={slot.value}
                                  type="button"
                                  onClick={() => setValue('timeSlot', slot.value, { shouldValidate: true })}
                                  className={`py-2 px-3 rounded-xl text-xs font-semibold font-mono border transition-all ${
                                    isSelected
                                      ? 'bg-primary text-white border-primary shadow-xs'
                                      : 'bg-surface-50 border-border/70 text-foreground hover:bg-surface-100'
                                  }`}
                                >
                                  {slot.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {afternoonSlots.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider block mb-2">
                            Afternoon Slots
                          </span>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {afternoonSlots.map((slot) => {
                              const isSelected = currentTimeSlot === slot.value
                              return (
                                <button
                                  key={slot.value}
                                  type="button"
                                  onClick={() => setValue('timeSlot', slot.value, { shouldValidate: true })}
                                  className={`py-2 px-3 rounded-xl text-xs font-semibold font-mono border transition-all ${
                                    isSelected
                                      ? 'bg-primary text-white border-primary shadow-xs'
                                      : 'bg-surface-50 border-border/70 text-foreground hover:bg-surface-100'
                                  }`}
                                >
                                  {slot.label}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {errors.timeSlot && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle size={13} />
                          {errors.timeSlot.message}
                        </p>
                      )}
                    </div>

                    {/* Step 2 Footer Navigation */}
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        leftIcon={<ArrowLeft size={15} />}
                        onClick={() => setStep(1)}
                        className="text-xs sm:text-sm font-semibold h-11 rounded-xl"
                      >
                        Back
                      </Button>

                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        rightIcon={<ArrowRight size={15} />}
                        onClick={() => validateAndProceed(3)}
                        className="text-xs sm:text-sm font-semibold px-6 h-11 rounded-xl"
                      >
                        Next: Patient Details
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: PATIENT DETAILS */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-5"
                  >
                    <div>
                      <h4 className="font-heading font-semibold text-sm sm:text-base text-foreground">
                        Step 3: Patient Information & Clinical Note
                      </h4>
                      <p className="text-xs text-foreground-secondary mt-0.5">
                        Consultation summary:{' '}
                        <strong className="text-foreground">{selectedDoctor?.name}</strong> on{' '}
                        <strong className="text-foreground">{currentDate}</strong> at{' '}
                        <strong className="text-foreground">{currentTimeSlot}</strong>.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Full Name */}
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1.5">
                          Full Legal Name *
                        </label>
                        <Input
                          placeholder="e.g. Johnathan Doe"
                          leftIcon={<User size={16} />}
                          {...register('fullName')}
                          error={errors.fullName?.message}
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1.5">
                          Mobile Phone (for SMS confirmation) *
                        </label>
                        <Input
                          placeholder="e.g. 0324 0130267"
                          type="tel"
                          leftIcon={<Phone size={16} />}
                          {...register('phone')}
                          error={errors.phone?.message}
                        />
                      </div>

                      {/* Reason for Visit */}
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1.5">
                          Reason for Visit / Primary Symptoms *
                        </label>
                        <Textarea
                          placeholder="Describe symptoms, duration, or any ongoing medication (e.g. routine cardiac checkup, persistent cough for 4 days)..."
                          rows={3}
                          {...register('reason')}
                          error={errors.reason?.message}
                        />
                      </div>
                    </div>

                    {/* Trust Badges & Phone Concierge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div className="p-3 rounded-xl bg-surface-50 border border-border/70 flex items-center gap-2.5 text-xs text-foreground-secondary">
                        <ShieldCheck size={16} className="text-primary shrink-0" />
                        <span>HIPAA Encrypted &bull; Zero Prepayment</span>
                      </div>

                      <a
                        href={`tel:${CLINIC_PHONE_TEL}`}
                        className="p-3 rounded-xl bg-surface-50 border border-border/70 flex items-center gap-2.5 text-xs text-foreground-secondary hover:text-primary hover:border-primary/40 transition-colors"
                      >
                        <Phone size={16} className="text-primary shrink-0" />
                        <span>Concierge: {CLINIC_PHONE_DISPLAY}</span>
                      </a>
                    </div>

                    {/* Step 3 Footer Actions */}
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        leftIcon={<ArrowLeft size={15} />}
                        onClick={() => setStep(2)}
                        className="text-xs sm:text-sm font-semibold h-11 rounded-xl"
                      >
                        Back
                      </Button>

                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={isSubmitting}
                        className="text-xs sm:text-sm font-semibold px-6 h-11 rounded-xl"
                      >
                        Confirm Private Consultation
                      </Button>
                    </div>
                  </motion.div>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
