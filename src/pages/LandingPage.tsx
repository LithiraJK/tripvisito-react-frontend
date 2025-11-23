import { Link } from "react-router-dom"
import Header from "../components/Header"

const Index = () => {
  return (
    <div className="bg-white flex flex-row items-center justify-center min-h-screen space-x-4">
      <Header title="Welcome to Tripvisito" description="Your gateway to amazing travel experiences" />
      <Link to="/login" className="bg-blue-500  text-white px-4 py-2 rounded">Login</Link>
      <Link to="/register" className="bg-green-500  text-white px-4 py-2 rounded">Register</Link>
    </div>
  )
}

export default Index