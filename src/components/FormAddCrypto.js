import {Form} from 'react-bootstrap'

function FormAddCrypto(){
    return(
    <Form>
        <Form.Group controlId="exampleForm.ControlInputName">
            <Form.Label>Nom crypto</Form.Label>
            <Form.Control placeholder="bitcoin" />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInputID">
            <Form.Label>ID</Form.Label>
            <Form.Control placeholder="BTC" />
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInputQuantity">
            <Form.Label>Quantité achetée</Form.Label>
            <Form.Control placeholder="1" />
        </Form.Group>
    </Form>
    )
}

export default FormAddCrypto