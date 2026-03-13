require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
const mongoose = require('mongoose')
const Question = require('./models/questionModel')
const User = require('./models/userModel')

const questions = [
  // Identity & Self-knowledge
  { text: 'Who were you before the world told you who to be?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'What does your inner critic say most often — and is it telling the truth?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'If you had to describe yourself without using your job, role, or appearance, who are you?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'What is one belief you hold about yourself that might be holding you back?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'What version of yourself are you most afraid others will discover?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'What part of your personality do you hide in public that you wish you didn\'t have to?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'When do you feel most like yourself?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'What would the ten-year-old version of you think of you today?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'What qualities in others annoy you most — and do you see any of them in yourself?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'What do you pretend not to care about, but actually care about deeply?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'How much of your personality is truly yours, versus shaped by who you\'ve been around?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'What would you do differently if you knew no one was watching or judging?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'What parts of your younger self have you abandoned that you wish you hadn\'t?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'What would you say to yourself ten years ago if you could?', theme: 'Identity & Self-knowledge', author: 'Quackel' },
  { text: 'Are you living by your own values, or by values you inherited without questioning?', theme: 'Identity & Self-knowledge', author: 'Quackel' },

  // Purpose & Direction
  { text: 'If your life ended tomorrow, what would you wish you had spent more time on?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'In ten years, what do you hope you started doing today?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'What does a life well-lived look like to you — not to anyone else, to you?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'If money and opinion didn\'t matter, how would you spend your days?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'What are you building — and is it something you actually want?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'When did you last feel like what you were doing truly mattered?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'What problem in the world makes you angry enough to want to do something about it?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'What would you regret never trying?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'Are you moving toward something, or away from something?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'What would you do with your life if failure wasn\'t possible?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'What lights you up so much that you lose track of time?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'If you could leave one thing behind after you\'re gone, what would it be?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'What legacy are you building right now, whether you mean to or not?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'What does "success" actually mean to you — not your parents, not society, to you?', theme: 'Purpose & Direction', author: 'Quackel' },
  { text: 'What dream have you been postponing — and what is the real reason?', theme: 'Purpose & Direction', author: 'Quackel' },

  // Relationships & Connection
  { text: 'Who in your life do you take for granted, and what would it look like to appreciate them more?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'When did you last tell someone what they truly mean to you?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'Who would you call if you had genuinely bad news — and what does that tell you?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'What relationship in your life needs the most honesty right now?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'Is there someone you need to forgive — including yourself?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'What do you bring to a friendship that is uniquely you?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'Who drains your energy, and who fills it?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'What do you wish someone would just ask you about?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'When did you last truly listen to someone without planning what you\'d say next?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'What do people always come to you for — and do you value that in yourself?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'Who have you lost touch with that you miss?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'Are there people in your life you keep around out of habit rather than genuine connection?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'What does loneliness feel like to you — and what do you usually do with it?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'What makes you feel genuinely understood?', theme: 'Relationships & Connection', author: 'Quackel' },
  { text: 'How has your relationship with your parents shaped how you show up in the world?', theme: 'Relationships & Connection', author: 'Quackel' },

  // Courage & Fear
  { text: 'What are you most afraid of — really?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'What would you attempt if you were ten percent braver?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'What conversation have you been avoiding that needs to happen?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'What are you tolerating in your life that you know, deep down, you shouldn\'t be?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'What risk have you been rationalising away that might actually be worth taking?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'What would your life look like if you stopped playing it safe?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'When did fear last stop you from doing something — and was it worth listening to?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'What\'s the worst realistic outcome of the thing you\'re most afraid to do?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'Are you brave in the ways that matter most to you?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'What would you do if you weren\'t worried about looking foolish?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'What would you attempt if you had already decided you were enough?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'What is the bravest thing you\'ve ever done — and what did it cost you?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'What has playing it safe cost you?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'If you weren\'t afraid, who would you be?', theme: 'Courage & Fear', author: 'Quackel' },
  { text: 'What fear are you currently mistaking for wisdom?', theme: 'Courage & Fear', author: 'Quackel' },

  // Habits, Time & Energy
  { text: 'How do you spend the first hour of your day — and does it reflect what you value?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'What habit is silently shaping your life in ways you\'ve barely noticed?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'If you tracked your time for a week, would you be proud of where it went?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'What do you do with time that doesn\'t need to be filled?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'What are you spending energy on that isn\'t giving anything back?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'What small action, done consistently, would most change your life?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'What do you keep saying you\'ll start when things calm down — and will they?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'How do you behave when you\'re running on empty?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'What would change if you treated your time like it was genuinely limited?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'What does rest mean to you — and are you actually getting it?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'What are you addicted to that you wouldn\'t call an addiction?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'What is the gap between who you want to be and how you spent this week?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'What does your phone history say about what you actually value?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'What would you stop doing if you gave yourself permission to?', theme: 'Habits, Time & Energy', author: 'Quackel' },
  { text: 'What does your daily routine say about your priorities?', theme: 'Habits, Time & Energy', author: 'Quackel' },

  // Gratitude & Enough
  { text: 'What does "enough" look like for you — and are you living it?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'What do you have right now that a previous version of you was desperately hoping for?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'What ordinary thing in your life would you miss terribly if it were gone?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'When did you last feel genuinely content — not happy, just content?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'What chapter of your life, even a hard one, are you grateful for now?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'What do you own that owns you back?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'What would be enough for you to feel like your life had been worth it?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'What\'s a simple pleasure you\'ve been walking past without noticing?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'What do you have in your life right now that you once thought would make you happy?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'How would your life change if you stopped wanting more and started using what you have?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'What would you lose if you suddenly had everything you think you want?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'What are five things about today that are easy to overlook but worth noticing?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'Who or what has made your life easier that you\'ve never said thank you for?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'What does abundance mean to you beyond money?', theme: 'Gratitude & Enough', author: 'Quackel' },
  { text: 'What is going right in your life that rarely gets your attention?', theme: 'Gratitude & Enough', author: 'Quackel' },

  // Growth & Change
  { text: 'When did you last do something for the first time — and how did it feel?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What could you improve about yourself without losing who you are?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What has been your hardest life lesson — and what did it give you?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What would you do differently if you could live this year again?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What is one thing you know you should stop, and what\'s stopping you from stopping?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'When did failure teach you something success never could have?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What are you currently growing through — even if it doesn\'t feel like growth?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What chapter of your life are you finally ready to close?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What criticism of you turned out to be useful, even though it stung?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What would the future version of you most want to tell you right now?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What have you outgrown that you\'re still carrying?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What is currently changing in you, even if you haven\'t named it yet?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What hard thing are you currently avoiding that would change you for the better?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What has your biggest failure so far taught you about yourself?', theme: 'Growth & Change', author: 'Quackel' },
  { text: 'What is one thing you believed five years ago that you no longer do?', theme: 'Growth & Change', author: 'Quackel' },

  // Work & Contribution
  { text: 'Are you proud of how you spend most of your waking hours?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'What would you do differently in your work if you weren\'t afraid of losing it?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'When did you last feel that your work made a genuine difference to someone?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'What would you create if you had no audience?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'What skill are you not using that the world might actually need?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'If your work disappeared tomorrow, what would be lost — and to whom?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'What part of your work do you do because you love it, versus because you feel you should?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'What would it look like to bring more of who you are into what you do?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'Are you building something you believe in?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'What would you do for free if you didn\'t need money — and why aren\'t you doing more of it?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'Do you work to live or live to work — and are you okay with that answer?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'What ambition have you quietly abandoned that deserves one more look?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'What does meaningful work look like to you, and how close are you to it?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'What do you wish people understood about the work you do?', theme: 'Work & Contribution', author: 'Quackel' },
  { text: 'Is there a contribution you feel called to make that you\'ve been putting off?', theme: 'Work & Contribution', author: 'Quackel' },

  // Body, Health & Presence
  { text: 'When did you last feel fully present in your body — not your thoughts, your body?', theme: 'Body, Health & Presence', author: 'Quackel' },
  { text: 'What does your body try to tell you that you regularly ignore?', theme: 'Body, Health & Presence', author: 'Quackel' },
  { text: 'How do you treat yourself when you\'re sick, tired, or struggling — and what does that say?', theme: 'Body, Health & Presence', author: 'Quackel' },
  { text: 'When were you last truly, physically at rest?', theme: 'Body, Health & Presence', author: 'Quackel' },
  { text: 'What does your relationship with food say about how you comfort yourself?', theme: 'Body, Health & Presence', author: 'Quackel' },
  { text: 'When did you last move your body in a way that felt joyful, not obligatory?', theme: 'Body, Health & Presence', author: 'Quackel' },
  { text: 'How do you feel in your body most days — and have you accepted that as normal when it isn\'t?', theme: 'Body, Health & Presence', author: 'Quackel' },
  { text: 'What does sleep mean to you beyond rest?', theme: 'Body, Health & Presence', author: 'Quackel' },
  { text: 'When did you last breathe slowly and on purpose?', theme: 'Body, Health & Presence', author: 'Quackel' },
  { text: 'How would your life change if you treated your body like it had to last forever?', theme: 'Body, Health & Presence', author: 'Quackel' },

  // Money & Security
  { text: 'What is your earliest memory of money — and how has it shaped you?', theme: 'Money & Security', author: 'Quackel' },
  { text: 'Does your spending reflect what you say you value?', theme: 'Money & Security', author: 'Quackel' },
  { text: 'What would financial security actually feel like — and would it change who you are?', theme: 'Money & Security', author: 'Quackel' },
  { text: 'What are you buying to fill a gap that money can\'t fill?', theme: 'Money & Security', author: 'Quackel' },
  { text: 'How much of your anxiety is actually about money at the root?', theme: 'Money & Security', author: 'Quackel' },
  { text: 'What would you do tomorrow if you knew your income was secure for ten years?', theme: 'Money & Security', author: 'Quackel' },
  { text: 'What is your relationship with generosity — with your time, money, and attention?', theme: 'Money & Security', author: 'Quackel' },
  { text: 'Do you make financial decisions from fear or from values?', theme: 'Money & Security', author: 'Quackel' },
  { text: 'What would you stop buying if you were honest about what it\'s actually for?', theme: 'Money & Security', author: 'Quackel' },
  { text: 'What would "free" feel like to you — and what would it cost to get there?', theme: 'Money & Security', author: 'Quackel' },

  // Meaning & The Big Questions
  { text: 'What do you believe in that you can\'t prove?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'What gives your life meaning when the easy answers don\'t feel like enough?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'Do you believe people are fundamentally good — and has life tested that?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'What question about life do you keep coming back to?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'What would you want people to say about you at your funeral — and are you living that way?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'What is the difference between happiness and meaning — and which do you want more?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'What would you do if you believed your life had a purpose?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'What is something you believe that most people around you don\'t?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'What experience has most changed how you see the world?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'Is there a version of life after this one — and does your answer change how you live now?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'What does it mean to be a good person — and how do you measure up to your own standard?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'What would you do today if you believed time was truly running out?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'What small moment this week felt quietly significant?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'What is something the world needs more of that you could give?', theme: 'Meaning & The Big Questions', author: 'Quackel' },
  { text: 'What makes being human both beautiful and hard at the same time?', theme: 'Meaning & The Big Questions', author: 'Quackel' },

  // Decisions & Regret
  { text: 'What is one decision you could make today that your future self would thank you for?', theme: 'Decisions & Regret', author: 'Quackel' },
  { text: 'If you could change one decision from your past, what would it be — and what does that tell you about your values now?', theme: 'Decisions & Regret', author: 'Quackel' },
  { text: 'What decision are you currently making by not deciding?', theme: 'Decisions & Regret', author: 'Quackel' },
  { text: 'What do you keep choosing even though it no longer fits who you\'re becoming?', theme: 'Decisions & Regret', author: 'Quackel' },
  { text: 'What would you choose if the options were reversed — and does that tell you something?', theme: 'Decisions & Regret', author: 'Quackel' },
  { text: 'When did you last trust your gut — and were you right?', theme: 'Decisions & Regret', author: 'Quackel' },
  { text: 'What important decision are you making with someone else\'s voice in your head instead of your own?', theme: 'Decisions & Regret', author: 'Quackel' },
  { text: 'What would you decide today if you weren\'t waiting for more certainty?', theme: 'Decisions & Regret', author: 'Quackel' },
  { text: 'What regret do you carry quietly — and what has it changed in you?', theme: 'Decisions & Regret', author: 'Quackel' },
  { text: 'What would it feel like to finally decide the thing you\'ve been circling for months?', theme: 'Decisions & Regret', author: 'Quackel' },

  // Seasons, Transitions & Endings
  { text: 'What season of life are you currently in — and what does this season ask of you?', theme: 'Seasons & Transitions', author: 'Quackel' },
  { text: 'What are you in the middle of right now that you\'ll look back on as important?', theme: 'Seasons & Transitions', author: 'Quackel' },
  { text: 'What is ending in your life right now, even if nothing dramatic has happened?', theme: 'Seasons & Transitions', author: 'Quackel' },
  { text: 'What transition have you been resisting that life is pushing you through anyway?', theme: 'Seasons & Transitions', author: 'Quackel' },
  { text: 'What were you this time last year — and what has changed?', theme: 'Seasons & Transitions', author: 'Quackel' },
  { text: 'What beginning in your life deserves more celebration than you\'ve given it?', theme: 'Seasons & Transitions', author: 'Quackel' },
  { text: 'What are you holding onto from a past chapter that no longer belongs in this one?', theme: 'Seasons & Transitions', author: 'Quackel' },
  { text: 'What does this time of year bring up in you — and where does that come from?', theme: 'Seasons & Transitions', author: 'Quackel' },
  { text: 'What are you in the process of becoming right now?', theme: 'Seasons & Transitions', author: 'Quackel' },
  { text: 'What would it look like to end this year differently than you began it?', theme: 'Seasons & Transitions', author: 'Quackel' },

  // Community & The World
  { text: 'What kind of world do you want to leave behind — and what are you doing about it?', theme: 'Community & The World', author: 'Quackel' },
  { text: 'What injustice do you witness regularly that you\'ve learned to look away from?', theme: 'Community & The World', author: 'Quackel' },
  { text: 'How do you show up for strangers — and does that align with who you think you are?', theme: 'Community & The World', author: 'Quackel' },
  { text: 'What would you do if you knew your actions would set the example for everyone around you?', theme: 'Community & The World', author: 'Quackel' },
  { text: 'What does your community look like — and is it the one you want?', theme: 'Community & The World', author: 'Quackel' },
  { text: 'What is something small you could do for someone today that would genuinely matter to them?', theme: 'Community & The World', author: 'Quackel' },
  { text: 'When did a stranger last surprise you with their kindness?', theme: 'Community & The World', author: 'Quackel' },
  { text: 'What do you wish the people around you understood about what the world needs right now?', theme: 'Community & The World', author: 'Quackel' },
  { text: 'What problem in your immediate community could you actually do something about?', theme: 'Community & The World', author: 'Quackel' },
  { text: 'What does belonging feel like to you — and where do you feel it most?', theme: 'Community & The World', author: 'Quackel' },

  // Playfulness, Joy & Lightness
  { text: 'When did you last laugh until it hurt — and who were you with?', theme: 'Playfulness & Joy', author: 'Quackel' },
  { text: 'What makes you childishly, unashamedly happy?', theme: 'Playfulness & Joy', author: 'Quackel' },
  { text: 'What would you do purely for fun this week if you let yourself?', theme: 'Playfulness & Joy', author: 'Quackel' },
  { text: 'When did you last play — not exercise, not relax, but actually play?', theme: 'Playfulness & Joy', author: 'Quackel' },
  { text: 'What brings you joy that has no practical justification whatsoever?', theme: 'Playfulness & Joy', author: 'Quackel' },
  { text: 'What makes you come alive in a room full of people?', theme: 'Playfulness & Joy', author: 'Quackel' },
  { text: 'What is something delightfully weird about you that you love?', theme: 'Playfulness & Joy', author: 'Quackel' },
  { text: 'When did you last do something purely because it made you happy?', theme: 'Playfulness & Joy', author: 'Quackel' },
  { text: 'What used to make you happy as a kid that you\'ve drifted away from?', theme: 'Playfulness & Joy', author: 'Quackel' },
  { text: 'If you had a completely free Saturday with no obligations, what would you actually do?', theme: 'Playfulness & Joy', author: 'Quackel' },

  // Wildcard & Perspective Shifts
  { text: 'What is something you changed your mind about this year?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What would you think about your life if you were seeing it from the outside?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What is something everyone around you believes that you quietly question?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What is a story you tell about yourself that you\'re not sure is true anymore?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What would happen if you assumed the best about people today instead of the worst?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What does a stranger observing your life for a week likely see that you don\'t?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What would change if you took full responsibility for where you are right now?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What would you notice about today if it were the last one you had?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What is something that used to feel impossible that now feels ordinary?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What is the most interesting thing about your life that you rarely talk about?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What would you do today if you believed you were already enough?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What has been the unexpected gift hidden inside your hardest experience?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What would you say to yourself in ten years if you could?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What would you stop waiting for if you knew the permission was never coming?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What is something true about you today that wasn\'t true five years ago?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What do you know now that you wish you\'d known at the start of this year?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What chapter of your life are you currently in — and what is its title?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What small thing happened this week that you almost missed but are glad you didn\'t?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What would your life look like if you stopped apologising for who you are?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'What is the most honest thing you could say about where you are right now?', theme: 'Perspective Shifts', author: 'Quackel' },
  { text: 'If today were the start of the rest of your life, what would you begin?', theme: 'Perspective Shifts', author: 'Quackel' },
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

  for (const q of questions) {
    while (scheduled.has(candidate.toISOString().split('T')[0])) {
      candidate.setDate(candidate.getDate() + 1)
    }
    const dateKey = candidate.toISOString().split('T')[0]
    toInsert.push({ ...q, scheduledDate: new Date(dateKey), createdBy: admin._id })
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
