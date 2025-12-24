'use client'

import { useReceiptAnalysis } from '@hooks/useReceiptAnalysis'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProcessingPage() {
  const router = useRouter()
  const { analyze } = useReceiptAnalysis()
  const [imageUrl] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    return sessionStorage.getItem('receiptImage') || ''
  })
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('Extracting text...')

  useEffect(() => {
    // Check if image exists
    if (!imageUrl) {
      router.push('/camera')
      return
    }

    // Start analysis
    const processReceipt = async () => {
      try {
        // Convert base64 to blob
        const res = await fetch(imageUrl)
        const blob = await res.blob()
        const file = new File([blob], 'receipt.jpg', { type: 'image/jpeg' })

        // Simulate progress stages
        setProgress(25)
        setStage('Extracting text...')

        const result = await analyze({ file })

        setProgress(75)
        setStage('Analyzing details...')

        await new Promise((resolve) => setTimeout(resolve, 800))

        setProgress(100)
        setStage('Complete!')

        // Store results in sessionStorage
        sessionStorage.setItem('receiptAnalysis', JSON.stringify(result))

        // Navigate to results
        setTimeout(() => {
          router.push('/result')
        }, 500)
      } catch (error) {
        console.error('Processing failed:', error)
        alert('Failed to process receipt. Please try again.')
        router.push('/camera')
      }
    }

    processReceipt()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      {/* Image Preview */}
      <div className="flex-1 flex items-center justify-center w-full max-w-md">
        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full aspect-3/4 rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image src={imageUrl} alt="Receipt" fill className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
          </motion.div>
        )}
      </div>

      {/* Progress Section */}
      <div className="w-full max-w-md space-y-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Extracting details</h2>
          <p className="text-gray-600 text-sm">{stage}</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-blue-500 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Percentage */}
        <div className="text-center text-sm font-medium text-gray-700">{progress}%</div>
      </div>
    </div>
  )
}
