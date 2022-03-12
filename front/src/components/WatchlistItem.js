import '../styles/WatchlistItem.css'
import {Col, Row, Image } from 'react-bootstrap'

function WatchlistItem({name, img, link, status}){

    const isLive = (name) => {
        if(name == null) return false;
        name = name.toLowerCase()
        return name.includes('open') || name.includes('live')
    }
    return (
                <Row className={isLive(status) ? 'wl-i wl-i-live' : 'wl-i'}> 
                    <Col md={2} >
                        <a href={link} target="_blank" rel="noreferrer">
                            <Image fluid src={img} className="wl-i-img" />{' '}
                        </a>
                    </Col>

                    <Col md={6} className='wl-i-info-wrapper'>
                        <Row>
                            <Col md={2} className='wl-i-name'>
                                {name ? name.toUpperCase() : 'Inconnu'}
                            </Col>
                            <Col md={5}> 
                                Status <br/> 
                                <div className={isLive(status) ? 'wl-i-status wl-i-status-live' : 'wl-i-status'}> {status ? status : "Inconnu"} </div>
                            </Col>
                            <Col className='wl-i-link'>
                                <a className='wl-i-link-text' href={link}> Lien vers l'IDO </a>
                            </Col>
                        </Row>
                    </Col>
                </Row>
    )
}
export default WatchlistItem;