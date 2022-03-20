// import dependencies
const bcrypt = require('bcrypt');

// import db
const db = require('../config/db/db');

module.exports = {

    register(req, res, next) {
        const { username, password } = req.body;

        const hash = bcrypt.hashSync(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, results) => {
            if (err) {
                return next(err);
            }
            res.json({ message: 'user successfully created.' });
        });
    },

    getUser(req, res, next) {
        if (req.user) {
            res.json({ user: { username: req.user.username } });
        } else {
            res.status(401).json({ error: 'No user is logged in.' });
        }
    },

    login(req, res, next) {
        const { username, password, role } = req.body;

        const errors = [];

        if (!username || !password) {
            errors.push('Field(s) missing');
        }
        if (typeof username !== 'string' || typeof password !== 'string') {
            errors.push('Not strings');
        }

        if (errors.length > 0) {
            return res.status(400).json({ error: errors[0] });
        }

        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) {
                throw err;
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Incorrect credentials.' });
            }

            try {
                const matches = await bcrypt.compare(password, results[0].password);
                if (matches) {
                    req.session.auth = { userId: results[0].id };
                    res.json({ message: 'Log in successful.' });
                } else {
                    res.status(401).json({ message: 'Incorrect credentials.' });
                }
            } catch (err) {
                next(err);
            }

        });
    },

    logout(req, res, next) {
        if (!req.user) {
            return res.json();
        }

        req.session.auth = 0;
        res.json({ message: 'Successfully logged out.' });
    },

    deserializeUser(req, res, next) {
        if (req.session.auth && req.session.auth !== 0) {
            db.query('SELECT * FROM users WHERE id = ?', [req.session.auth.userId], (err, results) => {
                if (err) {
                    throw err;
                }
                req.user = results[0];
                next();
            });
        } else {
            next();
        }
    }
};