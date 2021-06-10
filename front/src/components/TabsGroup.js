import {Tabs, Tab} from 'react-bootstrap'
import NewsTab from './NewsTab.js'
import { useState, useEffect } from 'react'
import '../styles/TabsGroup.css'

function TabsGroup(){

    const [key, setKey] = useState('all');

    return (
    <Tabs 
        id="controlled-tab"
        activeKey={key}
        onSelect={(k) => setKey(k)}
    >
        <Tab className="tab scrollTab" eventKey="all" title="Toutes">
            <NewsTab />
        </Tab>
        <Tab className="tab" eventKey="Tweets" title="Tweets">
            <p> OK 2 </p>
        </Tab>
        <Tab className="tab" eventKey="Cryptoast" title="Cryptoast">
            <NewsTab />
        </Tab>
    </Tabs>
    )
}

export default TabsGroup
