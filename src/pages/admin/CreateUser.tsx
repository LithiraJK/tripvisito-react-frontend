import Header from '../../components/Header'
import Button from '../../components/Button'
import { useState } from 'react'

const CreateUser = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = ()=>{
    
  }

  return (
    <main className='flex flex-col gap-10 w-full pb-20 max-w-7xl mx-auto px-4 lg:px-8'>
      <Header
        title="Add a New User"
        description="Add a New user here"
      />
      <section className="mt-2.5 w-full max-w-3xl px-4 lg:px-8 mx-auto">


        <form
          className="flex flex-col gap-6 py-6 bg-white rounded-xl shadow-xl"
          onSubmit={handleSubmit}
        >

            <div className="w-full flex flex-col gap-4 px-6 relative items-center">
            <label
              className="text-sm font-normal text-gray-400 self-start"
              htmlFor="profilePicture"
            >
             Choose Profile Picture
            </label>
            <div className="flex flex-col items-center gap-3">
              <div 
                className="relative w-28 h-28 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50 cursor-pointer hover:border-blue-400 transition-all duration-200 group"
                onClick={() => document.getElementById('profilePicture')?.click()}
              >
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg 
                      className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {imagePreview ? 'Click to change' : 'Click to Upload'}
              </p>
            </div>
            <input
              id="profilePicture"
              name="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="name"
            >
              Name
            </label>
            <input 
              className="w-full pl-4 pr-10 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
              type="text" 
            />
            
          </div>
          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="email"
            >
              Email
            </label>
            <input 
              className="w-full pl-4 pr-10 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
              type="email" 
            />
            
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="password"
            >
              Password
            </label>
            <input 
              className="w-full pl-4 pr-10 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none"
              type="password" 
            />
            
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="role"
            >
             Choose Role
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                className="px-8 py-2.5 rounded-lg text-sm font-semibold w-full pl-4 pr-10 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none focus:bg-blue-50"
              >
                <div className='flex flex-col justify-center items-baseline px-4 py-2'>
                  <h3 className='text-blue-600'>Admin</h3>
                  <p className="text-xs font-normal text-gray-400">Full access to the admin panel</p>
                </div>
              </button>
              <button
                type="button"
                className="px-8 text-sm w-full pl-4 pr-10 py-3 border-2 rounded-lg duration-200 bg-white font-medium hover:border-blue-400 cursor-text border-gray-200 focus:border-blue-500 shadow-sm focus:outline-none focus:bg-blue-50"
              >
                <div className='flex flex-col justify-center items-baseline px-4 py-2'>
                  <h3 className='text-blue-600'>User</h3>
                  <p className="text-xs font-normal text-gray-400">Limited access to own data</p>
                </div>
              </button>
            </div>
          </div>

          

          <footer className="w-full px-6">
            <Button
              type="submit"
              ctaText="Create User"
              variant="primary"
              fullWidth={true}
            />
          </footer>
        </form>
      </section>
      
    </main>
  )
}

export default CreateUser