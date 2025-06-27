import React from 'react'

export default function Loading({ className, childClassName }: { className?: string, childClassName?: string }) {
  return (
    <div className={`flex justify-center items-center min-h-[calc(100vh-100px)] text-primary-900 ${className}`}>
        <div className={`animate-bounce rounded-full h-12 w-12 bg-primary-200 ${childClassName}`}></div>
    </div>
  )
}