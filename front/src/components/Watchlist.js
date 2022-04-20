import WatchlistItem from './WatchlistItem.js'
import '../styles/Watchlist.css'
import {Col, Row } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { server } from '../assets/env.js'

function Watchlist(){

    const { data, status } = useQuery('watchlist', fetchIdo)

    async function fetchIdo() {
        const response = await fetch(`http://${server.host}:${server.port}/ido`)
        const json = await response.json()
        json.sort(comparatorWacthlist)
        return json
    }

    function comparatorWacthlist(a,b){
        const aStatus = a.status?.toLowerCase()
        const bStatus = b.status?.toLowerCase()

        if(aStatus?.includes('upcoming') || aStatus?.includes('open') || aStatus?.includes('live')){
            return -1
        } else if (bStatus?.includes('upcoming') || bStatus?.includes('open') || aStatus?.includes('live')){
            return 1
        } else {
            return 0
        }
    }

    if(status == "loading"){
        return (
            <p className='wl-message'> Chargement en cours de la liste ... </p>
        )
    }

    if(status == "error"){
        return (
            <p className='wl-message'> Erreur lors du chargement de la liste </p>
        )
    }

    return (
        <div className='wl-wrapper'>
            <div className='title'> IDO Watchlist </div>
            <div className='watchlistScroller'>
                {data.map(({name, img, link, status, index}) =>
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