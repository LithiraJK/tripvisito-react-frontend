import Header from "../components/Header";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <>
      {/* Hero Section */}
      <section className='w-full min-h-screen flex items-center bg-[url("src/assets/images/hero-img.png")] bg-cover bg-center bg-no-repeat'>
        <div className="w-full h-full flex flex-col justify-center items-start bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <Header
              title={'Plan Your Trip with Ease'}
              description="Customize your travel itinerary in minutes - pick your destination, set your preferences, and explore with confidence."
            />
            <Link
              to="/register"
              className="mt-6 bg-blue-600 hover:bg-blue-700 transition-colors w-full sm:w-auto px-8 py-3 text-white font-semibold rounded-lg inline-block text-center shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Travel Destinations Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Travel Destinations</h2>
          <p className="text-gray-600 mb-8">Check out some of the best places you can visit around the world.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Destination Name</h3>
                <p className="text-gray-600 text-sm">Activities count</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Handpicked Trips Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Handpicked Trips</h2>
          <p className="text-gray-600 mb-8">Browse well-planned trips designed for different travel styles and interests</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-semibold text-base">Trip Name</h3>
                <p className="text-gray-600 text-sm">Location</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">Tag</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-12">
            <button className="px-3 py-1 text-gray-600 hover:text-gray-900">← Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 text-gray-600 hover:text-gray-900">2</button>
            <button className="px-3 py-1 text-gray-600 hover:text-gray-900">3</button>
            <button className="px-3 py-1 text-gray-600 hover:text-gray-900">Next →</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-xl font-bold text-blue-600">🌍 Tourvisto</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Terms & Condition</a>
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;
