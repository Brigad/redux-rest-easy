# `reset()`

Resets the whole store to its original state

#### Arguments

None

#### Returns

Nothing

#### Example

This example demonstrates how to use `reset` to reset the store when the user logs out.

```js
import React from 'react';
import { reset, connect } from '@brigad/redux-rest-easy';

const LogoutButton = ({ logout }) => (
  <button onClick={logout}>{'Logout'}</button>
);

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(reset()),
});

export default connect(null, mapDispatchToProps)(LogoutButton);
```

#### Tips

* Just like any action, you have to dispatch `reset` for it to work
