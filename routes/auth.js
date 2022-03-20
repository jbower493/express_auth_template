// import dependencies
const express = require('express');

// import controllers
const authController = require('../controllers/authController.js');

// import access control methods
const access = require('../access_control');

// create auth router
const authRouter = express.Router();


// POST /auth/create-admin
// ACCESS: no users or admin exist
authRouter.post('/register', access.notLoggedIn, authController.register);

// GET /auth/get-user
// ACCESS: PUBLIC
authRouter.get('/get-user', authController.getUser);

// POST /auth/login
// ACCESS: not logged in USER
authRouter.post('/login', access.notLoggedIn, authController.login);

// GET /auth/logout
// ACCESS: logged in USER
authRouter.get('/logout', access.loggedInUser, authController.logout);


// export auth router for use in server.js
module.exports = authRouter;