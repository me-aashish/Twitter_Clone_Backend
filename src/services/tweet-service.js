const { TweetRepository, HashtagRepository } = require('../repository/index');
const Tweet = require('../model/tweet');

class TweetService{

    constructor(){
        this.tweetRepository = new TweetRepository();
        this.hashtagRepository = new HashtagRepository();
    }

    async create(data){
        try {

            const content = data.content;
            let tags = content.match(/#[a-zA-Z0-9_]+/g);
            tags = tags.map( (tag) => tag.substring(1));

            const tweet = await this.tweetRepository.create(data);

            /**
             * todo create hashtags - 
             *  1. bulkcreate in mongoose
             *  2. filter title of hashtags based on multiple tags
             *  3. how to add tweet id inside all the hashtags
            */
            
            let alreadyPresentTags = await this.hashtagRepository.findByNameTitleOnly(tags);
            let titleOfPresetnTags  = alreadyPresentTags.map((tags) => tags.title);
            let newTags = tags.filter((tag) => !titleOfPresetnTags.includes(tag));
            
            newTags = newTags.map(tag => {
                return {
                    title : tag,
                    tweets : [tweet.id]
                }
            })

            alreadyPresentTags = await this.hashtagRepository.findByName(tags);
            alreadyPresentTags.forEach((tag) => {
                tag.tweets.push(tweet.id);
                tag.save();
            })

            await this.hashtagRepository.bulkCreate(newTags);

            let allTags = await this.hashtagRepository.findByName(tags);
            let allTagsId = allTags.map((tags) => tags._id)
            console.log(allTagsId)
            
            const newTweet = await Tweet.findByIdAndUpdate(tweet._id, 
                { $addToSet: { hashtags: { $each:  allTagsId } } }
            )

            return newTweet;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }
    
}

module.exports = TweetService;