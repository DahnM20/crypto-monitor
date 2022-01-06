import '../styles/App.css'
import Header from './Header.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Row, Container} from 'react-bootstrap'
import LeftPanel from './LeftPanel.js'
import RightPanel from './RightPanel.js'
import CenterPanel from './CenterPanel.js'
import { socket } from './socket.js'
import { useState, useEffect } from 'react'
import Analysis from './analysis/Analysis'

function App() {

  const [wallet, updateWallet] = useState([])
  const [showWallet, updateShowWallet] = useState(true)
  const [showAnalysis, updateShowAnalysis] = useState(false)


    useEffect(() => {
        socket.on("MajWallet", data => {
          updateWallet(data)
        });
        return () => socket.disconnect();
    }, [])

  return (
    <div className="App">
      <Header updateShowAnalysis={updateShowAnalysis} updateShowWallet={updateShowWallet} />
      <Container fluid className="bg-dark">

            <Row className={!showWallet ? 'hidden' : null}>
              <LeftPanel wallet={wallet} />
              <CenterPanel />
              <RightPanel />
            </Row>

            <Row className={!showAnalysis ? 'hidden' : null}>
              <Analysis />
            </Row>

      </Container>
    </div>
  );
}

export default App;
