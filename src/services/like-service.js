const { LikeRepository, TweetRepository, CommentRepository } = require('../repository/index');

class LikeService{
    constructor(){
        this.likeRepoObj = new LikeRepository();
        this.tweetRepoObj = new TweetRepository();
        this.commentRepoObj = new CommentRepository();
    }

    async toogleLike(modelId, modelType, userId){  // api/v1/likes/toogle?id=modelId&type=modelType
        let isAdded;
        let likeable;
        if(modelType === 'Tweet'){
            likeable = await this.tweetRepoObj.get(modelId);
        }
        else if(modelType === 'Comment'){
            likeable = await this.commentRepoObj.get(modelId);
        }
        else{
            throw new Error('unknown model name given');
        }

        const exists = await this.likeRepoObj.findByUserAndLikeable({
            user : userId,
            onModel : modelType,
            likeable : modelId
        })

        if(exists){
            likeable.likes.pull(exists.id);
            await likeable.save();
            await exists.deleteOne();
            isAdded = false;
        }
        else{
            const newLike = await this.likeRepoObj.create( {
                user : userId,
                onModel : modelType,
                likeable : modelId
            });

            likeable.likes.push(newLike);
            await likeable.save();
            isAdded = true;
        }

        return isAdded;
    }
}

module.exports = LikeService;