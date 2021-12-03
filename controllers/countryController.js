const Country = require('../models/Country');

const getAllCountries = async (req, res) => {
  try {
    const { region } = req.query;
    const queryObject = {};
    if(region) {
      // regex for case insensitivity
      queryObject.region = { $regex: region, $options: 'i' };
    }

    const countries = await Country.find(queryObject).select('-_id name region');
    res.status(200).json({ countries });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = { getAllCountries };