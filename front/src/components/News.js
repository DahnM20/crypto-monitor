import {Col, Row, Image} from 'react-bootstrap'
import '../styles/News.css'

function News({id, link, text, img}){
    return (
        <Row className='news new-animation' key={id}>
            <Col md={3}>
                <a href={link} target="_blank" rel="noreferrer">
                    <Image fluid
                        src={img}
                    />{' '}
                </a>
            </Col>
            <Col className='colContent'>
                <Row>
                    <Col md={12} className='newsText'>
                        {text}
                    </Col>
                </Row>
                <Row className='linkRow'>
                    <Col md={12} className='linkCol'>
                        <a href={link} className='newsLink' target="_blank" rel="noreferrer"> Voir l'article sur cryptoast </a>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
export default News;