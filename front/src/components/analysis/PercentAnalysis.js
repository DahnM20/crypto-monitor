import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import '../../styles/PercentAnalysis.css'
import PercentAnalysisTable from './PercentAnalysisTable';
import { server } from '../../assets/env.js'

function PercentAnalysis({ kind, title, vsBTC }) {

  const { data, status } = useQuery('rawData' + kind, fetchRawData)
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

  async function fetchRawData() {
    try {
      const response = await fetch(`http://${server.host}:${server.port}/watchlist-summary-chart/${kind}?vsBTC=${vsBTC}&nbWeek=5`);
      const json = await response.json();
      json.forEach(element => { element.asset = element.asset.toUpperCase(); });
      return json

    } catch (e) {
      console.log("Exception lors du fetch dans PercentAnalysis fetchRawData")
    }
  }

  useEffect(() => {
    if (status === 'success') {
      updateColumns(createColumnsName(data, title))
    }
  }, [data])

  return (
    <div className='percentAnalysisDiv'>
      {status === 'loading' && <p className='a-msg'> Chargement en cours </p>}
      {status === 'error' && <p className='a-msg'> Erreur lors du chargement </p>}
      {status === 'success' && <PercentAnalysisTable data={data} columns={columns} />}
    </div>
  )
}

export default PercentAnalysis;