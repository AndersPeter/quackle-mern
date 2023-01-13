import { useState } from 'react'
import {useSelector} from 'react-redux'

function NewQuack() {
    const {user} = useSelector((state)=> state.auth)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [quack, setQuack] = useState('')

  return (
    <div>NewQuack</div>
  )
}

export default NewQuack