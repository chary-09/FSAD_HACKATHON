import { useLocation, useNavigate } from 'react-router-dom'
import PaymentForm from '../components/PaymentForm'
import BookingSummary from '../components/BookingSummary'

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const booking = location.state?.booking
  const amount = location.state?.amount || 5050

  const handleSuccess = () => {
    // After simulated payment, go to confirmation page
    const bookingId = booking?.booking_id || booking?.bookingId || booking?.id
    if (bookingId) {
      navigate(`/confirmation/${bookingId}`, { state: { booking } })
    } else {
      navigate('/confirmation/preview')
    }
  }

  return (
    <div className="pt-24 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-2">Secure Payment</h1>
            <p className="text-on-surface-variant text-lg">
              Complete your Bharat Airways booking with our secure payment gateway.
            </p>
          </div>

          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">payments</span>
              <h2 className="font-headline text-2xl font-bold">Card Details</h2>
            </div>
            <PaymentForm amount={amount} onSuccess={handleSuccess} />
          </section>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <BookingSummary flight={booking?.flight} selectedSeat={booking?.seat_number} addOns={booking?.addOns} />
        </div>
      </div>
    </div>
  )
}

