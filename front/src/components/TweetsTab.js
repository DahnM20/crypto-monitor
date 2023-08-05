import React from 'react'
import TweetQuery from './TweetQuery'
import { server } from '../assets/env.js'
import { useQuery } from 'react-query'
import {Col, Row } from 'react-bootstrap'
import Tweet from './Tweet'

function TweetsTab() {
    /*const { data, status } = useQuery('tweets', fetchTweets)

    async function fetchTweets() {
        const response = await fetch(`http://${server.host}:${server.port}/tweets`)
        const json = await response.json()
        return json
    }*/

    return (
        <div>
            <TweetQuery />
            {/* < br/>
            { 
                data.map(({id, link, text, author, author_image, index}) =>
                <Row key={`${index}-${id}`}>
                    <Col>
                        <Tweet id={id} text={text} link={link} author_image={author_image}/>
                    </Col>
                </Row>
            )} */}
        </div>
    )
}

export default TweetsTab
