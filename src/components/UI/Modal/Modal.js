import React from 'react';

import classes from './Modal.module.css';
import Aux from '../../../hoc/Aux';
import Backdrop from '../Backdrop/Backdrop';

const modal = props => (
    <Aux>
        <Backdrop show={ props.show } clicked={ props.closeModal } />
        <div className={ classes.Modal }
            style={{
                display : props.show ? 'block' : 'none'
            }}>
            { props.children }
        </div>
    </Aux>
);

export default modal;