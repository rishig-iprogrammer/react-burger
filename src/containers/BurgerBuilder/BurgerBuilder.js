import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
    salad : 0.4,
    meat : 1.0,
    bacon : 0.5,
    cheese : 0.9
}

class BurgerBuilder extends Component {

    state = {
        ingredients : {
            salad : 0,
            meat : 0,
            cheese : 0,
            bacon : 0
        },
        totalPrice : 2,
        purchasable : false,
        purchasing : false
    }

    updatePurchasableState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((s, el) => {
                return s + el
            }, 0);
        
        this.setState({purchasable : sum > 0});
    }

    addIngredientHandler = type => {
        //update ingredients
        const oldCount = this.state.ingredients[type];
        const newCount = oldCount + 1;

        const newIngredients = {
            ...this.state.ingredients
        }
        newIngredients[type] = newCount;

        //update price
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + INGREDIENT_PRICES[type];

        this.setState({totalPrice : newPrice, ingredients : newIngredients});
        this.updatePurchasableState(newIngredients);
    }

    removeIngredientHandler = type => {
        //update ingredients
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0) {
            return;
        }
        const newCount = oldCount - 1;

        const newIngredients = {
            ...this.state.ingredients
        }
        newIngredients[type] = newCount;

        //update price
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - INGREDIENT_PRICES[type];

        this.setState({totalPrice : newPrice, ingredients : newIngredients});
        this.updatePurchasableState(newIngredients);
    }

    updatePurchasingState = () => {
        this.setState({purchasing : true})
    }

    cancelPurchasingState = () => {
        this.setState({purchasing : false})
    }

    continuePurchaseHandler = () => {
        alert('Done!');
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        return(
            <Aux>
                <Modal 
                    show={this.state.purchasing}
                    closeModal = {this.cancelPurchasingState} >
                    <OrderSummary 
                        ingredients={ this.state.ingredients } 
                        continuePurchase ={ this.continuePurchaseHandler }
                        cancelPurchase = { this.cancelPurchasingState }
                        totalPrice = { this.state.totalPrice }
                    />
                </Modal>
                <Burger ingredients={ this.state.ingredients } />
                <BuildControls 
                    ingredientRemoved = {this.removeIngredientHandler}
                    ingredientAdded = {this.addIngredientHandler}
                    disabled = {disabledInfo}
                    price = { this.state.totalPrice }
                    purchasable = { this.state.purchasable }
                    ordered = { this.updatePurchasingState }
                />
            </Aux>
        );
    }
}

export default BurgerBuilder;