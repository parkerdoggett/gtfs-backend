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
            return res.status(404).json({ error: 'Stop not found' });
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
        const result = await Trips.findOne({ trip_id : searchId });

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

router.get('/service/:id', async (req, res) => {
    try {
        const serviceId = req.params.id;

        const Calendar = require('../modals/Calendar');

        const service = await Calendar.findOne({ service_id: serviceId });

        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }

        const today = new Date();

        const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long'}).toLowerCase();
        const todayNumber = (today.getFullYear() * 10000) + ((today.getMonth() + 1) * 100) + today.getDate();

        const gtfsStartDate = parseInt(service.start_date, 10);
        const gtfsEndDate = parseInt(service.end_date, 10);

        const isRunning = (
            todayNumber >= gtfsStartDate &&
            todayNumber <= gtfsEndDate &&
            service[dayOfWeek] === 1
        );

        return res.json({ service_id: serviceId, is_running: isRunning });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/stops/:id/departures', async (req, res) => {
    try {
        const stopId = req.params.id;
        const limit = Number.parseInt(req.query.limit, 10) || 10;

        const StopTime = require('../modals/StopTime');
        const Trip = require('../modals/Trip');

        const now = new Date();
        const nowString = now.toTimeString().slice(0, 8);

        const upcoming = await StopTime.find({
            stop_id: stopId,
            departure_time: { $gte: nowString }
        })
            .sort({ departure_time: 1 })
            .limit(limit)
            .lean();

        if (!upcoming.length) {
            return res.json([]);
        }

        const tripIds = [...new Set(upcoming.map(dep => dep.trip_id))];
        const trips = await Trip.find({ trip_id: { $in: tripIds } }).lean();
        const tripMap = new Map(trips.map(trip => [trip.trip_id, trip]));

        const departures = upcoming.map(dep => ({
            trip_id: dep.trip_id,
            departure_time: dep.departure_time,
            arrival_time: dep.arrival_time,
            stop_sequence: dep.stop_sequence,
            trip: tripMap.get(dep.trip_id) || null
        }));

        return res.json(departures);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;