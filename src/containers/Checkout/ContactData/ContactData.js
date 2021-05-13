import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
    state = {
        orderForm : {
            name : {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'Your name'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            street : {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'Your street'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            zipCode : {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'ZIP Code'
                },
                value : '',
                validation : {
                    required : true,
                    minLength : 5,
                    maxLength : 10
                },
                valid : false,
                touched : false
            },
            country : {
                elementType : 'input',
                elementConfig : {
                    type : 'text',
                    placeholder : 'Country'
                },
                value : '',
                validation : {
                    required : true
                },
        valid : false,
                touched : false
            },
            email : {
                elementType : 'input',
                elementConfig : {
                    type : 'email',
                    placeholder : 'Your email'
                },
                value : '',
                validation : {
                    required : true
                },
                valid : false,
                touched : false
            },
            deliveryMethod : {
                elementType : 'select',
                elementConfig : {
                    options : [
                        {value : 'fastest', displayValue : 'Fastest'},
                        {value : 'cheapest', displayValue : 'Cheapest'}
                    ]
                },
                value : 'fastest'
            }
        },
        formIsValid : false,
        loading : false
    }

    orderHandler = (event) => {
        event.preventDefault();
        let formData = {};
        for(let formNameIdentifier in this.state.orderForm) {
            formData[formNameIdentifier] = this.state.orderForm[formNameIdentifier].value;
        }
        const order = {
            ingredients : this.props.ings,
            price : this.props.price,
            orderData : formData
        }

        this.props.onOrderBurger(order); // call the action
    }

    checkValidity(value, rules) {
        let isValid = true;
        if(rules) {
            if(rules.required) {
                isValid = value.trim() !== '' && isValid;
            }
            if(rules.minLength) {
                isValid = value.length >= rules.minLength && isValid;
            }
            if(rules.maxLength) {
                isValid = value.length <= rules.maxLength && isValid;
            }
        }
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        //clone list of elements
        const updatedOrderForm = {
            ...this.state.orderForm
        }
        //get details of a particular form element since previous statement doesn't create a deep clone
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        }
        //change the value in the clone element
        updatedFormElement.value = event.target.value;
        //update the validity of the element
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        //replace the element in the cloned list of elements
        updatedOrderForm[inputIdentifier] = updatedFormElement
        //check overall validity
        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({orderForm : updatedOrderForm, formIsValid : formIsValid });


    }

    render () {
        const formElementsArray = [];
        for(let key in this.state.orderForm) {
            formElementsArray.push({
                id : key,
                config : this.state.orderForm[key]
            })
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                        shouldValidate = {formElement.config.validation}
                        touched = {formElement.config.touched}
                        invalid={!formElement.config.valid}
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>Order</Button>
            </form>
        );
        if(this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter contact details</h4>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        price : state.totalPrice,
        ings : state.ingredients
    }
}

const mapDispatchToProps = dispatch => {
    onOrderBurger : (orderData) => dispatch(actions.purchaseBurgerStart(orderData))
}

export default connect(mapStateToProps) ( withErrorHandler (ContactData, axios));