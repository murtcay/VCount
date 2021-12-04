require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// database
const connectDB = require('./db/connection');

// controllers
const { 
  getAllCountries, 
  salesReprestative, 
  getOptimal
} = require('./controllers/countryController');

// middleware
const notFoundMiddleware = require('./middleware/not-found');

app.use(express.json());

app.get('/countries', getAllCountries);
app.get('/salesrep', salesReprestative);
app.get('/optimal', getOptimal);

app.use(notFoundMiddleware);

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