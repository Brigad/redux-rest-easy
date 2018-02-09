import React from 'react';
import { connect } from 'react-redux';

/* eslint-disable no-underscore-dangle */

const getDisplayName = name => `EasyConnect(${name})`;

const easyConnect = injectProps => (
  mapStateToProps,
  mapDispatchToProps,
  ...otherArgs
) => {
  const modifiedMapDispatchToProps
    = mapDispatchToProps && typeof mapDispatchToProps === 'function'
      ? (...mapDispatchToPropsArgs) => {
          const dispatchedProps = mapDispatchToProps(...mapDispatchToPropsArgs);

          return Object.keys(dispatchedProps).reduce(
            (prev, key) => ({
              ...prev,
              [key]: (...actionArgs) => {
                const promise = dispatchedProps[key](...actionArgs);

                if (promise && promise.__actionName && promise.__requestURL) {
                  injectProps(promise.__actionName, promise.__requestURL);

                  delete promise.__actionName;
                  delete promise.__requestURL;
                }

                return promise;
              },
            }),
            {},
          );
        }
      : {};

  return connect(mapStateToProps, modifiedMapDispatchToProps, ...otherArgs);
};

export default (...args) => (WrappedComponent) => {
  const wrappedComponentName
    = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  class EasyConnect extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        __requestURLsByActionKey: {},
      };

      this.ConnectedComponent = easyConnect(this.onInjectProps)(...args)(
        WrappedComponent,
      );
    }

    onInjectProps = (actionName, requestURL) => {
      this.setState(
        prevState =>
          prevState.__requestURLsByActionKey[actionName] !== requestURL
            ? {
                __requestURLsByActionKey: {
                  ...prevState.__requestURLsByActionKey,
                  [actionName]: requestURL,
                },
              }
            : null,
      );
    };

    render() {
      const { ConnectedComponent } = this;
      const passedProps = {
        ...this.props,
        ...this.state,
      };

      return <ConnectedComponent {...passedProps} />;
    }
  }

  EasyConnect.displayName = getDisplayName(wrappedComponentName);

  return EasyConnect;
};
