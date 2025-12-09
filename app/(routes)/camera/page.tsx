'use client'

import { useCamera } from '@hooks/useCamera'
import { compressImage } from '@utils/compressImage'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface OCRResult {
  success: boolean
  data: Array<{ text: string; confidence: number; bbox: number[][] }>
  raw_text: string
}

export default function CameraPage() {
  const { videoRef, startCamera, photoUrl, photoBlob, takePhoto, showRetake, resetPhoto } =
    useCamera()
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    startCamera()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleOCR = async () => {
    if (!photoBlob) return

    setLoading(true)
    try {
      const compressedFile = await compressImage(photoBlob)

      // API 호출
      const ocrResponse = await fetch('/api/ocr', {
        method: 'POST',
        body: compressedFile,
      })

      const result = await ocrResponse.json()

      if (result.success) {
        setOcrResult(result)
        console.log('OCR Result:', result.data)
      } else {
        console.error('OCR failed:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <video ref={videoRef} className="w-full h-full object-cover" />
      {photoUrl && (
        <div className="absolute inset-0 w-full h-full bg-black/70 flex items-center justify-center">
          <Image src={photoUrl} alt="Captured" fill className="object-cover" />
        </div>
      )}

      {/* 하단 버튼들 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-50">
        {showRetake ? (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg"
              onClick={resetPhoto}
            >
              다시 찍기
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg"
              onClick={handleOCR}
              disabled={loading}
            >
              업로드
            </motion.button>
          </>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 border-4 border-white bg-red-500 text-white rounded-full shadow-lg"
            onClick={takePhoto}
          />
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div className="text-white text-lg">처리 중...</div>
        </div>
      )}

      {/* OCR 결과 표시 */}
      {ocrResult && (
        <div className="absolute top-4 left-4 right-4 bg-white/90 p-4 rounded-lg max-h-64 overflow-y-auto z-50">
          <h3 className="font-bold mb-2">OCR Result:</h3>
          <pre className="text-xs">{ocrResult.raw_text}</pre>
        </div>
      )}
    </div>
  )
}
