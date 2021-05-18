'use strict'

const express = require('express');
const userController = require('../controllers/user.controller');
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/users'})

var api = express.Router();

/*Post */
api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);
api.post('/search', userController.search);

/* Get */
api.get('/getUsers', userController.getUsers);
api.get('/getImage/:fileName', [upload], userController.getImage); 

/* Put*/
api.put('/:userId/updateUser',userController.updateUser);
api.put('/:userId/removeUser',userController.removeUser);
api.put('/:userId/uploadImage',[upload],userController.uploadImage);  
 

module.exports = api;