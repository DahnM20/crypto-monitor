const MongoClient = require('mongodb').MongoClient;

let db;

const mongoConnect = async () => {
    const client = await MongoClient.connect(process.env.MONGODB_URL);
    db = client.db(process.env.MONGODB_NAME);
    console.log("Connected successfully to server");
}

const walletFindAll = async () => {
    return await db.collection('wallet').find({}).limit(15000).toArray();
}

const insertAssetInWallet = async (asset) => {
    if(asset.hasOwnProperty('id') && asset.hasOwnProperty('name') && asset.hasOwnProperty('quantity')){
        await db.collection("wallet").insertOne(asset);
        return true;
    }
    return false;
}

const watchlistFindAll = async () => {
    return await db.collection('watchlist').find({}).toArray();
}

const insertInWatchlist = async(asset) => {
    if(asset.hasOwnProperty('name') && asset.hasOwnProperty('marketcap') && asset.hasOwnProperty('site')){
        await db.collection("watchlist").insertOne(asset);
        return true;
    }
    return false;
}

const updateNoteWatchlist = async(name, note) => {
    let result = await db.collection("watchlist").updateOne({'name' : name}, {$set : {'note' : note} } );
    return result
}

const getWalletLastTotalValue = async () => {
    return await db.collection('wallet-value').find().limit(1).sort( { id: -1 } ).toArray();
}

const walletValuesFindAll = async () => {
    return await db.collection('wallet-value').find().sort( { id: 1 } ).toArray();
}

const updateWalletAsset = async(asset) => {
    let result = await db.collection("wallet").updateOne({'name' : asset.name}, {$set : asset} );
    return result
}

const updateWalletAssetQuantityByName = async(name, quantity) => {
    let result = await db.collection("wallet").updateOne({'name' : name}, {$set : {'quantity' : quantity} } );
    return result
}

const insertWalletValue = async(totalValue) => {
    const lastValue = await getWalletLastTotalValue();
    const newId = lastValue[0].id + 1;
    await db.collection("wallet-value").insertOne({"value" : totalValue, "date" : getCurrentDate(), "id": newId});
}

module.exports = {
    insertAssetInWallet,
    insertInWatchlist,
    insertWalletValue,
    updateNoteWatchlist,
    updateWalletAssetQuantityByName,
    updateWalletAsset,
    walletValuesFindAll,
    getWalletLastTotalValue,
    watchlistFindAll,
    walletFindAll,
    mongoConnect
}


const paddingWithOneZero = (element) => {
    return (element < 10 ? '0' + element : element)
}
const  getCurrentDate = () => {
    // current timestamp in milliseconds
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
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
