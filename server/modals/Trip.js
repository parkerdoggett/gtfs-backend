const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    route_id: { type: String, required: true },
    service_id: { type: String, required: true },
    trip_id: { type: String, required: true, unique: true },
    trip_headsign: { type: String },
    trip_short_name: { type: String },
    direction_id: { type: Number, enum: [0, 1] },
    block_id: { type: String },
    shape_id: { type: String },
    wheelchair_accessible: { type: Number, enum: [0, 1, 2], default: 0 },
    bikes_allowed: { type: Number, enum: [0, 1, 2], default: 0 }
});

module.exports = mongoose.model('Trip', tripSchema, 'halifax_trips');