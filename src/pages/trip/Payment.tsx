import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/icons/logo.svg";

const Payment = () => {

  const navigate = useNavigate();

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Section - Trip Details */}
        <section className="bg-white p-8 lg:p-12">
          <header className="mb-8">
            <Link to="/" className="flex flex-row items-center gap-2 text-gray-700 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <img src={logo} alt="logo" className="size-7" />
              <h1 className="text-xl font-semibold text-gray-900">
                Tourvisto
              </h1>
            </Link>
          </header>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-gray-600 text-sm">Pay 5-Day Japan Highlights: Culture, Food and Adventure</p>
              <p className="text-4xl font-normal text-gray-900">$ 604.00</p>
            </div>

            <div className="mt-6">
              <img 
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop" 
                alt="Beach destination" 
                className="w-full h-64 object-cover rounded-lg"
               />
              
              <div className="mt-4 flex flex-col gap-1">
                <h3 className="text-lg font-medium text-gray-900">5-Day Japan Adventure</h3>
                <p className="text-gray-600 text-sm">Luxury, Diversity, and Harmony</p>
              </div>
            </div>
          </div>

          <footer className="mt-auto pt-12 flex items-center gap-2 text-xs text-gray-500">
            <span>Powered by</span>
            <span className="font-semibold text-[#635bff]">stripe</span>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-gray-700">Terms</a>
            <a href="#" className="hover:text-gray-700">Privacy</a>
          </footer>
        </section>

        {/* Right Section - Payment Form */}
        <section className="bg-white lg:bg-gray-50 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Apple Pay Button */}
            <button className="w-full bg-black text-white py-3 rounded-md mb-4 flex items-center justify-center hover:bg-gray-900 transition-colors">
              <svg className="w-12 h-6" viewBox="0 0 48 20" fill="white">
                <path d="M8.1 4.6c.5-.6 1.3-1.1 2.1-1.1.1 0 .3 0 .4.1-.1.8-.4 1.5-.9 2-.5.6-1.3 1-2.1 1-.1 0-.3 0-.4-.1.1-.7.4-1.4.9-1.9zm.6 2.5c.6 0 1.7-.8 3.1-.8 2.4 0 3.4 1.7 3.4 1.7s-1.9.9-1.9 3.3c0 2.8 2.5 3.7 2.5 3.7s-1.8 4.9-4.1 4.9c-1 0-1.8-.7-2.9-.7-1.1 0-2.2.7-2.9.7-2.1 0-4.8-4.6-4.8-8.3 0-3.6 2.3-5.5 4.4-5.5 1.3 0 2.3.8 3.2.8z"/>
                <path d="M24.5 7.3c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c1.4 0 2.7-.5 3.7-1.4v1.2h2.8V7.5h-2.8v1.2c-1-.9-2.3-1.4-3.7-1.4zm.4 2.5c1.6 0 2.9 1.3 2.9 2.9s-1.3 2.9-2.9 2.9-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9z"/>
                <path d="M40.7 7.5h-3.1l-2.8 7.4-2.8-7.4h-3.1l4.3 10.4-2.1 5h3l6.6-15.4z"/>
              </svg>
            </button>

            <div className="text-center text-gray-500 text-sm mb-6">Or pay with card</div>

            <form className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>

              {/* Country or region */}
              <div className="flex flex-col gap-1">
                <label htmlFor="country" className="text-sm font-medium text-gray-700">Country or region</label>
                <select 
                  id="country" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
              </div>

              {/* Card Number */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="1234 1234 1234 1234" 
                    className="w-full border border-gray-300 rounded-t-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="h-5" />
                    <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-5" />
                    <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" className="h-5" />
                    <img src="https://js.stripe.com/v3/fingerprinted/img/discover-ac52cd46f89fa40a29a0bfb954e33173.svg" alt="Discover" className="h-5" />
                  </div>
                </div>
                
                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-0">
                  <input 
                    type="text" 
                    placeholder="MM / YY" 
                    className="border border-gray-300 border-t-0 rounded-bl-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="CVC" 
                      className="w-full border border-gray-300 border-t-0 border-l-0 rounded-br-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Name on card */}
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Name on card</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>

              {/* Country or region */}
              <div className="flex flex-col gap-1">
                <label htmlFor="billingCountry" className="text-sm font-medium text-gray-700">Country or region</label>
                <select 
                  id="billingCountry" 
                  className="w-full border border-gray-300 rounded-t-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
                <input 
                  type="text" 
                  placeholder="ZIP" 
                  className="w-full border border-gray-300 border-t-0 rounded-b-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>

              {/* Submit Button */}
              <button 
                type="button"
                onClick={() => navigate('/trip/payment/success')} 
                className="w-full bg-[#5469d4] hover:bg-[#4355c8] text-white font-medium py-3 rounded-md transition-colors mt-2"
              >
                Pay $604.00
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Payment