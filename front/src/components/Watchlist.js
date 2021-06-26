import WatchlistItem from './WatchlistItem.js'
import '../styles/Watchlist.css'
import {Col, Row } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { server } from '../assets/env.js'

function Watchlist(){

    const [watchlist, updateWatchlist] = useState([])

    useEffect(() => {
        async function loadWatchlist() {
            const response = await fetch(`http://${server.host}:${server.port}/watchlist`);
            const json = await response.json();
            updateWatchlist(json);
        }
        loadWatchlist()
    }, [])

    return (
        <>
        <div className='title'> Watchlist </div>
        < br/>
        {watchlist.map(({name, marketcap, note, site, index}) =>
            <Row className='watchlistRow' key={`${index}-${name}`}>
              <Col>
                <WatchlistItem name={name} marketcap={marketcap} note={note} site={site} />
              </Col>
            </Row>
        )}
        </>
    )
}
export default Watchlist;