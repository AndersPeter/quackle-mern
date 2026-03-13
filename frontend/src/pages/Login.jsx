import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaSignInAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import { useNavigate } from 'react-router-dom'



function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoading, isError, message } =
    useSelector(
      state => state.auth
    )

    useEffect(() => {
      if (isError) {
        toast.error(message)
      }
  
      // Redirect when logged in
      if (user) {
        navigate('/')
      }
      dispatch(reset())
    }, [isError, user, message, navigate, dispatch])
  

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email,
      password
    }
    dispatch(login(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="auth-page">
      <section className="heading">
        <h1><FaSignInAlt /> Welcome back</h1>
        <p>Log in to see today's question</p>
      </section>
      <div className="card">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={email} onChange={onChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={onChange} placeholder="••••••••" required />
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block">Log in</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login