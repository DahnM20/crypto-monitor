import '../../styles/TxDate.css'
import { Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

const TxDate = ({timestamp}) => {
  return (
      <Row>
          <Col>
                <p className='tx-date'> 
                    {timestamp} <FontAwesomeIcon  icon={faArrowDown} /> 
                </p>
          </Col>
      </Row>
  )
}

export default TxDate