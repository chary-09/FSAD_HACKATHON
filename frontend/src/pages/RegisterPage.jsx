import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../config/api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const normalizedPhone = formData.phone.replace(/[^+0-9]/g, '')
      const response = await api.post('/auth/register', {
        name: formData.fullName,
        email: formData.email,
        phone: normalizedPhone,
        password: formData.password,
      })
      const payload = response.data?.data || {}
      localStorage.setItem('accessToken', payload.accessToken)
      localStorage.setItem('refreshToken', payload.refreshToken)
      localStorage.setItem('userRole', payload.role)
      navigate('/profile')
      window.location.reload()
    } catch (err) {
      const serverError = err.response?.data
      const validationError = serverError?.errors?.[0]?.message
      setError(validationError || serverError?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-16 px-6 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-8 border border-outline-variant/20">
          <h1 className="font-headline text-3xl font-bold text-center mb-2">Join Bharat Airways</h1>
          <p className="text-center text-on-surface-variant mb-8">Create your account to book flights</p>

          {error && <div className="bg-error/20 text-error px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                placeholder="+91 98765 43210"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-on-surface-variant mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
