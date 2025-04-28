require('dotenv').config();
const express       = require('express');
const helmet        = require('helmet');
const cors          = require('cors');
const morgan        = require('morgan');
const rateLimit     = require('express-rate-limit');

const authRouter    = require('./routes/authRoutes');
const gameRouter    = require('./routes/gameRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Env‐var check omitted for brevity

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(morgan('tiny'));
app.use(express.json());

app.use(
  '/api/auth/login',
  rateLimit({ windowMs: 5*60e3, max: 5, message:{error:'Too many login attempts'} })
);
app.use(
  '/api/',
  rateLimit({ windowMs: 15*60e3, max:100, message:{error:'Too many requests'} })
);

app.use('/api/auth', authRouter);
app.use('/api/game', gameRouter);

app.use((req,res)=> res.status(404).json({error:'Not Found'}));
app.use(errorMiddleware);

const PORT = process.env.PORT||5000;
app.listen(PORT, ()=> console.log(`🚀 Server on port ${PORT}`));