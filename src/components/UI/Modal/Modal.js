import React, { Component } from 'react';

import classes from './Modal.module.css';
import Aux from '../../../hoc/Aux/Aux';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }

    componentWillUpdate() {
        console.log('[Modal] componentWillUpdate');
    }

    render () {
        return (
            <Aux>
                <Backdrop show={ this.props.show } clicked={ this.props.closeModal } />
                <div className={ classes.Modal }
                    style={{
                        display : this.props.show ? 'block' : 'none'
                    }}>
                    { this.props.children }
                </div>
            </Aux>
        )
    }
}

export default Modal;