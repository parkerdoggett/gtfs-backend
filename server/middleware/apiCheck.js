const ApiKey = require('../modals/ApiKey');

module.exports = async function apiCheck(req, res, next) {
    const apiKey = req.header('x-api-key');
    if (!apiKey) {
        return res.status(401).json({ error: 'API key missing' });
    }
    const keyExists = await ApiKey.findOne({ key: apiKey });
    if (!keyExists) {
        return res.status(403).json({ error: 'Invalid API key' });
    }
    next();
}