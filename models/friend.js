const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const friendSchema = new Schema({
    nama: {
        type: String,
        required: true
    },
    alamat: {
        type: String,
        required: true
    },
    umur: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Friend', friendSchema);