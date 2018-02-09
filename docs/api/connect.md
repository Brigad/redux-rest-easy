# `connect(...connectArgs)`

Enhances [react-redux](https://github.com/reactjs/react-redux)'s connect so that `redux-rest-easy` knows which URLs have been requested by which components. If you have been using [react-redux](https://github.com/reactjs/react-redux) before, all you need to do for `redux-rest-easy` to work is changing the import from

```js
import { connect } from 'react-redux';
```

to

```js
import { connect } from '@brigad/redux-rest-easy';
```

#### Arguments

1. (_connectArgs_): The same arguments as [react-redux](https://github.com/reactjs/react-redux)'s connect. See [connect arguments](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).

#### Returns

(_component_): A component, which will be exactly the same as it would have been if wrapped in [react-redux](https://github.com/reactjs/react-redux)'s connect. See [connect's return](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).

#### Example

This example demonstrates how to use `connect` to wrap a simple component.

```js
import React, { Component } from 'react';
import { connect } from '@brigad/redux-rest-easy';
import { getUsers, isRetrievingUsers, retrieveUsers } from './rest-easy/users';

class ConnectedComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
    };
  }

  componentDidMount() {
    this.props.retrieveUsers(this.state);
  }

  componentDidUpdate(prevState) {
    if (this.state.page !== prevState.page) {
      this.props.retrieveUsers(this.state);
    }
  }

  onPageChange = newPage => {
    this.setState({ page: newPage });
  };

  render() {
    if (this.props.isRetrievingUsers) {
      return <div>{'Loading...'}</div>;
    }

    return (
      <div>
        <select value={this.state.page} onChange={this.onPageChange} />
        <Users items={this.props.users} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  users: getUsers(state, ownProps),
  isRetrievingOwnUsers: isRetrievingUsers(state, ownProps),
});

const mapDispatchToProps = dispatch => ({
  retrieveUsers: query => dispatch(retrieveUsers({ query })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedComponent);
```

#### Tips

* Selectors linked to a particular query need both `state` and `ownProps`. See [selectors documentation](./createResource/selectors.md#selectors).
