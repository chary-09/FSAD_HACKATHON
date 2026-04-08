import { useAirlineTheme } from '../context/AirlineThemeContext'

export default function FlightCard({ flight, onSelect }) {
  const { setAirlineTheme, setCustomAirlineTheme } = useAirlineTheme()

  const airlineName = flight.airline_name || flight.airline || 'Bharat Airways Partner'
  const primary = flight.primary_color || null
  const secondary = flight.secondary_color || null
  const airlineCode = flight.airline_code || null

  const handleSelect = () => {
    if (primary && secondary) {
      setCustomAirlineTheme({ airlineName, primary, secondary })
    } else if (airlineCode) {
      setAirlineTheme(airlineCode)
    }
    onSelect?.(flight)
  }

  return (
    <div className="bg-white/80 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border-l-4 border-india-blue/60">
      <div className="p-6 flex flex-wrap md:flex-nowrap items-center justify-between gap-8">
        <div className="w-full md:w-40 flex items-center gap-4">
          <div
            className="h-12 w-12 flex items-center justify-center rounded-lg text-white font-bold shadow"
            style={
              primary && secondary
                ? { background: `linear-gradient(135deg, ${primary}, ${secondary})` }
                : { backgroundColor: '#FF9933' }
            }
          >
            {airlineCode || (airlineName.split(' ')[0]?.slice(0, 2).toUpperCase() || 'IN')}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Airline</p>
            <p className="text-lg font-display font-bold">{airlineName}</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Departure</p>
            <p className="text-xl font-display font-bold">{flight.departure_time}</p>
            <p className="text-xs text-gray-500">{flight.origin}</p>
          </div>

          <div className="flex-1 flex flex-col items-center px-4">
            {(() => {
              const durationMinutes = Number(flight.duration_minutes || flight.duration || 0)
              const hh = Math.floor(durationMinutes / 60)
              const mm = durationMinutes % 60
              return (
                <span className="text-[10px] font-semibold text-indigo-600 mb-1 uppercase tracking-[0.2em]">
                  {hh}h {mm}m
                </span>
              )
            })()}
            <div className="w-full h-px bg-gray-200 relative">
              <span className="material-symbols-outlined text-indigo-600 text-xl bg-white rounded-full px-1 absolute -top-3 left-1/2 -translate-x-1/2">
                flight
              </span>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 mt-1 uppercase tracking-[0.2em]">
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
            </span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Arrival</p>
            <p className="text-xl font-display font-bold">{flight.arrival_time}</p>
            <p className="text-xs text-gray-500">{flight.destination}</p>
          </div>
        </div>

        <div className="w-full md:w-48 bg-slate-50 rounded-xl p-4 flex flex-col items-center md:items-end">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">From</p>
          <p className="text-2xl font-display font-extrabold text-gray-900">
            ₹{flight.price_economy || flight.economy_price || flight.price || '—'}
          </p>
          <p className="text-[10px] text-gray-500 mb-3">Incl. taxes & fees</p>
          <button
            onClick={handleSelect}
            className="w-full bg-india-blue text-white py-2.5 rounded-full font-semibold text-sm hover:bg-blue-900 transition-colors"
          >
            Select Flight
          </button>
        </div>
      </div>
    </div>
  )
}

