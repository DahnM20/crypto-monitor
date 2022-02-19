const log = require('loglevel');
const fetch = require('node-fetch');

const host = process.env.MESSARI_API_URL

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

    await new Promise(resolve => setTimeout(resolve, 5000));

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

    if(!values){
        throw new Error(`Pas de valeur USD disponible pour ${asset}`)
    }

    const perfArray = [];

    values.forEach(value => {
        perfArray.push({
            date: convertTimeStampToDate(value[0]),
            open : value[1], 
            high : value[2],
            low : value[3],
            close : value[4],
            vol : value[5],
            perf : (value[4]-value[1])/value[4] * 100
        });
    });

    return perfArray;

}

async function getTimeSeriesBTCLastWeeks(asset, numberOfWeeks){

    await new Promise(resolve => setTimeout(resolve, 5000));

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

    if(!values || !valuesBTC){
        throw new Error(`Pas de valeur BTC disponible pour ${asset}`)
    }

    const perfArray = [];

    for (let i = 0; i < values.length; ++i) {
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

function computeVolumePerf(perfArray){
    perfArray[0]['perfVolume'] = null;
    for(let i = 1; i < perfArray.length; ++i) {
        const value = perfArray[i]
	if(value.vol != null && perfArray[i-1].vol != null){
        	value['perfVolume'] = (((value.vol - perfArray[i-1].vol)/perfArray[i-1].vol)*100);
	}
    }
}

function convertTimeSeriesArrayToSingleObject(timeSeries, asset, field){
    const timeSerieObject = {
        asset : asset
    };

    timeSeries.forEach(value => {
	if(value[field] != null) timeSerieObject[value.date] = value[field].toFixed(2);
    });
    return timeSerieObject;
}

let summaryWeeklyUSD = []
let summaryVolumePerf = []
let summaryWeeklyBTC = []

exports.computeSummaryForPerf = async(assets, vsBTC, numberOfWeeks, kind) => {
    if(vsBTC == true) summaryWeeklyBTC = []
    else {
        summaryVolumePerf = []
        summaryWeeklyUSD = []
    }

    for (const asset of assets) {
        if(vsBTC == true){
            try {
                let timeSeries = await getTimeSeriesBTCLastWeeks(asset, numberOfWeeks);
                summaryWeeklyBTC.push(convertTimeSeriesArrayToSingleObject(timeSeries, asset, kind))
            } catch (error) {
                log.error(error.message)
            }
        } else {
            try{
                let timeSeries = await getTimeSeriesUSDLastWeeks(asset, numberOfWeeks);
                computeVolumePerf(timeSeries)
                summaryWeeklyUSD.push(convertTimeSeriesArrayToSingleObject(timeSeries, asset, kind))
                summaryVolumePerf.push(convertTimeSeriesArrayToSingleObject(timeSeries, asset, 'perfVolume'))
            } catch (error) {
                log.error(error.message)
            }
        }
    }
}

exports.getCurrentSummaries = async(vsBTC, kind) => {
    if(kind == 'vol'){
        return summaryVolumePerf;
    }

    if(vsBTC == 'true'){
        return summaryWeeklyBTC;
    } else {
        return summaryWeeklyUSD;
    }
}

async function main() {
    //console.log(await getAssetData('btc'));
    //console.log(await getAssetRoiData('btc'))
    /*const timeSeries = await getTimeSeriesUSDLastWeeks('sol', 5);
    computeVolumePerf(timeSeries)
    console.log(timeSeries)*/
    //await getTimeSeriesBTCLastWeeks('sol', 5);
    //convertTimeSeriesArrayToSingleObject(timeSeries, 'btc', 'perf');
    
    //const watchlist = ['sol', 'btc', 'chz', 'matic'];
    //const summary = await getPerfSummaryForList(watchlist, false, 5);
    //console.log(summary);
    /*const watchlist = ['sol','btc'];
    await exports.computeSummaryForPerf(watchlist, false, 5, 'perf');
    console.log(summaryVolumePerf)*/
}

main();