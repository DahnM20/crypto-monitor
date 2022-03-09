//UNUSED
var Twitter = require('twitter');
 
var twitterClient = new Twitter({
  consumer_key: 'GTOULM1MxwxNbuF2vl6mCGMFC',
  consumer_secret: 'RMZYx4yRdHgyR4y6FGQDriCNrC4bfhcKLnZtXr3ghEBRu67q8G',
  access_token_key: '1356852971326365697-NBwUDLGj53aZSl2mGhibMJR0xEkss9',
  access_token_secret: 'jCzzEiQl2Reme8jRgkFjCAUidYKKMHBVWBSYQYHyNPdB8'
});
 
const nbMaxTweet = 100;
const option_no_retweet = ' -is:retweet';
const type = 'mixed'; //popular/mixed/recent
let query = "Algorand OR Cumrocket";


function changeQuery(q){
    console.log("Changement de query : " + q)
    query = q;
}

async function executeTwitterQuery(){

    let tweets = await twitterClient.get('search/tweets', {q: query + option_no_retweet, count: nbMaxTweet, result_type: type})
    essentialData = [];
    
    for(tweet of tweets.statuses){
        essentialData.push({
            'id' : tweet.id_str,
            'text' : tweet.text,
            'created_at' : tweet.created_at,
            'author' : tweet.user.screen_name,
            'author_image' : tweet.user.profile_image_url_https,
            'author_nb_follower' : tweet.user.followers_count,
            'rt' : tweet.retweet_count,
            'fav' : tweet.favorite_count,
            'link' : 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str
        })
    }
    
    // console.log(essentialData);
    // console.log(essentialData.length);
    return essentialData;
}

exports.executeTwitterQuery = executeTwitterQuery;
exports.changeQuery = changeQuery;