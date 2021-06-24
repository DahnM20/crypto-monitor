import {Col, Row, Container} from 'react-bootstrap'
import Wallet from './Wallet.js'
import '../styles/LeftPanel.css'

function LeftPanel({wallet}){
    return (
        <Col lg={2} className='bg-dark leftPanel'>
            <Wallet wallet={wallet}/>
        </Col>
    )
}

export default LeftPanel;