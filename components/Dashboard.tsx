'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { Plus, Search, Filter, LogOut } from 'lucide-react'
import RepairJobCard from './RepairJobCard'
import RepairJobModal from './RepairJobModal'
import { formatDate } from '@/lib/utils'

interface RepairJob {
  id: number
  customer_name: string
  device_type: string
  device_model: string
  issue_description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
  images: string[]
  estimated_cost?: number
  actual_cost?: number
  notes?: string
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [jobs, setJobs] = useState<RepairJob[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState<RepairJob | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await api.get('/repair-jobs')
      setJobs(response.data)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateJob = () => {
    setEditingJob(null)
    setShowModal(true)
  }

  const handleEditJob = (job: RepairJob) => {
    setEditingJob(job)
    setShowModal(true)
  }

  const handleJobSaved = (savedJob: RepairJob) => {
    if (editingJob) {
      setJobs(jobs.map(job => job.id === savedJob.id ? savedJob : job))
    } else {
      setJobs([savedJob, ...jobs])
    }
    setShowModal(false)
    setEditingJob(null)
  }

  const handleDeleteJob = async (jobId: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/repair-jobs/${jobId}`)
        setJobs(jobs.filter(job => job.id !== jobId))
      } catch (error) {
        console.error('Failed to delete job:', error)
      }
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.device_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.device_model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Repair Tracker</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateJob}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Job</span>
              </button>
              <button
                onClick={logout}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">{jobs.filter(j => j.status === 'pending').length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-yellow-600">{jobs.filter(j => j.status === 'in_progress').length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">{jobs.filter(j => j.status === 'completed').length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-gray-600">{jobs.length}</div>
            <div className="text-sm text-gray-600">Total Jobs</div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <RepairJobCard
              key={job.id}
              job={job}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
            />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No jobs found</div>
            <div className="text-gray-400 text-sm mt-2">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first repair job to get started'
              }
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <RepairJobModal
          job={editingJob}
          onClose={() => {
            setShowModal(false)
            setEditingJob(null)
          }}
          onSave={handleJobSaved}
        />
      )}
    </div>
  )
}
