import { Col, Row, Image, Button} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../styles/Tx.css'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

const Tx = ({asset, quantity, priceAtTime, icon, operation}) => {
  return (
    <Row className='tx-wrapper'>
        <Col md={1}>
            <FontAwesomeIcon 
                icon={ operation.toLowerCase() === 'add' ?   faPlus : faMinus }
                className={ operation.toLowerCase() === 'add' ?   
                    'tx-op-icon-add' : 'tx-op-icon-del' } />
        </Col>
        <Col>
            {quantity}
        </Col>
        { 
            priceAtTime != undefined ? 
            <Col>
                 {priceAtTime} $
            </Col> : <Col> Non disponible </Col>
        }
        <Col className='tx-name'>
            <Image fluid src={icon} className='tx-icon'></Image>
            {asset.toUpperCase()}
        </Col>
        <Col md={2}>
            <Button className='tx-button' variant="primary"> Annuler </Button>
        </Col>
    </Row>
  )
}

export default Tx