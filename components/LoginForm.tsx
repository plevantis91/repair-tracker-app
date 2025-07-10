'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'

interface LoginFormData {
  username: string
  password: string
}

interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const { login, register } = useAuth()

  const loginForm = useForm<LoginFormData>()
  const registerForm = useForm<RegisterFormData>()

  const handleLogin = async (data: LoginFormData) => {
    const success = await login(data.username, data.password)
    if (success) {
      toast.success('Login successful!')
    } else {
      toast.error('Invalid credentials')
    }
  }

  const handleRegister = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    const success = await register(data.username, data.email, data.password)
    if (success) {
      toast.success('Registration successful!')
    } else {
      toast.error('Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="card p-8">
          {isLogin ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...loginForm.register('username', { required: true })}
                    type="text"
                    className="input pl-10"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...loginForm.register('password', { required: true })}
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button type="submit" className="btn btn-primary w-full">
                  Sign in
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...registerForm.register('username', { required: true })}
                    type="text"
                    className="input pl-10"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...registerForm.register('email', { required: true, pattern: /^\S+@\S+$/i })}
                    type="email"
                    className="input pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...registerForm.register('password', { required: true, minLength: 6 })}
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...registerForm.register('confirmPassword', { required: true })}
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div>
                <button type="submit" className="btn btn-primary w-full">
                  Sign up
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
