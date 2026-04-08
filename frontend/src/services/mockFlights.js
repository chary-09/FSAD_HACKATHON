const AIRLINES = [
  { code: 'AI', name: 'Air India', primary: '#E31837', secondary: '#FDB615' },
  { code: '6E', name: 'IndiGo', primary: '#001B94', secondary: '#00D1FF' },
  { code: 'UK', name: 'Vistara', primary: '#5C0931', secondary: '#B98D5B' },
  { code: 'SG', name: 'SpiceJet', primary: '#E42823', secondary: '#FEE000' },
  { code: 'QP', name: 'Akasa Air', primary: '#F95C03', secondary: '#FFFFFF' },
  { code: 'G8', name: 'Go First', primary: '#D52B1E', secondary: '#FFD700' },
]

const pad2 = (n) => String(n).padStart(2, '0')

function addMinutes(date, minutes) {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() + minutes)
  return d
}

export default function makeMockFlights({ fromCode, toCode, departDate } = {}) {
  const day = departDate || new Date().toISOString().slice(0, 10)

  // Use a fixed base time per mock flight so durations are consistent.
  const baseDepartureHour = 9
  const baseDepartureMin = 15

  return AIRLINES.map((a, idx) => {
    const departure = new Date(`${day}T${pad2(baseDepartureHour + idx)}:${pad2(baseDepartureMin)}:00.000Z`)
    const durationMinutes = 80 + idx * 15
    const arrival = addMinutes(departure, durationMinutes)

    return {
      id: `mock-${a.code}-${idx + 1}`,
      isMock: true,
      airline_code: a.code,
      airline_name: a.name,
      primary_color: a.primary,
      secondary_color: a.secondary,
      origin: fromCode || 'DEL',
      destination: toCode || 'BOM',
      departure_time: departure.toISOString().slice(11, 16), // HH:MM
      arrival_time: arrival.toISOString().slice(11, 16),
      duration_minutes: durationMinutes,
      stops: 0,
      price_economy: 4500 + idx * 350,
      price_business: 9800 + idx * 450,
    }
  })
}

