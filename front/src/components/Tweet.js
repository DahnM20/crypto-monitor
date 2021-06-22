import {Col, Row, Image} from 'react-bootstrap'
import '../styles/Tweet.css'

function Tweet({id, link, text, author, author_image}){
    return (
        <Row key={id}>
            <Col md={1}>
                <Image fluid roundedCircle
                    src={author_image}
                />{' '}
            </Col>
            <Col className='tweetContainer'>
                <Row>
                    <Col md={12} className='tweetText'>
                        {text}
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className='tweetLink'>
                        <a href={link} > Lien </a>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
export default Tweet;