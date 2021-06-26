import {Col} from 'react-bootstrap'
import TabsGroup from './TabsGroup.js'
import '../styles/RightPanel.css'

function RightPanel(){
    return (
        <Col className='bg-dark rightPanel' lg={5}>
            <TabsGroup />
        </Col>
    )

}

export default RightPanel;