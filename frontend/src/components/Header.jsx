import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'


function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const OnLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <header className="header">
            <div className="logo">
                <Link to='/'>Quackle</Link>
            </div>
            <ul>
                {user ? (
                    <>
                        <li>
                            <button className="btn" onClick={OnLogout}> <FaSignOutAlt /> Logout</button>
                        </li>
                        <li>
                            <Link to='/all-quacks'>
                                <FaUser /> All your Quacks
                            </Link>
                        </li>
                        <li>
                            <Link to='/profile'>
                                <FaUser /> Profile
                            </Link>
                        </li>
                    
                    </>
                ) : (
                    <>
                        <li>
                            <Link to='/login'>
                                <FaSignInAlt /> Login
                            </Link>
                        </li>
                        <li>
                            <Link to='/register'>
                                <FaUser /> Register
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </header>

    )
}

export default Header