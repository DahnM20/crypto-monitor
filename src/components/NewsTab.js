import News from './News.js'
import {Col, Row} from 'react-bootstrap'
import { news } from '../assets/cryptoDatas'
import '../styles/NewsTab.css'

function NewsTab(){
    return (
        <div className="newsTab">
        < br/>
            {news.map(({id, text, link}) =>
                <Row>
                    <Col>
                        <News id={id} text={text} link={link} />
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default NewsTab;