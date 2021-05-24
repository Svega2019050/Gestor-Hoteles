'use strict'

const express = require('express');
const userController = require('../controllers/user.controller');
const mdAuth = require('../middlewares/authenticated');
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({ uploadDir: './uploads/users'})

var api = express.Router();

/*Post */
api.post('/saveUser', userController.saveUser);
api.post('/saveUserByAdmin/:userId', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],userController.saveUserByAdmin);
api.post('/login', userController.login);
api.post('/search', userController.search);

/* Get */
api.get('/getUsers', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],userController.getUsers);
api.get('/getImage/:fileName', [upload], userController.getImage); 

/* Put*/
api.put('/updateUser/:userId',[mdAuth.ensureAuth],userController.updateUser);
api.put('/removeUser/:userId',[mdAuth.ensureAuth],userController.removeUser);
api.put('/:userId/uploadImage',[mdAuth.ensureAuth,upload],userController.uploadImage);  
 

module.exports = api;