'use client'

import { useCamera } from '@hooks/useCamera'
import { useReceiptAnalysis } from '@hooks/useReceiptAnalysis'
import { compressImage } from '@utils/compressImage'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function CameraPage() {
  const { videoRef, startCamera, photoUrl, photoBlob, takePhoto, showRetake, resetPhoto } =
    useCamera()
  const { analyze, data: analysis, loading, reset } = useReceiptAnalysis()
  const [isPreparing, setIsPreparing] = useState(false)

  useEffect(() => {
    startCamera()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleOCR = async () => {
    if (!photoBlob || loading || isPreparing) return
    try {
      setIsPreparing(true)
      const compressedFile = await compressImage(photoBlob)

      reset()

      const result = await analyze({ file: compressedFile })

      if (result.success) {
        console.log('Analysis complete:', result.receipt)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsPreparing(false)
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
              disabled={loading || isPreparing}
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
      {analysis && (
        <div className="absolute top-4 left-4 right-4 bg-white/90 p-4 rounded-lg max-h-64 overflow-y-auto z-50">
          <h3 className="font-bold mb-2">Analysis Result:</h3>
          {'success' in analysis && analysis.success ? (
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">OCR</div>
                <pre className="text-xs whitespace-pre-wrap">{analysis.ocr.text}</pre>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Parsed</div>
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(analysis.receipt, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <pre className="text-xs whitespace-pre-wrap">
              {'success' in analysis && !analysis.success
                ? `[${analysis.stage}] ${analysis.error}`
                : 'Analysis failed'}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
