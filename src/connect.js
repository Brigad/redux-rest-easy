/* eslint-disable import/no-unresolved, import/extensions */
import React, { forwardRef } from 'react';
import { connect } from 'react-redux';
import hoistStatics from 'hoist-non-react-statics';
/* eslint-enable import/no-unresolved, import/extensions */

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
      : mapDispatchToProps;

  return connect(
    mapStateToProps,
    modifiedMapDispatchToProps,
    ...otherArgs,
  );
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
      // eslint-disable-next-line react/prop-types
      const { forwardedRef, ...otherProps } = this.props;
      const passedProps = {
        ...otherProps,
        ...this.state,
        ref: forwardedRef,
      };

      return <ConnectedComponent {...passedProps} />;
    }
  }

  EasyConnect.displayName = getDisplayName(wrappedComponentName);
  EasyConnect.WrappedComponent = WrappedComponent;

  if (args[3] && args[3].forwardRef) {
    // eslint-disable-next-line react/no-multi-comp
    const forwarded = forwardRef((props, ref) => (
      <EasyConnect {...props} forwardedRef={ref} />
    ));

    forwarded.displayName = wrappedComponentName;
    forwarded.WrappedComponent = WrappedComponent;

    return hoistStatics(forwarded, WrappedComponent);
  }

  return hoistStatics(EasyConnect, WrappedComponent);
};
