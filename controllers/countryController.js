const Country = require('../models/Country');
const axios = require('axios').default;
const url = require('url');

const getAllCountries = async (req, res) => {
  try {
    const { region } = req.query;
    const queryObject = {};
    if(region) {
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

    const countryList = await sendCounrtyListRequest(host);

    const regionsWithCountries = getRegionsWithCountries(countryList);

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

const getOptimal = async (req, res) => {
  try {
    
    const { host } = req.headers;

    const countryList = await sendCounrtyListRequest(host);

    const regionsWithCountries = getRegionsWithCountries(countryList);
    
    const roster = [];

    for (const region in regionsWithCountries) {
      if (Object.hasOwnProperty.call(regionsWithCountries, region)) {

        const countryNumber = regionsWithCountries[region].length;

        let minSalesReq = Math.floor(countryNumber / 7);
        if((countryNumber % 7) !== 0) {minSalesReq++;}

        const n = Math.floor(countryNumber / minSalesReq);
        let m = regionsWithCountries[region].length % minSalesReq;

        const tempArr = [];
        
        // store last m countries in tempArr
        for(let i = 0; i < m; i++) {
          tempArr.push(regionsWithCountries[region].pop());
        }
        // create new array its all elements have same country number = n
        const countries = new Array(Math.ceil(minSalesReq)).fill().map(
          _ => regionsWithCountries[region].splice(0, n)
        );
        
        // push back the countries from tempArr one by one into countries array
        for(let i = 0; i < m; i++) {
          countries[i].push(tempArr.pop());
        }

        countries.forEach(countryArr => {
          // push each object in roseter array
          roster.push({
            region,
            countryList: countryArr,
            countryCount: countryArr.length
          });
        });
      }
    }
    res.status(200).json( roster );
    
  } catch (error) {
    res.status(400).json({msg: error.message});
  }
};

async function sendCounrtyListRequest(host) {
  try {
    const {data:{countries:countryList}} = await axios.get(`http://${host}/countries`);
    return countryList;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

function getRegionsWithCountries(countryList) {
  const regionsWithCountries = {};
  
  if(countryList.length) {
    for (let country of countryList) {
      if(!country.region || !country.name ) {
        break;
      }
      else {
        if(!regionsWithCountries[`${country.region}`]) {
          regionsWithCountries[`${country.region}`] = [];
        }
        regionsWithCountries[`${country.region}`].push(country.name);
      }
    }
  }

  return regionsWithCountries;
}

module.exports = { getAllCountries, salesReprestative, getOptimal };