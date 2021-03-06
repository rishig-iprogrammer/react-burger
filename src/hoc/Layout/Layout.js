import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../Aux/Aux';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        showSideDrawer : false
    }

    closeSideDrawerHandler = () => {
        this.setState({showSideDrawer : false});
    }

    sideDrawerTogglehandler = () => {
        this.setState((prevState) => {
          return  { showSideDrawer : !prevState.showSideDrawer }
        })
    }

    render() {
        return (
            <Aux>
                <Toolbar 
                    isAuth={this.props.isAuthenticated}
                    drawerToggleClicked={this.sideDrawerTogglehandler} />
                <SideDrawer 
                    isAuth={this.props.isAuthenticated}
                    closed={ this.closeSideDrawerHandler } 
                    open = { this.state.showSideDrawer }
                />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated : state.auth.token !== null
    }
}

export default connect(mapStateToProps) (Layout);