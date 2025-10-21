"use client"

import dynamic from 'next/dynamic'

const SignupFormClient = dynamic(() => import('./signup-form-client').then(mod => ({ default: mod.SignupFormClient })), {
  ssr: false
})

interface SignupFormProps {
  onSuccess?: () => void
}

export function SignupForm(props: SignupFormProps) {
  return <SignupFormClient {...props} />
}