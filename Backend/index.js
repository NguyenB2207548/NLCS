const express = require('express');
const app = express();
require('dotenv').config();
const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const carDetailsRouter = require('./routes/carDetails');

app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/', homeRouter);
app.use('/login', authRouter);
app.use('/cars', carDetailsRouter);

app.listen(port, () => {
    console.log('Server-running');
})