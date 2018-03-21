# `getPersistableState(state, options)`

Returns a state pruned from outdated data. [Read more](../principles/persistence.md) about what is removed from the state exactly.

#### Arguments

1.  (_state_): (`object`) The current Redux state
2.  (_persistOptions_): (`object`) An object containing additional, optional options for the pruning:

A. (_alwaysPersist_): (`string || array<string>`) String or array of strings containing resource name(s). Request performing on the resource(s) will **always** be persisted, expired or not
B. (_neverPersist_): (`string || array<string>`) String or array of strings containing resource name(s). Request performing on the resource(s) will **never** be persisted, expired or not

#### Returns

(_state_): A new state, pruned from outdated data

#### Example

This example demonstrates how to integrate [redux-offline](https://github.com/redux-offline/redux-offline) with redux-rest-easy, by creating a [transform with redux-persist](https://github.com/rt2zz/redux-persist#transforms), a dependency of redux-offline.

```js
import { getPersistableState } from '@brigad/redux-rest-easy';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
// No need to manually install redux-persist if you already have installed redux-offline
import { createTransform } from 'redux-persist';

const restEasyTransform = createTransform(
  state =>
    getPersistableState(state, {
      persist: { alwaysPersist: ['tokens'], neverPersist: ['configuration'] },
    }),
  null,
  {
    whitelist: ['restEasy'],
  },
);

const createPersistedStore = (persistCallback, initialStore = {}) => {
  const offlineCustomConfig = {
    ...offlineConfig,
    persistCallback,
    persistOptions: {
      whitelist: ['restEasy'],
      transforms: [restEasyTransform],
    },
  };

  return createStore(
    reducers,
    initialStore,
    compose(applyMiddleware(thunkMiddleware), offline(offlineCustomConfig)),
  );
};

export default createPersistedStore;
```

#### Tips

* `persistOptions.alwaysPersist` is a great way to persist resources you would never want to expire
* `persistOptions.neverPersist` is a great way to clear some resources each time your app starts
