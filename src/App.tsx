import { AuthProvider } from './contexts/authContext'
import { WishlistProvider } from './contexts/wishlistContext'
import Router from './routes'

const App = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <Router />
      </WishlistProvider>
    </AuthProvider>
  )
}

export default App
