import ChartSummary from './ChartSummary.js'
import ValueSummary from './ValueSummary.js'
import {Col, Row, Container} from 'react-bootstrap'

function Summary({wallet}) {
    return (
      <div>
          <Row> 
            <ChartSummary />
          </Row>
          <Row className={'bg-dark'}>
            <ValueSummary wallet={wallet}/>
          </Row>
      </div>
      )
  }

export default Summary;