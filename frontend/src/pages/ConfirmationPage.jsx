import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../config/api'
import { QRCodeCanvas } from 'qrcode.react'

export default function ConfirmationPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const mockBooking = location.state?.booking
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')
  const [fetchError, setFetchError] = useState('')

  const isMockBooking = Boolean(booking?.booking_id && String(booking.booking_id).startsWith('mock-'))

  useEffect(() => {
    if (mockBooking?.booking_id) {
      setBooking(mockBooking)
      setLoading(false)
      return
    }

    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${bookingId}`)
        setBooking(response.data?.data || response.data || null)
      } catch (error) {
        console.error('Error fetching booking:', error)
        setFetchError(error.response?.data?.message || error.message || 'Unable to load booking details')
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId, mockBooking])

  const downloadTicket = async () => {
    setDownloadError('')
    setDownloading(true)

    try {
      if (isMockBooking) {
        const ticketText = `Bharat Airways Demo Ticket\n\nBooking ID: ${booking.booking_id}\nReference: ${booking.booking_reference || 'N/A'}\nFlight: ${booking.flight?.flight_number || booking.flight_number || 'Demo Flight'}\nRoute: ${booking.flight?.origin || booking.origin || 'N/A'} → ${booking.flight?.destination || booking.destination || 'N/A'}\nSeat: ${booking.seat_number || 'N/A'}\nPassenger: ${booking.passenger?.fullName || booking.passenger_name || booking.passenger?.name || 'Passenger'}\nAmount: ₹${booking.amount || 5050}\n\nThis is a demo ticket generated locally.`
        const blob = new Blob([ticketText], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `BharatAirways-${booking.booking_id}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        return
      }

      const bookingRequestId = booking?.id || booking?.bookingId || booking?.booking_id
      if (!bookingRequestId) {
        throw new Error('Booking ID is missing')
      }

      const response = await api.post(`/bookings/${bookingRequestId}/boarding-pass`)
      const pdfUrl = response.data?.data?.pdfUrl || response.data?.data?.url
      if (!pdfUrl) {
        throw new Error('No boarding pass URL returned')
      }
      const downloadUrl = pdfUrl.startsWith('http') ? pdfUrl : `${process.env.VITE_API_URL || 'http://localhost:5000'}${pdfUrl}`
      window.open(downloadUrl, '_blank')
    } catch (err) {
      setDownloadError(err.response?.data?.message || err.message || 'Unable to download ticket')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-32 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-primary animate-spin">flight</span>
          <p className="mt-4 text-on-surface-variant">Loading your booking...</p>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="pt-32 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-xl text-center bg-surface-container-lowest rounded-3xl p-10 shadow-sm border border-error/20">
          <span className="material-symbols-outlined text-6xl text-error mb-6">error</span>
          <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-on-surface-variant mb-6">{fetchError}</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-primary text-white py-3 px-6 rounded-full font-semibold"
          >
            Go to My Trips
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-tertiary-container mb-6 shadow-lg shadow-tertiary/20">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'wght' 700" }}>
              check
            </span>
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
            Your Flight is Confirmed!
          </h1>
          <p className="text-on-surface-variant text-lg">
            Booking ID: <span className="font-bold text-primary">{booking?.booking_reference}</span>. We've sent your
            itinerary to your email.
          </p>
        </div>

        {/* Boarding Pass Card */}
        <div className="relative group mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-green-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-outline-variant/10">
            {/* Main Ticket Section */}
            <div className="flex-grow p-8 md:p-12">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant/60 block mb-1">
                    Flight Number
                  </span>
                  <span className="font-headline text-2xl font-extrabold text-secondary">{booking?.flight_number || booking?.flight?.flight_number || 'N/A'}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant/60 block mb-1">
                    Class
                  </span>
                  <span className="font-headline text-lg font-bold text-on-surface">{booking?.seat_class || booking?.flight?.seat_class || 'Economy'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-12">
                <div className="text-left">
                  <h2 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface">
                    {booking?.origin || booking?.flight?.origin || 'Unknown'}
                  </h2>
                  <p className="text-sm font-medium text-on-surface-variant">Origin</p>
                </div>
                <div className="flex-grow mx-8 relative flex flex-col items-center">
                  <div className="w-full border-t-2 border-dashed border-outline-variant/40 absolute top-1/2 -translate-y-1/2"></div>
                  <div className="relative bg-surface-container-lowest px-4">
                    <span className="material-symbols-outlined text-primary scale-150 rotate-90" style={{ fontVariationSettings: "'FILL' 1" }}>
                      flight
                    </span>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mt-6 bg-surface-container-low px-2 py-0.5 rounded-full">
                    2h 15m
                  </span>
                </div>
                <div className="text-right">
                  <h2 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface">
                    {booking?.destination || booking?.flight?.destination || 'Unknown'}
                  </h2>
                  <p className="text-sm font-medium text-on-surface-variant">Destination</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-surface-container">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 block mb-1">
                    Date
                  </span>
                  <span className="font-bold text-on-surface">{new Date(booking?.departure_time || booking?.flight?.departure_time || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) || 'TBD'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 block mb-1">
                    Boarding
                  </span>
                  <span className="font-bold text-on-surface">08:00 AM</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 block mb-1">
                    Gate
                  </span>
                  <span className="font-bold text-on-surface">G-12</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 block mb-1">
                    Seat
                  </span>
                  <span className="font-bold text-primary">{booking?.seat_number}</span>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-surface-container-low md:w-72 p-8 md:p-12 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-4 rounded-2xl shadow-inner mb-6 border border-white">
                <div className="flex items-center justify-center">
                  <QRCodeCanvas
                    value={booking?.qrPayload || booking?.booking_reference || bookingId || 'Bharat Airways'}
                    size={128}
                    bgColor="#FFFFFF"
                    fgColor="#000080"
                    level="M"
                    includeMargin={false}
                  />
                </div>
              </div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant mb-4">
                Scan for Web Check-in
              </p>
              <div className="w-full space-y-3">
                <button
                  onClick={downloadTicket}
                  disabled={downloading}
                  className={`w-full ${downloading ? 'bg-gray-300 text-gray-700' : 'bg-gradient-to-r from-primary to-primary-container text-white'} py-3 px-6 rounded-full font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all`}
                >
                  {downloading ? (isMockBooking ? 'Preparing Demo Ticket...' : 'Generating Ticket...') : 'Download Ticket'}
                </button>
                {downloadError && <p className="text-sm text-error mt-2">{downloadError}</p>}
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 text-primary py-3 px-6 rounded-full font-bold text-sm hover:bg-surface transition-all"
                >
                  View My Trips
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Promotional Offers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group relative h-48 rounded-[1.5rem] overflow-hidden">
            <img
              alt="Hotel"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLSpznmUy9HUMC9Jfb1Fd-GFYS3BregWJu-Z22SjzaYiZs1T_RtmjqkTuhzHHPxuT-HWeA5BUrRIWm7PYLpA9rEkplXnEIuFhru9v1lcKs-u-u6hp2Ifu2vU87ZA4k83GeYpupe1IUtPXTIfB1E39uSD2J9Almx_l2T2DAx1Cw10gVE--xUc1h3BAEJSd_iSzgFW1V9-Nbou5Euol80ALqpG8JjobwaW8dvBowgCGQWsBosAOMZjy1AuZTV4_7ErzPxH3p7PSkQ00"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-white font-headline font-bold text-xl">Exclusive Stay Offers</h3>
              <p className="text-white/80 text-sm">Save up to 25% on Taj Hotels in Mumbai</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
