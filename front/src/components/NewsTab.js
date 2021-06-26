import News from './News.js'
import { useState, useEffect } from 'react'
import {Col, Row} from 'react-bootstrap'
import { socket } from './socket.js'

import '../styles/NewsTab.css'

function NewsTab(){

    const [news, updateNews] = useState([])

    useEffect(() => {
        socket.on("MajNews", data => {
                updateNews(data)
        });

        return () => socket.disconnect();
	  }, [])

    return (
        <div className="newsTab">
        < br/>
            {news.map(({title, img, link, index}) =>
                <Row key={`${index}-${title}`}>
                    <Col>
                        <News id={index} text={title} link={link} img={img}/>
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default NewsTab;