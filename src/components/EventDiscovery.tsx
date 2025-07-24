import React, { useState, useEffect } from 'react'
import { Search, Filter, Grid, List, Calendar, Map } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import EventCard from './EventCard'

// Mock event data
const mockEvents = [
  {
    id: '1',
    name: 'Web3 Developer Summit 2024',
    description: 'Join the biggest Web3 developer conference featuring talks from industry leaders, hands-on workshops, and networking opportunities.',
    category: 'Technology',
    startTime: '2024-02-15T09:00:00Z',
    endTime: '2024-02-15T18:00:00Z',
    location: 'San Francisco, CA',
    organizer: 'TechCorp',
    ticketPrice: 0.1,
    maxAttendees: 500,
    currentAttendees: 342,
    imageUrl: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true
  },
  {
    id: '2',
    name: 'NFT Art Gallery Opening',
    description: 'Exclusive opening of the first virtual NFT art gallery on Monad blockchain with live artist presentations.',
    category: 'Art',
    startTime: '2024-02-10T19:00:00Z',
    endTime: '2024-02-10T22:00:00Z',
    location: 'New York, NY',
    organizer: 'ArtDAO',
    ticketPrice: 0.05,
    maxAttendees: 200,
    currentAttendees: 156,
    imageUrl: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false
  },
  {
    id: '3',
    name: 'DeFi Workshop Series',
    description: 'Learn about decentralized finance protocols, yield farming, and liquidity mining in this comprehensive workshop series.',
    category: 'Finance',
    startTime: '2024-02-20T14:00:00Z',
    endTime: '2024-02-20T17:00:00Z',
    location: 'Austin, TX',
    organizer: 'DeFiEducation',
    ticketPrice: 0,
    maxAttendees: 100,
    currentAttendees: 78,
    imageUrl: 'https://images.pexels.com/photos/7567565/pexels-photo-7567565.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false
  },
  {
    id: '4',
    name: 'Blockchain Gaming Tournament',
    description: 'Compete in the ultimate blockchain gaming tournament with prizes in crypto and NFTs.',
    category: 'Gaming',
    startTime: '2024-02-25T10:00:00Z',
    endTime: '2024-02-25T20:00:00Z',
    location: 'Los Angeles, CA',
    organizer: 'GameChain',
    ticketPrice: 0.02,
    maxAttendees: 300,
    currentAttendees: 245,
    imageUrl: 'https://images.pexels.com/photos/7862618/pexels-photo-7862618.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true
  }
]

const categories = ['All', 'Technology', 'Art', 'Finance', 'Gaming', 'Education']

const EventDiscovery: React.FC = () => {
  const [events, setEvents] = useState(mockEvents)
  const [filteredEvents, setFilteredEvents] = useState(mockEvents)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let filtered = events

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, selectedCategory])

  const handleViewDetails = (eventId: string) => {
    console.log('View details for event:', eventId)
    // Navigate to event details page
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover Events</h2>
        <p className="text-gray-600">Find and join amazing Web3 events on Monad</p>
      </motion.div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </motion.button>

          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-2 px-4 py-3 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-5 h-5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-4 py-3 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-5 h-5" />
              <span>List</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 rounded-lg p-4 mb-4"
            >
              <h3 className="font-semibold text-gray-900 mb-3">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Events Grid */}
      <motion.div
        className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}
        layout
      >
        <AnimatePresence>
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <EventCard
                event={event}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  )
}

export default EventDiscovery