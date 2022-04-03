const mongoose = require('mongoose')
const Article = require('../../src/models/article')
const Tx = require("../../src/models/tx")
const WalletAsset = require("../../src/models/walletAsset")
const WalletValue = require('../../src/models/walletValue')

const assetOneId = new mongoose.Types.ObjectId()
const assetTwoId = new mongoose.Types.ObjectId()
const sampleAssetSolanaId = new mongoose.Types.ObjectId()

const assetOne = {
    _id: assetOneId,
    name: "ethereum",
    id: "ETH",
    quantity: 2.2,
    currentPrice: 2909.47,
    currentValue: 6400.834,
    lastDailyValue: 6291.89,
    dailyBenef: 108.9,
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png"
}

const assetTwo = {
    _id: assetTwoId,
    name: "bitcoin",
    id: "BTC",
    quantity: 0.2
}


const sampleAssetSolana = {
    _id: sampleAssetSolanaId,
    name: "solana",
    quantity: 2.2,
    id: "SOL"
}

const sampleWalletValue = {
    value:1000
}


/**
 * Populate database for testing purpose
 */
const populateDatabase = async () => {
    await deleteAll()
    await new WalletAsset(assetOne).save()
    await new WalletAsset(assetTwo).save()

}


/**
 * Remove all objects in every collections of the application database
 */
async function deleteAll() {
    await WalletAsset.deleteMany()
    await Tx.deleteMany()
    await WalletValue.deleteMany()
    await Article.deleteMany()
}

module.exports = {
    assetOneId,
    assetTwoId,
    sampleAssetSolanaId,
    assetOne,
    assetTwo,
    sampleAssetSolana,
    sampleWalletValue,
    populateDatabase
}
