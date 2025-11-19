import { Outlet } from 'react-router-dom'
import NavItems from './NavItems'
import Sidebar from './Sidebar'

const AdminLayout = () => {
  return (
    <div className='min-h-screen flex bg-gray-50'>
      <Sidebar>
        <NavItems />
      </Sidebar>
      <main className='flex-1 container mx-auto p-4'>
        <Outlet /> 
      </main>
    </div>
  )
}

export default AdminLayout