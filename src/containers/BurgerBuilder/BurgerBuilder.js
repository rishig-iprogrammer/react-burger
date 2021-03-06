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
import * as actions from '../../store/actions/index';

export class BurgerBuilder extends Component {

    state = {
        purchasing : false
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }

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
        if(this.props.isAuthenticated) {
            this.setState({purchasing : true})
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push("/auth");
        }
        
    }

    cancelPurchasingState = () => {
        this.setState({purchasing : false})
    }

    continuePurchaseHandler = () => {
        this.props.onInitPurchase();
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
         
        
        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />
        if(this.props.ing) {
            burger = (
                <Aux>
                    <Burger ingredients={ this.props.ing } />
                    <BuildControls 
                        ingredientRemoved = {this.props.onIngredientRemoved}
                        ingredientAdded = {this.props.onIngredientAdded}
                        disabled = {disabledInfo}
                        price = { this.props.price }
                        isAuth= {this.props.isAuthenticated}
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
        ing : state.burgerBuilder.ingredients,
        price : state.burgerBuilder.totalPrice,
        error : state.burgerBuilder.error,
        isAuthenticated : state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded : (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved : (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients : () => dispatch(actions.initIngredients()),
        onInitPurchase : () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath : (path) => dispatch(actions.setAuthPathRedirect(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios));