const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    route_id: { type: String, required: true, unique: true },
    agency_id: { type: String, required: true },
    route_short_name: { type: String, required: true },
    route_long_name: { type: String, required: true },
    route_desc: { type: String },
    route_type: { type: Number, required: true },
    route_url: { type: String },
    route_color: { type: String },
    route_text_color: { type: String }
});

module.exports = mongoose.model('Route', routeSchema, 'halifax_routes');