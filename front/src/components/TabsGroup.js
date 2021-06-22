import {Tabs, Tab} from 'react-bootstrap'
import NewsTab from './NewsTab.js'
import TweetsTab from './TweetsTab.js'
import { useState, useEffect } from 'react'
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
            <NewsTab />
        </Tab>
        <Tab className="tab scrollTab" eventKey="Tweets" title="Tweets">
            <TweetsTab />
        </Tab>
    </Tabs>
    )
}

export default TabsGroup
