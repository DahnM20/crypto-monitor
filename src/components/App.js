import '../styles/App.css'
import Header from './Header.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Col, Row, Container} from 'react-bootstrap'
import LeftPanel from './LeftPanel.js'
import RightPanel from './RightPanel.js'
import CenterPanel from './CenterPanel.js'
import { wallet } from '../assets/cryptoDatas'

function App() {
  return (
    <div className="App">
      <Header />
      <Container fluid >
        <Row>
          <LeftPanel wallet={wallet} />
          <CenterPanel wallet={wallet} />
          <RightPanel />
        </Row>
      </Container>
    </div>
  );
}

export default App;
