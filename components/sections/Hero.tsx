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
  Sparkles,
  Building2,
  Calendar,
  Activity,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { CLINIC_NAME } from '@/lib/constants'

export default function Hero() {
  const heroSectionRef = useRef<HTMLDivElement>(null)
  const pinnedContainerRef = useRef<HTMLDivElement>(null)
  const headerTextRef = useRef<HTMLDivElement>(null)
  const subtextRef = useRef<HTMLDivElement>(null)
  const showcaseFrameRef = useRef<HTMLDivElement>(null)
  const imageInnerRef = useRef<HTMLDivElement>(null)
  const badge1Ref = useRef<HTMLDivElement>(null)
  const badge2Ref = useRef<HTMLDivElement>(null)
  const badge3Ref = useRef<HTMLDivElement>(null)
  const statsBarRef = useRef<HTMLDivElement>(null)

  const scrollToBooking = (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById('booking')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = '/booking'
    }
  }

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // DESKTOP & TABLET: Pinned animejs.com-style scrubbed animation
      mm.add('(min-width: 768px)', () => {
        if (!heroSectionRef.current || !pinnedContainerRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1, // Smooth, 1:1 scrubbed scroll progress
            invalidateOnRefresh: true,
          },
        })

        // Step 1: Heading transforms smoothly upward & subtle scale down
        tl.to(
          headerTextRef.current,
          {
            y: -45,
            scale: 0.94,
            opacity: 0.88,
            ease: 'power1.out',
            duration: 1.5,
          },
          0
        )

        // Step 2: Subtext & CTAs gently fade down to spotlight central visual
        tl.to(
          subtextRef.current,
          {
            opacity: 0.2,
            y: -25,
            ease: 'power1.out',
            duration: 1.2,
          },
          0
        )

        // Step 3: Central architectural photography expands outward smoothly
        tl.fromTo(
          showcaseFrameRef.current,
          { scale: 0.91, y: 35, borderRadius: '32px' },
          {
            scale: 1.06,
            y: -15,
            borderRadius: '20px',
            boxShadow: '0 25px 60px -15px rgba(15, 76, 69, 0.25)',
            ease: 'power2.out',
            duration: 2.2,
          },
          0.1
        )

        // Parallax depth on image inside the frame
        tl.fromTo(
          imageInnerRef.current,
          { scale: 1.15, y: -25 },
          { scale: 1.02, y: 20, ease: 'none', duration: 3 },
          0
        )

        // Step 4: Staggered floating clinical credential badges reveal and float into place
        tl.fromTo(
          [badge1Ref.current, badge2Ref.current, badge3Ref.current],
          { opacity: 0, y: 40, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.35,
            ease: 'back.out(1.4)',
            duration: 1.2,
          },
          0.7
        )

        // Step 5: Clinical facts bar slides in at the bottom
        tl.fromTo(
          statsBarRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 1.2 },
          1.4
        )
      })

      // MOBILE (<768px): Silky non-pinned scroll-reveal scrub (no scroll trapping, 60fps)
      mm.add('(max-width: 767px)', () => {
        if (!heroSectionRef.current) return

        const tlMobile = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top 15%',
            end: 'bottom 40%',
            scrub: 0.6,
          },
        })

        tlMobile.to(showcaseFrameRef.current, {
          scale: 1.03,
          ease: 'power1.out',
          duration: 1,
        })

        tlMobile.fromTo(
          [badge1Ref.current, badge2Ref.current, badge3Ref.current],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.25, ease: 'power1.out', duration: 1 },
          0.2
        )
      })
    }, heroSectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroSectionRef} className="relative w-full md:h-[220vh] bg-surface-50">
      {/* Pinned Viewport Container */}
      <section
        ref={pinnedContainerRef}
        className="relative md:sticky md:top-0 w-full min-h-screen md:h-screen flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 md:pb-10 overflow-hidden"
      >
        <Container className="relative z-10 flex-1 flex flex-col justify-between">
          {/* Top Section: Typography and Intros */}
          <div ref={headerTextRef} className="max-w-4xl mx-auto md:mx-0 will-change-transform">
            {/* Subtle status chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-border text-[11px] font-medium text-foreground-secondary mb-4 sm:mb-6 tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Accepting New Patients &bull; San Francisco</span>
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
                  onClick={scrollToBooking}
                  className="text-xs sm:text-sm font-semibold tracking-wide px-6 py-3.5 h-12"
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

          {/* Central Visual: Architectural Facility Photography with AnimeJS-style Scroll Scrub */}
          <div className="relative w-full my-4 sm:my-6">
            <div
              ref={showcaseFrameRef}
              className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-border/80 shadow-soft bg-surface-200 will-change-transform transition-shadow duration-300"
            >
              <div ref={imageInnerRef} className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform">
                <Image
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1800&auto=format&fit=crop&q=80"
                  alt="Medica Wellness Clinic Private Suites San Francisco"
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              {/* In-image caption banner */}
              <div className="absolute bottom-4 left-5 right-5 sm:bottom-6 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-center justify-between text-white text-xs font-medium gap-1 pointer-events-none">
                <div className="flex items-center gap-2">
                  <Building2 size={15} className="text-primary-300 shrink-0" />
                  <span className="font-semibold">San Francisco Main Campus &bull; Private Clinical Suites</span>
                </div>
                <span className="opacity-85 text-[11px]">Monday &ndash; Saturday &bull; 8:00 AM &ndash; 8:00 PM</span>
              </div>
            </div>

            {/* Floating Glassmorphic Clinical Badges (Scrubbed in via ScrollTrigger) */}
            <div
              ref={badge1Ref}
              className="absolute -top-3 right-4 sm:top-4 sm:right-6 md:-top-4 md:right-8 z-20 will-change-transform"
            >
              <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-border/90 shadow-elevated flex items-center gap-2.5 text-xs text-foreground">
                <div className="w-6 h-6 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <Sparkles size={13} />
                </div>
                <div>
                  <span className="font-semibold block leading-tight">8 Board-Certified Specialties</span>
                  <span className="text-[10px] text-foreground-muted leading-tight">Direct Access &bull; No Referral</span>
                </div>
              </div>
            </div>

            <div
              ref={badge2Ref}
              className="absolute top-1/2 -translate-y-1/2 -left-2 sm:left-4 md:-left-4 z-20 will-change-transform hidden sm:block"
            >
              <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-border/90 shadow-elevated flex items-center gap-2.5 text-xs text-foreground">
                <div className="w-6 h-6 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <Clock size={13} />
                </div>
                <div>
                  <span className="font-semibold block leading-tight">Zero Wait Policy</span>
                  <span className="text-[10px] text-foreground-muted leading-tight">30+ Min Unhurried Visits</span>
                </div>
              </div>
            </div>

            <div
              ref={badge3Ref}
              className="absolute -bottom-3 right-4 sm:bottom-4 sm:right-6 md:-bottom-4 md:right-8 z-20 will-change-transform"
            >
              <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-border/90 shadow-elevated flex items-center gap-2.5 text-xs text-foreground">
                <div className="w-6 h-6 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck size={13} />
                </div>
                <div>
                  <span className="font-semibold block leading-tight">In-House 3T MRI & Labs</span>
                  <span className="text-[10px] text-foreground-muted leading-tight">Same-Day Results Delivery</span>
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
              <span className="text-xs text-foreground-muted">Average waiting time</span>
            </div>
            <div className="p-3 sm:p-0">
              <span className="block font-heading font-semibold text-xl sm:text-2xl text-foreground">Same-day</span>
              <span className="text-xs text-foreground-muted">In-house lab reports</span>
            </div>
            <div className="p-3 sm:p-0">
              <span className="block font-heading font-semibold text-xl sm:text-2xl text-foreground">99.4%</span>
              <span className="text-xs text-foreground-muted">Patient satisfaction</span>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
