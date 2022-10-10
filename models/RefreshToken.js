
const mongoose = require('mongoose');
const Schema = mongoose.Schema


const RefreshTokenSchema = new Schema({
    token : {
        type: String,
        require: true
    }
}, {timestamps : true})

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema );

module.exports = RefreshToken;