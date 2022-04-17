import { Col } from 'react-bootstrap'
import { useMemo, useState, useEffect } from 'react'
import '../../styles/PercentAnalysis.css'
import PercentAnalysisTable from './PercentAnalysisTable';
import { server } from '../../assets/env.js'

function PercentAnalysis({ kind, title, vsBTC }) {

  const [rawData, updateRawData] = useState([])
  const [columns, updateColumns] = useState([])

  function createColumnsName(data) {
    let sampleKeys = Object.keys(data[0])
    for(let i = 1; i<data.length; ++i){
      let currentKeys = Object.keys(data[i])
      if(currentKeys.length > sampleKeys.length) sampleKeys = currentKeys
    }

    let columnsComputed = []
    columnsComputed.push({
      Header: 'Asset',
      accessor: sampleKeys.shift(),
    })

    let weekNumber = sampleKeys.length - 1;

    for (const key of sampleKeys) {
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

  async function loadRawData() {
    try {
      const response = await fetch(`http://${server.host}:${server.port}/watchlist-summary-chart/${kind}?vsBTC=${vsBTC}&nbWeek=5`);
      const json = await response.json();
      json.forEach(element => { element.asset = element.asset.toUpperCase(); });
      updateRawData(json);
    } catch (e) {
      console.log("Exception lors du fetch dans PercentAnalysis loadRawData")
      updateRawData([])
    }
  }

  useEffect(() => {
    loadRawData()
  }, [])

  useEffect(() => {
    if (rawData != null && rawData.length > 0) {
      updateColumns(createColumnsName(rawData, title))
    }
  }, [rawData])

  return (
    <div className='percentAnalysisDiv'>
      {columns != null && <PercentAnalysisTable data={rawData} columns={columns} />}
    </div>
  )
}

export default PercentAnalysis;