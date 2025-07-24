import React, { useState } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Download,
  Eye,
  Star
} from 'lucide-react'
import { motion } from 'framer-motion'

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d')

  // Mock data
  const stats = [
    {
      title: 'Total Events',
      value: '12',
      change: '+2.5%',
      positive: true,
      icon: Calendar
    },
    {
      title: 'Total Attendees',
      value: '1,247',
      change: '+12.3%',
      positive: true,
      icon: Users
    },
    {
      title: 'Revenue',
      value: '45.2 ETH',
      change: '+8.1%',
      positive: true,
      icon: DollarSign
    },
    {
      title: 'Engagement Rate',
      value: '78.5%',
      change: '-2.1%',
      positive: false,
      icon: TrendingUp
    }
  ]

  const eventData = [
    { name: 'Web3 Summit', attendees: 450, revenue: 12.5 },
    { name: 'NFT Gallery', attendees: 200, revenue: 8.2 },
    { name: 'DeFi Workshop', attendees: 120, revenue: 0 },
    { name: 'Gaming Tournament', attendees: 350, revenue: 15.8 },
    { name: 'Art Exhibition', attendees: 180, revenue: 6.4 }
  ]

  const categoryData = [
    { name: 'Technology', value: 35, color: '#8B5CF6' },
    { name: 'Art', value: 25, color: '#06B6D4' },
    { name: 'Finance', value: 20, color: '#10B981' },
    { name: 'Gaming', value: 15, color: '#F59E0B' },
    { name: 'Other', value: 5, color: '#EF4444' }
  ]

  const recentEvents = [
    {
      id: 1,
      name: 'Web3 Developer Summit',
      date: '2024-02-15',
      attendees: 450,
      status: 'completed',
      revenue: 12.5
    },
    {
      id: 2,
      name: 'NFT Art Gallery',
      date: '2024-02-20',
      attendees: 200,
      status: 'upcoming',
      revenue: 8.2
    },
    {
      id: 3,
      name: 'DeFi Workshop',
      date: '2024-02-25',
      attendees: 120,
      status: 'live',
      revenue: 0
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Track your event performance and analytics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  stat.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs last period</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Event Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendees" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Event</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Attendees</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{event.name}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{event.date}</td>
                    <td className="py-4 px-4 text-gray-600">{event.attendees}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : event.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {event.revenue > 0 ? `${event.revenue} ETH` : 'Free'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-purple-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-yellow-600">
                          <Star className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard