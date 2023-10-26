'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export const AdminError = () => {
  const route = useRouter()

  const handleBackToHome = () => {
    route.replace('/')
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="inline-flex flex-col items-center justify-center">
        <div className="inline-flex items-center">
          <ExclamationTriangleIcon className="h-20 w-20 text-gray-500/50" />
          <div className="text-6xl text-gray-500/50">404 Not found </div>
        </div>
        <div
          onClick={handleBackToHome}
          className="cursor-pointer text-gray-500 underline hover:text-gray-300"
        >
          Back to Home
        </div>
      </div>
    </div>
  )
}
