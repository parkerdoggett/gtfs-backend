const fetch = require('node-fetch').default;
const GtfsRealtimeBindings = require('gtfs-realtime-bindings');

const VEHICLE_POSITIONS_URL = 'https://gtfs.halifax.ca/realtime/Vehicle/VehiclePositions.pb';
const UPDATE_INTERVAL_MS = 15000;

let realtimeDataCache = {
    vehicles: [],
    timestamp: null
};

async function fetchAndCacheVehiclePositions() {
    console.log('Beginning vechicle positions fetch...');
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

        console.log(`Vehicles: ${realtimeDataCache.vehicles.length} entities parsed`);
    } catch (error) {
        console.error('Error in parsing vehicle position data: ', error.message);
    }
}

function startRealtimeUpdates() {
    fetchAndCacheVehiclePositions();

    setInterval(fetchAndCacheVehiclePositions, UPDATE_INTERVAL_MS);
}

function getVehiclePositions() {
    return realtimeDataCache;
}

module.exports = {
    startRealtimeUpdates,
    getVehiclePositions,
};