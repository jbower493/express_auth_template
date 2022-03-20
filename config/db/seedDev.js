require('dotenv').config();
const db = require('./dbDev');
const statements = require('./sqlStatements');

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('DB connection opened')
    db.query(statements.createUsersTable, (err, results) => {
        if (err) {
            throw err;
        }
        console.log('Users table created');
        db.end(err => {
            if (err) {
                throw err;
            }
            console.log('DB connection closed')
        })
    });
});