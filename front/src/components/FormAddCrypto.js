import {Form} from 'react-bootstrap'

function FormAddCrypto({updateName, updateId, updateQuantity}){
    function handleNameChange(field){
        updateName(field.target.value)

    }

    function handleIDChange(field){
        updateId(field.target.value)
    }

    function handleQuantityChange(field){
        updateQuantity(parseFloat(field.target.value))
    }

    return(
    <Form>
        <Form.Group controlId="exampleForm.ControlInputName">
            <Form.Label>Nom crypto</Form.Label>
            <Form.Control placeholder="bitcoin" onChange={(e) => handleNameChange(e)}/>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInputID">
            <Form.Label>ID</Form.Label>
            <Form.Control placeholder="BTC" onChange={(e) => handleIDChange(e)}/>
        </Form.Group>
        <Form.Group controlId="exampleForm.ControlInputQuantity">
            <Form.Label>Quantité achetée</Form.Label>
            <Form.Control placeholder="1"onChange={(e) => handleQuantityChange(e)} />
        </Form.Group>
    </Form>
    )
}

export default FormAddCrypto