import '../styles/Wallet.css'
import CryptoAsset from './CryptoAsset.js'
import ButtonAddAsset from './ButtonAddAsset.js'
import WalletPieChart from './WalletPieChart.js'
import {Col, Row, Container} from 'react-bootstrap'

function Wallet({wallet}) {
  return (
    <>
    <h4 className='walletTitle'>  Portefeuille </h4>
    <WalletPieChart />
    < br />
    < br />
    <ButtonAddAsset />
    < br />
    < br />
    {wallet.map(({name, quantity, id, color}) =>
            <>
            <Row key={id}>
              <Col>
                <CryptoAsset name={name} quantity={quantity} id={id} color={color} />
              </Col>
            </Row> 
            < br/>
            </>
    )}
    </>
    )
}

export default Wallet;