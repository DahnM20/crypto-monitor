import '../../styles/TxPage.css'
import { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import Tx from './Tx'
import TxHeader from './TxHeader'
import TxDate from './TxDate'
import { server } from '../../assets/env.js'

const TxPage = ({wallet}) => {
  const [txs, updateTxs] = useState()
  const [iconsMap, updateIconsMap] = useState()

  async function loadTxs() {
    const response = await fetch(`http://${server.host}:${server.port}/tx`);
    const txs = await response.json();
    txs.forEach((tx) => formatTx(tx))
    updateTxs(txs);
  }

  function formatTx(tx) {
    tx.quantity = tx.quantity?.toFixed(2)
    tx.timestamp = tx.timestamp?.split(' ')[0]
  }

  useEffect(() => {
    console.log('Update Txs')
    loadTxs()
  }, [])

  useEffect(() => {
    const iconsMapTemp = []
    wallet.forEach((asset) => {
      iconsMapTemp[asset.name] = asset.icon
    })
    updateIconsMap(iconsMapTemp)
  }, [wallet])

  const renderTx = (txs) => {
    const componentArray = []
    let currentTimeStamp = undefined

    txs?.forEach(({ asset, quantity, operation, timestamp }, i) => {
      if (currentTimeStamp !== timestamp) {
        componentArray.push(
          <TxDate timestamp={timestamp} key={i + '-' + timestamp + 'date'} />
        )
      }
      componentArray.push(
        <Tx asset={asset} quantity={quantity} operation={operation} icon={iconsMap[asset]} key={i + '-' + timestamp} />
      )
      currentTimeStamp = timestamp
    })
    return componentArray
  }

  return (
    <Row className="bg-dark tx-page-wrapper">
      <Col md={{ span: 8, offset: 2 }}>
        <h1 className='tx-page-title'> Liste des transactions </h1>
        <TxHeader asset='Nom' quantity='Quantité' operation='Operation' timestamp='Date' />
        {renderTx(txs)}
      </Col>
    </Row>
  )
}

export default TxPage