import { Link } from 'react-router-dom'

const RegisterPage = () => {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <form className='flex flex-col justify-between items-center p-6 border rounded-2xl shadow-md max-w-md mx-auto mt-10  border-gray-300 bg-white w-full'>
            <h2 className='text-2xl font-bold mb-4'>Register</h2>
            <div className='w-full'>
                <label className='text-gray-700' htmlFor="firstName">FirstName</label>
                <input className='p-2 border rounded w-full mb-4' type="text" id="firstName" name="firstName" />
            </div>
            <div className='w-full'>
                <label className='text-gray-700' htmlFor="email">Email:</label>
                <input className='p-2 border rounded w-full mb-4' type="email" id="email" name="email" />
            </div>
            <div className='w-full'>
                <label className='text-gray-700' htmlFor="password">Password:</label>
                <input className='p-2 border rounded w-full mb-4' type="password" id="password" name="password" />
            </div>
            <button className='bg-blue-500 text-white px-4 py-2 rounded mb-4' type="button">Register</button>
            <p className='text-gray-700'>Already have an account? <Link to="/login" className='text-blue-500'>Login here</Link></p>

        </form>
    </div>
  )
}

export default RegisterPage