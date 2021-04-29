import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
    state = {
        name : '',
        email : '',
        address : {
            street : '',
            postalCode : ''
        },
        loading : false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading : true});
        const order = {
            ingredients : this.props.ingredients,
            price : this.props.price,
            customer : {
                name : 'John Doe',
                email : 'test@abc.com'
            }
        }
        axios.post('/orders.json', order)
            .then(response => {
                console.log(response);
                this.setState({loading : false});
                this.props.history.push('/');
            }, error => {
                console.log(error);
                this.setState({loading : false});
            })
    }

    render () {
        let form = (
            <form>
                <input className={classes.Input} type="text" name="name" placeholder="Enter your name" />
                <input className={classes.Input} type="email" name="email" placeholder="Enter your email" />
                <input className={classes.Input} type="text" name="street" placeholder="Enter your street name" />
                <input className={classes.Input} type="text" name="postal" placeholder="Enter your postal code" />
                <Button btnType="Success" clicked={this.orderHandler}>Order</Button>
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

export default ContactData;