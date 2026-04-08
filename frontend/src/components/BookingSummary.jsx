export default function BookingSummary({ flight, selectedSeat, addOns }) {
  const addonsSelected = Object?.values(addOns || {}).filter(Boolean).length || 0
  const baseFare = flight?.economy_price || flight?.price_economy || 4850
  const seatPrice = selectedSeat ? 200 : 0
  const addonsPrice = addonsSelected * 100
  const taxes = 850
  const total = baseFare + seatPrice + addonsPrice + taxes
  const durationMinutes = Number(flight?.duration_minutes || flight?.duration || 0)

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
      <div className="bg-gradient-to-r from-india-saffron to-india-green px-6 py-4 text-white">
        <h3 className="font-headline font-bold text-lg">Trip Summary</h3>
      </div>
      <div className="p-6 space-y-6">
        {flight && (
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-2xl font-black font-headline">{flight.origin}</p>
              <p className="text-xs text-on-surface-variant">Departure</p>
            </div>
            <div className="flex-1 px-4 flex flex-col items-center">
              <span className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">
                {Math.floor(durationMinutes / 60)}h {durationMinutes % 60}m
              </span>
              <div className="w-full h-[1px] bg-outline-variant relative">
                <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary bg-white text-lg">
                  flight_takeoff
                </span>
              </div>
              <span className="text-[10px] text-on-surface-variant mt-1">Direct</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black font-headline">{flight.destination}</p>
              <p className="text-xs text-on-surface-variant">Arrival</p>
            </div>
          </div>
        )}

        <div className="space-y-3 pt-4 border-t border-surface-container">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Base Fare</span>
            <span className="font-semibold">₹{baseFare}</span>
          </div>
          {selectedSeat && (
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Seat {selectedSeat}</span>
              <span className="font-semibold">₹{seatPrice}</span>
            </div>
          )}
          {addonsSelected > 0 && (
            <div className="flex justify-between text-sm text-tertiary">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">verified</span> Add-ons
              </span>
              <span className="font-semibold">+ ₹{addonsPrice}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Taxes & Fees</span>
            <span className="font-semibold">₹{taxes}</span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t-2 border-dashed border-outline-variant/30">
          <div className="flex justify-between items-end">
            <p className="font-headline font-bold text-lg">Total Amount</p>
            <p className="text-3xl font-black font-headline text-primary">₹{total}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

