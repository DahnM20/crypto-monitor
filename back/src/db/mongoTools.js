
//UNUSED 

const log = require('loglevel');
const { MongoClient, ObjectID }  = require('mongodb');

let db;

const mongoConnect = async () => {
    const client = await MongoClient.connect(process.env.MONGODB_URL, { useUnifiedTopology: true });
    db = client.db(process.env.MONGODB_NAME);
    log.info("Connected successfully to server");
}

const walletFindAsset = async(name) => {
    return await db.collection('wallet').findOne({'name' : name});
}

const updateWalletAsset = async(asset) => {
    let result = await db.collection("wallet").updateOne({'name' : asset.name}, {$set : asset} );
    return result
}

const removeTransaction = async(_id) => {
    try {
        return await db.collection("wallet-tx").deleteOne({_id : new ObjectID(_id) });
    } catch(e) {
        log.error(`Impossible de supprimer la tx ${_id} `)
    }
}

const updateWalletAssetQuantityByName = async(name, quantity) => {
    let oldAssetValue = await walletFindAsset(name)
    let oldQuantity = oldAssetValue.quantity

    let result = await db.collection("wallet").updateOne({'name' : name}, {$set : {'quantity' : quantity} } );
    
    log.debug(`oldQuantity ${oldQuantity}  quantity ${quantity}  name ${name}`)

    if(oldQuantity != quantity && quantity != null){
        const tx = {
            asset : name,
            quantity : quantity - oldQuantity
        }
        await insertTransaction(tx)
    }
    return result
}

const updateWalletAssetIconByName = async(name, icon) => {
    let result = await db.collection("wallet").updateOne({'name' : name}, {$set : {'icon' : icon} } );
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
    const newId = lastValue[0].id + 1; // TODO : A ameliorer
    await db.collection("wallet-value").insertOne({"value" : totalValue, "date" : getCurrentDate(), "id": newId});
}

module.exports = {
    insertInWatchlist,
    insertWalletValue,
    updateNoteWatchlist,
    updateWalletAssetQuantityByName,
    updateWalletAssetIconByName,
    updateWalletAsset,
    walletValuesFindAll,
    getWalletLastTotalValue,
    watchlistFindAll,
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