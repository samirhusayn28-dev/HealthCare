'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  HeartHandshake,
  Timer,
  Network,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react'
import { Container } from '@/components/layout/Container'

const PILLARS = [
  {
    number: '01',
    icon: HeartHandshake,
    title: 'Unhurried Listening',
    description:
      'We schedule 30-to-60 minute consultation blocks. No stopwatch, no rushing through clinical histories, and no cutting patients off.',
    tag: '30+ min visits',
  },
  {
    number: '02',
    icon: Timer,
    title: 'Same-Day Diagnostics',
    description:
      'On-site laboratory suites and digital radiography deliver actionable diagnostic results before you walk out our doors.',
    tag: 'Zero referral lag',
  },
  {
    number: '03',
    icon: Network,
    title: 'Continuous Connection',
    description:
      'Direct WhatsApp access to our clinical triage team and an intuitive patient portal for seamless records, lab results, and follow-ups.',
    tag: 'Direct clinician line',
  },
]

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<(HTMLDivElement | null)[]>([])
  const photoCardRef = useRef<HTMLDivElement>(null)
  const photoInnerRef = useRef<HTMLDivElement>(null)
  const quoteBadgeRef = useRef<HTMLDivElement>(null)
  const secondaryDoctorBadgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // DESKTOP: Pinned scrubbed scrollytelling with comfortable completion buffer
      mm.add('(min-width: 1024px)', () => {
        if (!sectionRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3, // Immediate 1:1 scrubbed tracking without lagging
            invalidateOnRefresh: true,
          },
        })

        // Header slides and locks (completes by 0.5s)
        tl.fromTo(
          headerRef.current,
          { y: 20, opacity: 0.85 },
          { y: 0, opacity: 1, ease: 'power1.out', duration: 0.5 },
          0
        )

        // Photo subtle expansion and depth parallax (completes by 0.8s)
        tl.fromTo(
          photoCardRef.current,
          { scale: 0.95, y: 25 },
          { scale: 1.02, y: -10, ease: 'power2.out', duration: 0.8 },
          0
        )

        tl.fromTo(
          photoInnerRef.current,
          { scale: 1.12, y: -15 },
          { scale: 1.0, y: 12, ease: 'none', duration: 1.0 },
          0
        )

        // Staggered sequential reveal of the 3 pillars (completes by 0.85s)
        pillarsRef.current.forEach((el, index) => {
          if (!el) return
          tl.fromTo(
            el,
            { opacity: 0.3, x: -20, scale: 0.98 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              ease: 'power2.out',
              duration: 0.45,
            },
            0.1 + index * 0.2
          )
        })

        // Quote badge pops in (completes by 0.95s)
        tl.fromTo(
          quoteBadgeRef.current,
          { opacity: 0, scale: 0.9, y: 15 },
          { opacity: 1, scale: 1, y: 0, ease: 'back.out(1.4)', duration: 0.45 },
          0.5
        )

        // Secondary Doctor consultation badge (completes by 0.85s)
        tl.fromTo(
          secondaryDoctorBadgeRef.current,
          { opacity: 0, scale: 0.9, y: -12 },
          { opacity: 1, scale: 1, y: 0, ease: 'back.out(1.4)', duration: 0.45 },
          0.4
        )

        // Large 50% dwell buffer: ensures all animations finish at exactly 50% of scroll progress
        // giving the user ample time to read the 3 pillars and patient review before unpinning!
        tl.to({}, { duration: 1.0 })
      })

      // MOBILE & TABLET: Non-pinned scrubbed reveal
      mm.add('(max-width: 1023px)', () => {
        if (!sectionRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 20%',
            scrub: 0.4,
          },
        })

        tl.fromTo(
          headerRef.current,
          { opacity: 0.4, y: 20 },
          { opacity: 1, y: 0, ease: 'power1.out' },
          0
        )

        tl.fromTo(
          photoCardRef.current,
          { scale: 0.96, y: 15 },
          { scale: 1, y: 0, ease: 'power1.out' },
          0.2
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="relative w-full lg:h-[280vh] bg-gradient-to-b from-[#ebf3f0] via-[#f7f9f8] to-[#e8f1ed] border-y border-border/60">
      {/* Subtle Background Accent & Soft Clinical Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-10 w-[550px] h-[550px] bg-primary-100/35 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-emerald-100/35 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f4c4508_1px,transparent_1px),linear-gradient(to_bottom,#0f4c4508_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <section
        id="about"
        className="relative lg:sticky lg:top-0 w-full min-h-screen flex items-center py-16 md:py-24 overflow-hidden"
      >
        <Container className="relative z-10">
          {/* Section Header */}
          <div ref={headerRef} className="max-w-3xl mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] font-semibold uppercase tracking-widest mb-3 border border-primary-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Care Philosophy
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.12]">
              Medicine practiced as it was intended &mdash; personal, unhurried, rigorous.
            </h2>
            <p className="text-xs sm:text-sm text-foreground-secondary mt-3 max-w-2xl leading-relaxed">
              We eliminated 10-minute rushed appointments and fragmented referrals. Our outpatient model is built around deep diagnostic listening.
            </p>
          </div>

          {/* Asymmetric Split: Narrative Columns + Natural Clinic Photo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* 3 Editorial Pillars */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {PILLARS.map((pillar, idx) => {
                const IconComponent = pillar.icon
                return (
                  <div
                    key={pillar.number}
                    ref={(el) => {
                      pillarsRef.current[idx] = el
                    }}
                    className="group relative p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-border/80 bg-white/80 backdrop-blur-xs hover:bg-white hover:border-primary/40 hover:shadow-soft transition-all duration-300"
                  >
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                          <IconComponent size={18} />
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-semibold text-primary/70">
                            {pillar.number}
                          </span>
                          <h3 className="font-heading font-semibold text-base sm:text-lg text-foreground">
                            {pillar.title}
                          </h3>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-surface-100 border border-border/80 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted shrink-0">
                        {pillar.tag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed pl-12">
                      {pillar.description}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Quiet, Well-Lit Patient Portrait with Medical Layering */}
            <div className="lg:col-span-5">
              <div
                ref={photoCardRef}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border/90 bg-surface-100 shadow-elevated"
              >
                <div ref={photoInnerRef} className="relative w-full h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1000&auto=format&fit=crop&q=85"
                    alt="Senior female physician consulting with patient in clinical office"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                {/* Floating Doctor Consultation Badge */}
                <div
                  ref={secondaryDoctorBadgeRef}
                  className="absolute top-5 left-5 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 shadow-md flex items-center gap-2.5 text-xs text-foreground"
                >
                  <div className="w-7 h-7 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                    <Stethoscope size={14} />
                  </div>
                  <div>
                    <span className="font-semibold block leading-tight">Unhurried Care</span>
                    <span className="text-[10px] text-foreground-muted leading-tight">Patient-First Medicine</span>
                  </div>
                </div>

                {/* Quote Badge */}
                <div
                  ref={quoteBadgeRef}
                  className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg text-foreground"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={15} className="text-primary shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Verified Patient Experience
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground italic leading-snug">
                    &ldquo;The first doctor who took time to explain every single lab value clearly.&rdquo;
                  </p>
                  <span className="text-[10px] text-foreground-muted mt-1 block">
                    &mdash; Patient review &bull; San Francisco Campus
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
