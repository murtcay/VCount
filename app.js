const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// routes
const countryRouter = require('./routes/countryRoutes');

// middleware
app.use(express.json());

app.use('/countries', countryRouter);

const start = async () => {
  try {
    app.listen(PORT, console.log(`Server is listening on port: ${PORT}...`));
  } catch (error) {
    console.log(error.message);
  }
};

start();