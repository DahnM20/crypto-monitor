import {Button} from 'react-bootstrap'
import '../styles/ButtonAddAsset.css'
import { useState } from 'react'
import ModalAddCrypto from './ModalAddCrypto.js'

function ButtonAddAsset(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <div style={{padding: '10px'}}>
            <Button className='buttonAddAsset' onClick={handleShow}> Ajouter dans portefeuille </Button>
            <ModalAddCrypto show={show} handleClose={handleClose} />
        </div>
    )
}

export default ButtonAddAsset;