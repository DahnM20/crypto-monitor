import PercentAnalysis from "./PercentAnalysis";
import '../../styles/Analysis.css'
import {Col, Row, Button, InputGroup, Form} from 'react-bootstrap'
import { useMemo, useState, useEffect } from 'react'

function Analysis(){

    const [kinds, updateKinds] = useState(['perf', 'vol'])
    const [titles, updateTitles] = useState(['Evolution hebdomadaire des prix VS USD', 'Evolution hebdomadaire des prix VS BTC', 'Evolutions des volumes hebdomadaire'])

    return (
        <Row className="bg-dark analysis">
            <Col md={{ span: 8, offset: 2 }}>
                <Row className="analysisParamters">
                    <Col>
                        <InputGroup className="mb-3">
                            <Form.Control placeholder='ok' onChange={(e) => console.log(e)} />
                        </InputGroup>
                    </Col>
                    <Col>
                        Placeholder 2
                    </Col>
                    <Col>
                        <Button className='buttonAnalysis'> Charger données </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <PercentAnalysis kind={kinds[0]} title={titles[0]} vsBTC={false}/> 
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <PercentAnalysis kind={kinds[0]} title={titles[1]} vsBTC={true}/> 
                    </Col>
                </Row>
                
                <Row>
                    <Col md={12}>
                        <PercentAnalysis kind={kinds[1]} title={titles[2]} vsBTC={false}/> 
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Analysis;