'use client'

import { useRef } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'
import { useIsMobile } from './useIsMobile'

interface ScrollAnimationOptions {
  /** Input progress range [start, end], e.g. [0, 1] */
  inputRange?: [number, number]
  /** Output range for opacity transform */
  opacityRange?: [number, number]
  /** Output range for translateY transform (in px) */
  translateYRange?: [number, number]
  /** Output range for scale transform */
  scaleRange?: [number, number]
}

interface ScrollAnimationReturn {
  containerRef: React.RefObject<HTMLDivElement>
  scrollYProgress: MotionValue<number>
  opacity: MotionValue<number>
  y: MotionValue<number>
  scale: MotionValue<number>
  isMobile: boolean
  prefersReducedMotion: boolean
}

export function useScrollAnimation(
  options: ScrollAnimationOptions = {}
): ScrollAnimationReturn {
  const {
    inputRange = [0, 1],
    opacityRange = [1, 0],
    translateYRange = [0, -80],
    scaleRange = [1, 0.95],
  } = options

  const containerRef = useRef<HTMLDivElement>(null!)
  const isMobile = useIsMobile()

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(
    scrollYProgress,
    inputRange,
    prefersReducedMotion ? [1, 1] : opacityRange
  )
  const y = useTransform(
    scrollYProgress,
    inputRange,
    prefersReducedMotion ? [0, 0] : translateYRange
  )
  const scale = useTransform(
    scrollYProgress,
    inputRange,
    prefersReducedMotion ? [1, 1] : scaleRange
  )

  return {
    containerRef,
    scrollYProgress,
    opacity,
    y,
    scale,
    isMobile,
    prefersReducedMotion,
  }
}
