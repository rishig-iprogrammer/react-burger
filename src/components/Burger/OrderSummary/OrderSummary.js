import React, { Component } from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';



class OrderSummary extends Component {
    componentWillUpdate() {
        console.log('[OrderSummary] componentWillUpdate');
    }

    render () {
        const ingredientsSummary = Object.keys(this.props.ingredients)
            .map(igKey => {
                return <li key={igKey}><span style={{textTransform : 'capitalize'}}>{ igKey }</span> : { this.props.ingredients[igKey] }</li>
            })
        return (
            <Aux>
                <h3>Order Summary</h3>
                <p>Burger with the following ingredients : </p>
                <ul>
                    { ingredientsSummary }
                </ul>
                <p><strong>Total Price : ${this.props.totalPrice.toFixed(2)}</strong></p>
                <p>Continue to checkout?</p>
                <Button clicked={this.props.continuePurchase} btnType="Success">Continue</Button>
                <Button clicked={this.props.cancelPurchase} btnType="Danger">Cancel</Button>
            </Aux>
        );
    }
}

export default OrderSummary;