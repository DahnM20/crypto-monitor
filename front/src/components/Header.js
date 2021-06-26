import '../styles/Header.css';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logoSolana.png';

function Header() {
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
    </Navbar>)
}

export default Header;