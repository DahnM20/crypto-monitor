import '../../styles/TxPage.css'
import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { Col, Row } from 'react-bootstrap'
import Tx from './Tx'
import TxHeader from './TxHeader'
import TxDate from './TxDate'
import { server } from '../../assets/env.js'

const TxPage = ({ wallet }) => {
  const [iconsMap, updateIconsMap] = useState()
  const { data, status } = useQuery('txs', fetchTx)

  useEffect(() => {
    const iconsMapTemp = []
    wallet.forEach((asset) => {
      iconsMapTemp[asset.name] = asset.icon
    })
    updateIconsMap(iconsMapTemp)
  }, [wallet])

  async function fetchTx() {
    const response = await fetch(`http://${server.host}:${server.port}/tx`)
    const txs = await response.json()
    txs.forEach((tx) => formatTx(tx))
    return txs
  }

  function formatTx(tx) {
    tx.quantity = tx.quantity?.toFixed(2)
    tx.timestamp = tx.timestamp?.split(' ')[0]
  }

  const renderTx = (txs) => {
    const componentArray = []
    let currentTimeStamp = undefined

    txs?.forEach(({ asset, quantity, operation, priceAtTime, timestamp }, i) => {
      if (currentTimeStamp !== timestamp) {
        componentArray.push(
          <TxDate timestamp={timestamp} key={i + '-' + timestamp + 'date'} />
        )
      }
      componentArray.push(
        <Tx asset={asset} quantity={quantity} operation={operation} priceAtTime={priceAtTime} icon={iconsMap[asset]} key={i + '-' + timestamp} />
      )
      currentTimeStamp = timestamp
    })
    return componentArray
  }


  if (status == "loading") {
    return (
      <p className='bg-dark tx-page-wrapper'> Chargement en cours des transactions ... </p>
    )
  }

  if (status == "error") {
    return (
      <p className='bg-dark tx-page-wrapper'> Erreur lors du chargement des transactions. </p>
    )
  }

  return (
    <Row className="bg-dark tx-page-wrapper">
      <Col md={{ span: 8, offset: 2 }}>
        <h1 className='tx-page-title'> Liste des transactions </h1>
        <TxHeader asset='Nom' quantity='Quantité' operation='Operation' timestamp='Date' />
        {renderTx(data)}
      </Col>
    </Row>
  )
}

export default TxPage