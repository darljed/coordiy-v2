import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { DashboardLayout } from '@/components/dashboard-layout'
import { EventDetails } from '@/components/event-details'

interface EventPageProps {
  params: Promise<{ id: string }>
}

export default async function EventPage({ params }: EventPageProps) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/')
  }

  const { id } = await params

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Events", href: "/dashboard/events" },
    { label: "Event Details" }
  ]

  return (
    <DashboardLayout user={user} breadcrumbs={breadcrumbs}>
      <EventDetails eventId={id} />
    </DashboardLayout>
  )
}