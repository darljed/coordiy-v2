'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus, Type, MapPin, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useEvents } from '@/contexts/events-context'

export function CreateEventSheet() {
  const { addEvent } = useEvents()
  const [open, setOpen] = useState(false)
  const [eventTitle, setEventTitle] = useState('')
  const [venue, setVenue] = useState('')
  const [date, setDate] = useState<Date | DateRange | undefined>()
  const [isDateRange, setIsDateRange] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!eventTitle.trim()) {
      toast.error('Please enter an event title')
      return
    }
    
    if (!venue.trim()) {
      toast.error('Please enter a venue')
      return
    }
    
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

    addEvent({
      event_title: eventTitle,
      venue,
      start_date: startDate,
      end_date: endDate
    })

    toast.success('Event created successfully!')
    setOpen(false)
    setEventTitle('')
    setVenue('')
    setDate(undefined)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button style={{ backgroundColor: '#F76C5E', color: 'white' }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-full h-full">
        <div className="flex flex-col justify-center items-center h-full">
          <div className="w-full max-w-sm p-5 mt-[-80px]">
            <SheetHeader className="text-center mb-6">
              <SheetTitle>Create New Event</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="eventTitle" className="flex items-center space-x-2">
                  <Type className="h-4 w-4" />
                  <span>Event Title</span>
                </Label>
                <Input
                  id="eventTitle"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Venue</span>
                </Label>
                <Input
                  id="venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Enter venue"
                  required
                />
              </div>

              <div className="space-y-4">
                <Label className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Date</span>
                </Label>
                
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant={!isDateRange ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setIsDateRange(false)
                      setDate(undefined)
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
                      setDate(undefined)
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
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
                    {isDateRange ? (
                      <Calendar
                        mode="range"
                        selected={date as DateRange}
                        onSelect={setDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        required
                      />
                    ) : (
                      <Calendar
                        mode="single"
                        selected={date as Date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    )}
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-end space-x-2 pt-6">
                <Button 
                  type="submit" 
                  style={{ backgroundColor: '#F76C5E', color: 'white' }}
                  className="w-full">
                  Create Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}