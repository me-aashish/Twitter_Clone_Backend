const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true,
        max : [250, "Content can't be more than 250 characters"]
    },
    hashtags: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Hashtag'
        }
    ],
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Like'
        }
    ]
}, {timestamps : true})

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;