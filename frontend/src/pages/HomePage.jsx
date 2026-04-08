import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CITIES = [
  { code: 'DEL', name: 'New Delhi' },
  { code: 'BOM', name: 'Mumbai' },
  { code: 'BLR', name: 'Bengaluru' },
  { code: 'HYD', name: 'Hyderabad' },
  { code: 'CCU', name: 'Kolkata' },
  { code: 'MAA', name: 'Chennai' },
  { code: 'PNQ', name: 'Pune' },
  { code: 'AMD', name: 'Ahmedabad' },
  { code: 'GOI', name: 'Goa' },
  { code: 'COK', name: 'Kochi' },
  { code: 'JAI', name: 'Jaipur' },
  { code: 'LKO', name: 'Lucknow' },
  { code: 'IXC', name: 'Chandigarh' },
  { code: 'SAG', name: 'Sagar' },
  { code: 'VTZ', name: 'Visakhapatnam' },
  { code: 'COB', name: 'Coimbatore' },
  { code: 'SXR', name: 'Srinagar' },
  { code: 'VIJ', name: 'Vijayawada' },
  { code: 'TRZ', name: 'Tirupati' },
  { code: 'IDR', name: 'Indore' },
  { code: 'BHO', name: 'Bhopal' },
  { code: 'AGR', name: 'Agra' },
  { code: 'VNS', name: 'Varanasi' },
  { code: 'RJC', name: 'Rajkot' },
  { code: 'AUH', name: 'Abu Dhabi' },
  { code: 'DXB', name: 'Dubai' },
  { code: 'DOH', name: 'Doha' },
  { code: 'SIN', name: 'Singapore' },
  { code: 'KUL', name: 'Kuala Lumpur' },
  { code: 'BKK', name: 'Bangkok' },
  { code: 'LHR', name: 'London' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)
  const [searchParams, setSearchParams] = useState({
    from: 'DEL',
    to: 'BOM',
    departDate: today,
    returnDate: '',
    passengers: '1',
    class: 'economy',
  })

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="pt-0">
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-black text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] mb-4 tracking-tight leading-tight">
            Explore India and the World
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium mb-6">
            Search and book flights with real-time seat availability.
          </p>

          <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 max-w-6xl mx-auto border border-white/25">
            <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">From</label>
                  <select
                    value={searchParams.from}
                    onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    {CITIES.map((city) => (
                      <option key={city.code} value={city.code}>
                        {city.code} - {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">To</label>
                  <select
                    value={searchParams.to}
                    onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    {CITIES.map((city) => (
                      <option key={city.code} value={city.code}>
                        {city.code} - {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">Departure</label>
                  <input
                    type="date"
                    value={searchParams.departDate}
                    onChange={(e) => setSearchParams({ ...searchParams, departDate: e.target.value })}
                    className="w-full p-3 tricolor-border bg-white text-sm font-medium outline-none focus:ring-0"
                    placeholder="Select departure date"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">Return</label>
                  <input
                    type="date"
                    value={searchParams.returnDate}
                    onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                    className="w-full p-3 tricolor-border bg-white text-sm font-medium outline-none focus:ring-0"
                    placeholder="Select return date"
                  />
                </div>
              </div>

              <div className="lg:col-span-1 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">Passengers</label>
                    <select
                      value={searchParams.passengers}
                      onChange={(e) => setSearchParams({ ...searchParams, passengers: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-300"
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                          {value} Adult{value > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">Class</label>
                    <select
                      value={searchParams.class}
                      onChange={(e) => setSearchParams({ ...searchParams, class: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-300"
                    >
                      <option value="economy">Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="CartBtn">
                  <span className="IconContainer">✈</span>
                  <span className="text">Search Flights</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-headline text-4xl font-extrabold mb-3 tricolor-text">Exclusive Bharat Deals</h2>
          <p className="text-gray-700 mb-10">Curated destinations at unbeatable prices for your next adventure.</p>

          <div className="container-cards-ticket mx-auto max-w-4xl">
            <div className="card-ticket">
              <div className="separator">
                <div className="span-lines"></div>
              </div>
              <div className="content-ticket flex items-center justify-between w-full">
                <div className="content-data">
                  <div className="destination">
                    <div className="dest">
                      <span className="country">DEL → BOM</span>
                      <span className="acronym text-2xl font-extrabold">New Delhi to Mumbai</span>
                      <span className="hour">Dec 15, 2024 · 09:30 AM</span>
                    </div>
                    <div className="ticket-code text-sm font-semibold">PNR: BHA123</div>
                  </div>
                  <div className="data data-flex-col">
                    <span className="title">Passenger</span>
                    <span className="subtitle">1 Adult · Economy</span>
                  </div>
                </div>
                <div className="container-icons flex flex-col justify-between p-4">
                  <span className="icon text-xl">✈</span>
                  <span className="icon text-xs">Boarding</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
