import { Link } from 'react-router-dom'

const LoginPage = () => {
  return (
    <div className='flex justify-center items-center min-h-screen '>
        <form className='flex flex-col justify-between items-center p-6 border rounded-2xl shadow-md max-w-md mx-auto mt-10  border-gray-300 bg-white w-full'>
            <h2 className='text-2xl font-bold mb-4'>Login Page</h2>
            <div className='w-full'>
                <label className='text-gray-700' htmlFor="username">Username:</label>
                <input className='p-2 border rounded w-full mb-4' type="text" id="username" name="username" />
            </div>
            <div className='w-full'>
                <label className='text-gray-700' htmlFor="password">Password:</label>
                <input className='p-2 border rounded w-full mb-4' type="password" id="password" name="password" />
            </div>
            <button className='bg-green-500 text-white px-4 py-2 rounded mb-4' type="submit">Login</button>
            <p className='text-gray-700'>Don't have an account? <Link to="/register" className='text-blue-500'>Register here</Link></p>
        </form>
    </div>
  )
}

export default LoginPage