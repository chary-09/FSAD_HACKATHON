import { useState } from 'react'

export default function PaymentForm({ amount, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const handlePay = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate payment delay
    setTimeout(() => {
      setLoading(false)
      onSuccess?.()
    }, 1500)
  }

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Card Holder Name</label>
          <input
            type="text"
            required
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="As on card"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Card Number</label>
          <input
            type="text"
            required
            maxLength={16}
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="1111 2222 3333 4444"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Expiry</label>
          <input
            type="text"
            required
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="MM/YY"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">CVV</label>
          <input
            type="password"
            required
            maxLength={4}
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="***"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-india-saffron to-india-green text-white py-3 rounded-full font-headline font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
      >
        {loading ? 'Processing Payment...' : `Pay ₹${amount}`}
      </button>
    </form>
  )
}

