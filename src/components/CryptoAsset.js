import '../styles/CryptoAsset.css'
import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import {Col, Row, Container} from 'react-bootstrap'
import whiteCrossmark from '../assets/whiteCrossmark.png'

function CryptoAsset({name, quantity, id, color}) {
    const host = 'https://api.coingecko.com/api/v3/simple/price'
    const [price, updatePrice] = useState(0)

    useEffect(() => {
        async function loadPrice() {
            const response = await fetch(`${host}?ids=${name}&vs_currencies=usd`);
            const json = await response.json();
            updatePrice(json[name].usd);
        }
        loadPrice()
	}, [])

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
            Valeur actuelle : {(price * quantity).toFixed(2)}$
          </Card.Text>
        </Card.Body>
      </Card>
    )
}

export default CryptoAsset;