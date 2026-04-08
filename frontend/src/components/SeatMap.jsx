import SeatComponent from './SeatComponent'

// Render classic 3-3 layout: A B C | aisle | D E F
export default function SeatMap({ seats, selectedSeat, onSelectSeat }) {
  // Backend seat numbers are not guaranteed to be A/B/C-like. To keep a realistic 3-3 cabin,
  // we place seats into a 6-seat-per-row grid (A B C | aisle | D E F) based on ordering.
  const sorted = [...seats].sort((a, b) => {
    if (a.id && b.id) return a.id - b.id
    return String(a.seat_number || '').localeCompare(String(b.seat_number || ''))
  })

  const seatsPerRow = 6
  const rowCount = Math.ceil(sorted.length / seatsPerRow)
  const rowIndexes = Array.from({ length: rowCount }, (_, index) => rowCount - 1 - index)

  return (
    <div className="seat-map-plane relative p-4">
      <div className="plane-outline absolute inset-0 rounded-[2.2rem] border-2 border-white/50 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"></div>
      <div className="seat-scroll relative z-10 flex overflow-x-auto overflow-y-hidden gap-4 h-[390px] min-h-[380px] items-end pb-3 pr-3 scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-200/40" style={{ scrollbarGutter: 'stable' }}>
        {rowIndexes.map((rowIndex) => {
          const rowSeats = sorted.slice(rowIndex * seatsPerRow, rowIndex * seatsPerRow + seatsPerRow)
          const left = rowSeats.slice(0, 3)
          const right = rowSeats.slice(3, 6)
          const rowLabel = rowIndex + 1

          return (
            <div key={rowIndex} className="flex flex-col items-center gap-2 p-3 bg-slate-900/30 border border-white/15 rounded-xl min-w-[150px] shadow-md backdrop-blur-md">
              <span className="text-xs font-bold text-white tracking-wide">Row {rowLabel}</span>
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-2">
                  {left.map((seat) => (
                    <SeatComponent
                      key={seat.seat_number}
                      seat={seat}
                      isSelected={selectedSeat?.seat_number === seat.seat_number}
                      onSelect={onSelectSeat}
                    />
                  ))}
                </div>
                <div className="w-8 text-center text-[11px] font-bold text-white uppercase tracking-[0.2em] px-1 py-0.5 rounded bg-black/30">AISLE</div>
                <div className="flex flex-col gap-2">
                  {right.map((seat) => (
                    <SeatComponent
                      key={seat.seat_number}
                      seat={seat}
                      isSelected={selectedSeat?.seat_number === seat.seat_number}
                      onSelect={onSelectSeat}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="plane-nose absolute top-[-14px] left-1/2 -translate-x-1/2 h-6 w-16 bg-white/60 rounded-full border border-white/40"></div>
      <div className="plane-tail absolute bottom-[-10px] left-1/2 -translate-x-1/2 h-6 w-20 bg-white/60 rounded-full border border-white/40"></div>
    </div>
  )
}

