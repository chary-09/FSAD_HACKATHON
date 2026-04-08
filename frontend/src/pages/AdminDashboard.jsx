import { useState, useEffect } from 'react'
import api from '../config/api'
import AnalyticsCharts from '../components/AnalyticsCharts'

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [bookings, setBookings] = useState([])
  const [newFlight, setNewFlight] = useState({
    airline: '',
    airline_code: '',
    origin: '',
    destination: '',
    departure_time: '',
    arrival_time: '',
    economy_price: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, bookingsRes] = await Promise.all([
          api.get('/admin/analytics').catch(() => ({ data: null })),
          api.get('/admin/bookings').catch(() => ({ data: { bookings: [] } })),
        ])
        setAnalytics(analyticsRes.data)
        setBookings(bookingsRes.data.bookings || [])
      } catch (e) {
        // graceful fallback to static data
      }
    }
    fetchData()
  }, [])

  const handleAddFlight = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/flights', {
        ...newFlight,
        economy_price: Number(newFlight.economy_price),
      })
      setNewFlight({
        airline: '',
        airline_code: '',
        origin: '',
        destination: '',
        departure_time: '',
        arrival_time: '',
        economy_price: '',
      })
      alert('Flight added successfully')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add flight')
    }
  }

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="font-headline text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-on-surface-variant mb-8">
        Manage flights, monitor bookings, and view real-time analytics for Bharat Airways.
      </p>

      {/* Analytics cards + charts */}
      <AnalyticsCharts analytics={analytics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add flight */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
          <h2 className="font-headline text-xl font-bold mb-4">Add New Flight</h2>
          <form onSubmit={handleAddFlight} className="space-y-4">
            <input
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-sm"
              placeholder="Airline Name (e.g. Air India)"
              value={newFlight.airline}
              onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
              required
            />
            <input
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-sm"
              placeholder="Airline Code (AI, 6E, UK...)"
              value={newFlight.airline_code}
              onChange={(e) => setNewFlight({ ...newFlight, airline_code: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-sm"
                placeholder="Origin (DEL)"
                value={newFlight.origin}
                onChange={(e) => setNewFlight({ ...newFlight, origin: e.target.value })}
                required
              />
              <input
                className="bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-sm"
                placeholder="Destination (BOM)"
                value={newFlight.destination}
                onChange={(e) => setNewFlight({ ...newFlight, destination: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="time"
                className="bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-sm"
                value={newFlight.departure_time}
                onChange={(e) => setNewFlight({ ...newFlight, departure_time: e.target.value })}
                required
              />
              <input
                type="time"
                className="bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-sm"
                value={newFlight.arrival_time}
                onChange={(e) => setNewFlight({ ...newFlight, arrival_time: e.target.value })}
                required
              />
            </div>
            <input
              type="number"
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 text-sm"
              placeholder="Economy Price (₹)"
              value={newFlight.economy_price}
              onChange={(e) => setNewFlight({ ...newFlight, economy_price: e.target.value })}
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-india-saffron to-india-green text-white py-2.5 rounded-full text-sm font-bold"
            >
              Add Flight
            </button>
          </form>
        </div>

        {/* Recent bookings */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
          <div className="px-8 py-6 flex justify-between items-center border-b border-outline-variant/10">
            <h3 className="font-headline text-lg font-bold">Recent Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                  <th className="px-8 py-4">Passenger Name</th>
                  <th className="px-8 py-4">Route</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {(bookings.length ? bookings : [
                  { id: 1, name: 'Rohan Agarwal', origin: 'DEL', destination: 'BOM', status: 'Confirmed' },
                  { id: 2, name: 'Priya Iyer', origin: 'BLR', destination: 'HYD', status: 'Pending' },
                  { id: 3, name: 'Meera Kapoor', origin: 'MAA', destination: 'DXB', status: 'Canceled' },
                ]).map((row) => (
                  <tr key={row.id || row.name} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-8 py-5 font-semibold text-sm">{row.name}</td>
                    <td className="px-8 py-5 text-sm">
                      {row.origin} → {row.destination}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          row.status === 'Confirmed'
                            ? 'bg-tertiary-container/20 text-tertiary'
                            : row.status === 'Pending'
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-error-container/40 text-error'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
