import React from 'react'
import { Calendar, MapPin, Users, Star, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

interface EventCardProps {
  event: {
    id: string
    name: string
    description: string
    category: string
    startTime: string
    endTime: string
    location: string
    organizer: string
    ticketPrice: number
    maxAttendees: number
    currentAttendees: number
    imageUrl: string
    featured: boolean
  }
  onViewDetails: (eventId: string) => void
}

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  const startDate = new Date(event.startTime)
  const endDate = new Date(event.endTime)
  const isUpcoming = startDate > new Date()
  const attendancePercentage = (event.currentAttendees / event.maxAttendees) * 100

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onViewDetails(event.id)}
      layout
    >
      <div className="relative">
        <img 
          src={event.imageUrl} 
          alt={event.name}
          className="w-full h-48 object-cover"
        />
        
        {event.featured && (
          <div className="absolute top-4 left-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
              <Star className="w-4 h-4 fill-current" />
              <span>Featured</span>
            </div>
          </div>
        )}
        
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isUpcoming 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isUpcoming ? 'Upcoming' : 'Past'}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
            {event.category}
          </span>
          <span className="text-sm text-gray-500">
            by {event.organizer}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {format(startDate, 'MMM d, yyyy')} • {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Attendance</span>
            <span className="text-sm text-gray-500">{attendancePercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            {event.ticketPrice === 0 ? 'Free' : `${event.ticketPrice} ETH`}
          </div>
          
          <motion.button
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(event.id)
            }}
          >
            <span>View Details</span>
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default EventCard