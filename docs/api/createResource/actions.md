# Actions

Creating a resource with [createResource](../createResource.md) will return an object containing an `actions` key, with the following properties:

```js
const resource = {
  actions: {
    resource: {
      invalidate: func,
      invalidateId: func,
      reset: func,
    },
    actionName1: {
      perform: func,
      invalidate: func,
    },
    actionName2: {
      perform: func,
      invalidate: func,
    },
    ...,
  },
};
```

These functions can be imported in components and directly dispatched.

`resource.invalidate` and `resource.invalidateId` respectively invalidate the requests performed on the related resource and resource id.

`resource.reset` removes resources and requests linked to the resource from your state.

`actionName.invalidate` invalidates the related request.

`actionName.perform` performs the request, accepting the following object as an argument:

#### Properties

1.  (_urlParams_): (`map<urlParam:value>`) An object to replace dynamic parameters in the URL (see [actions config documentation](./actionsConfig.md#properties))
2.  (_query_): (`map<queryParam:value>`) An object to prepend a query to the URL
3.  (_body_): (`map<bodyParam:value>`) An object to specify the body of the request (e.g. POST)
4.  (_onSuccess_): (`(normalizedPayload, otherArgs) : undefined`) A hook which will be invoked after the request has performed successfully. Useful to update the UI accordingly, at the component level
5.  (_onFailure_): (`(error) : undefined`) A hook which will be invoked when the request fails. Useful to update the UI accordingly, at the component level
6.  (_...otherArgs_): (`any`) You can also pass any other args you may need in `beforeHook`, `normalizer`, `afterHook`, and `onSuccess`. They will be forwarded to these functions, as an object

#### Example

This example demonstrates a sample call to an `action`.

```js
import { actionName1 } from './rest-easy/resource';

const args = {
  urlParams: { userId: 1 },
  query: { page: 2 },
  body: { age: 21 },
  onSuccess: () =>
    console.log('Success! Component will update the UI accordingly!'),
  onError: error => console.log('Failed with error: ', error),
};

const mapDispatchToProps = dispatch => ({
  action1: (arg1, arg2) => dispatch(actionName1(args)),
  action2: () => dispatch(actionName1()),
});
```
