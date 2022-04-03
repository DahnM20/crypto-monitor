class CoinGeckoPriceRetriever extends PriceRetriever {
    constructor(){
        super(process.env.COINGECKO_API_URL);
    }

    async retrieveAssetCurrentPrice(assetName) {
        if(assetName === 'bitcoin') return 50000
        else return 3000
    }


}

module.exports = {
    CoinGeckoPriceRetriever
}