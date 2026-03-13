import { FaLinkedin, FaEnvelope, FaGlobe, FaReact, FaNodeJs, FaDatabase } from 'react-icons/fa'
import { SiMongodb, SiRedux, SiExpress, SiJsonwebtokens } from 'react-icons/si'

const STACK = [
  { icon: <FaReact />,          label: 'React',        desc: 'Frontend UI & routing' },
  { icon: <SiRedux />,          label: 'Redux Toolkit', desc: 'State management' },
  { icon: <FaNodeJs />,         label: 'Node.js',       desc: 'Runtime environment' },
  { icon: <SiExpress />,        label: 'Express',       desc: 'REST API backend' },
  { icon: <SiMongodb />,        label: 'MongoDB',       desc: 'Database' },
  { icon: <FaDatabase />,       label: 'Mongoose',      desc: 'ODM & schema validation' },
  { icon: <SiJsonwebtokens />,  label: 'JWT',           desc: 'Authentication' },
]

function About() {
  return (
    <>
      <section className="heading">
        <h1>About Quackel</h1>
        <p>one question. one answer. every day.</p>
      </section>

      {/* ── The app ── */}
      <div className="card">
        <p className="card-title">What is Quackel?</p>
        <p style={{ lineHeight: 1.7, marginBottom: '16px' }}>
          Quackel is a daily reflection app. Every day you get one question worth sitting with —
          something that nudges you to think about your life, your values, or your direction.
          You write your answer, then unlock the community's answers and read how others see it.
        </p>
        <p style={{ lineHeight: 1.7 }}>
          There are no likes, no upvotes, no ranking. Instead, each person gets one
          <strong> resonance</strong> per question — a single moment to mark the answer that
          landed most with them. Not the cleverest answer, not the most popular one.
          The one that felt true.
        </p>
      </div>

      {/* ── Resonance ── */}
      <div className="card">
        <p className="card-title">✦ What is a resonance?</p>
        <p style={{ lineHeight: 1.7, marginBottom: '16px' }}>
          When you read someone else's answer and something in you recognises it —
          not because it's the same as yours, but because it carries a truth you feel too —
          that's resonance. It's the quiet "yes, that" moment.
        </p>
        <p style={{ lineHeight: 1.7, marginBottom: '16px' }}>
          You get one resonance per question. Choosing which answer resonated most is itself
          a reflective act — it asks you to sit with several honest answers and decide
          which one reaches you deepest.
        </p>
        <p style={{ lineHeight: 1.7 }}>
          You can always come back and change your mind. Reflection isn't final.
        </p>
      </div>

      {/* ── The builder ── */}
      <div className="card">
        <p className="card-title">Built by Anders Peter Sørensen</p>
        <p style={{ lineHeight: 1.7, marginBottom: '16px' }}>
          I'm a developer in the making — transitioning into web and app development with a focus
          on building things that are actually useful. Quackel is one of my portfolio projects:
          a full-stack app built from scratch to practise the whole development lifecycle, from
          database design and API security to UI/UX and deployment.
        </p>
        <p style={{ lineHeight: 1.7 }}>
          I'm interested in products that help people reflect, grow, and connect — technology
          that serves humans rather than distracts them.
        </p>

        {/* Socials */}
        <div className="about-links">
          <a
            href="https://www.linkedin.com/in/anders-peter-s%C3%B8rensen/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            <FaLinkedin /> LinkedIn
          </a>
          <a
            href="mailto:anderspeter1982@gmail.com"
            className="about-link"
          >
            <FaEnvelope /> anderspeter1982@gmail.com
          </a>
          <span className="about-link about-link--pending">
            <FaGlobe /> Developer site — coming soon
          </span>
        </div>
      </div>

      {/* ── Tech stack ── */}
      <div className="card">
        <p className="card-title">Tech Stack</p>
        <ul className="stack-list">
          {STACK.map(({ icon, label, desc }) => (
            <li key={label} className="stack-item">
              <span className="stack-item__icon">{icon}</span>
              <span className="stack-item__label">{label}</span>
              <span className="stack-item__desc">{desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default About
