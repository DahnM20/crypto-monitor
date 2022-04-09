import {Col} from 'react-bootstrap'
import '../styles/ValueSummary.css'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { server } from '../assets/env.js'

function ValueSummary() {

    const { data, status, error} = useQuery('total', fetchTotal)

    async function fetchTotal() {
        const response = await fetch(`http://${server.host}:${server.port}/value`);
        const json = await response.json();
        return json.value
    }

    const invested = 16500
    
    if(status == "loading"){
        return (
            <p className='colValue'> Chargement en cours... </p>
        )
    }

    if(status == "error"){
        return (
            <p className='colValue'> Erreur lors du chargement - {error.message} </p>
        )
    }

    return (
        <>
            <Col className="colName"> Valeur totale <br /> 
                <div className="colValue"> {data} </div> 
            </Col>
            <Col className="colName"> Valeur investie <br />
                <div className="colValue"> {invested} </div>
            </Col>
            <Col className="colName"> PNL <br />
                <div className="colValue"> {data - invested} </div> 
            </Col>
        </>
      )
}
  
export default ValueSummary;