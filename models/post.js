
const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL ||  'mongodb://127.0.0.1:27017/associate';
mongoose.connect(MONGO_URL)

const postSchema = mongoose.Schema({
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
},
date: {
type: Date,
default: Date.now()
},
content: String,
likes: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
]

})

module.exports = mongoose.model('post', postSchema);