import '../styles/Wallet.css'
import CryptoAsset from './CryptoAsset.js'
import ButtonAddAsset from './ButtonAddAsset.js'
import WalletPieChart from './WalletPieChart.js'
import {Col, Row } from 'react-bootstrap'
import { compareAsset } from './utils.js';
import DailyPerf from './DailyPerf.js';

function Wallet({wallet}) {

  return (
    <>
    <h4 className='walletTitle'>  Portefeuille </h4>
    <WalletPieChart wallet={wallet}/>
    < br />
    < br />
    <ButtonAddAsset />
    < br />
    < br />
    <DailyPerf wallet={wallet} />
    < br />
    { wallet.sort(compareAsset).map(({name, quantity, id, currentValue, dailyBenef, currentPrice, color}) =>
            <Row className='assetRow' key={id}>
              <Col>
                <CryptoAsset name={name} quantity={quantity} currentValue={currentValue} dailyBenef={dailyBenef} currentPrice={currentPrice} id={id} color={color} />
              </Col>
            </Row>
    )}
    </>
    )
}

export default Wallet;