'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { useBookingModal } from '@/context/BookingModalContext'

const SHOWCASE_ITEMS = [
  {
    title: '3T Wide-Bore Diagnostic MRI',
    tag: 'Siemens Magnetom',
    description:
      'Ultra-high resolution neuro, musculoskeletal, and cardiac MRI imaging with acoustic reduction and same-day radiologist readings.',
    image:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1000&auto=format&fit=crop&q=85',
    specs: ['Sub-millimeter spatial resolution', 'Zero ionising radiation', 'Claustrophobia-reducing wide bore'],
  },
  {
    title: 'High-Resolution Color Doppler Ultrasound',
    tag: 'GE Voluson Expert',
    description:
      'Real-time hemodynamic vascular assessments, echocardiography, and musculoskeletal guided diagnostic interventions.',
    image:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1000&auto=format&fit=crop&q=85',
    specs: ['Direct physician-performed scans', 'Instant hemodynamics visualization', 'Non-invasive point-of-care'],
  },
  {
    title: 'Automated Clinical Pathology Suite',
    tag: 'Roche Cobas Lab',
    description:
      'Full-spectrum hematology, metabolic panels, and viral PCR diagnostics processed on-premises in under 45 minutes.',
    image:
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1000&auto=format&fit=crop&q=85',
    specs: ['45-minute urgent blood panels', 'Automated robotic verification', 'Integrated into patient portal'],
  },
]

export default function PinnedShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  const { openBookingModal } = useBookingModal()

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // DESKTOP: Scrubbed entrance that completes comfortably within section
      mm.add('(min-width: 1024px)', () => {
        if (!sectionRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 35%', // Fully completes comfortably while section is centered
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
          tl.fromTo(
            card,
            {
              opacity: 0.25,
              y: 35 + idx * 12,
              scale: 0.97,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power2.out',
              duration: 0.6,
            },
            0.1 + idx * 0.12
          )
        })
      })

      // MOBILE: Progressive scrubbed reveals
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
      ref={sectionRef}
      className="py-20 sm:py-28 md:py-32 bg-gradient-to-b from-[#e8f1ed] via-[#f5f8f6] to-[#ecf3f0] border-t border-border/60 overflow-hidden relative"
    >
      {/* Background Soft Lighting & Medical Depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-primary-100/35 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f4c4508_1px,transparent_1px),linear-gradient(to_bottom,#0f4c4508_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <Container className="relative z-10">
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
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-800 transition-colors group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Schedule consultation with imaging</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
