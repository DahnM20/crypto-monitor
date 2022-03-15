import { Col, Row} from 'react-bootstrap'
import '../../styles/TxHeader.css'

const TxHeader = ({asset, quantity, operation}) => {
  return (
    <Row className='tx-header-wrapper'>
        <Col  md={1}>
            {operation}
        </Col>
        <Col>
            {quantity}
        </Col>
        <Col>
            {asset}
        </Col>
        <Col md={2}>
            
        </Col>
    </Row>
  )
}

export default TxHeader