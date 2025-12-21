export type ExternalOcrApiResponse = {
  text: string //NOTE: 실제 space OCR API 응답 형식 확인
}

export type OcrSuccess = {
  success: true
  data: {
    text: string
  }
}

export type OcrFailure = {
  success: false
  error: string
  details?: string
}

export type OcrResult = OcrSuccess | OcrFailure

export type AnalyzeOptions = {
  file: File
}

// FIXME recipt 타입 정의 필요
export type ParseReceiptSuccess = {
  success: true
  receipt: unknown
}

export type ParseReceiptFailure = {
  success: false
  error: string
  details?: unknown
}

export type ParseReceiptResult = ParseReceiptSuccess | ParseReceiptFailure

export type RequestParsingOptions = {
  rawText: string
}

export type ReceiptAnalysisSuccess = {
  success: true
  ocr: Extract<OcrResult, { success: true }>
  receipt: unknown
}

export type ReceiptAnalysisFailure = {
  success: false
  stage: 'ocr' | 'parse'
  error: string
  details?: unknown
}

export type ReceiptAnalysisResult = ReceiptAnalysisSuccess | ReceiptAnalysisFailure
