import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {

    state = {
        purchasing : false,
        loading : false,
        error : false
    }

    // componentDidMount() {
        // axios.get('https://react-my-burger-43488-default-rtdb.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients : response.data});
        //     })
        //     .catch(error => {
        //         this.setState({error : true})
        //     })
    // }

    updatePurchasableState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((s, el) => {
                return s + el
            }, 0);
        
        return sum > 0;
    }

    updatePurchasingState = () => {
        this.setState({purchasing : true})
    }

    cancelPurchasingState = () => {
        this.setState({purchasing : false})
    }

    continuePurchaseHandler = () => {
        this.props.history.push('/checkout');
    }

    
    

    render() {
        const disabledInfo = {
            ...this.props.ing
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;
         
        
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />
        if(this.props.ing) {
            burger = (
                <Aux>
                    <Burger ingredients={ this.props.ing } />
                    <BuildControls 
                        ingredientRemoved = {this.props.onIngredientRemoved}
                        ingredientAdded = {this.props.onIngredientAdded}
                        disabled = {disabledInfo}
                        price = { this.props.price }
                        purchasable = { this.updatePurchasableState(this.props.ing) }
                        ordered = { this.updatePurchasingState }
                    />
                </Aux>
            );

            orderSummary = <OrderSummary 
                ingredients={ this.props.ing } 
                continuePurchase ={ this.continuePurchaseHandler }
                cancelPurchase = { this.cancelPurchasingState }
                totalPrice = { this.props.price } />;
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

const mapStateToProps = state => {
    return {
        ing : state.ingredients,
        price : state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded : (ingName) => dispatch({type : actionTypes.ADD_INGREDIENT, ingredientName : ingName}),
        onIngredientRemoved : (ingName) => dispatch({type : actionTypes.REMOVE_INGREDIENT, ingredientName : ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios));