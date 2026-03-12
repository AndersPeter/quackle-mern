require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
const mongoose = require('mongoose')
const Question = require('./models/questionModel')
const User = require('./models/userModel')

const questions = [
  // Identity & Self-knowledge
  'Who were you before the world told you who to be?',
  'What does your inner critic say most often — and is it telling the truth?',
  'If you had to describe yourself without using your job, role, or appearance, who are you?',
  'What is one belief you hold about yourself that might be holding you back?',
  'What version of yourself are you most afraid others will discover?',
  'What part of your personality do you hide in public that you wish you didn\'t have to?',
  'When do you feel most like yourself?',
  'What would the ten-year-old version of you think of you today?',
  'What qualities in others annoy you most — and do you see any of them in yourself?',
  'What do you pretend not to care about, but actually care about deeply?',
  'How much of your personality is truly yours, versus shaped by who you\'ve been around?',
  'What would you do differently if you knew no one was watching or judging?',
  'What parts of your younger self have you abandoned that you wish you hadn\'t?',
  'What would you say to yourself ten years ago if you could?',
  'Are you living by your own values, or by values you inherited without questioning?',

  // Purpose & Direction
  'If your life ended tomorrow, what would you wish you had spent more time on?',
  'In ten years, what do you hope you started doing today?',
  'What does a life well-lived look like to you — not to anyone else, to you?',
  'If money and opinion didn\'t matter, how would you spend your days?',
  'What are you building — and is it something you actually want?',
  'When did you last feel like what you were doing truly mattered?',
  'What problem in the world makes you angry enough to want to do something about it?',
  'What would you regret never trying?',
  'Are you moving toward something, or away from something?',
  'What would you do with your life if failure wasn\'t possible?',
  'What lights you up so much that you lose track of time?',
  'If you could leave one thing behind after you\'re gone, what would it be?',
  'What legacy are you building right now, whether you mean to or not?',
  'What does "success" actually mean to you — not your parents, not society, to you?',
  'What dream have you been postponing — and what is the real reason?',

  // Relationships & Connection
  'Who in your life do you take for granted, and what would it look like to appreciate them more?',
  'When did you last tell someone what they truly mean to you?',
  'Who would you call if you had genuinely bad news — and what does that tell you?',
  'What relationship in your life needs the most honesty right now?',
  'Is there someone you need to forgive — including yourself?',
  'What do you bring to a friendship that is uniquely you?',
  'Who drains your energy, and who fills it?',
  'What do you wish someone would just ask you about?',
  'When did you last truly listen to someone without planning what you\'d say next?',
  'What do people always come to you for — and do you value that in yourself?',
  'Who have you lost touch with that you miss?',
  'Are there people in your life you keep around out of habit rather than genuine connection?',
  'What does loneliness feel like to you — and what do you usually do with it?',
  'What makes you feel genuinely understood?',
  'How has your relationship with your parents shaped how you show up in the world?',

  // Courage & Fear
  'What are you most afraid of — really?',
  'What would you attempt if you were ten percent braver?',
  'What conversation have you been avoiding that needs to happen?',
  'What are you tolerating in your life that you know, deep down, you shouldn\'t be?',
  'What risk have you been rationalising away that might actually be worth taking?',
  'What would your life look like if you stopped playing it safe?',
  'When did fear last stop you from doing something — and was it worth listening to?',
  'What\'s the worst realistic outcome of the thing you\'re most afraid to do?',
  'Are you brave in the ways that matter most to you?',
  'What would you do if you weren\'t worried about looking foolish?',
  'What would you attempt if you had already decided you were enough?',
  'What is the bravest thing you\'ve ever done — and what did it cost you?',
  'What has playing it safe cost you?',
  'If you weren\'t afraid, who would you be?',
  'What fear are you currently mistaking for wisdom?',

  // Habits, Time & Energy
  'How do you spend the first hour of your day — and does it reflect what you value?',
  'What habit is silently shaping your life in ways you\'ve barely noticed?',
  'If you tracked your time for a week, would you be proud of where it went?',
  'What do you do with time that doesn\'t need to be filled?',
  'What are you spending energy on that isn\'t giving anything back?',
  'What small action, done consistently, would most change your life?',
  'What do you keep saying you\'ll start when things calm down — and will they?',
  'How do you behave when you\'re running on empty?',
  'What would change if you treated your time like it was genuinely limited?',
  'What does rest mean to you — and are you actually getting it?',
  'What are you addicted to that you wouldn\'t call an addiction?',
  'What is the gap between who you want to be and how you spent this week?',
  'What does your phone history say about what you actually value?',
  'What would you stop doing if you gave yourself permission to?',
  'What does your daily routine say about your priorities?',

  // Gratitude & Enough
  'What does "enough" look like for you — and are you living it?',
  'What do you have right now that a previous version of you was desperately hoping for?',
  'What ordinary thing in your life would you miss terribly if it were gone?',
  'When did you last feel genuinely content — not happy, just content?',
  'What chapter of your life, even a hard one, are you grateful for now?',
  'What do you own that owns you back?',
  'What would be enough for you to feel like your life had been worth it?',
  'What\'s a simple pleasure you\'ve been walking past without noticing?',
  'What do you have in your life right now that you once thought would make you happy?',
  'How would your life change if you stopped wanting more and started using what you have?',
  'What would you lose if you suddenly had everything you think you want?',
  'What are five things about today that are easy to overlook but worth noticing?',
  'Who or what has made your life easier that you\'ve never said thank you for?',
  'What does abundance mean to you beyond money?',
  'What is going right in your life that rarely gets your attention?',

  // Growth & Change
  'When did you last do something for the first time — and how did it feel?',
  'What could you improve about yourself without losing who you are?',
  'What has been your hardest life lesson — and what did it give you?',
  'What would you do differently if you could live this year again?',
  'What is one thing you know you should stop, and what\'s stopping you from stopping?',
  'When did failure teach you something success never could have?',
  'What are you currently growing through — even if it doesn\'t feel like growth?',
  'What chapter of your life are you finally ready to close?',
  'What criticism of you turned out to be useful, even though it stung?',
  'What would the future version of you most want to tell you right now?',
  'What have you outgrown that you\'re still carrying?',
  'What is currently changing in you, even if you haven\'t named it yet?',
  'What hard thing are you currently avoiding that would change you for the better?',
  'What has your biggest failure so far taught you about yourself?',
  'What is one thing you believed five years ago that you no longer do?',

  // Work & Contribution
  'Are you proud of how you spend most of your waking hours?',
  'What would you do differently in your work if you weren\'t afraid of losing it?',
  'When did you last feel that your work made a genuine difference to someone?',
  'What would you create if you had no audience?',
  'What skill are you not using that the world might actually need?',
  'If your work disappeared tomorrow, what would be lost — and to whom?',
  'What part of your work do you do because you love it, versus because you feel you should?',
  'What would it look like to bring more of who you are into what you do?',
  'Are you building something you believe in?',
  'What would you do for free if you didn\'t need money — and why aren\'t you doing more of it?',
  'Do you work to live or live to work — and are you okay with that answer?',
  'What ambition have you quietly abandoned that deserves one more look?',
  'What does meaningful work look like to you, and how close are you to it?',
  'What do you wish people understood about the work you do?',
  'Is there a contribution you feel called to make that you\'ve been putting off?',

  // Body, Health & Presence
  'When did you last feel fully present in your body — not your thoughts, your body?',
  'What does your body try to tell you that you regularly ignore?',
  'How do you treat yourself when you\'re sick, tired, or struggling — and what does that say?',
  'When were you last truly, physically at rest?',
  'What does your relationship with food say about how you comfort yourself?',
  'When did you last move your body in a way that felt joyful, not obligatory?',
  'How do you feel in your body most days — and have you accepted that as normal when it isn\'t?',
  'What does sleep mean to you beyond rest?',
  'When did you last breathe slowly and on purpose?',
  'How would your life change if you treated your body like it had to last forever?',

  // Money & Security
  'What is your earliest memory of money — and how has it shaped you?',
  'Does your spending reflect what you say you value?',
  'What would financial security actually feel like — and would it change who you are?',
  'What are you buying to fill a gap that money can\'t fill?',
  'How much of your anxiety is actually about money at the root?',
  'What would you do tomorrow if you knew your income was secure for ten years?',
  'What is your relationship with generosity — with your time, money, and attention?',
  'Do you make financial decisions from fear or from values?',
  'What would you stop buying if you were honest about what it\'s actually for?',
  'What would "free" feel like to you — and what would it cost to get there?',

  // Meaning & The Big Questions
  'What do you believe in that you can\'t prove?',
  'What gives your life meaning when the easy answers don\'t feel like enough?',
  'Do you believe people are fundamentally good — and has life tested that?',
  'What question about life do you keep coming back to?',
  'What would you want people to say about you at your funeral — and are you living that way?',
  'What is the difference between happiness and meaning — and which do you want more?',
  'What would you do if you believed your life had a purpose?',
  'What is something you believe that most people around you don\'t?',
  'What experience has most changed how you see the world?',
  'Is there a version of life after this one — and does your answer change how you live now?',
  'What does it mean to be a good person — and how do you measure up to your own standard?',
  'What would you do today if you believed time was truly running out?',
  'What small moment this week felt quietly significant?',
  'What is something the world needs more of that you could give?',
  'What makes being human both beautiful and hard at the same time?',

  // Decisions & Regret
  'What is one decision you could make today that your future self would thank you for?',
  'If you could change one decision from your past, what would it be — and what does that tell you about your values now?',
  'What decision are you currently making by not deciding?',
  'What do you keep choosing even though it no longer fits who you\'re becoming?',
  'What would you choose if the options were reversed — and does that tell you something?',
  'When did you last trust your gut — and were you right?',
  'What important decision are you making with someone else\'s voice in your head instead of your own?',
  'What would you decide today if you weren\'t waiting for more certainty?',
  'What regret do you carry quietly — and what has it changed in you?',
  'What would it feel like to finally decide the thing you\'ve been circling for months?',

  // Seasons, Transitions & Endings
  'What season of life are you currently in — and what does this season ask of you?',
  'What are you in the middle of right now that you\'ll look back on as important?',
  'What is ending in your life right now, even if nothing dramatic has happened?',
  'What transition have you been resisting that life is pushing you through anyway?',
  'What were you this time last year — and what has changed?',
  'What beginning in your life deserves more celebration than you\'ve given it?',
  'What are you holding onto from a past chapter that no longer belongs in this one?',
  'What does this time of year bring up in you — and where does that come from?',
  'What are you in the process of becoming right now?',
  'What would it look like to end this year differently than you began it?',

  // Community & The World
  'What kind of world do you want to leave behind — and what are you doing about it?',
  'What injustice do you witness regularly that you\'ve learned to look away from?',
  'How do you show up for strangers — and does that align with who you think you are?',
  'What would you do if you knew your actions would set the example for everyone around you?',
  'What does your community look like — and is it the one you want?',
  'What is something small you could do for someone today that would genuinely matter to them?',
  'When did a stranger last surprise you with their kindness?',
  'What do you wish the people around you understood about what the world needs right now?',
  'What problem in your immediate community could you actually do something about?',
  'What does belonging feel like to you — and where do you feel it most?',

  // Playfulness, Joy & Lightness
  'When did you last laugh until it hurt — and who were you with?',
  'What makes you childishly, unashamedly happy?',
  'What would you do purely for fun this week if you let yourself?',
  'When did you last play — not exercise, not relax, but actually play?',
  'What brings you joy that has no practical justification whatsoever?',
  'What makes you come alive in a room full of people?',
  'What is something delightfully weird about you that you love?',
  'When did you last do something purely because it made you happy?',
  'What used to make you happy as a kid that you\'ve drifted away from?',
  'If you had a completely free Saturday with no obligations, what would you actually do?',

  // Wildcard & Perspective Shifts
  'What is something you changed your mind about this year?',
  'What would you think about your life if you were seeing it from the outside?',
  'What is something everyone around you believes that you quietly question?',
  'What is a story you tell about yourself that you\'re not sure is true anymore?',
  'What would happen if you assumed the best about people today instead of the worst?',
  'What does a stranger observing your life for a week likely see that you don\'t?',
  'What would change if you took full responsibility for where you are right now?',
  'What would you notice about today if it were the last one you had?',
  'What is something that used to feel impossible that now feels ordinary?',
  'What is the most interesting thing about your life that you rarely talk about?',
  'What would you do today if you believed you were already enough?',
  'What has been the unexpected gift hidden inside your hardest experience?',
  'What would you say to yourself in ten years if you could?',
  'What would you stop waiting for if you knew the permission was never coming?',
  'What is something true about you today that wasn\'t true five years ago?',
  'What do you know now that you wish you\'d known at the start of this year?',
  'What chapter of your life are you currently in — and what is its title?',
  'What small thing happened this week that you almost missed but are glad you didn\'t?',
  'What would your life look like if you stopped apologising for who you are?',
  'What is the most honest thing you could say about where you are right now?',
  'If today were the start of the rest of your life, what would you begin?',
]

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  const admin = await User.findOne({ isAdmin: true })
  if (!admin) {
    console.error('No admin user found. Set isAdmin: true on your user first.')
    process.exit(1)
  }

  // Find next available date starting from today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const existing = await Question.find(
    { scheduledDate: { $gte: today } },
    { scheduledDate: 1 }
  )
  const scheduled = new Set(
    existing.map((q) => q.scheduledDate.toISOString().split('T')[0])
  )

  const toInsert = []
  let candidate = new Date(today)

  for (const text of questions) {
    while (scheduled.has(candidate.toISOString().split('T')[0])) {
      candidate.setDate(candidate.getDate() + 1)
    }
    const dateKey = candidate.toISOString().split('T')[0]
    toInsert.push({ text, scheduledDate: new Date(dateKey), createdBy: admin._id })
    scheduled.add(dateKey)
    candidate.setDate(candidate.getDate() + 1)
  }

  await Question.insertMany(toInsert)
  console.log(`Seeded ${toInsert.length} questions starting from ${toInsert[0].scheduledDate.toISOString().split('T')[0]}`)
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
