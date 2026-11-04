import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import MobileBottomNav from '../components/MobileBottomNav'

const LandingLayout = () => {
  return (
    <div className='min-h-screen min-w-[320px] pb-16 lg:pb-0'>
      <header className='absolute top-0 left-0 w-full glassmorphism border-0 rounded-2xl shadow-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <NavBar />
        </div>
      </header>

      <main className='pt-24'>
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  )
}

export default LandingLayout
