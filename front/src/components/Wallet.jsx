import '../styles/Wallet.css'
import CryptoAsset from './CryptoAsset'
import ButtonAddAsset from './ButtonAddAsset'
import WalletPieChart from './WalletPieChart'
import {Col, Row } from 'react-bootstrap'
import { compareAsset } from './utils';
import DailyPerf from './DailyPerf';

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
    { wallet.sort(compareAsset).map(({name, quantity, id, currentValue, dailyBenef, currentPrice, icon}) =>
            <Row className='assetRow' key={id}>
              <Col>
                <CryptoAsset name={name} quantity={quantity} currentValue={currentValue} dailyBenef={dailyBenef} currentPrice={currentPrice} id={id} icon={icon} />
              </Col>
            </Row>
    )}
    </>
    )
}

export default Wallet;