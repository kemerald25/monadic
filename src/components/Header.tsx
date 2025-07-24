import React from 'react'
import { Calendar, Users, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Monadic Meetups
                </h1>
                <p className="text-sm text-gray-500">On-chain events ecosystem</p>
              </div>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            <motion.a
              href="#events"
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-5 h-5" />
              <span>Events</span>
            </motion.a>
            <motion.a
              href="#organizers"
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-5 h-5" />
              <span>Organizers</span>
            </motion.a>
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <w3m-button />
          </motion.div>
        </div>
      </div>
    </header>
  )
}

export default Header