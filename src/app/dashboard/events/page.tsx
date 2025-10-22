import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { DashboardLayout } from '@/components/dashboard-layout'
import { EventsList } from '@/components/events-list'
import { CreateEventSheet } from '@/components/create-event-sheet'

export default async function EventsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/')
  }

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Events" }
  ]

  return (
    <DashboardLayout user={user} breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">Create and manage your digital invitations</p>
          </div>
          <CreateEventSheet />
        </div>

        <EventsList />
      </div>
    </DashboardLayout>
  )
}