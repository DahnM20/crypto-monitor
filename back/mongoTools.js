const MongoClient = require('mongodb').MongoClient;

let db;

exports.mongoConnect = async () => {
    const url = 'mongodb://192.168.1.14:27017';
    const dbName = 'monitor-crypto-db';

    const client = await MongoClient.connect(url);
    db = client.db(dbName);
    console.log("Connected successfully to server");
}

exports.walletFindAll = async () => {
    return await db.collection('wallet').find({}).toArray();
}

exports.insertAssetInWallet = async () => {
    if(asset.hasOwnProperty('id') && asset.hasOwnProperty('name') && asset.hasOwnProperty('quantity')){
        await db.collection("wallet").insertOne(asset);
        return true;
    }
    return false;
}

exports.watchlistFindAll = async () => {
    return await db.collection('watchlist').find({}).toArray();
}

exports.insertInWatchlist = async(asset) => {
    if(asset.hasOwnProperty('name') && asset.hasOwnProperty('marketcap') && asset.hasOwnProperty('site')){
        await db.collection("watchlist").insertOne(asset);
        return true;
    }
    return false;
}

exports.updateNoteWatchlist = async(name, note) => {
    let result = await db.collection("watchlist").updateOne({'name' : name}, {$set : {'note' : note} } );
    return result
}

exports.getWalletLastTotalValue = async () => {
    return await db.collection('wallet-value').find().limit(1).sort({$natural:-1}).toArray();
}

exports.walletValuesFindAll = async () => {
    return await db.collection('wallet-value').find().sort( { id: 1 } ).toArray();
}

exports.updateWalletAsset = async(asset) => {
    let result = await db.collection("wallet").updateOne({'name' : asset.name}, {$set : asset} );
    return result
}

exports.updateWalletAssetQuantityByName = async(name, quantity) => {
    let result = await db.collection("wallet").updateOne({'name' : name}, {$set : {'quantity' : quantity} } );
    return result
}

exports.insertWalletValue = async(totalValue) => {
    const lastValue = await db.collection('wallet-value').find().limit(1).sort({$natural:-1}).toArray();
    const newId = lastValue[0].id + 1;
    await db.collection("wallet-value").insertOne({"value" : totalValue, "date" : getCurrentDate(), "id": newId});
}


function paddingWithOneZero(element){
    return (element < 10 ? '0' + element : element)
}
function getCurrentDate(){
    // current timestamp in milliseconds
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours() + 2;
    let min = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    month = paddingWithOneZero(month);
    date = paddingWithOneZero(date);
    hour = paddingWithOneZero(hour);
    min = paddingWithOneZero(min);
    seconds = paddingWithOneZero(seconds);

    // prints date & time in YYYY-MM-DD format
    return (year + "-" + month + "-" + date + " " + hour + ':' + min + ':' + seconds);
}
