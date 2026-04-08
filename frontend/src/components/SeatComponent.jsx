export default function SeatComponent({ seat, isSelected, onSelect }) {
  const getSeatClasses = () => {
    if (seat.status === 'booked') {
      return 'bg-red-600 text-white cursor-not-allowed ring-2 ring-red-300 opacity-90'
    }
    if (isSelected) {
      return 'bg-blue-600 text-white ring-4 ring-blue-300 shadow-lg'
    }
    if (seat.seat_class === 'business' || seat.seat_class === 'premium') {
      return 'bg-orange-400 text-slate-900 ring-1 ring-orange-100 font-bold'
    }
    // available
    return 'bg-emerald-500 text-white ring-1 ring-emerald-200 hover:bg-emerald-600'
  }

  return (
    <button
      type="button"
      disabled={seat.status === 'booked'}
      onClick={() => onSelect(seat)}
      className={`h-10 w-10 rounded-md text-[10px] font-semibold flex items-center justify-center transition-transform ${
        seat.status === 'booked' ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
      } ${getSeatClasses()}`}
      title={`${seat.seat_number} • ${seat.status}`}
    >
      {seat.seat_number}
    </button>
  )
}

