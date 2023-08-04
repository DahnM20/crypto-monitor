import PercentAnalysis from "./PercentAnalysis";
import '../../styles/Analysis.css'
import {Col, Row, Button, InputGroup, Form} from 'react-bootstrap'
import { useMemo, useState, useEffect } from 'react'

function Analysis(){

    const [kinds, updateKinds] = useState(['vsUSD', 'vsBTC', 'vol'])
    const [titles, updateTitles] = useState(['Evolution hebdomadaire des prix VS USD', 'Evolution hebdomadaire des prix VS BTC', 'Evolutions des volumes hebdomadaire'])

    return (
        <Row className="bg-dark analysis">
            <Col md={{ span: 8, offset: 2 }}>
                <Row>
                    <Col md={6}>
                       <PercentAnalysis kind={kinds[0]} title={titles[0]} vsBTC={false}/>
                    </Col>
                    <Col md={6}>
                        <PercentAnalysis kind={kinds[1]} title={titles[1]} vsBTC={true}/>
                    </Col>
                </Row>
                
                <Row>
                    <Col md={{ span: 8, offset: 2 }}>
                        <PercentAnalysis kind={kinds[2]} title={titles[2]} vsBTC={false}/>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Analysis;