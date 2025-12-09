import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'


const LandingLayout = () => {
  return (
    <div className='min-h-screen min-w-[375px] bg-white'>
      <header className='fixed top-0 left-0 right-0 z-50 bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <NavBar />
        </div>
      </header>

      <main className='pt-16'>
        <Outlet />
      </main>
    </div>
  )
}

export default LandingLayout




