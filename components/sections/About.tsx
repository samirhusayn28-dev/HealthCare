'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CheckCircle2, Award, Clock3, MessageSquareHeart } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { CLINIC_NAME } from '@/lib/constants'

const PILLARS = [
  {
    number: '01',
    title: 'Unhurried Listening',
    tag: '30+ Min Minimum',
    icon: Clock3,
    description:
      'Appointments are scheduled for a minimum of 30 minutes. Your physician listens to your full medical narrative, reviews history thoroughly, and answers every question without glancing at the clock.',
  },
  {
    number: '02',
    title: 'Same-Day Diagnostics',
    tag: 'In-House 3T MRI & Labs',
    icon: Award,
    description:
      'We run an integrated 3T MRI suite, low-dose digital radiography, and in-house automated pathology. Most critical diagnostic panels are analyzed and explained before you leave the building.',
  },
  {
    number: '03',
    title: 'Continuous Connection',
    tag: 'Direct Portal Access',
    icon: MessageSquareHeart,
    description:
      'Healthcare should not end when you exit the clinic. Access your test results, request medication renewals, and send non-urgent clinical queries directly to your care team through the encrypted portal.',
  },
]

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<(HTMLDivElement | null)[]>([])
  const photoCardRef = useRef<HTMLDivElement>(null)
  const photoInnerRef = useRef<HTMLDivElement>(null)
  const quoteBadgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // DESKTOP: Pinned scrubbed scrollytelling (animejs.com style)
      mm.add('(min-width: 1024px)', () => {
        if (!sectionRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1, // 1:1 scroll synchrony
            invalidateOnRefresh: true,
          },
        })

        // Header slides and locks
        tl.fromTo(
          headerRef.current,
          { y: 30, opacity: 0.8 },
          { y: 0, opacity: 1, ease: 'power1.out', duration: 1 },
          0
        )

        // Photo subtle expansion and depth parallax
        tl.fromTo(
          photoCardRef.current,
          { scale: 0.95, y: 40 },
          { scale: 1.02, y: -20, ease: 'power2.out', duration: 3 },
          0
        )

        tl.fromTo(
          photoInnerRef.current,
          { scale: 1.12, y: -20 },
          { scale: 1.0, y: 20, ease: 'none', duration: 3 },
          0
        )

        // Staggered sequential reveal of the 3 pillars
        pillarsRef.current.forEach((el, index) => {
          if (!el) return
          tl.fromTo(
            el,
            { opacity: 0.25, x: -30, scale: 0.97 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              ease: 'power2.out',
              duration: 1.2,
            },
            0.4 + index * 0.7
          )
        })

        // Quote badge pops in with satisfying spring
        tl.fromTo(
          quoteBadgeRef.current,
          { opacity: 0, scale: 0.85, y: 20 },
          { opacity: 1, scale: 1, y: 0, ease: 'back.out(1.5)', duration: 1.2 },
          1.8
        )
      })

      // MOBILE & TABLET: Non-pinned scrubbed reveal for smooth 60fps touch
      mm.add('(max-width: 1023px)', () => {
        if (!sectionRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.8,
          },
        })

        tl.fromTo(
          headerRef.current,
          { opacity: 0.3, y: 25 },
          { opacity: 1, y: 0, ease: 'power1.out' },
          0
        )

        tl.fromTo(
          photoCardRef.current,
          { scale: 0.95, y: 20 },
          { scale: 1, y: 0, ease: 'power1.out' },
          0.2
        )

        pillarsRef.current.forEach((el, index) => {
          if (!el) return
          tl.fromTo(
            el,
            { opacity: 0.4, y: 20 },
            { opacity: 1, y: 0, ease: 'power1.out' },
            0.1 + index * 0.2
          )
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="relative w-full lg:h-[210vh] bg-white border-y border-border/60">
      <section
        id="about"
        className="relative lg:sticky lg:top-0 w-full min-h-screen flex items-center py-16 md:py-24 overflow-hidden"
      >
      <Container>
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] font-semibold uppercase tracking-widest mb-3 border border-primary-100/60">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Our Care Philosophy
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.12] text-balance">
            Healthcare should feel like a partnership, not an assembly line.
          </h2>
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
                  className="group relative p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-border/80 bg-surface-50/50 hover:bg-white hover:border-primary/40 hover:shadow-soft transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-border shadow-xs flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200">
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-primary block uppercase tracking-wider">
                          Pillar {pillar.number}
                        </span>
                        <h3 className="font-heading font-semibold text-base sm:text-lg text-foreground">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-white border border-border text-[10px] font-semibold uppercase tracking-wider text-foreground-muted shrink-0">
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

          {/* Quiet, Well-Lit Patient Portrait */}
          <div className="lg:col-span-5">
            <div
              ref={photoCardRef}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border bg-surface-100 shadow-elevated"
            >
              <div ref={photoInnerRef} className="relative w-full h-full">
                <Image
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1000&auto=format&fit=crop&q=80"
                  alt="Doctor listening attentively to patient"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

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

