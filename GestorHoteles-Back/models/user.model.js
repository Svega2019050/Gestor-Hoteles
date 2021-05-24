'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    lastname: String,
    username: String,
    password: String,
    email:String,
    phone: Number,
    role: String,
    image: String,
    hotel:[{type:Schema.ObjectId, ref: 'hotel'}]
});

module.exports = mongoose.model('user',userSchema);