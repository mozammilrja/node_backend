const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const morgan = require("morgan"); 
const colors = require("colors"); 
const fileupload = require('express-fileupload')
const cookieParser = require("cookie-parser");
const connectDB = require('./config/db')
const errorHandler = require("./middleware/error")


// Load env vars
dotenv.config({ path: './config/config.env' })

connectDB()

// Route files
const bootcampas = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')


const app = express();

// Body parser
app.use(express.json())

// cookie parser
app.use(cookieParser())

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// file uploading

app.use(fileupload())

// Mount routers
app.use('/api/v1/bootcamps', bootcampas)
app.use('/api/v1/courses', courses)
app.use("/api/v1/auth", auth);
app.use(errorHandler)



const PORT = process.env.PORT || 5000;

const Server =  app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandle promise rejections

process.on('Unhandled Rejections', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // close server & exit process
  Server.close(() => process.exit(1 ))
})