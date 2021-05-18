'use strict'

const express = require('express');
const userController = require('../controllers/user.controller');

var api = express.Router();

/*Post */
api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);
api.post('/search', userController.search);

/* Get */
api.get('/getUsers', userController.getUsers);

/* Put*/


module.exports = api;