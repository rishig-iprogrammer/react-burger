import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({adapter : new Adapter()});

describe('<NavigationItems />', ()=> {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<NavigationItems />);
    })

    it('should render two <NaivgationItem /> elements if user is not authenticated', () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    })
    it('should render three <NaivgationItem /> elements if user is authenticated', () => {
        wrapper.setProps({isAuthenticated : true});
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    })
    it('should render Logout <NaivgationItem /> if user is authenticated', () => {
        wrapper.setProps({isAuthenticated : true});
        expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true);
    })
})