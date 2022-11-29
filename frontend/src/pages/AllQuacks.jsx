import {useState} from 'react'


function AllQuacks() {
  return (
    <div>
      <section className="heading">
        <h1>Your Quacking So Far</h1>
      </section>
      <section className="answers">
        <div className="answears_list">
          {/* TODO List of personal quacks from DB */}
          <p>List of quacks</p>
        </div>
      </section>

    </div>
  )
}

export default AllQuacks