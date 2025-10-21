"use client"

import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import AuthLayout from "@/components/auth-layout"

export default function MainApp() {
  const router = useRouter()

  const handleSignupClick = () => {
    router.push('/signup')
  }

  const handleForgotPasswordClick = () => {
    router.push('/forgot-password')
  }

  return (
    <AuthLayout>
      <LoginForm 
        onSignupClick={handleSignupClick} 
        onForgotPasswordClick={handleForgotPasswordClick}
      />
    </AuthLayout>
  )
}