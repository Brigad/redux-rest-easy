# Persistence

Redux-rest-easy works out-of-the-box with libraries such as [redux-offline](https://github.com/redux-offline/redux-offline) and [redux-persist](https://github.com/rt2zz/redux-persist). However, the library will need to clean the state before persisting it, so that it never ends up in an inconsistent shape.

Here is a list of actions performed when you call [getPersistableState](../api/getPersistableState.md):

* in-progress, expired and invalidated requests are deleted
* requests with `expireAt` set to `never` (`cacheLifetime` set to `Infinity`) are invalidated
* resources which are no longer referenced by any request are deleted
* resolversHashes which refer to no longer existing requests or modified resources are deleted
