const mongoose = require('mongoose');

const stopTimeSchema = new mongoose.Schema({
    trip_id: { type: String, required: true },
    arrival_time: { type: String, required: true },
    departure_time: { type: String, required: true },
    stop_id: { type: String, required: true },
    stop_sequence: { type: Number, required: true },
    stop_headsign: { type: String },
    pickup_type: { type: Number, enum: [0, 1, 2, 3], default: 0 },
    drop_off_type: { type: Number, enum: [0, 1, 2, 3], default: 0 },
    shape_dist_traveled: { type: Number },
    timepoint: { type: Number, enum: [0, 1], default: 1 }
});

module.exports = mongoose.model('StopTime', stopTimeSchema, 'halifax_stop_times');