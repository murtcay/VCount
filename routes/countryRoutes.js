const express = require('express');
const router = express.Router();

const { getAllCountries, salesReprestative} = require('../controllers/countryController');

router.get('/countries', getAllCountries);
router.get('/salesrep', salesReprestative);

module.exports = router;