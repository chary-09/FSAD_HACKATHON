export default function Loader() {
  return (
    <div className="mx-auto mb-8 w-max">
      <div className="loader-wrap">
        <svg viewBox="0 0 230 230" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle className="cal-loader__path" cx="115" cy="115" r="100" fill="none" strokeWidth="8" />
          <path className="cal-loader__plane" d="M115 45 L125 75 L145 80 L125 95 L130 115 L115 100 L100 115 L105 95 L85 80 L105 75 Z" />
        </svg>
      </div>
    </div>
  )
}
