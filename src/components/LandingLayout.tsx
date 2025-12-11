import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'


const LandingLayout = () => {
  return (
    <div className='min-h-screen min-w-[375px]'>
      <header className='absolute top-0 left-0 right-0 z-50 glassmorphism backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <NavBar />
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default LandingLayout




