const log = require('loglevel');
const fetch = require('node-fetch');
const PerfSummary = require('../models/perfSummary');
//require('../db/mongoose')

const host = process.env.MESSARI_API_URL
const apiKey = process.env.MESSARI_API_KEY

function convertTimeStamp(unix_timestamp) {
    var a = new Date(unix_timestamp);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();

    // Format with leading zeros
    month = month < 10 ? '0' + month : month;
    date = date < 10 ? '0' + date : date;
    
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    
    var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;

    return time;
}

function convertDateToTimeStamp(unix_timestamp) {
    return convertTimeStamp(unix_timestamp).split(' ')[0];
}

function subtractWeeksFromDate(date, numberOfWeeks) {
    let newDate = new Date(date);
    let subtractDays = numberOfWeeks * 7;
    newDate.setDate(date.getDate() - subtractDays);

    return newDate;
}
async function getTimeSeriesUSDLastWeeks(asset, numberOfWeeks) {

    await new Promise(resolve => setTimeout(resolve, 5000));

    let current_day = new Date()
    let date_end = convertDateToTimeStamp(current_day);
    let date_start = convertDateToTimeStamp(subtractWeeksFromDate(current_day, numberOfWeeks));


    const response = await fetch(`${host}assets/${asset}/metrics/price/time-series?` + new URLSearchParams({
        start: date_start,
        end: date_end,
        interval: "1w",
        format: "json"
    }),
        {
            method: 'GET',
            'x-messari-api-key': apiKey,
        }
    );

    const json = await response.json();

    console.log(json)

    const values = json.data.values;

    if (!values) {
        throw new Error(`Pas de valeur USD disponible pour ${asset}`)
    }

    const perfArray = [];

    values.forEach(value => {
        perfArray.push({
            date: convertDateToTimeStamp(value[0]),
            open: value[1],
            high: value[2],
            low: value[3],
            close: value[4],
            vol: value[5],
            perf: (value[4] - value[1]) / value[4] * 100
        });
    });

    return perfArray;

}

async function getTimeSeriesBTCLastWeeks(asset, numberOfWeeks) {

    await new Promise(resolve => setTimeout(resolve, 5000));

    let current_day = new Date()
    let date_end = convertDateToTimeStamp(current_day);
    let date_start = convertDateToTimeStamp(subtractWeeksFromDate(current_day, numberOfWeeks));

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

    if (!json.data || !jsonBTC.data) {
        throw new Error(`Pas de valeur BTC disponible pour ${asset}`)
    }

    const values = json.data.values;
    const valuesBTC = jsonBTC.data.values;

    const perfArray = [];

    for (let i = 0; i < values.length; ++i) {
        const value = values[i];
        const valueBTC = valuesBTC[i];

        const openVsBTC = value[1] / valueBTC[1]
        const closeVsBTC = value[4] / valueBTC[4]

        perfArray.push({
            date: convertDateToTimeStamp(value[0]),
            open: openVsBTC,
            close: closeVsBTC,
            high: value[2] / valueBTC[2],
            low: value[3] / valueBTC[3],
            vol: value[5],
            perf: (closeVsBTC - openVsBTC) / closeVsBTC * 100
        });

    }

    return perfArray;

}

function computeVolumePerf(perfArray) {
    perfArray[0]['perfVolume'] = null;
    for (let i = 1; i < perfArray.length; ++i) {
        const value = perfArray[i]
        if (value.vol != null && perfArray[i - 1].vol != null) {
            value['perfVolume'] = (((value.vol - perfArray[i - 1].vol) / perfArray[i - 1].vol) * 100);
        }
    }
}

const saveSummaryForPerf = async (perfArray) => {

    for (const perf of perfArray) {
        const perfFind = await PerfSummary.findOne({ asset: perf.asset, week: perf.date, kind: perf.kind })
        const currentPerf = perf.kind === 'vol' ? perf.perfVolume : perf.perf

        if (!currentPerf) continue;

        if (!perfFind) {
            const newPerf = new PerfSummary({
                asset: perf.asset,
                week: perf.date,
                value: currentPerf,
                kind: perf.kind
            })
            await newPerf.save()
        } else {
            perfFind.value = currentPerf ?? perfFind.value
            await perfFind.save()
        }
    }

}

const computeVsUSDPerf = async (assets, numberOfWeeks) => {
    let summaryWeeklyUSD = []
    const kind = 'vsUSD'
    for (const asset of assets) {
        try {
            let timeSeries = await getTimeSeriesUSDLastWeeks(asset, numberOfWeeks);
            for (let timeSerie of timeSeries) {
                timeSerie.asset = asset
                timeSerie.kind = kind
            }
            summaryWeeklyUSD = summaryWeeklyUSD.concat(timeSeries)
        } catch (error) {
            log.error(error.message)
        }
    }
    return summaryWeeklyUSD
}

const computeVsBTCPerf = async (assets, numberOfWeeks) => {
    let summaryWeeklyBTC = []
    const kind = 'vsBTC'
    for (const asset of assets) {
        try {
            let timeSeries = await getTimeSeriesBTCLastWeeks(asset, numberOfWeeks);
            for (let timeSerie of timeSeries) {
                timeSerie.asset = asset
                timeSerie.kind = kind
            }
            summaryWeeklyBTC = summaryWeeklyBTC.concat(timeSeries)
        } catch (error) {
            log.error(error.message)
        }
    }
    return summaryWeeklyBTC
}

const computeSummaryVolumePerf = async (assets, numberOfWeeks) => {
    let summaryVolumePerf = []
    const kind = 'vol'
    for (const asset of assets) {
        try {
            let timeSeries = await getTimeSeriesUSDLastWeeks(asset, numberOfWeeks);
            computeVolumePerf(timeSeries)
            for (let timeSerie of timeSeries) {
                timeSerie.asset = asset
                timeSerie.kind = kind
            }
            summaryVolumePerf = summaryVolumePerf.concat(timeSeries)
        } catch (error) {
            log.error(error.message)
        }
    }
    return summaryVolumePerf;

}

const computeSummaryForPerf = async (assets, numberOfWeeks) => {

    const summaryWeeklyBTC = await computeVsBTCPerf(assets, numberOfWeeks)
    const summaryVolumePerf = await computeSummaryVolumePerf(assets, numberOfWeeks)
    const summaryWeeklyUSD = await computeVsUSDPerf(assets, numberOfWeeks)
    saveSummaryForPerf(summaryWeeklyUSD)
    saveSummaryForPerf(summaryWeeklyBTC)
    saveSummaryForPerf(summaryVolumePerf)
}

module.exports = {
    computeSummaryForPerf,
    getTimeSeriesUSDLastWeeks,
}

// async function main() {

//    await computeSummaryForPerf(['sol','btc','eth'], 5)
//    console.log("---- " + JSON.stringify(await PerfSummary.getGlobalSummary('vsBTC',4)))
//    console.log("---- " + JSON.stringify(await PerfSummary.getGlobalSummary('vsUSD',4)))
//    console.log("---- " + JSON.stringify(await PerfSummary.getGlobalSummary('vol',4)))
// }

// main();