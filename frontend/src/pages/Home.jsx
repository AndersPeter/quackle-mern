import { Link } from 'react-router-dom'
import { useState } from 'react';
import {useSelector} from 'react-redux'


function Home() {
  const {user} = useSelector((state)=> state.auth)
  const [name] = useState(user.name)
  const [email] = useState(user.email)

  const [formData, setFormData] = useState({
    text: ''
  })

  const { text } = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(text);
  }

  return (
    <>
      <section className="heading">
        <h1>Quackle</h1>
        <h2>Quacks to reflect on</h2>
      </section>
      <section className="question">
        <h3 className="question_heading">Question of the day</h3>
        {/* TODO: Get question of the day from DB */}
        <p className="question_text">question_text from DB</p>
      </section>

      <section className="answear">
        <h3 className="answear_heading">Quack here</h3>
      </section>
      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor='name'>Quackers Name</label>
            <input type="text" className='form-control' value={name} disabled />
            <label htmlFor='email'>Quackers email</label>
            <input type="text" className='form-control' value={email} disabled />

          </div>
          <div className="form-group">
            <label htmlFor="Quack">Your quack to the question</label>
            <textarea rows="4" type="text"  id='text' name='text' value={text} onChange={onChange} placeholder='Please write your quack here' required />
          </div>

          <div className="form-group">
            <button className="btn btn-block">Quack it!</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Home