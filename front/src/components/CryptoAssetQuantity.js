import UpdateQuantityForm from "./UpdateQuantityForm";

function CryptoAssetQuantity({quantity, updateQuantity, updateModify, modify, id, name}) {
    return (
        modify ? 
            <UpdateQuantityForm name={name} updateQuantity={updateQuantity} quantity={quantity} updateModify={updateModify}/>
        :
            <span>
                Quantité : {quantity} {id}
            </span>
    )
}

export default CryptoAssetQuantity;

