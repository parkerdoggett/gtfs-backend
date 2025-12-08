const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    stop_id: { type: String, required: true, unique: true },
    stop_code: { type: String },
    stop_name: { type: String, required: true },
    stop_desc: { type: String },
    stop_lat: { type: Number, required: true },
    stop_lon: { type: Number, required: true },
    zone_id: { type: String },
    stop_url: { type: String },
    location_type: { type: Number, default: 0 },
    parent_station: { type: String },
    stop_timezone: { type: String },
    wheelchair_boarding: { type: Number, default: 0 }
});

module.exports = mongoose.model('Stop', stopSchema, 'halifax_stops');