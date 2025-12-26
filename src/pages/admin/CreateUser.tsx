import Header from '../../components/Header'
import Button from '../../components/Button'
import { useState } from 'react'
import { addNewUser } from '../../services/auth'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const CreateUser = () => {
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'USER'>('USER')
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      setLoading(true)
      const formDataToSend = new FormData()
      
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('roles', JSON.stringify([selectedRole]))

      if (imageFile) {
        formDataToSend.append('profileimg', imageFile)
      }

      const response = await addNewUser(formDataToSend)
      
      toast.success(response.message || 'User created successfully!')
      
      // Reset form
      setFormData({ name: '', email: '', password: '' })
      setImagePreview(null)
      setImageFile(null)
      setSelectedRole('USER')
      
      // Navigate to users list
      setTimeout(() => {
        navigate('/admin/all-users')
      }, 1500)
      
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast.error(error.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
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
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
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
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
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
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
            />
            
          </div>

          <div className="w-full flex flex-col gap-2.5 px-6 relative">
            <label
              className="text-sm font-normal text-gray-400"
              htmlFor="role"
            >
              Choose Role
            </label>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('ADMIN')}
                className={`px-8 py-2.5 rounded-lg text-sm font-semibold w-full pl-4 pr-10 py-3 border-2 rounded-lg duration-200 font-medium hover:border-blue-400 cursor-pointer border-gray-200 focus:outline-none ${
                  selectedRole === 'ADMIN' 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'bg-white'
                }`}
              >
                <div className='flex flex-col justify-center items-baseline px-4 py-2'>
                  <h3 className='text-blue-600'>Admin</h3>
                  <p className="text-xs font-normal text-gray-400">Full access to the admin panel</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('USER')}
                className={`px-8 text-sm w-full pl-4 pr-10 py-3 border-2 rounded-lg duration-200 font-medium hover:border-blue-400 cursor-pointer border-gray-200 focus:outline-none ${
                  selectedRole === 'USER' 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'bg-white'
                }`}
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
              ctaText={loading ? "Creating User..." : "Create User"}
              variant="primary"
              fullWidth={true}
              disabled={loading}
            />
          </footer>
        </form>
      </section>
      
    </main>
  )
}

export default CreateUser