import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

export default function AnalyticsCharts({ analytics }) {
  const dailyBookingsData = {
    labels: analytics?.dailyBookings?.map((d) => d.date) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Bookings',
        data: analytics?.dailyBookings?.map((d) => d.count) || [32, 45, 51, 62, 54, 70, 66],
        borderColor: '#000080',
        backgroundColor: 'rgba(0, 0, 128, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const revenueData = {
    labels: analytics?.revenue?.map((d) => d.date) || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Revenue (₹ Lakhs)',
        data: analytics?.revenue?.map((d) => d.amount) || [24, 32, 28, 40],
        backgroundColor: '#FF9933',
      },
    ],
  }

  const routesData = {
    labels: analytics?.popularRoutes?.map((r) => r.route) || ['DEL-BOM', 'BLR-DEL', 'HYD-MAA', 'DEL-DXB'],
    datasets: [
      {
        data: analytics?.popularRoutes?.map((r) => r.count) || [32, 21, 15, 18],
        backgroundColor: ['#FF9933', '#138808', '#000080', '#6B21A8'],
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 lg:col-span-2">
        <h3 className="font-headline font-bold text-lg mb-4">Daily Bookings</h3>
        <Line data={dailyBookingsData} />
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20">
        <h3 className="font-headline font-bold text-lg mb-4">Popular Routes</h3>
        <Doughnut data={routesData} />
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 lg:col-span-3">
        <h3 className="font-headline font-bold text-lg mb-4">Weekly Revenue</h3>
        <Bar data={revenueData} />
      </div>
    </div>
  )
}

