const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const hospitalAddress = new Schema({
    postal_code: Number,
    address: String,
    districts: String,
    phone: String,
    fax: String,
    email: String
});

const hospitalSchema = new Schema({
    code: Number,
    name: String,
    type: String,
    class: String,
    owner: String,
    location: hospitalAddress,
    last_update: Date
    // last_update: {
    //     type: Date,
    //     default: '0000-00-00'
    // }
});

module.exports = mongoose.model('Hospital', hospitalSchema);