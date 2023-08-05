import {Tabs, Tab} from 'react-bootstrap'
import NewsTab from './NewsTab.js'
import { useState } from 'react'
import '../styles/TabsGroup.css'

function TabsGroup(){

    const [key, setKey] = useState('Cryptoast');

    return (
    <Tabs 
        id="controlled-tab"
        activeKey={key}
        onSelect={(k) => setKey(k)}
    >
        <Tab className="tab scrollTab" eventKey="Cryptoast" title="Cryptoast">
            <NewsTab source="cryptoast"/>
        </Tab>
        <Tab className="tab scrollTab" eventKey="JDC" title="Journal du coin">
            <NewsTab source="jdc"/>
        </Tab>
    </Tabs>
    )
}

export default TabsGroup
