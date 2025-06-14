const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const carRouter = require('./routes/car');
const rentalRouter = require('./routes/rental');
const payRouter = require('./routes/pay');

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

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