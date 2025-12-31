import { Outlet } from 'react-router-dom'
import NavItems from './NavItems'
import Sidebar from './Sidebar'
import MobileSideBar from './MobileSideBar'

const UserLayout = () => {
  return (
    <div className='min-h-screen min-w-[375px] flex bg-gray-50'>
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
    </div>
  )
}

export default UserLayout