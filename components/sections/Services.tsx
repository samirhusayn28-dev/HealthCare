'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SERVICES } from '@/lib/constants'

// Clean, high-resolution clinical photography
const SERVICE_IMAGES: Record<string, string> = {
  'svc-1': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
  'svc-2': 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80',
  'svc-3': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
  'svc-4': 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format&fit=crop&q=80',
  'svc-5': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
  'svc-6': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // DESKTOP: Scrubbed entrance for 6 service cards
      mm.add('(min-width: 1024px)', () => {
        if (!sectionRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'center 45%',
            scrub: 1, // scroll progress = animation progress
          },
        })

        tl.fromTo(
          headerRef.current,
          { opacity: 0.3, y: 35 },
          { opacity: 1, y: 0, ease: 'power1.out', duration: 1 },
          0
        )

        cardsRef.current.forEach((card, idx) => {
          if (!card) return
          const row = Math.floor(idx / 3)
          const col = idx % 3
          tl.fromTo(
            card,
            {
              opacity: 0.2,
              y: 50 + row * 30 + col * 15,
              scale: 0.95,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power2.out',
              duration: 1.4,
            },
            0.15 + (row * 0.3 + col * 0.15)
          )
        })
      })

      // MOBILE: Progressive cards scrub
      mm.add('(max-width: 1023px)', () => {
        cardsRef.current.forEach((card) => {
          if (!card) return
          gsap.fromTo(
            card,
            { opacity: 0.35, y: 25 },
            {
              opacity: 1,
              y: 0,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                end: 'top 65%',
                scrub: 0.6,
              },
            }
          )
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={sectionRef} className="py-24 md:py-32 bg-white">
      <Container>
        {/* Section Header */}
        <div ref={headerRef} className="max-w-2xl mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary block mb-3">
            Clinical Scope
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.12]">
            Comprehensive medical care under one roof.
          </h2>
          <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed mt-4">
            Direct access to board-certified physicians across primary and complex specialties without outside referrals.
          </p>
        </div>

        {/* 3x2 Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const imageUrl = SERVICE_IMAGES[service.id] || SERVICE_IMAGES['svc-1']

            return (
              <div
                key={service.id}
                ref={(el) => {
                  cardsRef.current[index] = el
                }}
                className="group flex flex-col justify-between border border-border/80 rounded-3xl overflow-hidden bg-white hover:border-primary/40 hover:shadow-elevated transition-all duration-300"
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
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-800 transition-colors group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Book consultation</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

