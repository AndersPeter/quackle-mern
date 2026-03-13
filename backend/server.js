const express = require("express");
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const dotenv = require("dotenv").config();
const path = require('path')
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require('./config/db')
const { startReminderCron } = require('./utils/reminderCron')
const PORT = process.env.PORT || 5001;

connectDB()

const app = express();

// Security headers
app.use(helmet())

// CORS — only needed in dev (same-origin in production)
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))
}

// General API rate limit — 100 req / 15 min
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Strict rate limit for auth — 10 attempts / 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' },
})
app.use('/api/users/login', authLimiter)
app.use('/api/users', authLimiter) // covers register

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ limit: '10kb', extended: false }))

// Strip $ and . from user input to block NoSQL injection
app.use(mongoSanitize())

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/quacks", require("./routes/quackRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/build')
  app.use(express.static(buildPath))
  app.get('*', (_, res) => res.sendFile(path.join(buildPath, 'index.html')))
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
  startReminderCron()
});
