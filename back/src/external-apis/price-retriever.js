const fetch = require('node-fetch');

class PriceRetriever {
    constructor(url){
        this.url = url;
        if (this.constructor === PriceRetriever) {
            throw new TypeError('Class "PriceRetriever" cannot be instantiated directly');
        }
        
        if(!this.retrieveAssetCurrentPrice) {
            throw new Error("PriceRetriever must have retrieveAssetCurrentPrice method ");
        }
    }
}

class CoinGeckoPriceRetriever extends PriceRetriever {
    constructor(){
        super(process.env.COINGECKO_API_URL);
    }

    async retrieveAssetCurrentPrice(assetName) {
        const response = await fetch(`${this.url}?ids=${assetName}&vs_currencies=usd`);
        const json = await response.json();
        return json[assetName].usd
    }

    async getAsset(assetName){
        const response = await fetch(`${this.url}?ids=${assetName}&vs_currencies=usd`);
        const json = await response.json();
        return json[assetName]
    }


}

module.exports = {
    PriceRetriever,
    CoinGeckoPriceRetriever
}