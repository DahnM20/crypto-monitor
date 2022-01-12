import '../styles/WatchlistItem.css'
import {Col, Row, Image } from 'react-bootstrap'

function WatchlistItem({name, img, link, status}){

    return (
                <Row className='item'> 
                    <Col md={2} >
                        <a href={link} target="_blank" rel="noreferrer">
                            <Image fluid
                                src={img}
                            />{' '}
                        </a>
                    </Col>
                    <Col md={2} className='itemName'>
                        {name.toUpperCase()}
                    </Col>
                    <Col md={5}> 
                        Status : {status ? status : "Inconnu"}
                    </Col>
                    <Col>
                        <a className='link' href={link}> Lien vers l'IDO </a>
                    </Col>
                </Row>
    )
}
export default WatchlistItem;