import {Col} from 'react-bootstrap'
import { useMemo, useState, useEffect } from 'react'
import '../../styles/PercentAnalysis.css'
import PercentAnalysisTable from './PercentAnalysisTable';
import { server } from '../../assets/env.js'

function PercentAnalysis({kind,title}){

    const [rawData, updateRawData] = useState([])
    const [columns, updateColumns] = useState([])

    function createColumnsName(data){
      let sampleKeys = Object.keys(data[0])

      let columnsComputed = []
      columnsComputed.push({
        Header: 'Asset',
        accessor: sampleKeys.shift(),
      })

      let weekNumber = sampleKeys.length - 1; 

      for(const key of sampleKeys){
        columnsComputed.push({
            Header: 'W-' + weekNumber,
            accessor: key,
        })

          weekNumber--
      }

      return [
          {
            Header: title,
            columns: columnsComputed,
          }
        ];
  }


    useEffect(() => {
        async function loadRawData() {
            //const response = await fetch(`http://${server.host}:${server.port}/watchlist-summary-chart/${kind}?vsBTC=false&nbWeek=5`);
            //const json = await response.json();
            //updateRawData(json);
            //console.log("RawData useE : " + rawData)
            ///updateColumns(createColumnsName())
        }
        loadRawData()
        updateRawData(
          [
            {"asset":"sol","2021-12-06":"-15.12","2021-12-13":"90","2021-12-20":"-0.05","2021-12-27":"-4.49","2022-01-03":"-3.04"},{"asset":"btc","2021-12-06":"0.00","2021-12-13":"0.00","2021-12-20":"0.00","2021-12-27":"0.00","2022-01-03":"0.00"},{"asset":"chz","2021-12-06":"-6.19","2021-12-13":"-7.53","2021-12-20":"13.19","2021-12-27":"1.37","2022-01-03":"-1.68"},{"asset":"matic","2021-12-06":"0.60","2021-12-13":"12.50","2021-12-20":"16.02","2021-12-27":"-5.01","2022-01-03":"-3.54"}
          ]
        )
    }, [])

    useEffect(() => {
      if(rawData != null && rawData.length > 0){
        updateColumns(createColumnsName(rawData, title))
      }
    }, [rawData])

    return (
        <div className='percentAnalysisDiv'>
            { columns != null && <PercentAnalysisTable data={rawData} columns={columns}/> }
        </div>
    )
}

export default PercentAnalysis;