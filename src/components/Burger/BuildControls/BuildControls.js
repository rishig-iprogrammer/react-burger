import React from 'react';

import classes from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    {label : 'Salad', type : 'salad'},
    {label : 'Meat', type : 'meat'},
    {label : 'Cheese', type : 'cheese'},
    {label : 'Bacon', type : 'bacon'}
]

const buildControls = props => (
    <div className={ classes.BuildControls }>
        <p>Burger Price : <strong>${props.price.toFixed(2)}</strong></p>
        { controls.map(ctrl => (
            <BuildControl 
                key={ ctrl.label } 
                label={ ctrl.label } 
                removed = {() => props.ingredientRemoved(ctrl.type)}
                added = {() => props.ingredientAdded(ctrl.type)} 
                disabled = { props.disabled[ctrl.type] }
            />
        )) }
        <button 
            className={ classes.OrderButton } 
            disabled = { !props.purchasable }
            onClick = { props.ordered }
        >
            {props.isAuth ? 'Place Order' : 'Sign In to order'}
        </button>
    </div>
)

export default buildControls;