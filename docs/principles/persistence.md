# Persistence

Redux-rest-easy works out-of-the-box with libraries such as [redux-offline](https://github.com/redux-offline/redux-offline) and [redux-persist](https://github.com/rt2zz/redux-persist). However, the library will need to clean the state before persisting it, so that it never ends up in an inconsistent shape.

Here is a list of actions performed when you call [getPersistableState](../api/getPersistableState.md):

* In-progress requests are deleted. _This is to avoid pending requests never resolving._
* Expired and invalidated requests are deleted. _This is to avoid keeping outdated requests possibly forever._
* Requests with `expireAt` set to `never` (`cacheLifetime` set to `Infinity`) are invalidated. _This is to avoid trusting remote data forever. Can still be done via persistOptions.alwaysPersist_
* Resources which are no longer referenced by any request are deleted. _This is to avoidkeeping outdated resources in the state._
* resolversHashes which refer to no longer existing requests or modified resources are deleted. _This is to avoidkeeping outdated hashes in the state._

The first action is mandatory to avoid inconsistent state, but the others won't be applied to requests performing on resources defined in `persistOptions.alwaysPersist` and `persistOptions.neverPersist`. Instead, such requests will always/never be persisted.
