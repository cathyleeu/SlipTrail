import { apiError, apiSuccess } from '@lib/apiResponse'
import { parseReceipt } from '@lib/groq'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body.rawText !== 'string') {
      return apiError('rawText is required and must be a string', { status: 400 })
    }

    const rawText = body.rawText.trim()

    // verify OCR result minimum validation
    if (rawText.length < 30) {
      return apiError('OCR text too short', {
        status: 422,
        details: 'The provided OCR text is not sufficient for parsing',
      })
    }

    // request LLM to parse receipt
    let llmResponse: string | null = null
    try {
      llmResponse = await parseReceipt(rawText)
    } catch (err) {
      console.error('[LLM ERROR]', err)
      return apiError('LLM request failed', {
        status: 502,
        details: err instanceof Error ? err.message : 'Unknown LLM error',
      })
    }

    if (!llmResponse) {
      return apiError('LLM returned empty response', { status: 502 })
    }

    // parse LLM response as JSON
    let parsedJson: unknown
    try {
      parsedJson = JSON.parse(llmResponse)
    } catch {
      console.error('[JSON PARSE ERROR]', llmResponse)
      return apiError('Invalid JSON returned from LLM', { status: 500, details: llmResponse })
    }

    return apiSuccess(parsedJson)
  } catch (err) {
    console.error('[UNHANDLED ERROR]', err)

    return apiError('Internal server error', {
      status: 500,
      details: err instanceof Error ? err.message : String(err),
    })
  }
}
