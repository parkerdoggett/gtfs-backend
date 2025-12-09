const express = require('express');
const router = express.Router();
const apiCheck = require('../middleware/apiCheck');
const gtfs = require('../gtfs');

router.use(apiCheck);

// list all active vehicles streaming gtfs
router.get('/vehicles', (req, res) => {
    try {
        const data = gtfs.getVehiclePositions();
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// search vehicles by id
router.get('/vehicles/:id', (req, res) => {
    try {
        const searchId = req.params.id;
        
        const cacheObj = gtfs.getVehiclePositions();

        const vehicleArray = cacheObj.vehicles || [];

        const filteredData = vehicleArray.filter(vehicle =>
            vehicle.vehicle && (vehicle.vehicle.id === searchId || vehicle.id === searchId)
        );

        res.json(filteredData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// list all alerts
router.get('/alerts', (req, res) => {
    try {
        const data = gtfs.getAlerts();
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = router;