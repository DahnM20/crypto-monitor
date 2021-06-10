import '../styles/WatchlistItem.css'
import {Col, Row, Container} from 'react-bootstrap'
import whiteStar from '../assets/whiteStar.png'

function WatchlistItem({name, marketcap, note, site}){
    const range = [1, 2, 3, 4, 5]

    return (
        <Row className='item'>
            <Col>
                <Row> 
                    <Col className='itemName'>
                        {name.toUpperCase()}
                    </Col>
                    <Col>
                    {range.map((rangeElem) =>
                        note >= rangeElem ? (
                            <span key={rangeElem.toString()}> <img className='starIcon' src={whiteStar} alt='star-icon' /> </span>
                        ) : null
                    )}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Marketcap : {marketcap}
                    </Col>
                    <Col>
                        <a className='link' href={site}> Lien vers site officiel </a>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
export default WatchlistItem;