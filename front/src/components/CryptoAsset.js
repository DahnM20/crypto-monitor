import '../styles/CryptoAsset.css'
import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import {Col, Row, Container} from 'react-bootstrap'
import CryptoAssetQuantity from './CryptoAssetQuantity'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

function CryptoAsset({name, quantity, id, currentValue, dailyBenef, currentPrice, color}) {

  const [modify, updateModify] = useState(false)
  const [assetQuantity, updateAssetQuantity] = useState(quantity)

  const handleClick = () => updateModify(!modify);

    return (
        <Card style={{ margin:'auto' }} bg={'dark'}  text={'light'} key={id}>
        <Card.Body>
          <Card.Header className='cryptoName'>
            <Row>
              <Col>
                {name.toUpperCase()}
              </Col>
              <Col className='crossCol' sm={1}>
                <FontAwesomeIcon className='buttonModify' icon={faCog} onClick={handleClick} />
              </Col>
            </Row>
          </Card.Header>
          <Card.Text className='cryptoDetails'>
            <CryptoAssetQuantity quantity={assetQuantity} updateQuantity={updateAssetQuantity} id={id} name={name} modify={modify} updateModify={updateModify} />
            < br/>
            Cours actuel : {currentPrice}$
            < br/>
            Valeur actuelle : {(currentValue).toFixed(2)}$ 
            < br/>
            Performance daily : <span className={dailyBenef < 0 ? 'loss' : 'gain' }> {dailyBenef.toFixed(2)}$ </span>
          </Card.Text>
        </Card.Body>
      </Card>
    )
}

export default CryptoAsset;