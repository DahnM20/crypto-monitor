import React from 'react'
import TweetQuery from './TweetQuery'
import { server } from '../assets/env.js'
import { useState, useEffect } from 'react'
import {Col, Row } from 'react-bootstrap'
import Tweet from './Tweet'

function TweetsTab() {

    const [tweets, updateTweets] = useState([])

    useEffect(() => {
        async function loadTweets() {
            const response = await fetch(`http://${server.host}:${server.port}/tweets`);
            const json = await response.json();
            updateTweets(json);
        }
        loadTweets()
	  }, [])

    return (
        <div>
            <TweetQuery />
            < br/>
            {tweets.map(({id, link, text, author, author_image, index}) =>
                <Row key={`${index}-${id}`}>
                    <Col>
                        <Tweet id={id} text={text} link={link} author_image={author_image}/>
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default TweetsTab
