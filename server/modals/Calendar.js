const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
    service_id: { type: String, required: true, unique: true },
    monday: { type: Number, enum: [0, 1], required: true },
    tuesday: { type: Number, enum: [0, 1], required: true },
    wednesday: { type: Number, enum: [0, 1], required: true },
    thursday: { type: Number, enum: [0, 1], required: true },
    friday: { type: Number, enum: [0, 1], required: true },
    saturday: { type: Number, enum: [0, 1], required: true },
    sunday: { type: Number, enum: [0, 1], required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true }
});

module.exports = mongoose.model('Calendar', calendarSchema, 'halifax_routes');