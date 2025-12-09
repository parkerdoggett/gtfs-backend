const express = require('express');
const router = express.Router();
const apiCheck = require('../middleware/apiCheck');

router.use(apiCheck);

router.get('/vehicles', (req, res) => {
    try {
        const gtfs = require('../gtfs');
        const data = gtfs.getVehiclePositions();
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = router;