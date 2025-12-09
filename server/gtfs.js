const fetch = require('node-fetch').default;
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

const VEHICLE_POSITIONS_URL = 'https://gtfs.halifax.ca/realtime/Vehicle/VehiclePositions.pb';
const ALERTS_URL = 'https://gtfs.halifax.ca/realtime/Alert/Alerts.pb';
const UPDATE_INTERVAL_MS = 15000;

let realtimeDataCache = {
    vehicles: [],
    timestamp: null
};

let realtimeAlertsCache = {
    alerts: [],
    timestamp: null
};

async function fetchAndCacheVehiclePositions() {
    try{
        const response = await fetch(VEHICLE_POSITIONS_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();

        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
            new Uint8Array(buffer)
        );

        const vehiclePositions = [];

        feed.entity.forEach((entity => {
            if (entity.vehicle) {
                vehiclePositions.push(entity.vehicle);
            }
        }));

        realtimeDataCache.vehicles = vehiclePositions;

        realtimeDataCache.timestamp = feed.header.timestamp.low;

    } catch (error) {
        console.error('Error in parsing vehicle position data: ', error.message);
    }
}

async function fetchAndCacheAlerts() {
    try {
        const response = await fetch(ALERTS_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();

        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
            new Uint8Array(buffer)
        );

        const alerts = [];

        feed.entity.forEach((entity => {
            alerts.push(entity.alert);
        }));

        realtimeAlertsCache.alerts = alerts;

        realtimeAlertsCache.timestamp = feed.header.timestamp.low;
    } catch (err) {
        console.error(`Error parsing alert data: ${error.message}`);
    }
}

function startRealtimeUpdates() {
    fetchAndCacheVehiclePositions();
    setInterval(fetchAndCacheVehiclePositions, UPDATE_INTERVAL_MS);

    fetchAndCacheAlerts();
    setInterval(fetchAndCacheAlerts, UPDATE_INTERVAL_MS);
}

function getVehiclePositions() {
    return realtimeDataCache;
}

function getAlerts() {
    return realtimeAlertsCache;
}

module.exports = {
    startRealtimeUpdates,
    getVehiclePositions,
    getAlerts
};