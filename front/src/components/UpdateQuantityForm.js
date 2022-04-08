import { Form, Button, InputGroup } from 'react-bootstrap'
import { Col, Row, Image } from 'react-bootstrap'
import { useState } from 'react'
import { server } from '../assets/env.js'
import '../styles/UpdateQuantityForm.css'
import swal from 'sweetalert';

function UpdateQuantityForm({ quantity, updateQuantity, name, updateModify }) {

    const [fieldValue, updateFieldValue] = useState(quantity)

    function handleQuantityChange(field) {
        updateFieldValue(parseFloat(field.target.value))
    }

    function manageSendAlert(status) {
        if (status) {
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

    function sendFormatAlert() {
        swal(`Format incorrect, veuillez modifier`, {
                buttons: false,
                icon: 'error',
                timer: 1500,
        });
    }

    async function handleValidate() {
        const body = { 'name': name, 'quantity': fieldValue }

        const fieldValueConverted = parseFloat(fieldValue)

        if(!fieldValueConverted) {
            sendFormatAlert()
            return
        }


        updateQuantity(fieldValueConverted)

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };

        try {
            const response = await fetch(`http://${server.host}:${server.port}/wallet`, requestOptions)
            const data = await response.json()
            manageSendAlert(data._id ? true : false)
        } catch (e) {
            manageSendAlert(false)
        }
    }

    return (
        <>
            <Row>
                <Col>
                    <p> Quantité : </p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputGroup className='uqf-input-group'>
                        <Form.Control placeholder={fieldValue} onChange={(e) => handleQuantityChange(e)} />
                        <InputGroup.Append>
                            <Button variant="outline-secondary" onClick={handleValidate}> Update </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
            </Row>
        </>
    )
}

export default UpdateQuantityForm;