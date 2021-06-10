import {Col, Row, Image} from 'react-bootstrap'
import logo from '../assets/logoSolana.png'
import '../styles/NewsMini.css'

function NewsMini({id, link, text}){
    return (
        <Row>
            <Col md={1}>
                <img
                    src={logo}
                    width="30"
                    height="30"
                />{' '}
            </Col>
            <Col>
                <Row>
                    <Col md={12} className='newsText'>
                        {text}
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className='newsLink'>
                        <a href={link} > Lien </a>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
export default NewsMini;