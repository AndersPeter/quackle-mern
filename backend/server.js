const express = require("express");
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require('./config/db')
const { startReminderCron } = require('./utils/reminderCron')
const PORT = process.env.PORT || 5001;

connectDB()

const app = express();

// Security headers
app.use(helmet())

// CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000']

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

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

app.get("/", (_, res) => {
  res.status(200).json({ message: "Welcome to the Quackel API" });
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/quacks", require("./routes/quackRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
  startReminderCron()
});
