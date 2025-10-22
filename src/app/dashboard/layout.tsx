import { EventsProvider } from '@/contexts/events-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EventsProvider>
      {children}
    </EventsProvider>
  )
}