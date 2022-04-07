import WatchlistItem from './WatchlistItem.js'
import '../styles/Watchlist.css'
import {Col, Row } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { server } from '../assets/env.js'

function Watchlist(){

    const [watchlist, updateWatchlist] = useState([])

    function comparatorWacthlist(a,b){
        const aStatus = a.status?.toLowerCase()
        const bStatus = b.status?.toLowerCase()

        if(aStatus?.includes('upcoming') || aStatus?.includes('open')){
            return -1
        } else if (bStatus?.includes('upcoming') || bStatus?.includes('open')){
            return 1
        } else {
            return 0
        }
    }

    useEffect(() => {
        async function loadWatchlist() {
            const response = await fetch(`http://${server.host}:${server.port}/ido`);
            const json = await response.json();
            json.sort(comparatorWacthlist)
            updateWatchlist(json);
        }
        loadWatchlist()
    }, [])

    return (
        <div className='wl-wrapper'>
            <div className='title'> IDO Watchlist </div>
            <div className='watchlistScroller'>
                {watchlist.map(({name, img, link, status, index}) =>
                    <Row className='watchlistRow' key={`${index}-${name}`}>
                    <Col>
                        <WatchlistItem name={name} img={img} status={status} link={link} />
                    </Col>
                    </Row>
                )}
            </div>
        </div>
    )
}
export default Watchlist;