import { Link } from "react-router-dom"

const Index = () => {
  return (
    <div className="bg-gray-900 flex flex-row items-center justify-center min-h-screen space-x-4">
      <Link to="/login" className="bg-blue-500  text-white px-4 py-2 rounded">Login</Link>
      <Link to="/register" className="bg-green-500  text-white px-4 py-2 rounded">Register</Link>
    </div>
  )
}

export default Index