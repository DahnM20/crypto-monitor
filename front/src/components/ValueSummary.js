import {Col} from 'react-bootstrap'
import '../styles/ValueSummary.css'
import { useState, useEffect } from 'react'
import { server } from '../assets/env.js'

function ValueSummary() {

    const [total, updateTotal] = useState([])

    useEffect(() => {
        async function loadTotal() {
            const response = await fetch(`http://${server.host}:${server.port}/value`);
            const json = await response.json();
            updateTotal(parseFloat(json[0]['value']));
        }
        loadTotal()
    }, [])

    const invested = 13000

    return (
        <>
            <Col className="colName"> Valeur totale <br /> 
                <div className="colValue">{total}</div> 
            </Col>
            <Col className="colName"> Valeur investie <br />
                <div className="colValue"> {invested} </div>
            </Col>
            <Col className="colName"> PNL <br />
                <div className="colValue"> {total - invested} </div> 
            </Col>
        </>
      )
}
  
export default ValueSummary;