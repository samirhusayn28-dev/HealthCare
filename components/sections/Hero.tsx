'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Building2,
  Stethoscope,
  Activity,
  CheckCircle2,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { CLINIC_NAME, DOCTORS } from '@/lib/constants'
import { useBookingModal } from '@/context/BookingModalContext'

export default function Hero() {
  const heroSectionRef = useRef<HTMLDivElement>(null)
  const pinnedContainerRef = useRef<HTMLDivElement>(null)
  const headerTextRef = useRef<HTMLDivElement>(null)
  const subtextRef = useRef<HTMLDivElement>(null)
  const showcaseFrameRef = useRef<HTMLDivElement>(null)
  const badge1Ref = useRef<HTMLDivElement>(null)
  const badge2Ref = useRef<HTMLDivElement>(null)
  const badge3Ref = useRef<HTMLDivElement>(null)
  const statsBarRef = useRef<HTMLDivElement>(null)

  const { openBookingModal } = useBookingModal()

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // DESKTOP & TABLET: Pinned animejs.com-style scrubbed animation with comfortable dwell buffer
      mm.add('(min-width: 768px)', () => {
        if (!heroSectionRef.current || !pinnedContainerRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3, // Immediate 1:1 scrubbed tracking without trailing lag
            invalidateOnRefresh: true,
          },
        })

        // Step 1: Heading transforms smoothly upward & subtle scale (completes by 0.5s)
        tl.to(
          headerTextRef.current,
          {
            y: -15,
            scale: 0.98,
            opacity: 1,
            ease: 'power1.out',
            duration: 0.5,
          },
          0
        )

        // Step 2: Subtext & CTAs gently adjust (completes by 0.4s)
        tl.to(
          subtextRef.current,
          {
            opacity: 0.85,
            y: -10,
            ease: 'power1.out',
            duration: 0.4,
          },
          0
        )

        // Step 3: Central clinical photography settles into full prominence (completes by 0.7s)
        tl.fromTo(
          showcaseFrameRef.current,
          { scale: 0.95, y: 15, borderRadius: '24px' },
          {
            scale: 1,
            y: 0,
            borderRadius: '20px',
            boxShadow: '0 25px 60px -15px rgba(15, 76, 69, 0.22)',
            ease: 'power2.out',
            duration: 0.6,
          },
          0.1
        )

        // Step 4: Staggered floating clinical credential badges reveal and lock into place (completes by 0.8s)
        tl.fromTo(
          [badge1Ref.current, badge2Ref.current, badge3Ref.current],
          { opacity: 0, y: 15, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            ease: 'back.out(1.4)',
            duration: 0.5,
          },
          0.2
        )

        // Step 5: Clinical facts bar slides in at the bottom (completes by 0.8s)
        tl.fromTo(
          statsBarRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 },
          0.4
        )

        // Explicit 50% dwell buffer: ensures all animations finish at exactly 50% of scroll progress
        // so the completed view is stationary, settled, and completely stable before unpinning!
        tl.to({}, { duration: 0.8 })
      })

      // MOBILE (<768px): Progressive non-pinned scroll-reveal scrub
      mm.add('(max-width: 767px)', () => {
        if (!heroSectionRef.current) return

        const tlMobile = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top 75%',
            end: 'top 15%',
            scrub: 0.4,
          },
        })

        tlMobile.to(showcaseFrameRef.current, {
          scale: 1.02,
          ease: 'power1.out',
          duration: 1,
        })

        tlMobile.fromTo(
          [badge1Ref.current, badge2Ref.current, badge3Ref.current],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.2, ease: 'power1.out', duration: 0.8 },
          0.2
        )
      })
    }, heroSectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroSectionRef} className="relative w-full md:h-[220vh] bg-gradient-to-b from-[#eaf2ee] via-[#f4f7f6] to-[#ebf3f0]">
      {/* Pinned Viewport Container */}
      <section
        ref={pinnedContainerRef}
        className="relative md:sticky md:top-0 w-full min-h-screen md:h-screen flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 md:pb-10 overflow-hidden"
      >
        {/* Subtle Ambient Lighting & Grid INSIDE the pinned container so it stays synchronously anchored */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/35 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-emerald-200/25 rounded-full blur-3xl -translate-x-1/4" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f4c4506_1px,transparent_1px),linear-gradient(to_bottom,#0f4c4506_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_70%,transparent_100%)]" />
        </div>

        <Container className="relative z-10 flex-1 flex flex-col justify-between">
          {/* Top Section: Typography and Intros */}
          <div ref={headerTextRef} className="max-w-4xl mx-auto md:mx-0 will-change-transform">
            {/* Subtle status chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-border text-[11px] font-medium text-foreground-secondary mb-4 sm:mb-6 tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Accepting New Patients &bull; San Francisco Main Campus</span>
            </div>

            {/* Dominant Editorial Heading */}
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-foreground tracking-tight leading-[1.08] text-balance mb-4 sm:mb-6">
              Healthcare designed around life, not waiting rooms.
            </h1>

            {/* Calm, confident subtext & CTA buttons */}
            <div ref={subtextRef} className="will-change-transform">
              <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed max-w-2xl mb-6 sm:mb-8">
                {CLINIC_NAME} provides unhurried, multi-specialty outpatient medicine. Board-certified physicians, on-site diagnostics, and same-day access with zero administrative friction.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-8 sm:mb-12">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => openBookingModal()}
                  className="text-xs sm:text-sm font-semibold tracking-wide px-6 py-3.5 h-12 shadow-sm hover:shadow-md"
                >
                  Book an Appointment
                </Button>

                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors px-3 py-2 min-h-[44px]"
                >
                  <span>Meet our physicians</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </div>

          {/* Central Visual: Architectural Facility & Medical Consultation Visual with Scrub */}
          <div className="relative w-full my-4 sm:my-6">
            <div
              ref={showcaseFrameRef}
              className="relative w-full h-[220px] sm:h-[290px] md:h-[350px] lg:h-[390px] rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 shadow-soft bg-surface-200 will-change-transform"
            >
              <div className="relative w-full h-full">
                <Image
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=85"
                  alt="Board-certified physicians reviewing clinical diagnostic scan at Medica Wellness"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
              </div>

              {/* Minimal caption tag inside photo */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 text-white text-xs sm:text-sm flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Building2 size={15} className="text-primary-300 shrink-0" />
                  <span className="font-semibold">San Francisco Main Campus &bull; Private Clinical Suites</span>
                </div>
                <span className="opacity-85 text-[11px]">Monday &ndash; Saturday &bull; 8:00 AM &ndash; 8:00 PM &bull; Walk-ins & Appointments</span>
              </div>
            </div>

            {/* Floating Glassmorphic Clinical Badges (Scrubbed in via ScrollTrigger) */}
            {/* Badge 1: Top Right - Board-certified Doctor Avatar Stack */}
            <div
              ref={badge1Ref}
              className="absolute -top-3 right-4 sm:top-4 sm:right-6 md:-top-4 md:right-8 z-20 will-change-transform"
            >
              <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-border/90 shadow-elevated flex items-center gap-3 text-xs text-foreground">
                <div className="flex items-center -space-x-2 shrink-0">
                  {DOCTORS.slice(0, 3).map((doc) => (
                    <div
                      key={doc.id}
                      className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-white bg-surface-200 shrink-0"
                    >
                      <Image
                        src={doc.photoUrl}
                        alt={doc.name}
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <span className="font-semibold block leading-tight">Board-Certified Specialists</span>
                  <span className="text-[10px] text-foreground-muted leading-tight">Cardiology, Pediatrics, Neurology &bull; Direct Access</span>
                </div>
              </div>
            </div>

            {/* Badge 2: Left Center - Zero Wait & Dedicated Consultation */}
            <div
              ref={badge2Ref}
              className="absolute top-1/2 -translate-y-1/2 -left-2 sm:left-4 md:-left-4 z-20 will-change-transform hidden sm:block"
            >
              <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-border/90 shadow-elevated flex items-center gap-2.5 text-xs text-foreground">
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="font-semibold block leading-tight">Zero Wait Policy</span>
                  <span className="text-[10px] text-foreground-muted leading-tight">30+ Min Unhurried Visits &bull; Immediate Triage</span>
                </div>
              </div>
            </div>

            {/* Badge 3: Bottom Right - On-Site Diagnostic Imaging */}
            <div
              ref={badge3Ref}
              className="absolute -bottom-3 right-4 sm:bottom-4 sm:right-6 md:-bottom-4 md:right-8 z-20 will-change-transform"
            >
              <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-border/90 shadow-elevated flex items-center gap-2.5 text-xs text-foreground">
                <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <span className="font-semibold block leading-tight">In-House 3T MRI & Labs</span>
                  <span className="text-[10px] text-foreground-muted leading-tight">Same-Day Results Delivery &bull; On-Site Radiologists</span>
                </div>
              </div>
            </div>
          </div>

          {/* Understated Clinical Facts Bar (Scrubbed in via ScrollTrigger) */}
          <div
            ref={statsBarRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border/60 will-change-transform"
          >
            <div className="p-3 sm:p-0">
              <span className="block font-heading font-semibold text-xl sm:text-2xl text-foreground">30+ min</span>
              <span className="text-xs text-foreground-muted">Unhurried consultations</span>
            </div>
            <div className="p-3 sm:p-0">
              <span className="block font-heading font-semibold text-xl sm:text-2xl text-foreground">0 min</span>
              <span className="text-xs text-foreground-muted">Average waiting room time</span>
            </div>
            <div className="p-3 sm:p-0">
              <span className="block font-heading font-semibold text-xl sm:text-2xl text-foreground">Same-day</span>
              <span className="text-xs text-foreground-muted">Diagnostic lab & MRI reports</span>
            </div>
            <div className="p-3 sm:p-0">
              <span className="block font-heading font-semibold text-xl sm:text-2xl text-foreground">99.4%</span>
              <span className="text-xs text-foreground-muted">Verified patient satisfaction</span>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
