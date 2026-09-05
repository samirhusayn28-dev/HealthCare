'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, ArrowRight, Sparkles } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { DOCTORS } from '@/lib/constants'
import { useBookingModal } from '@/context/BookingModalContext'

interface DoctorsListProps {
  limit?: number
  showFilter?: boolean
}

export default function DoctorsList({
  limit,
  showFilter = false,
}: DoctorsListProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All')
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  const { openBookingModal } = useBookingModal()

  const specialties = useMemo(() => {
    const list = Array.from(new Set(DOCTORS.map((d) => d.specialization)))
    return ['All', ...list]
  }, [])

  const filteredDoctors = useMemo(() => {
    let list = DOCTORS
    if (selectedSpecialty !== 'All') {
      list = list.filter((d) => d.specialization === selectedSpecialty)
    }
    if (limit) {
      list = list.slice(0, limit)
    }
    return list
  }, [selectedSpecialty, limit])

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // DESKTOP: Scrubbed reveal of physician cards completing comfortably early
      mm.add('(min-width: 1024px)', () => {
        if (!sectionRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 20%',
            scrub: 0.4, // Smooth, 1:1 scrubbed tracking
          },
        })

        tl.fromTo(
          headerRef.current,
          { opacity: 0.4, y: 30 },
          { opacity: 1, y: 0, ease: 'power1.out', duration: 0.6 },
          0
        )

        cardsRef.current.forEach((card, idx) => {
          if (!card) return
          tl.fromTo(
            card,
            {
              opacity: 0.3,
              y: 35 + (idx % 4) * 15,
              scale: 0.97,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power2.out',
              duration: 0.8,
            },
            0.1 + (idx % 4) * 0.1
          )
        })
      })

      // MOBILE: Progressive scrub
      mm.add('(max-width: 1023px)', () => {
        cardsRef.current.forEach((card) => {
          if (!card) return
          gsap.fromTo(
            card,
            { opacity: 0.4, y: 20 },
            {
              opacity: 1,
              y: 0,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 60%',
                scrub: 0.4,
              },
            }
          )
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [filteredDoctors])

  return (
    <section
      id="doctors"
      ref={sectionRef}
      className="py-20 sm:py-28 md:py-32 bg-gradient-to-b from-white via-surface-50/70 to-surface-50 border-t border-border/60 relative overflow-hidden"
    >
      {/* Background Soft Depth Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary-50/25 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f4c4505_1px,transparent_1px),linear-gradient(to_bottom,#0f4c4505_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] font-semibold uppercase tracking-widest mb-3 border border-primary-100/60">
              <Sparkles size={13} />
              Clinical Leadership
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.12]">
              Board-certified specialists across every discipline.
            </h2>
          </div>

          {limit && (
            <Link
              href="/doctors"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-800 transition-colors shrink-0 group self-start md:self-end"
            >
              <span>View full medical directory ({DOCTORS.length})</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* Filter Chips */}
        {showFilter && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 mb-8">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`text-xs px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedSpecialty === spec
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-white border border-border text-foreground-secondary hover:bg-surface-50'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        )}

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredDoctors.map((doctor, index) => (
            <div
              key={doctor.id}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              className="group bg-white rounded-3xl border border-border/80 overflow-hidden shadow-soft flex flex-col justify-between hover:border-primary/40 hover:shadow-elevated transition-all duration-300"
            >
              <div>
                <div className="relative aspect-[4/5] w-full bg-surface-100 overflow-hidden">
                  <Image
                    src={doctor.photoUrl}
                    alt={doctor.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-foreground border border-border/60 shadow-xs flex items-center gap-1">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span>{doctor.rating}</span>
                    <span className="opacity-70">({doctor.reviewCount})</span>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary block mb-1">
                    {doctor.specialization}
                  </span>
                  <h3 className="font-heading font-semibold text-base sm:text-lg text-foreground mb-2">
                    {doctor.name}
                  </h3>

                  <p className="text-xs text-foreground-secondary line-clamp-2 leading-relaxed mb-4">
                    {doctor.bio}
                  </p>

                  <div className="pt-3 border-t border-border/60 text-[11px] text-foreground-muted truncate">
                    <span>{doctor.education}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openBookingModal(doctor.id)}
                  className="w-full text-xs font-semibold py-2.5 rounded-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200"
                >
                  Book with {doctor.name.split(' ')[1] || doctor.name}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
