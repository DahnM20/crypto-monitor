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
    <WalletPieChart wallet={wallet}/>
    <ButtonAddAsset />
    <DailyPerf wallet={wallet} />
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