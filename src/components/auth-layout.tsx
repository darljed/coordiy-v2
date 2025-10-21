import React from 'react'
import { ThemeToggle } from './theme-toggle'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
        <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
        </div>
        <div className="flex-[3] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        
        </div>
        <div className="flex-[2] bg-background flex items-center justify-center p-8">
        {children}
        </div>
    </div>
  )
}
