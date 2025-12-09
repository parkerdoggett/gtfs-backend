require('dotenv').config({path: './.env'});

const express = require('express');
const mongoose = require('mongoose');
const gtfs = require('./gtfs');

const app = express();
const PORT = process.env.PORT || 8080;

const DB_CONNECTION_STRING = process.env.MONGODB_URI

const ApiKeys = require('./modals/ApiKey');
const apiChecker = require('./middleware/apiCheck');
const ApiKey = require('./modals/ApiKey');
const Calendar = require('./modals/Calendar');
const Route = require('./modals/Route');
const Stop = require('./modals/Stop');
const StopTime = require('./modals/StopTime');
const Trip = require('./modals/Trip');


app.use(express.json());

const utilityRoutes = require('./routes/utilities');
const staticRoutes = require('./routes/static');

app.use('/utilities', utilityRoutes);
app.use('/static', staticRoutes);


async function main() {
    try {
        await mongoose.connect(DB_CONNECTION_STRING);
        console.log("mongodb connected");

        gtfs.startRealtimeUpdates();
        console.log("realtime updates started (vehicle positions)");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    } catch(error) {
        console.error(`Startup error occured: `, error.message);
    }
}

main();