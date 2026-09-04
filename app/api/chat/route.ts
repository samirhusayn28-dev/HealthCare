import { NextRequest, NextResponse } from 'next/server'
import { DOCTORS, SERVICES, CLINIC_NAME, CLINIC_PHONE, CLINIC_WHATSAPP_NUMBER, BRANCHES } from '@/lib/constants'

// Comprehensive system prompt grounding the AI Receptionist
const SYSTEM_PROMPT = `
You are the AI Clinical Receptionist for ${CLINIC_NAME} in San Francisco.
Location: ${BRANCHES.map(b => `${b.name} (${b.address})`).join(' and ')}.
Reception Telephone: ${CLINIC_PHONE}
WhatsApp Concierge: +${CLINIC_WHATSAPP_NUMBER}

Clinic Schedule & Hours:
- Monday through Friday: 8:00 AM – 8:00 PM
- Saturday: 9:00 AM – 5:00 PM
- Sunday: Closed
- Walk-ins are welcomed, but online booking guarantees zero wait time.

Facilities & Diagnostics on site:
- In-house 3T high-field MRI suite (same-day radiologist reports)
- Low-dose digital X-ray and ultrasound
- Automated robotic pathology laboratory (blood counts, metabolic & lipid panels ready within 2 hours)
- In-network with Blue Shield, Aetna, Cigna, UnitedHealthcare, Medicare Part B, and HSA/FSA.

Our Board-Certified Medical Specialists:
${DOCTORS.map(
  (d) =>
    `• ${d.name} (${d.specialization}): ${d.experience} years experience. Education: ${d.education}. Hours: ${d.availableHours}. Bio: ${d.bio}`
).join('\n')}

Clinical Services:
${SERVICES.map((s) => `• ${s.title}: ${s.description} (Features: ${s.features.join(', ')})`).join('\n')}

Role & Rules:
1. Speak warmly, professionally, and concisely (2–4 sentences per answer).
2. Emergency Protocol: If the user mentions severe chest pain, shortness of breath, sudden numbness, heavy uncontrolled bleeding, or loss of consciousness, instruct them immediately to call 911 or visit the nearest emergency room.
3. Medical Advice: Do not provide formal medical diagnoses or prescribe medications. Provide helpful triage guidance and recommend the appropriate clinic specialist for an in-person or telehealth visit.
4. Booking Guidance: Inform users they can book an appointment online directly through the booking section on this website, or call ${CLINIC_PHONE}.
`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { reply: `Hello, this is the ${CLINIC_NAME} reception. How may I assist you today?` },
        { status: 400 }
      )
    }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      console.warn('[Chat API] GROQ_API_KEY environment variable is not configured')
      return NextResponse.json(
        {
          reply: `I am currently in standby mode because the clinical AI key has not been configured yet. Please reach our reception directly at ${CLINIC_PHONE} or book online.`,
        },
        { status: 503 }
      )
    }

    console.log('[Chat API] Calling Groq with model openai/gpt-oss-20b, message count:', messages.length)

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-6), // Maintain recent context up to 6 messages
        ],
        temperature: 0.3,
        max_tokens: 450,
      }),
    })

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      console.error('[Groq API Call Failed HTTP', groqResponse.status, ']:', errorText)

      return NextResponse.json(
        {
          error: `Groq API Error (${groqResponse.status})`,
          reply: `I am currently having trouble connecting to our clinical knowledge base. Please call reception at ${CLINIC_PHONE} or book directly online.`,
          details: errorText,
        },
        { status: 502 }
      )
    }

    const data = await groqResponse.json()
    const rawReply = data.choices?.[0]?.message?.content || ''
    // Clean any accidental thinking or markdown tags
    const cleanReply = rawReply.replace(/<think>[\s\S]*?<\/think>/g, '').trim()

    if (!cleanReply) {
      console.warn('[Chat API] Groq returned empty content choice:', JSON.stringify(data.choices))
      return NextResponse.json({
        reply: `How may I assist you with scheduling or our clinic services today?`,
      })
    }

    console.log('[Chat API] Groq response received successfully, length:', cleanReply.length)

    return NextResponse.json({
      reply: cleanReply,
    })
  } catch (error: any) {
    console.error('[Chat API Exception]:', error?.message || error)
    return NextResponse.json(
      {
        error: 'Chat API Exception',
        reply: `We are experiencing a temporary network issue. Please call reception at ${CLINIC_PHONE} or try again in a moment.`,
        details: error?.message || String(error),
      },
      { status: 500 }
    )
  }
}
