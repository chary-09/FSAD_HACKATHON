import React from 'react';
import { Link } from 'react-router-dom';
import { PlaneTakeoff, Calendar, Users, Briefcase } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-tricolor-gradient opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-6 drop-shadow-md">
            Discover India with <span className="text-india-saffron">Bharat</span> <span className="text-india-green">Airways</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10">
            Experience premium air travel across the subcontinent and beyond with our top-tier partnered airlines.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/search" className="px-8 py-4 bg-india-saffron text-white rounded-full font-semibold shadow-lg hover:bg-orange-600 transition-all text-lg hover:-translate-y-1 transform">
              Search Flights
            </Link>
            <Link to="/dashboard" className="px-8 py-4 bg-white text-india-blue border-2 border-india-blue rounded-full font-semibold shadow-lg hover:bg-blue-50 transition-all text-lg hover:-translate-y-1 transform">
              Manage Booking
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="glass-panel p-8 rounded-2xl">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-orange-100 text-india-saffron rounded-full">
                <PlaneTakeoff size={40} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-display">Vast Network</h3>
            <p className="text-gray-600">Connecting all major and regional airports across India.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 text-india-blue rounded-full">
                <Briefcase size={40} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-display">Premium Service</h3>
            <p className="text-gray-600">Enjoy unparalleled comfort and hospitality on every journey.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 text-india-green rounded-full">
                <Users size={40} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-display">Family Friendly</h3>
            <p className="text-gray-600">Special amenities and seating options for families travelling together.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
