import ChartSummary from './ChartSummary.js'
import ValueSummary from './ValueSummary.js'
import { Row } from 'react-bootstrap'

function Summary() {
    return (
      <div>
          <Row> 
            <ChartSummary />
          </Row>
          <Row className={'bg-dark'}>
            <ValueSummary />
          </Row>
      </div>
      )
  }

export default Summary;