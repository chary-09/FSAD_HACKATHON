import { useState, useEffect } from 'react'
import api from '../config/api'

export default function ProfilePage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response = await api.get('/bookings/user/my-bookings')
        setBookings(response.data?.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to fetch bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const formatDateTime = (dateString) => {
    if (!dateString) return 'TBD'
    const d = new Date(dateString)
    return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  }

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-8">
        <h1 className="font-headline text-4xl font-bold mb-4">My Profile</h1>
        <p className="text-on-surface-variant mb-8">Manage your Bharat Airways account and preferences</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="Arjun Malhotra"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                defaultValue="arjun@example.com"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone</label>
              <input
                type="tel"
                defaultValue="+91 98765 43210"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3"
                readOnly
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-primary/10 rounded-lg p-6 border border-primary/20">
              <h3 className="font-headline font-bold text-xl mb-2 text-primary">Silver Wings Status</h3>
              <p className="text-on-surface-variant mb-4">42,850 miles earned</p>
              <div className="w-full bg-primary/20 h-2 rounded-full mb-2">
                <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-on-surface-variant">7,150 miles to Gold Status</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-headline text-3xl font-bold mb-4">My Trips</h2>

          {loading && <p className="text-sm text-on-surface-variant">Loading your bookings...</p>}
          {error && <p className="text-sm text-error">{error}</p>}

          {!loading && !error && bookings.length === 0 && (
            <p className="text-sm text-on-surface-variant">No bookings found. Make your first booking now!</p>
          )}

          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-surface-container rounded-lg p-4 border border-outline-variant/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{booking.origin} → {booking.destination}</p>
                    <p className="text-sm text-on-surface-variant">Flight: {booking.flight_number || 'N/A'} | Seat: {booking.seat_number || 'N/A'}</p>
                    <p className="text-sm text-on-surface-variant">{formatDateTime(booking.departure_time)} → {formatDateTime(booking.arrival_time)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    {booking.status || 'pending'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-on-surface-variant">Booking ref: {booking.booking_reference || booking.bookingReference || 'N/A'}</p>
                <p className="text-xs text-on-surface-variant">Amount: ₹{booking.total_amount?.toFixed(2) || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
