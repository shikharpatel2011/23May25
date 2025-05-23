'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { JobType } from '@prisma/client'
import { useParams } from 'next/navigation'

interface JobFormData {
  title: string
  company: string
  location: string
  type: JobType
  description: string
  salary: string
}

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    type: JobType.FULL_TIME,
    description: '',
    salary: '',
  })

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch job')
        }
        const job = await response.json()
        setFormData(job)
      } catch (error) {
        setError('Failed to load job details')
        console.error('Error fetching job:', error)
      }
    }

    if (jobId) {
      fetchJob()
    }
  }, [jobId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update job')
      }

      router.push('/dashboard/provider')
      router.refresh()
    } catch (error) {
      setError('Failed to update job')
      console.error('Error updating job:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Job</h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-900">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-900">
                  Job Type
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {Object.values(JobType).map((type) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-900">
                  Salary
                </label>
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  value={formData.salary || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g. $50,000 - $70,000"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 