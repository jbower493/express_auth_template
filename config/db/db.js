let db;

if (process.env.NODE_ENV === 'test') {
    db = require('./dbTest');
} else if (process.env.NODE_ENV === 'dev') {
    db = require('./dbDev');
} else {
    db = require('./dbProd');
}

module.exports = db;