'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { X, Upload, Image as ImageIcon, DollarSign } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

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

interface RepairJobModalProps {
  job?: RepairJob | null
  onClose: () => void
  onSave: (job: RepairJob) => void
}

interface FormData {
  customer_name: string
  device_type: string
  device_model: string
  issue_description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  estimated_cost?: number
  actual_cost?: number
  notes?: string
}

export default function RepairJobModal({ job, onClose, onSave }: RepairJobModalProps) {
  const [images, setImages] = useState<string[]>(job?.images || [])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      customer_name: job?.customer_name || '',
      device_type: job?.device_type || '',
      device_model: job?.device_model || '',
      issue_description: job?.issue_description || '',
      status: job?.status || 'pending',
      priority: job?.priority || 'medium',
      estimated_cost: job?.estimated_cost || undefined,
      actual_cost: job?.actual_cost || undefined,
      notes: job?.notes || '',
    }
  })

  const handleImageUpload = async (files: FileList) => {
    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach(file => {
        formData.append('images', file)
      })

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setImages(prev => [...prev, ...response.data.urls])
      toast.success('Images uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: FormData) => {
    try {
      const jobData = {
        ...data,
        images,
      }

      let response
      if (job) {
        response = await api.put(`/repair-jobs/${job.id}`, jobData)
      } else {
        response = await api.post('/repair-jobs', jobData)
      }

      onSave(response.data)
      toast.success(job ? 'Job updated successfully' : 'Job created successfully')
    } catch (error) {
      toast.error(job ? 'Failed to update job' : 'Failed to create job')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {job ? 'Edit Repair Job' : 'Create New Repair Job'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <input
                {...register('customer_name', { required: true })}
                className="input"
                placeholder="Enter customer name"
              />
              {errors.customer_name && (
                <p className="text-red-500 text-xs mt-1">Customer name is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Type *
              </label>
              <select
                {...register('device_type', { required: true })}
                className="input"
              >
                <option value="">Select device type</option>
                <option value="laptop">Laptop</option>
                <option value="desktop">Desktop</option>
                <option value="smartphone">Smartphone</option>
                <option value="tablet">Tablet</option>
                <option value="monitor">Monitor</option>
                <option value="printer">Printer</option>
                <option value="other">Other</option>
              </select>
              {errors.device_type && (
                <p className="text-red-500 text-xs mt-1">Device type is required</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Device Model *
            </label>
            <input
              {...register('device_model', { required: true })}
              className="input"
              placeholder="Enter device model"
            />
            {errors.device_model && (
              <p className="text-red-500 text-xs mt-1">Device model is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issue Description *
            </label>
            <textarea
              {...register('issue_description', { required: true })}
              rows={3}
              className="input"
              placeholder="Describe the issue"
            />
            {errors.issue_description && (
              <p className="text-red-500 text-xs mt-1">Issue description is required</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select {...register('status')} className="input">
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select {...register('priority')} className="input">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Cost
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...register('estimated_cost', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Cost
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...register('actual_cost', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="input pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="input"
              placeholder="Additional notes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex flex-col items-center justify-center py-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mb-2" />
                    <span>Click to upload images</span>
                  </>
                )}
              </button>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {job ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
