import React from 'react';
import { render } from 'react-dom';
import App, { UserRow, UserInfoDisplay } from './App';
import {shallow} from 'enzyme';
// import { expect } from 'chai';
import { spy, stub } from 'sinon';

const wrapper = shallow(<App />);

it('renders without crashing', () => {
  const div = document.createElement('div');
  render(<App />, div);
});

xit('should render the App component', () => {
  expect(wrapper.find('.App').length).to.equal(1);
  expect(wrapper.find('input').length).to.equal(1);
  expect(wrapper.find('button').length).to.equal(1);
});

xit('should render the child components', () => {
  expect(wrapper.find(UserInfoDisplay).length).to.equal(1);
});

xit('should render the user rows', () => {
  wrapper.setState({
    users: [{
      id: 117,
      name : 'John',
      public_repos: 1,
    }]
  });
  expect(wrapper.find(UserRow).length).to.equal(1);
});

it('should call getUserNames on click of the button', () => {
  const instance = wrapper.instance();
  const funcSpy = jest.spyOn(instance, 'getUserNames')
  const getProfileStub = stub(instance, 'getProfileInfo').callsFake(() => {});
  const dummySpy = spy(instance, 'dummyFn');
  wrapper.find('button').first().simulate('click');
  // expect(dummySpy.calledOnce).to.be.true;
  expect(funcSpy).toHaveBeenCalled();
})


