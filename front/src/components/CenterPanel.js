import {Col, Row, Container} from 'react-bootstrap'
import Summary from './Summary.js'
import '../styles/CentralPanel.css'
import Watchlist from './Watchlist.js'

function CenterPanel(){
    return (
        <Col className='bg-dark centralPanel' lg={5}>
            <Row>
                <Col>
                    <Summary />
                </Col>
            </Row>
            <Row>
                <Col>
                    < br/>
                    <Watchlist />
                </Col>
            </Row>
        </Col>
    )
}
export default CenterPanel