const Tweet = require('../model/tweet');

class TweetRepository{

    constructor(){}

    async create(data){
        try {
            const tweet = await Tweet.create(data);
            return tweet;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async get(id){
        try {
            const tweet = await Tweet.findById(id);
            return tweet;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAll(offset, limit) {
        try {
            const tweet = await Tweet.find().skip(offset).limit(limit);
            return tweet;
        } catch (error) {
            console.log(error);
            throw error;
        }
    } 

    async getWithComments(id){
        try {
            const tweet = await Tweet.findById(id).populate({ 
                path : 'comments',
                populate : {
                    path : 'comments'
                }
         }).lean().limit(10).sort({ 'createdAt' : -1});
            return tweet;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    async destroy(id){
        try {
            await Tweet.findByIdAndRemove(id);
            return true;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = TweetRepository