const Country = require('../models/Country');

const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find({});
    res.status(200).json({ countries });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = { getAllCountries };