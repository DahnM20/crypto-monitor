import {Col, Row, Container} from 'react-bootstrap'
import Summary from './Summary.js'
import '../styles/CentralPanel.css'
import Watchlist from './Watchlist.js'

function CenterPanel({wallet}){
    return (
        <Col className='bg-dark centralPanel'>
            <Row>
                <Col>
                    <Summary wallet={wallet}/>
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