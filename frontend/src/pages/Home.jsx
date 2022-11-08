import { Link } from 'react-router-dom'
import { useState } from 'react';

function Home() {
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
        <h3 className="answear_heading">Your quack to the question</h3>
      </section>
      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input type="text" id='text' name='text' value={text} onChange={onChange} placeholder='Please write your quack' required />
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