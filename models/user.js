
const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL ||  'mongodb://127.0.0.1:27017/associate';
mongoose.connect(MONGO_URL)

const userSchema = mongoose.Schema({
username: String,
name: String,
email: String,
password: String,
age: Number
})

module.exports = mongoose.model('user', userSchema);