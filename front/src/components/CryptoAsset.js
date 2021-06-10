import '../styles/CryptoAsset.css'
import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import {Col, Row, Container} from 'react-bootstrap'
import whiteCrossmark from '../assets/whiteCrossmark.png'

function CryptoAsset({name, quantity, id, currentValue, dailyBenef, currentPrice, color}) {

    return (
        <Card style={{ margin:'auto' }} bg={'dark'}  text={'light'} key={id}>
        <Card.Body>
          <Card.Header className='cryptoName'>
            <Row>
              <Col>
                {name.toUpperCase()}
              </Col>
              <Col className='crossCol' sm={1}>
                <img className='crossIcon' src={whiteCrossmark} alt='cross-icon' />
              </Col>
            </Row>
          </Card.Header>
          <Card.Text className='cryptoDetails'>
            Quantité : {quantity} {id} 
            < br/>
            Cours actuel : {currentPrice}$
            < br/>
            Valeur actuelle : {(currentValue).toFixed(2)}$ 
            < br/>
            Performance daily : {dailyBenef.toFixed(2)}$
          </Card.Text>
        </Card.Body>
      </Card>
    )
}

export default CryptoAsset;