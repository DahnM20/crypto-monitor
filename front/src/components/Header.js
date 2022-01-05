import '../styles/Header.css';
import {Navbar, Nav} from 'react-bootstrap'
import logo from '../assets/logoSolana.png';

function Header({updateShowWallet,updateShowAnalysis}) {

  function updateNavigation(nextNav){
      switch (nextNav) {
            case 'wallet': 
                updateShowWallet(true);
                updateShowAnalysis(false);
                break;
            case 'analysis':
                updateShowAnalysis(true);
                updateShowWallet(false);
                break;
            default : 
                updateShowWallet(true);
                updateShowAnalysis(false);
        }
  }

  return (
  <Navbar bg="dark" variant="dark" className="header">
    <Navbar.Brand href="#home">
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
      <Nav.Link href="#analysis" onClick={() => updateNavigation('analysis')}>Analysis</Nav.Link>
    </Nav>
    </Navbar>)
}

export default Header;