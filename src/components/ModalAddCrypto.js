import {Col, Row, Modal, Button} from 'react-bootstrap'
import '../styles/ModalAddCrypto.css'
import FormAddCrypto from './FormAddCrypto.js'

function ModalAddCrypto({show, handleClose}){

    return (
        <Modal show={show} onHide={handleClose}>
        <Modal.Header className='addCryptoModal'>
          <Modal.Title>Ajouter dans le portefeuille</Modal.Title>
        </Modal.Header>
        <Modal.Body className='addCryptoModal'>
            <FormAddCrypto />
        </Modal.Body>
        <Modal.Footer className='addCryptoModal'> 
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default ModalAddCrypto