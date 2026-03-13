import { FaSignInAlt, FaSignOutAlt, FaUser, FaFeatherAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo__name">🦆 Quackel</span>
          <span className="logo__tagline">one question. one answer. every day.</span>
        </Link>

        <nav className="nav-links">
          <Link to="/about"><span>About</span></Link>
          {user ? (
            <>
              <Link to="/profile">
                <FaUser /> <span>Profile</span>
              </Link>
              {user.isAdmin && (
                <Link to="/admin">
                  <FaFeatherAlt /> <span>Admin</span>
                </Link>
              )}
              <button onClick={onLogout} className="btn-nav-primary">
                <FaSignOutAlt /> <span>Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <FaSignInAlt /> <span>Log in</span>
              </Link>
              <Link to="/register" className="btn-nav-primary">
                <span>Sign up</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
