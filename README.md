# HealthCare

A modern, responsive outpatient clinic web application built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**. Features interactive appointment scheduling, WhatsApp concierge integration, AI clinical assistant powered by Groq, patient portal, and fluid scrollytelling animations.

## Key Features

- **Direct WhatsApp & Phone Integration**: Instant consultation scheduling and pre-filled appointment requests to clinic reception.
- **AI Clinical Assistant**: Groq LLaMA-powered interactive clinical triage assistant.
- **3-Step Horizontal Booking Form**: Department filtering, specialist selection, interactive date/time slots, and verification details.
- **Patient Portal**: Medical records, appointments, prescription history, invoices, and diagnostic imaging.
- **Scrollytelling & Visual Choreography**: Anime.js and GSAP ScrollTrigger-driven animations with pinned sections.
- **Infinite Testimonials Carousel**: Continuous auto-scrolling patient feedback with pause-on-hover, touch-swipe support, and edge gradient masks.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: GSAP, ScrollTrigger, Framer Motion, Lenis Smooth Scroll
- **AI / LLM**: Groq Cloud API
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form, Zod

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/samirhusayn28-dev/HealthCare.git
   cd HealthCare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local` and add your Groq API Key:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
