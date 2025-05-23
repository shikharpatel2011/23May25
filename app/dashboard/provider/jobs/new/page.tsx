'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { JobType } from '@prisma/client'

export default function NewJobPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      company: formData.get('company'),
      location: formData.get('location'),
      type: formData.get('type'),
      salary: formData.get('salary'),
      description: formData.get('description'),
    }

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }

      router.push('/dashboard/provider')
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {error && (
          <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white"
            placeholder="Enter job title"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            name="company"
            id="company"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white"
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white"
            placeholder="Enter job location"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Job Type
          </label>
          <select
            name="type"
            id="type"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white"
          >
            <option value="">Select job type</option>
            {Object.values(JobType).map((type) => (
              <option key={type} value={type} className="text-gray-900">
                {type.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
            Salary (Optional)
          </label>
          <input
            type="text"
            name="salary"
            id="salary"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white"
            placeholder="Enter salary range or amount"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={6}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white"
            placeholder="Enter detailed job description"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  )
} 