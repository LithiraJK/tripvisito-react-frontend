import { Outlet } from 'react-router-dom'
import NavItems from '../components/NavItems'
import Sidebar from '../components/Sidebar'
import MobileSideBar from '../components/MobileSideBar'
import MobileBottomNav from '../components/MobileBottomNav'

const UserLayout = () => {
  return (
    <div className='min-h-screen min-w-[375px] flex bg-gray-50 pb-16 lg:pb-0'>
      {/* Mobile Sidebar */}
      <MobileSideBar/>

      {/* Desktop Sidebar */}
      <div className='hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-10'>
        <Sidebar>
          <NavItems />
        </Sidebar>
      </div>

      {/* Main Content */}
      <main className='flex-1 container mx-auto p-4 pt-20 lg:pt-4 lg:ml-64'>
        <Outlet /> 
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

export default UserLayout
