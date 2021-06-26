import {Modal, Button} from 'react-bootstrap'
import '../styles/ModalAddCrypto.css'
import FormAddCrypto from './FormAddCrypto.js'
import { useState } from 'react'
import { server } from '../assets/env.js'

function ModalAddCrypto({show, handleClose}){

    const [name, updateName] = useState('')
    const [id, updateId] = useState('')
    const [quantity, updateQuantity] = useState(0)

    async function handleSubmit(){
      const body = { 'name' : name, 'id' : id, 'quantity' : quantity }
      
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        };

        const response = await fetch(`http://${server.host}:${server.port}/wallet`, requestOptions)
        const data = await response.json()
        console.log('DATA : ' + data)
        
        handleClose()
    }

    return (
        <Modal show={show} onHide={handleClose}>
        <Modal.Header className='addCryptoModal'>
          <Modal.Title>Ajouter dans le portefeuille</Modal.Title>
        </Modal.Header>
        <Modal.Body className='addCryptoModal'>
            <FormAddCrypto updateName={updateName} updateId={updateId} updateQuantity={updateQuantity}/>
        </Modal.Body>
        <Modal.Footer className='addCryptoModal'> 
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default ModalAddCrypto