const express=require('express')
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');

const error=require('../middleware/error')
const polygonRouter = require('../routes/city');
const userRouter=require('../routes/user')
const authRouter=require('../routes/auth')
const toiletRouter=require('../routes/toilet')
const jettiesRouter=require("../routes/jetties")
const whadjuksRouter=require("../routes/whadJuks")

module.exports=function(app){
app.use(error)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', polygonRouter);
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use("/api/toilet",toiletRouter)
app.use("/api/jetties",jettiesRouter)
app.use("/api/whadjuks",whadjuksRouter)

// app.use('/apis',mapBoxError)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
}