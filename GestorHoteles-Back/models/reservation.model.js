'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservationShema = Schema ({
    numberRoom: String,
    dateinit: String,
    dateEnd: String,
    price: String,
});