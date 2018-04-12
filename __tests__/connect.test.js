import React, { Component } from 'react';
import connect  from '../src/connect';

test('should hoist non-react statics from wrapped component', () => {
  class Container extends Component {
    static howIsRestEasy = () => 'Awesome!';
    static foo = '<3';

    render() {
      return <div {...this.props} />;
    }
  }

  const enhancedComponent = connect(state => state)(Container)

  expect(enhancedComponent.howIsRestEasy()).toBe('Awesome!');
  expect(enhancedComponent.foo).toBe('<3');
});
