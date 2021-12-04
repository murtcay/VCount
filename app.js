require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// database
const connectDB = require('./db/connection');

// routes
const countryRouter = require('./routes/countryRoutes');

// middleware
app.use(express.json());

app.use('/', countryRouter);

const start = async () => {
  try {
    // DB Connection
    await connectDB(process.env.MONGO_URL);
    console.log('CONNECTED TO DB !!!');
    app.listen(PORT, console.log(`Server is listening on port: ${PORT}...`));
  } catch (error) {
    console.log(error.message);
  }
};

start();