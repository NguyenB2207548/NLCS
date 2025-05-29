const express = require('express');
const app = express();
require('dotenv').config();
const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');

app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/', homeRouter);
app.use('/login', authRouter);

app.listen(port, () => {
    console.log('Server-running');
})