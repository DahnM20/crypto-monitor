import {Col} from 'react-bootstrap'
import '../styles/ValueSummary.css'

function ValueSummary({wallet}) {
    const total = wallet.reduce((acc, asset) => acc + asset.quantity * asset.value,0)
    const invested = 13000
    console.log(total)
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