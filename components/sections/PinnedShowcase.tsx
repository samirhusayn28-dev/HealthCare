'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/layout/Container'

const SHOWCASE_ITEMS = [
  {
    tag: 'Diagnostic Radiology',
    title: '3T High-Field Magnetic Resonance',
    description:
      'Ultra-quiet, wide-bore 3-Tesla MRI technology delivers neurological and orthopedic imaging with sub-millimeter anatomical precision in half conventional duration.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&auto=format&fit=crop&q=80',
    specs: ['Sub-millimeter resolution', 'Zero ionizing radiation', 'Same-day radiologist review'],
  },
  {
    tag: 'Preventive Specialty',
    title: 'Precision Cardiovascular Analysis',
    description:
      'Comprehensive non-invasive cardiovascular profiling combining color Doppler echocardiography, carotid intima-media thickness, and advanced lipid fraction testing.',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&auto=format&fit=crop&q=80',
    specs: ['Color Doppler sonography', 'Advanced lipid fraction panels', 'Direct cardiologist consultation'],
  },
  {
    tag: 'Molecular Diagnostics',
    title: 'In-House Robotic Pathology',
    description:
      'Fully automated on-site pathology laboratory eliminates specimen transit delays. Complete blood counts, metabolic panels, and hormone profiles ready within two hours.',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&auto=format&fit=crop&q=80',
    specs: ['99.98% analytical precision', '2-hour emergency turnaround', 'Encrypted portal delivery'],
  },
]

export default function PinnedShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // DESKTOP: Scrubbed entrance with card fanning and depth
      mm.add('(min-width: 1024px)', () => {
        if (!sectionRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'center center',
            scrub: 1, // scrubbed to scroll
          },
        })

        tl.fromTo(
          headerRef.current,
          { opacity: 0.3, y: 40 },
          { opacity: 1, y: 0, ease: 'power1.out', duration: 1 },
          0
        )

        cardsRef.current.forEach((card, idx) => {
          if (!card) return
          tl.fromTo(
            card,
            {
              opacity: 0.2,
              y: 60 + idx * 25,
              scale: 0.94,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power2.out',
              duration: 1.4,
            },
            0.2 + idx * 0.25
          )
        })
      })

      // MOBILE: Progressive scrubbed reveals
      mm.add('(max-width: 1023px)', () => {
        cardsRef.current.forEach((card) => {
          if (!card) return
          gsap.fromTo(
            card,
            { opacity: 0.4, y: 30 },
            {
              opacity: 1,
              y: 0,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 60%',
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
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 md:py-32 bg-surface-50 border-t border-border/60 overflow-hidden"
    >
      <Container>
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary block mb-3">
              Diagnostic Rigor &bull; Clinical Infrastructure
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.15]">
              Hospital-grade imaging and pathology, on-site.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-foreground-secondary max-w-sm leading-relaxed">
            Eliminating external referral loops. All critical diagnostic modalities are integrated under direct clinical supervision.
          </p>
        </div>

        {/* Responsive 3-Column Grid with scrubbed reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SHOWCASE_ITEMS.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              className="group bg-white rounded-3xl border border-border/80 overflow-hidden shadow-soft flex flex-col justify-between hover:border-primary/40 hover:shadow-elevated transition-all duration-300"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-surface-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-foreground border border-border/60 shadow-xs">
                      0{index + 1} &bull; {item.tag}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <h3 className="font-heading font-semibold text-lg sm:text-xl text-foreground mb-2.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-border/70">
                    {item.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-foreground-secondary">
                        <CheckCircle2 size={14} className="text-primary shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-800 transition-colors group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Schedule consultation with imaging</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

