import '../styles/Header.css';
import {Navbar, Nav} from 'react-bootstrap'
import logo from '../assets/logo.png';

function Header({updateShowWallet,updateShowAnalysis, updateShowTx}) {

  function updateNavigation(nextNav){
      switch (nextNav) {
            case 'wallet': 
                updateShowWallet(true);
                updateShowAnalysis(false);
                updateShowTx(false);
                break;
            case 'analysis':
                updateShowAnalysis(true);
                updateShowWallet(false);
                updateShowTx(false);
                break;
            case 'tx': 
                updateShowAnalysis(false);
                updateShowWallet(false);
                updateShowTx(true);
                break;
            default : 
                updateShowWallet(true);
                updateShowAnalysis(false);
                updateShowTx(false);
        }
  }

  return (
  <Navbar bg="dark" variant="dark" className="header">
    <Navbar.Brand href="#home" style={{padding:'10px'}}>
        <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
        />{' '}
        Crypto Monitor
    </Navbar.Brand>
    <Nav className="me-auto">
      <Nav.Link href="#home" onClick={() => updateNavigation('wallet')}>Wallet</Nav.Link>
      <Nav.Link href="#tx" onClick={() => updateNavigation('tx')}>Tx</Nav.Link>
      <Nav.Link href="#analysis" onClick={() => updateNavigation('analysis')}>Analysis</Nav.Link>
    </Nav>
    </Navbar>)
}

export default Header;