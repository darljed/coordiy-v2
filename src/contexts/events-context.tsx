'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Event {
  id: string
  event_title: string
  start_date: Date
  end_date: Date
  venue: string
}

interface EventsContextType {
  events: Event[]
  addEvent: (event: Omit<Event, 'id'>) => void
  updateEvent: (id: string, event: Omit<Event, 'id'>) => void
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      event_title: 'Annual Company Retreat',
      start_date: new Date('2024-03-15'),
      end_date: new Date('2024-03-17'),
      venue: 'Mountain Resort & Spa'
    },
    {
      id: '2',
      event_title: 'Birthday Celebration',
      start_date: new Date('2024-02-28'),
      end_date: new Date('2024-02-28'),
      venue: 'Community Center Hall'
    },
    {
      id: '3',
      event_title: 'Wedding Reception',
      start_date: new Date('2024-04-20'),
      end_date: new Date('2024-04-20'),
      venue: 'Grand Ballroom Hotel'
    }
  ])

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString()
    }
    setEvents(prev => [...prev, newEvent])
  }

  const updateEvent = (id: string, eventData: Omit<Event, 'id'>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...eventData, id } : event
    ))
  }

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent }}>
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventsContext)
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider')
  }
  return context
}