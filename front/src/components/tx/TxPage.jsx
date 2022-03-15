import '../../styles/TxPage.css'
import { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import Tx from './Tx'
import TxHeader from './TxHeader'
import TxDate from './TxDate'

const TxPage = () => {
  const [txs, updateTxs] = useState()

  useEffect(() => {
    console.log('Update Txs')
    updateTxs([
      { asset: 'sol', quantity: '2', operation: 'add', timestamp: '2022-03-13' },
      { asset: 'sol', quantity: '2', operation: 'remove', timestamp: '2022-03-13' },
      { asset: 'sol', quantity: '2', operation: 'remove', timestamp: '2022-03-14' },
      { asset: 'sol', quantity: '2', operation: 'remove', timestamp: '2022-03-14' },
      { asset: 'sol', quantity: '2', operation: 'remove', timestamp: '2022-03-15' }
    ])
    console.log(txs)
  }, [])

  const renderTx = (txs) => {
    const componentArray = []
    let currentTimeStamp = undefined

    txs?.forEach(({asset, quantity, operation, timestamp}) => {
        if (currentTimeStamp !== timestamp) {
          console.log(2)
          componentArray.push(
            <>
              <TxDate timestamp={timestamp}/>
              <Tx asset={asset} quantity={quantity} operation={operation} />
            </>
          )
        } else {
          console.log(1)
          componentArray.push(
              <Tx asset={asset} quantity={quantity} operation={operation} />
          )
        }
        currentTimeStamp = timestamp
    })
    return componentArray
  }  

  return (
    <Row className="bg-dark tx-page-wrapper">
      <Col md={{ span: 8, offset: 2 }}>
        <h1 className='tx-page-title'> Liste des transactions </h1>
        <TxHeader asset='Nom' quantity='Quantité' operation='Operation' timestamp='Date' />
        { renderTx(txs) }
      </Col>
    </Row>
  )
}

export default TxPage