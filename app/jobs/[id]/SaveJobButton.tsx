'use client'

import { useState } from 'react'

interface SaveJobButtonProps {
  jobId: string
  isSaved: boolean
}

export default function SaveJobButton({ jobId, isSaved: initialIsSaved }: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveJob = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/jobs/save', {
        method: isSaved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      })

      if (!response.ok) {
        throw new Error('Failed to save job')
      }

      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Error saving job:', error)
      alert('Failed to save job. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSaveJob}
      disabled={isLoading}
      className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium shadow-sm
        ${isSaved
          ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
          : 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          className="-ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill={isSaved ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      )}
      {isSaved ? 'Saved' : 'Save Job'}
    </button>
  )
} 