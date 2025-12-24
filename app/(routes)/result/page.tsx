'use client'

import Map from '@components/map'
import type { ReceiptAnalysisResult } from '@types'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ResultPage() {
  const router = useRouter()
  const [analysis] = useState<ReceiptAnalysisResult | null>(() => {
    if (typeof window === 'undefined') return null
    const stored = sessionStorage.getItem('receiptAnalysis')
    if (!stored) return null
    try {
      return JSON.parse(stored) as ReceiptAnalysisResult
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (!analysis) {
      router.push('/camera')
    }
  }, [analysis, router])

  if (!analysis || !analysis.success) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">Failed to load receipt details</p>
          <button
            onClick={() => router.push('/camera')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const { receipt, location } = analysis

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button onClick={() => router.push('/')} className="mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Receipt Details</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4 space-y-4">
          {/* Receipt Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
          >
            {/* Vendor Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">{receipt.vendor}</h2>
              {receipt.address && <p className="text-sm text-gray-600 mt-1">{receipt.address}</p>}
            </div>

            {/* Date & Time */}
            <div className="flex gap-4 text-sm text-gray-600">
              {receipt.purchased_at && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{receipt.purchased_at}</span>
                </div>
              )}
            </div>

            {/* Items */}
            {receipt.items && receipt.items.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Items</h3>
                <div className="space-y-2">
                  {receipt.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-800">
                        {item.qty > 1 ? `${item.qty}x ` : ''}
                        {item.name}
                      </span>
                      <span className="font-medium text-gray-900">
                        ${item.unit_price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charges */}
            {receipt.charges && receipt.charges.length > 0 && (
              <div className="border-t border-gray-100 pt-3 space-y-2">
                {receipt.charges.map((charge, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">{charge.type}</span>
                    <span className="text-gray-900">${charge.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="border-t-2 border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                ${receipt.total ? receipt.total.toFixed(2) : '0.00'}
              </span>
            </div>
          </motion.div>

          {/* Map */}
          {location && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Location</h3>
              </div>
              <Map location={location} zoom={16} className="h-64 w-full" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => alert('Edit functionality coming soon')}
            className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-xl font-medium"
          >
            Edit
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => alert('Split bill functionality coming soon')}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium"
          >
            Split Bill
          </motion.button>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-around py-2">
          <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs text-gray-600">Home</span>
          </button>
          <button
            onClick={() => router.push('/camera')}
            className="flex flex-col items-center gap-1"
          >
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-xs text-blue-500">Scan</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs text-gray-600">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
