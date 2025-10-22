'use client'

import { useEvents } from '@/contexts/events-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

export function EventsList() {
  const { events } = useEvents()
  const router = useRouter()

  if (events.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>No Events Yet</span>
            </CardTitle>
            <CardDescription>
              Create your first event to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your events will appear here once created.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{event.event_title}</span>
            </CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{event.venue}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {event.start_date.getTime() === event.end_date.getTime() ? (
                <p className="text-sm">
                  <strong>Date:</strong> {format(event.start_date, 'PPP')}
                </p>
              ) : (
                <p className="text-sm">
                  <strong>Date:</strong> {format(event.start_date, 'MMM dd')} - {format(event.end_date, 'MMM dd, yyyy')}
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push(`/dashboard/events/${event.id}`)}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}