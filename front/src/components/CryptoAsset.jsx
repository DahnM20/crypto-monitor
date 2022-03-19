import '../styles/CryptoAsset.css'
import { useState } from 'react'
import { Col, Row, Image } from 'react-bootstrap'
import CryptoAssetQuantity from './CryptoAssetQuantity'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

function CryptoAsset({ name, quantity, id, currentValue, dailyBenef, currentPrice, icon }) {

  const [modify, updateModify] = useState(false)
  const [assetQuantity, updateAssetQuantity] = useState(quantity)

  const handleClick = () => updateModify(!modify);

  return (
    <Row key={id}>
      <Col className='ca-wrapper' md={{ span : 10, offset: 1 }}>
        <Row className='ca-name'>
          {
            icon && 
            <Col className='ca-image-wrapper' md={1}>
              <Image src={icon} className='ca-image'></Image>
            </Col>
          }
          
          <Col md={icon  ? 9 : 10 }>
            {name.toUpperCase()}
          </Col>
          <Col className='crossCol' md={1}>
            <FontAwesomeIcon className='buttonModify' icon={faCog} onClick={handleClick} />
          </Col>
        </Row>
        <Row className='cryptoDetails'>
          <Col md={12}>
            <CryptoAssetQuantity quantity={assetQuantity} updateQuantity={updateAssetQuantity} id={id} name={name} modify={modify} updateModify={updateModify} />
            < br />
            Cours actuel : {currentPrice}$
            < br />
            Valeur actuelle : {currentValue?.toFixed(2)}$
            < br />
            Performance daily : <span className={dailyBenef < 0 ? 'loss' : 'gain'}> {(dailyBenef != null ? dailyBenef.toFixed(2) + '$' : "N/A")} </span>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default CryptoAsset;