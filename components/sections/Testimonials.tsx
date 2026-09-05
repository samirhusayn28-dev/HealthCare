'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Pause, Play } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { TESTIMONIALS } from '@/lib/constants'

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const setTrackRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isManualPaused, setIsManualPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragScrollLeft, setDragScrollLeft] = useState(0)

  const [metrics, setMetrics] = useState({
    cardWidth: 400,
    gap: 28,
    peekWidth: 48,
  })

  const scrollPosRef = useRef(0)
  const isInteractingRef = useRef(false)
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const singleSetWidthRef = useRef(0)
  const cardWidthWithGapRef = useRef(428)
  const peekWidthRef = useRef(48)
  const rafIdRef = useRef<number | null>(null)
  const isInitializedRef = useRef(false)

  // Calculate symmetrical card width, peek, and gap based on viewport width
  const updateMetrics = useCallback(() => {
    const container = scrollContainerRef.current
    const W = container?.offsetWidth || (typeof window !== 'undefined' ? window.innerWidth : 1280)
    
    let k = 3
    let gap = 28
    const p = 0.12 // 12% symmetrical peek on each side

    if (W < 640) {
      k = 1
      gap = 16
    } else if (W < 1024) {
      k = 2
      gap = 24
    } else if (W < 1536) {
      k = 3
      gap = 28
    } else {
      k = 4
      gap = 32
    }

    // Formula: (k + 2*p) * cardWidth + k * gap = W
    const calculatedCardWidth = Math.max(280, Math.round((W - k * gap) / (k + 2 * p)))
    const peekWidth = Math.round(calculatedCardWidth * p)

    setMetrics({
      cardWidth: calculatedCardWidth,
      gap,
      peekWidth,
    })

    const singleSet = TESTIMONIALS.length * (calculatedCardWidth + gap)
    singleSetWidthRef.current = singleSet
    cardWidthWithGapRef.current = calculatedCardWidth + gap
    peekWidthRef.current = peekWidth

    // On initial setup, center on middle set with symmetrical peek offset
    if (!isInitializedRef.current && container && singleSet > 0) {
      const initialScroll = singleSet - (peekWidth + gap)
      container.scrollLeft = initialScroll
      scrollPosRef.current = initialScroll
      isInitializedRef.current = true
    }
  }, [])

  useEffect(() => {
    updateMetrics()

    const onResize = () => {
      updateMetrics()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [updateMetrics])

  // Continuous Smooth Auto-Scroll Loop
  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const scrollSpeed = 0.65 // pixels per frame

    const tick = () => {
      const container = scrollContainerRef.current
      const singleSetWidth = singleSetWidthRef.current

      if (container && singleSetWidth > 0 && !isHovered && !isManualPaused && !isInteractingRef.current && !isDragging) {
        scrollPosRef.current += scrollSpeed

        // Seamless Infinite Loop Wrapping without visual jumps
        const minBound = singleSetWidth * 0.5
        const maxBound = singleSetWidth * 2

        if (scrollPosRef.current >= maxBound) {
          scrollPosRef.current -= singleSetWidth
        } else if (scrollPosRef.current < minBound) {
          scrollPosRef.current += singleSetWidth
        }

        container.scrollLeft = scrollPosRef.current
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    rafIdRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [isHovered, isManualPaused, isDragging])

  // Handle native scroll and sync active dot
  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const singleSetWidth = singleSetWidthRef.current
    const currentScroll = container.scrollLeft

    if (isInteractingRef.current || isDragging) {
      scrollPosRef.current = currentScroll

      // Seamless wrap during manual touch / drag
      if (singleSetWidth > 0) {
        if (currentScroll >= singleSetWidth * 2) {
          container.scrollLeft = currentScroll - singleSetWidth
          scrollPosRef.current = container.scrollLeft
        } else if (currentScroll < singleSetWidth * 0.5) {
          container.scrollLeft = currentScroll + singleSetWidth
          scrollPosRef.current = container.scrollLeft
        }
      }
    }

    // Active Index calculation
    if (singleSetWidth > 0 && cardWidthWithGapRef.current > 0) {
      const baseOffset = singleSetWidth - (peekWidthRef.current + metrics.gap)
      const relativeX = container.scrollLeft - baseOffset
      const normalizedX = ((relativeX % singleSetWidth) + singleSetWidth) % singleSetWidth
      const approxIndex = Math.round(normalizedX / cardWidthWithGapRef.current)
      setActiveIndex(Math.abs(approxIndex) % TESTIMONIALS.length)
    }
  }

  // Smooth Touch Interactions on Mobile (No fighting auto-scroll)
  const handleTouchStart = () => {
    isInteractingRef.current = true
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
  }

  const handleTouchEnd = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollPosRef.current = scrollContainerRef.current.scrollLeft
      }
      isInteractingRef.current = false
    }, 1800)
  }

  // Desktop Mouse Drag Support
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current
    if (!container) return
    setIsDragging(true)
    isInteractingRef.current = true
    setDragStartX(e.pageX - container.offsetLeft)
    setDragScrollLeft(container.scrollLeft)
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const container = scrollContainerRef.current
    if (!container) return
    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = (x - dragStartX) * 1.5
    container.scrollLeft = dragScrollLeft - walk
    scrollPosRef.current = container.scrollLeft
  }

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollPosRef.current = scrollContainerRef.current.scrollLeft
        }
        isInteractingRef.current = false
      }, 1500)
    }
  }

  // Manual Prev / Next Buttons
  const scrollDirection = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    isInteractingRef.current = true
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)

    const step = cardWidthWithGapRef.current || 400
    const scrollAmount = direction === 'left' ? -step : step
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })

    resumeTimerRef.current = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollPosRef.current = scrollContainerRef.current.scrollLeft
      }
      isInteractingRef.current = false
    }, 2800)
  }

  // Jump to specific card dot
  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current
    if (!container || singleSetWidthRef.current <= 0) return

    isInteractingRef.current = true
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)

    const baseOffset = singleSetWidthRef.current - (peekWidthRef.current + metrics.gap)
    const targetPos = baseOffset + (index * cardWidthWithGapRef.current)
    container.scrollTo({ left: targetPos, behavior: 'smooth' })

    resumeTimerRef.current = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollPosRef.current = scrollContainerRef.current.scrollLeft
      }
      isInteractingRef.current = false
    }, 2800)
  }

  // Entrance reveal animation
  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-20 sm:py-28 md:py-32 bg-gradient-to-b from-[#e8f1ed] via-[#f5f8f6] to-[#edf4f0] border-t border-border/60 overflow-hidden relative"
    >
      {/* Background Soft Lighting & Medical Depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[750px] h-[550px] bg-primary-100/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f4c4508_1px,transparent_1px),linear-gradient(to_bottom,#0f4c4508_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <Container className="relative z-10">
        {/* Header with Title and Scroll Controls */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] font-semibold uppercase tracking-widest mb-3 border border-primary-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Verified Patient Narratives
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.12]">
              Care described by those who received it.
            </h2>
            <p className="text-xs sm:text-sm text-foreground-secondary mt-2">
              Continuous patient feedback from verified clinical appointments. Hover or swipe to pause and read.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <div className="text-xs font-mono font-medium text-foreground-muted mr-1 hidden sm:flex items-center gap-2">
              <span className="text-foreground font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span>/</span>
              <span>{String(TESTIMONIALS.length).padStart(2, '0')}</span>
              <button
                type="button"
                onClick={() => setIsManualPaused((prev) => !prev)}
                title={isManualPaused ? 'Play auto-scroll' : 'Pause auto-scroll'}
                className="ml-2 w-7 h-7 rounded-lg border border-border flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-surface-100 transition-colors"
              >
                {isManualPaused ? <Play size={12} /> : <Pause size={12} />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => scrollDirection('left')}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-2xl border border-border bg-white text-foreground hover:border-primary hover:bg-primary-50 hover:text-primary shadow-xs active:scale-95 flex items-center justify-center transition-all"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              onClick={() => scrollDirection('right')}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-2xl border border-border bg-white text-foreground hover:border-primary hover:bg-primary-50 hover:text-primary shadow-xs active:scale-95 flex items-center justify-center transition-all"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
      </Container>

      {/* Full-width Carousel Track with Symmetrical Peeks and Soft Edge Fade Masks */}
      <div
        className="w-full relative overflow-hidden py-4"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 1.5%, black 6%, black 94%, rgba(0,0,0,0.15) 98.5%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 1.5%, black 6%, black 94%, rgba(0,0,0,0.15) 98.5%, transparent 100%)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          handleMouseUpOrLeave()
        }}
      >
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          className={`flex overflow-x-auto no-scrollbar select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            WebkitOverflowScrolling: 'touch',
            gap: `${metrics.gap}px`,
          }}
        >
          {/* 3 identical sets of cards for seamless infinite continuous wrapping */}
          {[0, 1, 2].map((setIndex) => (
            <div
              key={setIndex}
              ref={setIndex === 0 ? setTrackRef : undefined}
              className="flex shrink-0"
              style={{ gap: `${metrics.gap}px` }}
            >
              {TESTIMONIALS.map((item) => (
                <div
                  key={`${setIndex}-${item.id}`}
                  style={{
                    width: metrics.cardWidth ? `${metrics.cardWidth}px` : undefined,
                  }}
                  className="w-[85vw] sm:w-[380px] md:w-[420px] p-7 sm:p-8 rounded-3xl border border-border/80 bg-surface-50/80 hover:bg-white hover:border-primary/40 hover:shadow-elevated transition-all duration-300 flex flex-col justify-between shrink-0 select-none"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <div className="flex items-center gap-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary-50 border border-primary-100/60">
                        <CheckCircle2 size={11} className="text-primary" />
                        Verified Visit
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-foreground leading-relaxed mb-8 italic">
                      &ldquo;{item.content}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3.5 pt-4 border-t border-border/60">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-surface-200 border border-border/80 shrink-0">
                      <Image
                        src={item.photoUrl}
                        alt={item.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-xs sm:text-sm text-foreground">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-foreground-muted">
                        {item.role} &bull; {item.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Container>
        {/* Bottom Pagination Dots */}
        <div className="flex items-center justify-center sm:justify-start mt-8 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToCard(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-border hover:bg-foreground-muted/40'
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
