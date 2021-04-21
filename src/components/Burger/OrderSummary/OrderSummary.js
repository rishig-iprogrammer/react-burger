import React from 'react';

import Aux from '../../../hoc/Aux';
import Button from '../../UI/Button/Button';

const orderSummary = props => {
    const ingredientsSummary = Object.keys(props.ingredients)
        .map(igKey => {
            return <li key={igKey}><span style={{textTransform : 'capitalize'}}>{ igKey }</span> : { props.ingredients[igKey] }</li>
        })
    return (
        <Aux>
            <h3>Order Summary</h3>
            <p>Burger with the following ingredients : </p>
            <ul>
                { ingredientsSummary }
            </ul>
            <p><strong>Total Price : ${props.totalPrice.toFixed(2)}</strong></p>
            <p>Continue to checkout?</p>
            <Button clicked={props.continuePurchase} btnType="Success">Continue</Button>
            <Button clicked={props.cancelPurchase} btnType="Danger">Cancel</Button>
        </Aux>
    );
}

export default orderSummary;