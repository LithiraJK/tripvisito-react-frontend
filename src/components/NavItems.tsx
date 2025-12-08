import { Link, NavLink, useNavigate } from 'react-router-dom'
import { sidebarItems } from '../constants/index.ts'
import { getMyDetails } from '../services/auth.ts'
import { useEffect, useState } from 'react';
import logo from '../assets/icons/logo.svg'
import logoutIcon from '../assets/icons/logout.svg'

const NavItems = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate()


   useEffect(() => {
    let isMounted = true;
    
    const getUserDetails = async () => {
      try {
        const response = await getMyDetails();
        console.log(response)
        if (isMounted) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }

    getUserDetails();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/login')

  }


  return (
    <section className='flex flex-col h-full'>
        <Link to="/" className="nav-link flex flex-row items-center space-x-2 p-4 mb-2">
        <img src={logo} alt="logo" className='size-9' />
        <h1 className='text-2xl font-bold'>Tripvisito</h1>
        </Link>

        <div className="flex flex-col gap-9 mt-2.5 flex-1">
            <nav>
                {sidebarItems.map(({id, href , icon , label}) => (
                    <NavLink to={href} key={id} className={({isActive}) => `flex items-center gap-2 p-4 font-medium border-0 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                      {icon && <img src={icon} alt={label} className='size-5' />}
                      {label}
                    </NavLink>
                ))}
            </nav>
            {user && (
              <footer className='flex items-center gap-2.5 pb-8 mt-auto p-4'>
                  <img src={user.profileimg || '/default-avatar.png'} alt={user.name || 'User'} className='size-10 rounded-full shrink-0' />
                  <article className='flex-1 min-w-0'>
                    <h2 className='font-medium truncate'>{user.name}</h2>
                    <p className='text-sm text-gray-600 truncate'>{user.email}</p>
                  </article>
                  <button className='btn-logout cursor-pointer shrink-0' onClick={handleLogout}>
                    <img src={logoutIcon} alt="Logout" className='size-8' />
                  </button>
              </footer>
            )}
        </div>

    </section>
  )
}

export default NavItems