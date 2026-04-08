import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../config/api'
import { getSocket, disconnectSocket } from '../services/socket'
import SeatMap from '../components/SeatMap'

export default function SeatSelectionPage() {
  const { flightId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const flight = location.state?.flight || null
  const isMock = Boolean(flight?.isMock) || String(flightId).startsWith('mock-')

  const [selectedSeat, setSelectedSeat] = useState(null)
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)

  const createMockSeats = () => {
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F']
    const rows = 6
    const mock = []
    let id = 1

    for (let r = 1; r <= rows; r++) {
      for (let c = 0; c < seatLetters.length; c++) {
        const seat_number = `${r}${seatLetters[c]}`
        // Mark some seats as "business" (premium) for visual variety.
        const seat_class = r <= 2 && c >= 3 ? 'business' : 'economy'
        const status = Math.random() < 0.12 ? 'booked' : 'available'

        mock.push({
          id,
          seat_number,
          seat_class,
          status,
          price: seat_class === 'business' ? 450 : 200,
        })
        id++
      }
    }

    return mock
  }

  useEffect(() => {
    const fetchSeats = async () => {
      if (isMock) {
        setSeats(createMockSeats())
        setLoading(false)
        return
      }

      try {
        const response = await api.get(`/flights/${flightId}/seats`)
        setSeats(response.data?.data || [])
      } catch (error) {
        console.error('Error fetching seats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSeats()
  }, [flightId, isMock])

  useEffect(() => {
    if (isMock) return

    const socket = getSocket()
    socket.emit('join-flight', flightId)

    socket.on('seat-updated', (updatedSeat) => {
      setSeats((prev) =>
        prev.map((seat) => (seat.seat_number === updatedSeat.seat_number ? { ...seat, ...updatedSeat } : seat))
      )
    })

    return () => {
      socket.emit('leave-flight', flightId)
      disconnectSocket()
    }
  }, [flightId])

  // Simulate real-time seat availability for mock flights
  useEffect(() => {
    if (!isMock) return

    const interval = setInterval(() => {
      setSeats((prev) => {
        const available = prev.filter((s) => s.status === 'available' && s.seat_number !== selectedSeat)
        if (available.length === 0) return prev
        const chosen = available[Math.floor(Math.random() * available.length)]
        return prev.map((s) => (s.id === chosen.id ? { ...s, status: 'booked' } : s))
      })

      setTimeout(() => {
        setSeats((prev) => {
          const booked = prev.filter((s) => s.status === 'booked' && s.seat_number !== selectedSeat)
          if (booked.length === 0) return prev
          const chosen = booked[Math.floor(Math.random() * booked.length)]
          return prev.map((s) => (s.id === chosen.id ? { ...s, status: 'available' } : s))
        })
      }, 6000)
    }, 7000)

    return () => clearInterval(interval)
  }, [isMock, selectedSeat])

  const handleSelectSeat = (seat) => {
    if (seat.status === 'available') {
      setSelectedSeat(seat)
    }
  }

  const handleContinue = () => {
    if (selectedSeat) {
      navigate('/booking', {
        state: {
          flightId,
          selectedSeat,
          flight,
        },
      })
    }
  }

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
      <section className="mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-6 border-b-2 border-primary/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                flight_takeoff
              </span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-xl tracking-tight">DEL → BOM</h2>
              <p className="text-on-surface-variant text-sm font-medium">Dec 15, 2024 • 1 Passenger</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-xs font-label uppercase tracking-widest text-outline">Flight Status</p>
              <p className="text-tertiary font-bold">On Schedule</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Airplane Seat Layout */}
        <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-8">
          <div className="flex flex-wrap justify-center gap-6 mb-12 bg-surface-container-lowest/90 p-4 rounded-full border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-700"></div>
              <span className="text-xs font-semibold text-white">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-600 border border-red-700"></div>
              <span className="text-xs font-semibold text-white">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-600 border border-blue-700"></div>
              <span className="text-xs font-semibold text-white">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-400 border border-orange-600"></div>
              <span className="text-xs font-semibold text-white">Business</span>
            </div>
          </div>

          {loading ? <p className="text-center">Loading seats...</p> : (
            <SeatMap seats={seats} selectedSeat={selectedSeat} onSelectSeat={handleSelectSeat} />
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-4 space-y-6 sticky top-28">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            <div className="bg-secondary p-4 text-white">
              <h3 className="font-headline font-bold text-lg">Booking Summary</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Selected Seat Info */}
              {selectedSeat && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        chair
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-outline font-label uppercase tracking-wider">Selected Seat</p>
                      <p className="font-bold text-lg">{selectedSeat.seat_number} (Window)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-outline font-label uppercase tracking-wider">Seat Price</p>
                    <p className="font-bold text-secondary">₹200</p>
                  </div>
                </div>
              )}
              <div className="h-px bg-surface-container"></div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Base Fare (1 Adult)</span>
                  <span className="font-medium">₹4,850</span>
                </div>
                {selectedSeat && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Seat Selection</span>
                    <span className="font-medium">₹200</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Taxes & Fees</span>
                  <span className="font-medium text-tertiary">Included</span>
                </div>
              </div>
              <div className="h-px bg-surface-container"></div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="font-headline font-bold text-lg">Total Cost</span>
                <span className="font-headline font-extrabold text-2xl text-on-surface">₹5,050</span>
              </div>

              {/* Action Button */}
              <button
                onClick={handleContinue}
                disabled={!selectedSeat}
                className={`w-full py-4 rounded-full font-headline font-bold text-lg shadow-lg transition-all ${
                  selectedSeat
                    ? 'bg-gradient-to-r from-secondary to-on-secondary-fixed-variant text-white hover:shadow-secondary/30 active:scale-[0.98]'
                    : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
                }`}
              >
                Continue Booking
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
