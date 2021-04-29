import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad : 0.4,
    meat : 1.0,
    bacon : 0.5,
    cheese : 0.9
}

class BurgerBuilder extends Component {

    state = {
        ingredients : null,
        totalPrice : 2,
        purchasable : false,
        purchasing : false,
        loading : false,
        error : false
    }

    componentDidMount() {
        axios.get('https://react-my-burger-43488-default-rtdb.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients : response.data});
            })
            .catch(error => {
                this.setState({error : true})
            })
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
        
        const queryParam = [];
        for(let  i in this.state.ingredients) {
            queryParam.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }
        queryParam.push('price=' + this.state.totalPrice);
        const queryString = queryParam.join('&');
        this.props.history.push({
            pathname : '/checkout/',
            search : '?' + queryString
        });
    }

    
    

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;
         
        
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />
        if(this.state.ingredients) {
            burger = (
                <Aux>
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

            orderSummary = <OrderSummary 
                ingredients={ this.state.ingredients } 
                continuePurchase ={ this.continuePurchaseHandler }
                cancelPurchase = { this.cancelPurchasingState }
                totalPrice = { this.state.totalPrice } />;
        }
        
        if(this.state.loading) {
            orderSummary = <Spinner />;
        }
        
        return(
            <Aux>
                <Modal 
                    show={this.state.purchasing}
                    closeModal = {this.cancelPurchasingState} >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);