import WatchlistItem from './WatchlistItem.js'
import '../styles/Watchlist.css'
import {Col, Row } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { server } from '../assets/env.js'

function Watchlist(){

    const [watchlist, updateWatchlist] = useState([])

    useEffect(() => {
        async function loadWatchlist() {
            const response = await fetch(`http://${server.host}:${server.port}/ido`);
            const json = await response.json();
            updateWatchlist(json);
        }
        loadWatchlist()
    }, [])

    return (
        <>
        <div className='title'> IDO Watchlist </div>
        < br/>
        <div className='watchlistScroller'>
        {watchlist.map(({name, img, link, status, index}) =>
            <Row className='watchlistRow' key={`${index}-${name}`}>
              <Col>
                <WatchlistItem name={name} img={img} status={status} link={link} />
              </Col>
            </Row>
        )}
        </div>
        </>
    )
}
export default Watchlist;