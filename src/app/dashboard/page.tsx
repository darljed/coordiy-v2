import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DashboardContent } from '@/components/dashboard-content'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/')
  }

  return (
    <DashboardLayout user={user}>
      <DashboardContent user={user} />
    </DashboardLayout>
  )
}