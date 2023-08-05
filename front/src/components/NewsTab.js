import News from './News.js'
import { useState, useEffect } from 'react'
import {Col, Row} from 'react-bootstrap'
import { socket } from './socket.js'

import '../styles/NewsTab.css'

function NewsTab(props){

    const [news, updateNews] = useState([])

    useEffect(() => {
        socket.on("MajNews", data => {
                const dataFiltered = data.filter(d => d.source === props.source)
                if(dataFiltered.length === 0) return
                updateNews(dataFiltered)
        });

        return () => socket.disconnect();
	  }, [])

    return (
        <div className="newsTab">
        < br/>
            {news.map(({title, img, link, index}) =>
                <Row key={`${index}-${title}`}>
                    <Col>
                        <News id={index} text={title} link={link} img={img} source={props.source}/>
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default NewsTab;