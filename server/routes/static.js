const express = require('express');
const router = express.Router();
const apiCheck = require('../middleware/apiCheck');

router.use(apiCheck);

router.get('/routes', async (req, res) => {
    try {
        const Route = require('../modals/Route');
        const routes = await Route.find({});
        res.json(routes);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/routes/:id', async (req, res) => {
    try {
        const searchId = req.params.id;
        const Route = require('../modals/Route');
        const result = await Route.findOne({ route_id : searchId });
        if (!result) {
            return res.status(404);
        } else {
            return res.json(result);
        }
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/stops', async (req, res) => {
    try {
        const Stop = require('../modals/Stop');
        const stops = await Stop.find({});
        res.json(stops);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error'});
    }
})

router.get('/stops/:id', async (req, res) => {
    try {
        const searchId = req.params.id;
        const Stop = require('../modals/Stop');
        const result = await Stop.findOne({ stop_id : searchId });
        if (!result) {
            return res.status(404);
        } else {
            return res.json(result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/trips/:id', async (req, res) => {
    try {
        const searchId = req.params.id;
        const Trips = require('../modals/Trip');
        const result = Trips.findOne({ trip_id : searchId });

        if (!result) {
            return res.status(404);
        } else {
            return res.json(result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/stoptimes', async (req, res) => {
    try {
        const tripId = req.query.tripId;
        const stopId = req.query.stopId;

        if (!tripId || !stopId) {
            return res.status(400).json({ error: "Missing required parameters" });
        }
        
        const StopTime = require('../modals/StopTime');
        const result = await StopTime.findOne({trip_id : tripId, stop_id : stopId});

        if (!result) {
            return res.status(404);
        } else {
            return res.json(result);
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;