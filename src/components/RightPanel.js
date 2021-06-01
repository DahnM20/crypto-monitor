import {Col, Row, Container} from 'react-bootstrap'
import TabsGroup from './TabsGroup.js'
import '../styles/RightPanel.css'

function RightPanel(){
    return (
        <Col className='bg-dark rightPanel'>
            <TabsGroup />
        </Col>
    )

}

export default RightPanel;