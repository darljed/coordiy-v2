"use client"

import { useRouter } from "next/navigation"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import AuthLayout from "@/components/auth-layout"

export default function ForgotPasswordPage() {
  const router = useRouter()

  return (
    <AuthLayout>
      <ForgotPasswordForm onBackToLogin={() => router.push('/')} />
    </AuthLayout>
  )
}