'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Search, Star, Award, Clock } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { DOCTORS } from '@/lib/constants'

interface DoctorsListProps {
  limit?: number
  showFilters?: boolean
}

export default function DoctorsList({ limit, showFilters = true }: DoctorsListProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  const specialties = useMemo(() => {
    const list = Array.from(new Set(DOCTORS.map((d) => d.specialization)))
    return ['All', ...list]
  }, [])

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      const matchesSpecialty =
        selectedSpecialty === 'All' || doc.specialization === selectedSpecialty
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSpecialty && matchesSearch
    }).slice(0, limit || DOCTORS.length)
  }, [selectedSpecialty, searchQuery, limit])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // DESKTOP: Scrubbed reveal of physician cards
      mm.add('(min-width: 1024px)', () => {
        if (!sectionRef.current) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'center 45%',
            scrub: 1, // scroll-driven
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
          tl.fromTo(
            card,
            {
              opacity: 0.2,
              y: 40 + (idx % 4) * 20,
              scale: 0.96,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power2.out',
              duration: 1.2,
            },
            0.15 + (idx % 4) * 0.15
          )
        })
      })

      // MOBILE: Subtle progressive scrub
      mm.add('(max-width: 1023px)', () => {
        cardsRef.current.forEach((card) => {
          if (!card) return
          gsap.fromTo(
            card,
            { opacity: 0.4, y: 25 },
            {
              opacity: 1,
              y: 0,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 65%',
                scrub: 0.6,
              },
            }
          )
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [filteredDoctors])

  return (
    <section id="doctors" ref={sectionRef} className="py-24 md:py-32 bg-surface-50 border-t border-border/60">
      <Container>
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary block mb-3">
              Medical Leadership
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.12]">
              Board-certified specialists.
            </h2>
            <p className="text-sm text-foreground-secondary leading-relaxed mt-3">
              Physicians with decades of clinical and surgical training from the country&apos;s leading teaching institutions.
            </p>
          </div>

          {limit && (
            <Link
              href="/doctors"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-800 transition-colors whitespace-nowrap"
            >
              <span>View all {DOCTORS.length} specialists</span>
              <ArrowUpRight size={14} />
            </Link>
          )}
        </div>

        {/* Filter controls (when not limited) */}
        {showFilters && !limit && (
          <div className="mb-12 space-y-4">
            <div className="relative max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search by physician or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedSpecialty === spec
                      ? 'bg-foreground text-white'
                      : 'bg-white text-foreground-secondary hover:text-foreground border border-border/80'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
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
              className="group bg-white rounded-3xl border border-border/80 overflow-hidden flex flex-col justify-between hover:border-primary/40 hover:shadow-elevated transition-all duration-300"
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
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-foreground border border-border/60 shadow-xs">
                    {doctor.experience} yrs exp
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-medium text-white flex items-center gap-1">
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
                <Link href={`/booking?doctor=${doctor.id}`} className="block w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold py-2.5 rounded-xl group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200"
                  >
                    Book with {doctor.name.split(' ')[1]}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

