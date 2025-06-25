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
const brandRouter = require('./routes/brand');
const adminUser = require('./routes/admin/adminUser');
const adminCar = require('./routes/admin/adminCar');
const adminContract = require('./routes/admin/adminContract');
const statsRouter = require('./routes/stats')

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
app.use('/brand', brandRouter);
app.use('/stats', statsRouter);
app.use('/admin/user', adminUser);
app.use('/admin/car', adminCar);
app.use('/admin/contract', adminContract);

app.listen(port, () => {
    console.log('Server-running');
})