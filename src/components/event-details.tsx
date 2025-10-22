'use client'

import { useState } from 'react'
import { useEvents } from '@/contexts/events-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar, MapPin, ArrowLeft, Save, Type, CalendarDays, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface EventDetailsProps {
  eventId: string
}

const eventFormSchema = z.object({
  event_title: z.string().min(1, 'Event title is required').max(100, 'Event title must be less than 100 characters'),
  venue: z.string().min(1, 'Venue is required').max(200, 'Venue must be less than 200 characters'),
})

export function EventDetails({ eventId }: EventDetailsProps) {
  const { events, updateEvent, deleteEvent } = useEvents()
  const router = useRouter()
  const event = events.find(e => e.id === eventId)
  
  const [date, setDate] = useState<Date | DateRange | undefined>(() => {
    if (!event) return undefined
    if (event.start_date.getTime() === event.end_date.getTime()) {
      return event.start_date
    }
    return { from: event.start_date, to: event.end_date }
  })
  
  const [isDateRange, setIsDateRange] = useState(() => {
    if (!event) return false
    return event.start_date.getTime() !== event.end_date.getTime()
  })

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      event_title: event?.event_title || '',
      venue: event?.venue || '',
    },
  })

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg space-y-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">Event not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const onSubmit = (values: z.infer<typeof eventFormSchema>) => {
    if (!date) {
      toast.error('Please select a date')
      return
    }

    let startDate: Date
    let endDate: Date

    if (isDateRange && date && typeof date === 'object' && 'from' in date) {
      if (!date.from || !date.to) {
        toast.error('Please select both start and end dates')
        return
      }
      startDate = date.from
      endDate = date.to
    } else if (date instanceof Date) {
      startDate = date
      endDate = date
    } else {
      toast.error('Invalid date selection')
      return
    }

    updateEvent(eventId, {
      event_title: values.event_title,
      venue: values.venue,
      start_date: startDate,
      end_date: endDate,
    })
    toast.success('Event updated successfully!')
  }

  const handleDelete = () => {
    deleteEvent(eventId)
    toast.success('Event deleted successfully!')
    router.push('/dashboard/events')
  }

  return (
    <div className="flex justify-center p-4 pt-8">
      <div className="w-full max-w-lg space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">Edit Event</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="event_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Type className="h-4 w-4" />
                      <span>Event Title</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Venue</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter venue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Date</span>
                </FormLabel>
                
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant={!isDateRange ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setIsDateRange(false)
                      setDate(event?.start_date)
                    }}
                  >
                    Single Date
                  </Button>
                  <Button
                    type="button"
                    variant={isDateRange ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setIsDateRange(true)
                      if (event) {
                        setDate({ from: event.start_date, to: event.end_date })
                      }
                    }}
                  >
                    Date Range
                  </Button>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? (
                        isDateRange && date && typeof date === 'object' && 'from' in date ? (
                          <>
                            {format(date.from!, "LLL dd, y")} -{" "}
                            {date.to ? format(date.to, "LLL dd, y") : "Select end date"}
                          </>
                        ) : date instanceof Date ? (
                          format(date, "LLL dd, y")
                        ) : (
                          "Select date"
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode={isDateRange ? "range" : "single"}
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </form>
          </Form>

          <div className="pt-6 border-t">
            <Button 
              type="button" 
              variant="destructive" 
              className="w-full"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Event
            </Button>
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Delete Event</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete "{event.event_title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}