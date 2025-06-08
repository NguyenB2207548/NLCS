const express = require('express');
const app = express();
require('dotenv').config();
const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const carRouter = require('./routes/car');
const rentalRouter = require('./routes/rental');
const payRouter = require('./routes/pay');

app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/car', carRouter);
app.use('/rental', rentalRouter);
app.use('/pay', payRouter);

app.listen(port, () => {
    console.log('Server-running');
})