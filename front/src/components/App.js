import '../styles/App.css'
import Header from './Header.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Col, Row, Container} from 'react-bootstrap'
import LeftPanel from './LeftPanel.js'
import RightPanel from './RightPanel.js'
import CenterPanel from './CenterPanel.js'
import { socket } from './socket.js'
import { useState, useEffect } from 'react'

function App() {

  const [wallet, updateWallet] = useState([])

    useEffect(() => {
        socket.on("MajWallet", data => {
          updateWallet(data)
        });
        return () => socket.disconnect();
    }, [])
    

  return (
    <div className="App">
      <Header />
      <Container fluid >
        <Row>
          <LeftPanel wallet={wallet} />
          <CenterPanel />
          <RightPanel />
        </Row>
      </Container>
    </div>
  );
}

export default App;
