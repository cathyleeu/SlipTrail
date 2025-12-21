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

    // 2️⃣ OCR 결과 최소 검증
    if (rawText.length < 30) {
      return apiError('OCR text too short', {
        status: 422,
        details: 'The provided OCR text is not sufficient for parsing',
      })
    }

    // 3️⃣ LLM 호출
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

    // 4️⃣ JSON 파싱
    let parsedJson: unknown
    try {
      parsedJson = JSON.parse(llmResponse)
    } catch {
      console.error('[JSON PARSE ERROR]', llmResponse)
      return apiError('Invalid JSON returned from LLM', { status: 500, details: llmResponse })
    }

    // 5️⃣ (선택) Schema validation
    /*
    try {
      parsedJson = ReceiptSchema.parse(parsedJson)
    } catch (err) {
      return NextResponse.json(
        {
          error: 'Parsed receipt does not match schema',
          issues: err,
        },
        { status: 422 }
      )
    }
    */

    // 6️⃣ 성공
    return apiSuccess(parsedJson)
  } catch (err) {
    // 🔥 진짜 예상 못한 에러
    console.error('[UNHANDLED ERROR]', err)

    return apiError('Internal server error', {
      status: 500,
      details: err instanceof Error ? err.message : String(err),
    })
  }
}
