const Country = require('../models/Country');
const axios = require('axios').default;
const url = require('url');

const getAllCountries = async (req, res) => {
  try {
    const { region } = req.query;
    const queryObject = {};
    if(region) {
      // regex for region name
      queryObject.region = { $regex: region, $options: 'i' };
    }

    const countries = await Country.find(queryObject).select('-_id name region');
    res.status(200).json({ countries });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const salesReprestative = async (req, res) => {
  try {
    
    const { host } = req.headers;

    const {data:{countries:countryList}} = await axios.get(`http://${host}/countries`);

    const regionsWithCountries = {};

    countryList.forEach(country => {

      if(!regionsWithCountries[`${country.region}`]) {
        regionsWithCountries[`${country.region}`] = [];
      }

      regionsWithCountries[`${country.region}`].push(country.name);
    });

    const salesReps = [];

    for (const region in regionsWithCountries) {
      if (Object.hasOwnProperty.call(regionsWithCountries, region)) {

        const countryNumber = regionsWithCountries[region].length;

        let minSalesReq = Math.floor(countryNumber / 7);

        if((countryNumber % 7) !== 0) {minSalesReq++;}

        let maxSalesReq = Math.floor(countryNumber / 3);
          
        salesReps.push({
          region,
          minSalesReq,
          maxSalesReq
        });
      }
    }
    
    res.status(200).json( salesReps );
    
  } catch (error) {
    res.status(400).json({msg: error.message});
  }
};

module.exports = { getAllCountries, salesReprestative };