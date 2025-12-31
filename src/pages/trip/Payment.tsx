import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/icons/logo.svg";
import { getTripDetails } from "../../services/trip";
import api from "../../services/api"; // ඔයාගේ axios instance එක
import toast from "react-hot-toast";

interface Trip {
  _id: string;
  tripDetails: {
    name: string;
    description: string;
    estimatedPrice: string;
  };
  imageUrls: string[];
}

const Payment = () => {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (tripId) {
        try {
          setLoading(true);
          const response = await getTripDetails(tripId);
          setTrip(response.data.trip);
        } catch (error) {
          console.error("Failed to fetch trip details:", error);
          toast.error("Trip details ලබා ගැනීමට නොහැකි විය.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTripDetails();
  }, [tripId]);

  // --- STRIPE REDIRECTION LOGIC ---
  const handlePayment = async () => {
    if (!trip) return;

    try {
      setIsProcessing(true);
      
      // Backend එකේ අපි හදපු /checkout endpoint එකට request එක යැවීම
      const response = await api.post("/payment/checkout", {
        tripId: trip._id,
        tripName: trip.tripDetails.name,
        tripImage: trip.imageUrls[0],
        tripDescription: trip.tripDetails.description,

        amount: Number(trip.tripDetails.estimatedPrice.replace(/[^0-9.]/g, "")),
      });

      if (response.data.url) {
        // Stripe Hosted Page එකට redirect කිරීම
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error(error.response?.data?.message || "ගෙවීමේ ක්‍රියාවලිය ආරම්භ කිරීමට නොහැකි විය.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!trip) return <div className="flex justify-center items-center h-screen">Trip not found</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* වම් පස - Trip Summary (එලෙසම පවතී) */}
        <section className="bg-white p-8 lg:p-12 flex flex-col justify-between border-r border-gray-100">
          <div>
            <header className="mb-12">
              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="logo" className="size-8" />
                <h1 className="text-2xl font-bold text-gray-900">TripVisito</h1>
              </Link>
            </header>

            <div className="space-y-6">
              <div>
                <p className="text-gray-500 font-medium">Pay for your adventure</p>
                <h2 className="text-5xl font-bold text-gray-900 mt-2">
                  {trip.tripDetails.estimatedPrice}
                </h2>
              </div>

              <div className="pt-8">
                <img 
                  src={trip.imageUrls[0]} 
                  alt={trip.tripDetails.name} 
                  className="w-full h-72 object-cover rounded-2xl shadow-sm"
                />
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900">{trip.tripDetails.name}</h3>
                  <p className="text-gray-600 mt-2 leading-relaxed">{trip.tripDetails.description}</p>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-12 flex items-center gap-2 text-xs text-gray-400">
            <span>Powered by</span>
            <span className="font-bold text-[#635bff] uppercase tracking-wider">stripe</span>
          </footer>
        </section>

        {/* දකුණු පස - Simplified Payment Trigger */}
        <section className="bg-gray-50 p-8 lg:p-12 flex items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="mb-8">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Secure Checkout</h3>
                <p className="text-gray-500 mt-2">You will be redirected to Stripe's secure payment gateway to complete your booking.</p>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-[#635bff] hover:bg-[#5851e0] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-100 disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : null}
                {isProcessing ? "Processing..." : `Proceed to Pay ${trip.tripDetails.estimatedPrice}`}
              </button>

              <p className="text-xs text-gray-400 mt-6 leading-relaxed">
                By clicking "Proceed to Pay", you agree to our terms and conditions. Your card information is never stored on our servers.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Payment;