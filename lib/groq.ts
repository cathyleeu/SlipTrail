import Groq from 'groq-sdk'

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function parseReceipt(text: string) {
  const prompt = `
    You are an expert receipt parsing engine for a Canadian expense-tracking app.
    Your job is to convert noisy OCR text into clean, structured JSON.

    ### Requirements:
    - Extract vendor name, address, and phone if available.
    - Extract date and time.
    - Extract list of line items.
    - Each line item must include: name, qty, unit_price, total_price.
    - If quantity is missing, assume 1.
    - If two numbers appear in the same line (e.g., "7.66 0.33"), treat the larger number as the price.
    - Identify subtotal, GST, PST, HST, tip, and final total.
    - Always return valid JSON.
    - No explanation text. Only JSON.

    ### JSON Schema:
    {
      "vendor": string,
      "address": string | null,
      "date": string | null,
      "time": string | null,
      "items": [
        { "name": string, "qty": number, "unit_price": number, "total_price": number }
      ],
      "subtotal": number | null,
      "tax": {
        "gst": number | null,
        "pst": number | null,
        "hst": number | null
      },
      "tip": number | null,
      "total": number | null,
      "raw_text": string
    }

    ### Receipt OCR Text:
    ${text}
  `

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })

  return completion.choices[0].message.content
}
