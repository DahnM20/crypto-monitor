const log = require('loglevel');
const { MongoClient, ObjectID }  = require('mongodb');

let db;

const mongoConnect = async () => {
    const client = await MongoClient.connect(process.env.MONGODB_URL, { useUnifiedTopology: true });
    db = client.db(process.env.MONGODB_NAME);
    log.info("Connected successfully to server");
}

const walletFindAll = async () => {
    return await db.collection('wallet').find({}).toArray();
}

const walletFindAsset = async(name) => {
    return await db.collection('wallet').findOne({'name' : name});
}

const insertAssetInWallet = async (asset) => {
    if(asset.hasOwnProperty('id') && asset.hasOwnProperty('name') && asset.hasOwnProperty('quantity')){
        await db.collection("wallet").insertOne(asset);

        const tx = {
            asset : asset.name,
            quantity : asset.quantity
        }

        await insertTransaction(tx)

        return true;
    }
    return false;
}


const updateWalletAsset = async(asset) => {
    let oldValue = await walletFindAsset(asset.name).quantity
    let result = await db.collection("wallet").updateOne({'name' : asset.name}, {$set : asset} );

    if(oldValue != asset.quantity){
        const tx = {
            asset : asset.name,
            quantity : asset.quantity - oldValue
        }
        await insertTransaction(tx)
    }
    return result
}

const getAllTransaction = async () => {
    return await db.collection('wallet-tx').find({}).toArray();
}

const insertTransaction = async(tx) => {
    tx.timeStamp = getCurrentDate()
    tx.operation = tx.quantity > 0 ? 'add' : 'remove'
    return await db.collection("wallet-tx").insertOne(tx);
}

const removeTransaction = async(_id) => {
    try {
        return await db.collection("wallet-tx").deleteOne({_id : new ObjectID(_id) });
    } catch(e) {
        log.error(`Impossible de supprimer la tx ${_id} `)
    }
}

const updateWalletAssetQuantityByName = async(name, quantity) => {
    let result = await db.collection("wallet").updateOne({'name' : name}, {$set : {'quantity' : quantity} } );
    return result
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
    const values = await db.collection('wallet-value').find().sort({id: -1}).limit(15000).toArray();
    return values.reverse();
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
    getAllTransaction,
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

const cleanValues = async (diffMax) => {
    const values = await db.collection('wallet-value').find({}).sort({id: -1}).limit(15000).toArray();

    const valuesBad = []
    for(let i = 0; i<values.length-2; ++i){

        if((values[i].value - values[i+1].value)/values[i].value * 100 > diffMax){
            valuesBad.push(values[i+1])
        }
    }

    for (const value of valuesBad) {
        await db.collection('wallet-value').remove({id: value.id });
    }

    console.log(valuesBad)
}


// const main = async () => {
//     log.setLevel(process.env.LOG_LEVEL)
//     await mongoConnect()
//     //await insertTransaction({asset: "s", quantity: "1"})
//     await removeTransaction('622ddbdcf8d88e5068b31bc2')
//     console.log(await getAllTransaction());
//     //console.log(await walletFindAsset("solana"))
// }

// main()