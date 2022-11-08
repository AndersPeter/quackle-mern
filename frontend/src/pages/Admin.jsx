function Home() {
    return (
      <>
        <section className="heading">
          <h1>Quackle Admin</h1>
          <h2>Create some Quacks!</h2>
        </section>
        <section className="question">
          <h3 className="question_heading">
            Quack of the day
          </h3>
          <p className="question_text"></p>
        </section>
        <section className="createQuack">
            <h3 className="createQuack_heading">
                Quack Creator
            </h3>
            <div>
                {/* TODO: Create a form that submits a question of the day to DB */}
            </div>
        </section>


      </>
    )
  }
  
  export default Home