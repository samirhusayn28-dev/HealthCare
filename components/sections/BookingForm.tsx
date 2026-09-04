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
  Building2,
  Sparkles,
  Star,
  AlertCircle,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import {
  DOCTORS,
  CLINIC_NAME,
  CLINIC_PHONE,
  CLINIC_PHONE_TEL,
  CLINIC_PHONE_DISPLAY,
  CLINIC_WHATSAPP_NUMBER,
} from '@/lib/constants'
import { submitBooking } from '@/lib/api'
import { generateTimeSlots } from '@/lib/utils'

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

interface BookingFormProps {
  defaultDoctorId?: string
}

export default function BookingForm({ defaultDoctorId }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [confirmedData, setConfirmedData] = useState<BookingFormValues | null>(null)
  const [appointmentId, setAppointmentId] = useState<string>('')
  const [copiedRef, setCopiedRef] = useState(false)
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('All')
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3>(1)

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
      doctorId: defaultDoctorId || (DOCTORS[0]?.id ?? ''),
      date: todayStr,
      timeSlot: '',
      reason: '',
    },
  })

  useEffect(() => {
    if (defaultDoctorId) {
      setValue('doctorId', defaultDoctorId)
    }
  }, [defaultDoctorId, setValue])

  const selectedDoctorId = watch('doctorId')
  const selectedDate = watch('date')
  const selectedTimeSlot = watch('timeSlot')

  const selectedDoctor = useMemo(() => {
    return DOCTORS.find((d) => d.id === selectedDoctorId) || DOCTORS[0]
  }, [selectedDoctorId])

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

  // Split time slots into Morning & Afternoon
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

  // Select first available slot on doctor change
  useEffect(() => {
    if (timeSlots.length > 0 && (!selectedTimeSlot || !timeSlots.some((t) => t.value === selectedTimeSlot))) {
      setValue('timeSlot', timeSlots[0].value)
    }
  }, [timeSlots, selectedTimeSlot, setValue])

  const handleCopyRef = () => {
    if (!appointmentId) return
    navigator.clipboard.writeText(appointmentId)
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 2000)
  }

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true)
    try {
      // Find doctor details for WhatsApp text
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

      // Open WhatsApp chat in a new tab
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
      console.error('Booking failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateStepAndGo = async (targetStep: 1 | 2 | 3) => {
    if (targetStep === 2) {
      const validDoctor = await trigger('doctorId')
      if (validDoctor) setMobileStep(2)
    } else if (targetStep === 3) {
      const validDoctor = await trigger('doctorId')
      const validDate = await trigger('date')
      const validSlot = await trigger('timeSlot')
      if (validDoctor && validDate && validSlot) setMobileStep(3)
    } else {
      setMobileStep(1)
    }
  }

  return (
    <section id="booking" className="py-20 sm:py-28 md:py-32 bg-surface-50 border-t border-border/60">
      <Container>
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] font-semibold uppercase tracking-widest mb-3 border border-primary-100/60">
            <Sparkles size={13} />
            Direct Clinical Scheduling
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.12]">
            Book a dedicated consultation.
          </h2>
          <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed mt-3">
            Select your preferred specialist and time slot. No external referral required, and zero prepayment.
          </p>
        </div>

        <div className="w-full">
          <AnimatePresence mode="wait">
            {isSuccess && confirmedData ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white p-8 sm:p-14 rounded-3xl border border-border shadow-elevated max-w-2xl mx-auto"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mb-6">
                  <CheckCircle2 size={34} />
                </div>

                <div className="space-y-2 mb-8">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Reservation Confirmed
                  </span>
                  <h3 className="font-heading font-semibold text-2xl sm:text-3xl text-foreground">
                    You&apos;re scheduled, {confirmedData.fullName.split(' ')[0]}.
                  </h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    A confirmation SMS and calendar invite have been dispatched to <strong className="text-foreground">{confirmedData.phone}</strong>.
                  </p>
                </div>

                {/* Consultation Details Pill */}
                <div className="p-6 rounded-2xl bg-surface-50 border border-border space-y-5 mb-8">
                  <div className="flex items-center justify-between pb-4 border-b border-border/80">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shrink-0">
                        {selectedDoctor?.photoUrl && (
                          <Image
                            src={selectedDoctor.photoUrl}
                            alt={selectedDoctor.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-base text-foreground">{selectedDoctor?.name}</div>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="flex items-center gap-2.5 text-foreground">
                      <Calendar size={16} className="text-primary shrink-0" />
                      <span><strong>Date:</strong> {confirmedData.date}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-foreground">
                      <Clock size={16} className="text-primary shrink-0" />
                      <span><strong>Time:</strong> {confirmedData.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-foreground sm:col-span-2">
                      <MapPin size={16} className="text-primary shrink-0" />
                      <span>123 Wellness Blvd, Suite 100, San Francisco, CA</span>
                    </div>
                  </div>
                </div>

                {/* Next Steps & CTA */}
                <div className="space-y-3">
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

                  <div className="space-y-3 sm:flex sm:items-center sm:gap-3 sm:space-y-0">
                    <Link href="/portal" className="block w-full sm:w-auto flex-1">
                      <Button
                        variant="primary"
                        size="lg"
                        rightIcon={<ExternalLink size={16} />}
                        className="w-full justify-center text-sm font-semibold h-13 rounded-xl"
                      >
                        Open in Patient Portal
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setIsSuccess(false)
                        setConfirmedData(null)
                        reset()
                        setMobileStep(1)
                      }}
                      className="w-full sm:w-auto text-sm font-semibold h-13 rounded-xl"
                    >
                      Schedule Another
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* HORIZONTAL STEPPER NAVIGATION HEADER */}
                <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-border shadow-xs">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {/* Step 1 Tab */}
                    <button
                      type="button"
                      onClick={() => setMobileStep(1)}
                      className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-left ${
                        mobileStep === 1
                          ? 'bg-primary-50 text-primary border border-primary/20 shadow-xs'
                          : 'hover:bg-surface-50 text-foreground-secondary'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center font-mono shrink-0 transition-colors ${
                        mobileStep === 1 ? 'bg-primary text-white' : 'bg-surface-200 text-foreground-secondary'
                      }`}>
                        1
                      </span>
                      <div className="hidden sm:block min-w-0">
                        <div className="text-[11px] uppercase tracking-wider font-semibold opacity-75">Step 1</div>
                        <div className="text-xs sm:text-sm font-bold text-foreground truncate">Select Specialist</div>
                      </div>
                      <span className="sm:hidden text-xs font-bold truncate">Specialist</span>
                    </button>

                    {/* Step 2 Tab */}
                    <button
                      type="button"
                      onClick={() => validateStepAndGo(2)}
                      className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-left ${
                        mobileStep === 2
                          ? 'bg-primary-50 text-primary border border-primary/20 shadow-xs'
                          : 'hover:bg-surface-50 text-foreground-secondary'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center font-mono shrink-0 transition-colors ${
                        mobileStep === 2 ? 'bg-primary text-white' : 'bg-surface-200 text-foreground-secondary'
                      }`}>
                        2
                      </span>
                      <div className="hidden sm:block min-w-0">
                        <div className="text-[11px] uppercase tracking-wider font-semibold opacity-75">Step 2</div>
                        <div className="text-xs sm:text-sm font-bold text-foreground truncate">Date & Time</div>
                      </div>
                      <span className="sm:hidden text-xs font-bold truncate">Date & Time</span>
                    </button>

                    {/* Step 3 Tab */}
                    <button
                      type="button"
                      onClick={() => validateStepAndGo(3)}
                      className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-left ${
                        mobileStep === 3
                          ? 'bg-primary-50 text-primary border border-primary/20 shadow-xs'
                          : 'hover:bg-surface-50 text-foreground-secondary'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center font-mono shrink-0 transition-colors ${
                        mobileStep === 3 ? 'bg-primary text-white' : 'bg-surface-200 text-foreground-secondary'
                      }`}>
                        3
                      </span>
                      <div className="hidden sm:block min-w-0">
                        <div className="text-[11px] uppercase tracking-wider font-semibold opacity-75">Step 3</div>
                        <div className="text-xs sm:text-sm font-bold text-foreground truncate">Patient Details</div>
                      </div>
                      <span className="sm:hidden text-xs font-bold truncate">Details</span>
                    </button>
                  </div>
                </div>

                {/* HORIZONTAL 3-COLUMN LAYOUT (DESKTOP: ALL 3 SIDE-BY-SIDE | MOBILE: ACTIVE STEP VISIBLE) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
                  
                  {/* COLUMN 1: SPECIALIST SELECTION */}
                  <div className={`bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-soft flex flex-col justify-between ${
                    mobileStep === 1 ? 'block' : 'hidden lg:flex'
                  }`}>
                    <div className="space-y-4">
                      {/* Step Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-border/80">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center font-mono shrink-0">
                            1
                          </span>
                          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
                            Select Specialist
                          </span>
                        </div>
                        <span className="text-[11px] text-foreground-muted">
                          {doctorsFiltered.length} Available
                        </span>
                      </div>

                      {/* Department Filter Chips */}
                      <div className="flex flex-wrap gap-1.5 pb-1">
                        {specialties.map((spec) => (
                          <button
                            key={spec}
                            type="button"
                            onClick={() => setSelectedSpecialtyFilter(spec)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                              selectedSpecialtyFilter === spec
                                ? 'bg-foreground text-white shadow-xs'
                                : 'bg-surface-50 text-foreground-secondary hover:text-foreground border border-border'
                            }`}
                          >
                            {spec}
                          </button>
                        ))}
                      </div>

                      {/* Doctor Cards Selector */}
                      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                        {doctorsFiltered.map((doc) => {
                          const isSelected = selectedDoctorId === doc.id
                          return (
                            <button
                              key={doc.id}
                              type="button"
                              onClick={() => setValue('doctorId', doc.id)}
                              className={`w-full p-3 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 ${
                                isSelected
                                  ? 'border-primary bg-primary-50/40 ring-2 ring-primary/20 shadow-xs'
                                  : 'border-border bg-white hover:border-primary-300 hover:bg-surface-50/60'
                              }`}
                            >
                              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border shrink-0">
                                <Image
                                  src={doc.photoUrl}
                                  alt={doc.name}
                                  fill
                                  sizes="44px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-heading font-semibold text-xs sm:text-sm text-foreground truncate">
                                    {doc.name}
                                  </span>
                                  {isSelected && (
                                    <CheckCircle2 size={15} className="text-primary shrink-0" />
                                  )}
                                </div>
                                <div className="text-[11px] font-medium text-primary truncate">
                                  {doc.specialization}
                                </div>
                                <div className="text-[10px] text-foreground-muted flex items-center gap-2 mt-0.5">
                                  <span>{doc.experience} yrs exp</span>
                                  <span>&bull;</span>
                                  <span className="flex items-center gap-0.5">
                                    <Star size={9} className="text-amber-400 fill-amber-400" />
                                    {doc.rating}
                                  </span>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {errors.doctorId && (
                        <p className="text-xs font-medium text-danger flex items-center gap-1.5">
                          <AlertCircle size={13} className="shrink-0" />
                          <span>{errors.doctorId.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Mobile Only: Advance to Step 2 */}
                    <div className="pt-4 lg:hidden">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => validateStepAndGo(2)}
                        rightIcon={<ArrowRight size={16} />}
                        className="w-full justify-center text-xs font-semibold h-11"
                      >
                        Continue to Date & Time
                      </Button>
                    </div>
                  </div>

                  {/* COLUMN 2: DATE & TIME */}
                  <div className={`bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-soft flex flex-col justify-between ${
                    mobileStep === 2 ? 'block' : 'hidden lg:flex'
                  }`}>
                    <div className="space-y-5">
                      {/* Step Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-border/80">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center font-mono shrink-0">
                            2
                          </span>
                          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
                            Date & Appointment Time
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-primary truncate max-w-[120px]">
                          {selectedDoctor?.name.split(' ').slice(-1)[0]}
                        </span>
                      </div>

                      {/* Date Input */}
                      <Input
                        label="Preferred Date *"
                        type="date"
                        min={todayStr}
                        inputSize="lg"
                        leftIcon={<Calendar size={18} />}
                        error={errors.date?.message}
                        {...register('date')}
                      />

                      {/* Interactive Time Slot Pills */}
                      <div className="space-y-3.5">
                        <label className="text-xs font-semibold text-foreground block">
                          Available Slots for {selectedDoctor?.name} *
                        </label>

                        {/* Morning Slots */}
                        {morningSlots.length > 0 && (
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted block mb-1.5">
                              Morning Availability
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {morningSlots.map((ts) => {
                                const isSelected = selectedTimeSlot === ts.value
                                return (
                                  <button
                                    key={ts.value}
                                    type="button"
                                    onClick={() => setValue('timeSlot', ts.value)}
                                    className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1.5 ${
                                      isSelected
                                        ? 'bg-primary text-white font-semibold shadow-xs ring-2 ring-primary/20 scale-[1.02]'
                                        : 'bg-white border border-border text-foreground-secondary hover:border-primary/40 hover:text-foreground hover:bg-surface-50'
                                    }`}
                                  >
                                    <Clock size={12} className={isSelected ? 'text-white' : 'text-foreground-muted'} />
                                    <span>{ts.label}</span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Afternoon Slots */}
                        {afternoonSlots.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted block mb-1.5">
                              Afternoon Availability
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {afternoonSlots.map((ts) => {
                                const isSelected = selectedTimeSlot === ts.value
                                return (
                                  <button
                                    key={ts.value}
                                    type="button"
                                    onClick={() => setValue('timeSlot', ts.value)}
                                    className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1.5 ${
                                      isSelected
                                        ? 'bg-primary text-white font-semibold shadow-xs ring-2 ring-primary/20 scale-[1.02]'
                                        : 'bg-white border border-border text-foreground-secondary hover:border-primary/40 hover:text-foreground hover:bg-surface-50'
                                    }`}
                                  >
                                    <Clock size={12} className={isSelected ? 'text-white' : 'text-foreground-muted'} />
                                    <span>{ts.label}</span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {errors.timeSlot && (
                          <p className="text-xs font-medium text-danger flex items-center gap-1.5 pt-1">
                            <AlertCircle size={13} className="shrink-0" />
                            <span>{errors.timeSlot.message}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Mobile Navigation Buttons */}
                    <div className="pt-5 flex items-center gap-2.5 lg:hidden">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setMobileStep(1)}
                        leftIcon={<ArrowLeft size={16} />}
                        className="flex-1 justify-center text-xs font-semibold h-11"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => validateStepAndGo(3)}
                        rightIcon={<ArrowRight size={16} />}
                        className="flex-1 justify-center text-xs font-semibold h-11"
                      >
                        Patient Info
                      </Button>
                    </div>
                  </div>

                  {/* COLUMN 3: PATIENT INFORMATION & SUBMISSION */}
                  <div className={`bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-soft flex flex-col justify-between ${
                    mobileStep === 3 ? 'block' : 'hidden lg:flex'
                  }`}>
                    <div className="space-y-4">
                      {/* Step Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-border/80">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center font-mono shrink-0">
                            3
                          </span>
                          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
                            Patient Information
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                          <ShieldCheck size={12} />
                          Encrypted
                        </span>
                      </div>

                      {/* Inputs */}
                      <div className="space-y-3.5">
                        <Input
                          label="Full Legal Name *"
                          placeholder="e.g. Eleanor Vance"
                          inputSize="lg"
                          leftIcon={<User size={17} />}
                          error={errors.fullName?.message}
                          {...register('fullName')}
                        />

                        <Input
                          label="Mobile Phone *"
                          type="tel"
                          placeholder="+1 (555) 234-5678"
                          inputSize="lg"
                          leftIcon={<Phone size={17} />}
                          error={errors.phone?.message}
                          {...register('phone')}
                        />

                        <Textarea
                          label="Reason for Visit / Symptoms *"
                          placeholder="Briefly describe symptoms or medical history..."
                          rows={2}
                          inputSize="lg"
                          error={errors.reason?.message}
                          {...register('reason')}
                        />
                      </div>

                      {/* Consultation Mini Summary Pill */}
                      <div className="p-3 rounded-2xl bg-surface-50 border border-border text-xs flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-foreground">{selectedDoctor?.name}</span>
                            <span className="text-foreground-muted ml-1">&bull; {selectedDate} @ {selectedTimeSlot || 'Select time'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button & Guarantees */}
                    <div className="pt-5 space-y-3">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isSubmitting}
                        rightIcon={<ArrowRight size={17} />}
                        className="w-full h-14 text-sm sm:text-base font-semibold shadow-elevated rounded-2xl hover:scale-[1.005] active:scale-[0.995] transition-all justify-center"
                      >
                        {isSubmitting ? 'Securing Slot...' : 'Confirm Private Consultation'}
                      </Button>

                      <div className="flex items-center justify-center gap-3 text-[11px] text-foreground-muted text-center">
                        <span className="inline-flex items-center gap-1">
                          <ShieldCheck size={13} className="text-primary shrink-0" />
                          HIPAA Compliant
                        </span>
                        <span>&bull;</span>
                        <span>Zero Prepayment</span>
                        <span>&bull;</span>
                        <span>Free 2h Rescheduling</span>
                      </div>

                      {/* Mobile Back Button */}
                      <div className="lg:hidden pt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setMobileStep(2)}
                          leftIcon={<ArrowLeft size={15} />}
                          className="w-full justify-center text-xs text-foreground-muted h-9"
                        >
                          Back to Schedule
                        </Button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* HORIZONTAL CONCIERGE INFORMATION FOOTER STRIP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/80">
                  <div className="p-4 rounded-2xl bg-white border border-border/70 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                      <Building2 size={16} />
                    </div>
                    <div className="min-w-0 text-xs">
                      <span className="font-bold text-foreground block">Main Campus Suites</span>
                      <span className="text-foreground-muted block truncate">123 Wellness Blvd, Ste 100</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-border/70 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                      <Clock size={16} />
                    </div>
                    <div className="min-w-0 text-xs">
                      <span className="font-bold text-foreground block">Clinic Working Hours</span>
                      <span className="text-foreground-muted block truncate">Mon&ndash;Fri 8am&ndash;8pm &bull; Sat 9&ndash;5</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-border/70 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                      <ShieldCheck size={16} />
                    </div>
                    <div className="min-w-0 text-xs">
                      <span className="font-bold text-foreground block">Insurance & Direct Pay</span>
                      <span className="text-foreground-muted block truncate">Blue Shield, Aetna, Cigna, HSA</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${CLINIC_PHONE_TEL}`}
                    className="p-4 rounded-2xl bg-white border border-border/70 flex items-start gap-3 hover:border-primary/50 hover:bg-primary-50/20 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone size={16} />
                    </div>
                    <div className="min-w-0 text-xs">
                      <span className="font-bold text-foreground block">Urgent Concierge</span>
                      <span className="text-primary font-semibold block truncate group-hover:underline">{CLINIC_PHONE_DISPLAY}</span>
                    </div>
                  </a>
                </div>

              </form>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  )
}
