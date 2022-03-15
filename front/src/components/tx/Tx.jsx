import { Col, Row, Image, Button} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../styles/Tx.css'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import icon from '../../assets/logoSolana.png'

const Tx = ({asset, quantity, operation}) => {
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
        <Col>
            <Image fluid src={icon} className='tx-icon'></Image>
            {asset.toUpperCase()}
        </Col>
        <Col md={2}>
            <Button className='tx-button' variant="primary"> Supprimer </Button>
        </Col>
    </Row>
  )
}

export default Tx