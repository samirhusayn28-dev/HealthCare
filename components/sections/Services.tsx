'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SERVICES } from '@/lib/constants'
import { useBookingModal } from '@/context/BookingModalContext'

// Authentic, high-resolution clinical and medical photography
const SERVICE_IMAGES: Record<string, string> = {
  'svc-1': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
  'svc-2': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
  'svc-3': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
  'svc-4': 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format&fit=crop&q=80',
  'svc-5': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=80',
  'svc-6': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  const { openBookingModal } = useBookingModal()

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // DESKTOP: Scrubbed entrance for 6 service cards with early finish
      mm.add('(min-width: 1024px)', () => {
        if (!sectionRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 35%', // Fully completes early while cards are centered in viewport
            scrub: 0.3, // Immediate responsive tracking
          },
        })

        tl.fromTo(
          headerRef.current,
          { opacity: 0.35, y: 25 },
          { opacity: 1, y: 0, ease: 'power1.out', duration: 0.5 },
          0
        )

        cardsRef.current.forEach((card, idx) => {
          if (!card) return
          const row = Math.floor(idx / 3)
          const col = idx % 3
          tl.fromTo(
            card,
            {
              opacity: 0.25,
              y: 30 + row * 15 + col * 8,
              scale: 0.97,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power2.out',
              duration: 0.55,
            },
            0.1 + (row * 0.12 + col * 0.06)
          )
        })
      })

      // MOBILE: Progressive cards scrub
      mm.add('(max-width: 1023px)', () => {
        cardsRef.current.forEach((card) => {
          if (!card) return
          gsap.fromTo(
            card,
            { opacity: 0.35, y: 20 },
            {
              opacity: 1,
              y: 0,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 0.3,
              },
            }
          )
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 sm:py-28 md:py-32 bg-gradient-to-b from-[#ecf3f0] via-[#f7faf8] to-[#e9f2ee] border-t border-border/60 relative overflow-hidden"
    >
      {/* Background Depth Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-5 w-[650px] h-[650px] bg-primary-100/35 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-5 w-[650px] h-[650px] bg-emerald-100/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f4c4508_1px,transparent_1px),linear-gradient(to_bottom,#0f4c4508_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <Container className="relative z-10">
        {/* Header with Title and Narrative */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] font-semibold uppercase tracking-widest mb-3 border border-primary-100/60">
              <Sparkles size={13} />
              Comprehensive Care Programs
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.12]">
              Clinical excellence across every department.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-foreground-secondary max-w-sm leading-relaxed">
            From preventive health screenings to advanced diagnostics and specialist interventions &mdash; all coordinated under one roof.
          </p>
        </div>

        {/* 6 Grid Cards with Clinical Photo Headers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service, index) => {
            const imageUrl = SERVICE_IMAGES[service.id] || SERVICE_IMAGES['svc-1']

            return (
              <div
                key={service.id}
                ref={(el) => {
                  cardsRef.current[index] = el
                }}
                className="group flex flex-col justify-between border border-border/80 rounded-3xl overflow-hidden bg-white/95 backdrop-blur-xs hover:border-primary/40 hover:shadow-elevated transition-all duration-300 shadow-soft"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-surface-100 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-foreground border border-border/60 shadow-xs">
                        Department 0{index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="p-7">
                    <h3 className="font-heading font-semibold text-lg sm:text-xl text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="space-y-2 pt-4 border-t border-border/60">
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-foreground-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-7 pt-0">
                  <button
                    type="button"
                    onClick={() => openBookingModal()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-800 transition-colors group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Book consultation</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
