import {Form, Button, InputGroup} from 'react-bootstrap'
import { useState } from 'react'
import { server } from '../assets/env.js'
import '../styles/UpdateQuantityForm.css'
import swal from 'sweetalert';

function UpdateQuantityForm({quantity, updateQuantity, name, updateModify}){

    const [fieldValue, updateFieldValue] = useState(quantity)

    function handleQuantityChange(field){
        updateFieldValue(parseFloat(field.target.value))
    }

    async function handleValidate(){
        const body = { 'name' : name, 'quantity' : fieldValue }
        updateQuantity(fieldValue)
      
        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        };

        const response = await fetch(`http://${server.host}:${server.port}/wallet`, requestOptions)
        const data = await response.json()

        if(data.result.ok){
            swal(`Quantité de ${name} modifiée !`, {
                buttons: false,
                icon: 'success',
                timer: 1500,
            });
            updateModify(false)
        } else {
            swal(`Erreur lors de l'envoi, veuillez réessayer`, {
                buttons: false,
                icon: 'error',
                timer: 1500,
            });
        }
    }

    return (
        <InputGroup className="mb-3">
            <Form.Control placeholder={fieldValue} onChange={(e) => handleQuantityChange(e)} />
            <InputGroup.Append>
                <Button variant="outline-secondary" onClick={handleValidate}> Update </Button>
            </InputGroup.Append>
        </InputGroup>
    )
}

export default UpdateQuantityForm;