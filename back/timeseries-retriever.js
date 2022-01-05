const fetch = require('node-fetch');

const host = 'https://data.messari.io/api/v1/'

async function getAssetData(asset){
    const response = await fetch(`${host}assets/${asset}/metrics/market-data`);
    const json = await response.json();

    const data = json.data;

    return data; 
}

async function getAssetMarketDataField(asset, field){
    const market_data = getAssetData(asset).market_data;
    return ({ [field] : market_data[field] });
}

async function getAssetRoiData(asset){
    const roi_data = getAssetData(asset).roi_data;
    return roi_data; 
}

function convertTimeStamp(unix_timestamp){
    var a = new Date(unix_timestamp);
    var year = a.getFullYear();
    var month = a.getMonth() + 1 < 10 ? '0' + (a.getMonth() + 1) : a.getMonth() + 1;
    var date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(); 
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec ;
    
    return time;
}

function convertTimeStampToDate(unix_timestamp){
    return convertTimeStamp(unix_timestamp).split(' ')[0];
}

function substractWeekToTimestamp(date, numberOfWeeks) {
    date.setDate(date.getDate() - numberOfWeeks*7);
    return date;
    
}

async function getTimeSeriesUSDLastWeeks(asset, numberOfWeeks){

    let current_day = new Date()
    let date_end = convertTimeStampToDate(current_day);
    let date_start = convertTimeStampToDate(substractWeekToTimestamp(current_day, numberOfWeeks));

    const response = await fetch(`${host}assets/${asset}/metrics/price/time-series?` + new URLSearchParams({
        start: date_start,
        end: date_end,
        interval: "1w",
        format: "json"
    }));


    const json = await response.json();

    const values = json.data.values;
    const perfArray = [];

    values.forEach(value => {
        perfArray.push({
            date: convertTimeStampToDate(value[0]),
            open : value[1], 
            close : value[2],
            high : value[3],
            low : value[4],
            vol : value[5],
            perf : (value[2]-value[1])/value[2] * 100
        });
    });

    return perfArray;

}

async function getTimeSeriesBTCLastWeeks(asset, numberOfWeeks){

    let current_day = new Date()
    let date_end = convertTimeStampToDate(current_day);
    let date_start = convertTimeStampToDate(substractWeekToTimestamp(current_day, numberOfWeeks));

    const response = await fetch(`${host}assets/${asset}/metrics/price/time-series?` + new URLSearchParams({
        start: date_start,
        end: date_end,
        interval: "1w",
        format: "json"
    }));

    const responseBTC = await fetch(`${host}assets/btc/metrics/price/time-series?` + new URLSearchParams({
        start: date_start,
        end: date_end,
        interval: "1w",
        format: "json"
    }));


    const json = await response.json();
    const jsonBTC = await responseBTC.json();

    const values = json.data.values;
    const valuesBTC = jsonBTC.data.values;

    const perfArray = [];

    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        const valueBTC = valuesBTC[i];

        const openVsBTC = value[1]/valueBTC[1]
        const closeVsBTC =  value[4]/valueBTC[4]

        perfArray.push({
            date: convertTimeStampToDate(value[0]),
            open : openVsBTC, 
            close : closeVsBTC,
            high : value[2]/valueBTC[2],
            low : value[3]/valueBTC[3],
            vol : value[5],
            perf : (closeVsBTC-openVsBTC)/closeVsBTC * 100
        });
        
    }

    return perfArray;

}

function convertTimeSeriesArrayToSingleObject(timeSeries, asset, field){
    const timeSerieObject = {
        asset : asset
    };

    timeSeries.forEach(value => {
        timeSerieObject[value.date] = value[field].toFixed(2);
    });
    return timeSerieObject;
}

let summaryWeeklyUSD = []
let summaryWeeklyBTC = []

exports.computeSummaryForPerf = async(assets, vsBTC, numberOfWeeks, kind) => {
    summaryWeeklyUSD = []
    summaryWeeklyBTC = []
    for (const asset of assets) {
        if(vsBTC){
            let timeSeries = await getTimeSeriesBTCLastWeeks(asset, numberOfWeeks);
            setTimeout(() => summaryWeeklyBTC.push(convertTimeSeriesArrayToSingleObject(timeSeries, asset, kind), 2000));
        } else {
            let timeSeries = await getTimeSeriesUSDLastWeeks(asset, numberOfWeeks);
            setTimeout(() => summaryWeeklyUSD.push(convertTimeSeriesArrayToSingleObject(timeSeries, asset, kind), 2000));
        }
    }
    return summary;
}

exports.getCurrentSummaries = async(vsBTC, kind) => {
    if(vsBTC){
        return summaryWeeklyBTC;
    } else {
        return summaryWeeklyUSD;
    }
}

async function main() {
    //console.log(await getAssetData('btc'));
    //console.log(await getAssetRoiData('btc'))
    //const timeSeries = await getTimeSeriesUSDLastWeeks('btc', 5);
    //await getTimeSeriesBTCLastWeeks('sol', 5);
    //convertTimeSeriesArrayToSingleObject(timeSeries, 'btc', 'perf');
    
    //const watchlist = ['sol', 'btc', 'chz', 'matic'];
    //const summary = await getPerfSummaryForList(watchlist, false, 5);
    //console.log(summary);
}

main();