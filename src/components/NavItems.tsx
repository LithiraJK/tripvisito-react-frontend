import { Link, NavLink } from 'react-router-dom'
import { sidebarItems } from '../constants/index.ts'

const NavItems = () => {
  const user = {
    name: "John Doe",
    role: "Admin",
    email: "john@gmail.com",
    imageURL: "src/assets/images/david.webp"
  }

  const handleLogout = () => {

  }


  return (
    <section className='flex flex-col h-full'>
        <Link to="/" className="nav-link flex flex-row items-center space-x-2 p-4 mb-2">
        <img src="/src/assets/icons/logo.svg" alt="logo" className='size-9' />
        <h1 className='text-2xl font-bold'>Tripvisito</h1>
        </Link>

        <div className="container flex flex-col flex-1">
            <nav>
                {sidebarItems.map(({id, href , icon , label}) => (
                    <NavLink to={href} key={id} className={({isActive}) => `flex items-center gap-2 p-4 font-medium border-0 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                      {icon && <img src={icon} alt={label} className='size-5' />}
                      {label}
                    </NavLink>
                ))}
            </nav>
            <footer className='nav-footer flex items-center gap-4 mt-auto p-4'>
                <img src={user?.imageURL} alt={user?.name} className='size-10 rounded-full shrink-0' />
                <article className='flex-1 min-w-0'>
                  <h2 className='font-medium truncate'>{user?.name}</h2>
                  <p className='text-sm text-gray-600 truncate'>{user?.email}</p>
                </article>
                <button className='btn-logout cursor-pointer shrink-0' onClick={handleLogout}>
                  <img src="src/assets/icons/logout.svg" alt="Logout" className='size-8' />
                </button>
            </footer>
        </div>

    </section>
  )
}

export default NavItems