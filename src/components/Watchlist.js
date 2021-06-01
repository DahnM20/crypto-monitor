import WatchlistItem from './WatchlistItem.js'
import '../styles/Watchlist.css'
import { watchlist } from '../assets/cryptoDatas'
import {Col, Row, Container} from 'react-bootstrap'

function Watchlist(){
    return (
        <>
        <div className='title'> Watchlist </div>
        < br/>
        {watchlist.map(({name, marketcap, note, site}) =>
            <>
            <Row key={name}>
              <Col>
                <WatchlistItem name={name} marketcap={marketcap} note={note} site={site} />
              </Col>
            </Row> 
            < br/>
            </>
        )}
        </>
    )
}
export default Watchlist;