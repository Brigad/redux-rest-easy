# Selectors

Selectors are functions which allow accessing any relevant information stored in the state. They are helpful, especially because `redux-rest-easy` state is generated and managed by the library itself.

There are 3 types of selectors :

* linked to a request: helpful to map a component to the payload of a specific request
* linked to a resource: helpful to map a component to a whole resource
* linked to a resource Id: helpful to map a component to a single item

And for each type, here is a sneak peek of what information you can access:

* the payload of the request/resource/resourceId
* could we perform on the request/resource/Id
* are we performing on the request/resource/Id
* has the request/resource/Id succeeded
* has the request/resource/Id failed

For a complete documentation on selectors, see the [selectors documentation](../api/createResource/selectors.md).
