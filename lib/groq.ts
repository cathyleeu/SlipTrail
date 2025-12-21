import Groq from 'groq-sdk'

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function parseReceipt(text: string) {
  const prompt = `
    You are an expert receipt parsing engine for a Canadian expense-tracking app.
    Your job is to convert noisy OCR text into clean, structured JSON.

    ### General Rules:
    - Always return valid JSON only.
    - Do NOT include explanations or markdown.
    - If a value is missing or unclear, use null.
    - Preserve original OCR text under "raw_text".

    ### Vendor & Date:
    - Extract vendor name.
    - Extract address and phone if available.
    - Extract purchase date and time.
    - Convert date into ISO 8601 format (timestampz) under "purchased_at".

    ### Line Items:
    - Extract a list of purchased items.
    - Each item must include:
      - name (string)
      - qty (number, default to 1 if missing)
      - unit_price (number)
    - If two numbers appear on the same line (e.g. "7.66 0.33"),
      treat the larger number as the unit price.

    ### Charges & Adjustments:
    - Extract all additional charges, taxes, discounts, and tips.
    - Charges may vary by receipt.
    - Represent ALL such values as objects in a "charges" array.
    - Each charge object must include:
      - type: one of ["tax", "tip", "discount", "fee"]
      - label: the original label from the receipt (e.g. "GST", "Service Charge")
      - amount: number

    Examples:
    - "GST 5%" → { "type": "tax", "label": "GST", "amount": 1.23 }
    - "Tip" → { "type": "tip", "label": "Tip", "amount": 5.00 }
    - "Discount" → { "type": "discount", "label": "Promo", "amount": -2.00 }

    ### Totals:
    - Extract subtotal if present.
    - Extract final total amount.
    - Extract currency if present (default to "CAD" if unclear).

    ### Required JSON Schema:
    {
      "vendor": string,
      "address": string | null,
      "phone": string | null,
      "purchased_at": string,
      "items": [
        { "name": string, "qty": number, "unit_price": number }
      ],
      "currency": string | null,
      "subtotal": number | null,
      "charges": [
        { "type": string, "label": string, "amount": number }
      ],
      "total": number | null,
      "raw_text": string
    }

    ### Receipt OCR Text:
    """
    ${text}
    """
    `

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })

  return completion.choices[0].message.content
}
