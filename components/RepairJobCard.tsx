'use client'

import { Edit, Trash2, Clock, DollarSign, AlertCircle } from 'lucide-react'
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

interface RepairJobCardProps {
  job: RepairJob
  onEdit: (job: RepairJob) => void
  onDelete: (jobId: number) => void
}

export default function RepairJobCard({ job, onEdit, onDelete }: RepairJobCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4" />
      case 'medium':
        return <Clock className="h-4 w-4" />
      case 'low':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {job.customer_name}
          </h3>
          <p className="text-sm text-gray-600">
            {job.device_type} - {job.device_model}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(job)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-2">
          {job.issue_description}
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
          {job.status.replace('_', ' ').toUpperCase()}
        </span>
        <div className={`flex items-center space-x-1 ${getPriorityColor(job.priority)}`}>
          {getPriorityIcon(job.priority)}
          <span className="text-xs font-medium">
            {job.priority.toUpperCase()}
          </span>
        </div>
      </div>

      {(job.estimated_cost || job.actual_cost) && (
        <div className="flex items-center space-x-4 mb-4">
          {job.estimated_cost && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>Est: ${job.estimated_cost}</span>
            </div>
          )}
          {job.actual_cost && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>Actual: ${job.actual_cost}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Created: {formatDate(job.created_at)}</span>
        {job.images.length > 0 && (
          <span>{job.images.length} image{job.images.length !== 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  )
}
