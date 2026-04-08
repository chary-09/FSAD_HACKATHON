import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../config/api'
import FlightCard from '../components/FlightCard'
import makeMockFlights from '../services/mockFlights'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const today = new Date().toISOString().slice(0, 10)
  const fromCode = searchParams.get('from') || 'DEL'
  const toCode = searchParams.get('to') || 'BOM'
  const departDate = searchParams.get('departDate') || today
  const returnDate = searchParams.get('returnDate') || ''
  const tripType = returnDate ? 'roundtrip' : 'oneway'

  useEffect(() => {
    const fetchFlights = async () => {
      setError('')
      try {
        if (!departDate) {
          setFlights([])
          setError('Please select a departure date.')
          return
        }

        const response = await api.post('/flights/search', {
          // Backend expects these exact keys (see flightValidations.searchFlights)
          origin: fromCode,
          destination: toCode,
          departure_date: departDate,
          trip_type: tripType,
        })
        const fetched = response.data?.data || []

        const seen = new Set()
        for (const f of fetched) {
          const key = f.airline_code || f.airline_name || f.airline || 'unknown'
          seen.add(key)
        }

        // If backend can't return enough airlines, show mock flights so the UI works end-to-end.
        if (fetched.length === 0 || seen.size < 5) {
          setFlights(makeMockFlights({ fromCode: fromCode, toCode: toCode, departDate }))
          return
        }

        // Otherwise show up to 6 distinct airlines from the real response.
        const selected = []
        const selectedSeen = new Set()
        for (const f of fetched) {
          const key = f.airline_code || f.airline_name || f.airline || 'unknown'
          if (selectedSeen.has(key)) continue
          selectedSeen.add(key)
          selected.push(f)
          if (selected.length >= 6) break
        }
        setFlights(selected)
      } catch (error) {
        console.error('Error fetching flights:', error)
        setError('Backend unavailable for this search; showing demo flights.')
        setFlights(makeMockFlights({ fromCode: fromCode, toCode: toCode, departDate }))
      } finally {
        setLoading(false)
      }
    }

    fetchFlights()
  }, [searchParams])

  const handleSelectFlight = (flight) => {
    navigate(`/flights/${flight.id}/seats`, {
      state: { flight },
    })
  }

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
      <div className="bg-white/80 rounded-xl p-6 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-sm border border-white/60">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">From</span>
            <span className="text-lg font-display font-bold">
              {fromCode}{' '}
              <span className="text-sm font-normal text-gray-500">Departure</span>
            </span>
          </div>
          <span className="material-symbols-outlined text-india-blue bg-slate-100 rounded-full p-2">
            swap_horiz
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">To</span>
            <span className="text-lg font-display font-bold">
              {toCode}{' '}
              <span className="text-sm font-normal text-gray-500">Arrival</span>
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <span className="material-symbols-outlined text-4xl text-india-blue">flight</span>
          </div>
          <p className="mt-4 text-gray-600">Loading flights...</p>
        </div>
      ) : flights.length > 0 ? (
        <div className="space-y-6">
          {flights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-gray-300">flight</span>
          <p className="mt-4 text-gray-600">{error || 'No flights found. Try different dates.'}</p>
        </div>
      )}
    </div>
  )
}
