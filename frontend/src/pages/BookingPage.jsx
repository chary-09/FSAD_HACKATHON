import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../config/api'
import BookingSummary from '../components/BookingSummary'

export default function BookingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    passportId: '',
  })
  const [addOns, setAddOns] = useState({
    baggage: false,
    meal: false,
    priority: false,
  })
  const flight = location.state?.flight || null
  const isMock = Boolean(flight?.isMock) || String(location.state?.flightId || '').startsWith('mock-')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddOnChange = (addon) => {
    setAddOns({ ...addOns, [addon]: !addOns[addon] })
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    try {
      if (isMock) {
        const booking = {
          booking_id: `mock-booking-${Date.now()}`,
          booking_reference: `BA-${Math.floor(100000 + Math.random() * 900000)}`,
          flight,
          seat_number: location.state?.selectedSeat?.seat_number,
          addOns,
          passenger: { ...formData },
          qrPayload: `${flight?.airline_name || 'Flight'}|${flight?.origin || ''}-${flight?.destination || ''}|${location.state?.selectedSeat?.seat_number || ''}`,
        }

        const amount = 5050 + Object.values(addOns).filter(Boolean).length * 100
        navigate('/payment', {
          state: {
            booking,
            amount,
          },
        })
        return
      }

      const response = await api.post('/bookings', {
        flight_id: location.state?.flightId,
        seat_id: location.state?.selectedSeat?.id,
        passenger_name: formData.fullName,
        passenger_email: formData.email,
        passenger_phone: formData.phone,
        passenger_passport: formData.passportId,
        special_requests: null,
      })
      const booking = response.data?.data || response.data || {}
      if (booking.bookingId && !booking.booking_id) {
        booking.booking_id = booking.bookingId
      }
      navigate('/payment', {
        state: {
          booking,
          amount: 5050 + Object.values(addOns).filter(Boolean).length * 100,
        },
      })
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to create booking: ' + (error.response?.data?.message || 'Unknown error'))
    }
  }

  return (
    <div className="pt-24 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-2">
              Complete Your Booking
            </h1>
            <p className="text-on-surface-variant text-lg">Secure your seat on Bharat Airways. Only a few steps away.</p>
          </div>

          {/* Passenger Information */}
          <section className="bg-white/70 backdrop-blur-md rounded-xl p-8 shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">person</span>
              <h2 className="font-headline text-2xl font-bold">Passenger Information</h2>
            </div>
            <form onSubmit={handleBooking} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-primary-fixed-variant ml-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border-b border-primary py-3 px-4 focus:ring-0 focus:border-b-2 transition-all outline-none"
                    placeholder="e.g. Aarav Sharma"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-primary-fixed-variant ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border-b border-primary py-3 px-4 focus:ring-0 focus:border-b-2 transition-all outline-none"
                    placeholder="aarav@example.com"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-primary-fixed-variant ml-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border-b border-primary py-3 px-4 focus:ring-0 focus:border-b-2 transition-all outline-none"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-on-primary-fixed-variant ml-1">Passport ID</label>
                  <input
                    type="text"
                    name="passportId"
                    value={formData.passportId}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-lowest border-b border-primary py-3 px-4 focus:ring-0 focus:border-b-2 transition-all outline-none"
                    placeholder="Z1234567"
                    required
                  />
                </div>
              </div>

              {/* Extras */}
              <div className="mt-8 pt-6 border-t border-outline-variant/20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">add_circle</span>
                  <h2 className="font-headline text-2xl font-bold">Enhance Your Journey</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 'baggage', icon: 'luggage', title: 'Extra Baggage', desc: '+15 KG check-in allowance', price: '₹500' },
                    { id: 'meal', icon: 'restaurant', title: 'In-flight Meal', desc: 'Vegetarian Platter', price: '₹350' },
                    { id: 'priority', icon: 'bolt', title: 'Priority Boarding', desc: 'Skip the queue & early bin access', price: '₹250' },
                  ].map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-primary">
                          <span className="material-symbols-outlined">{addon.icon}</span>
                        </div>
                        <div>
                          <p className="font-bold">{addon.title}</p>
                          <p className="text-sm text-on-surface-variant">{addon.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-primary">{addon.price}</span>
                        <input
                          type="checkbox"
                          checked={addOns[addon.id]}
                          onChange={() => handleAddOnChange(addon.id)}
                          className="w-6 h-6 rounded-lg border-primary text-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-full font-headline font-extrabold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-8"
              >
                Continue to Payment
              </button>
            </form>
          </section>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <BookingSummary flight={flight} selectedSeat={location.state?.selectedSeat?.seat_number} addOns={addOns} />
          </div>
        </div>
      </div>
    </div>
  )
}
