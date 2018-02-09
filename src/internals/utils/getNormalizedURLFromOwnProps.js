/* eslint-disable no-underscore-dangle, no-console */

const getNormalizedURLFromOwnProps = (resourceName, actionName, ownProps) => {
  if (!ownProps) {
    console.error(
      `You seem to have forgotten to pass ownProps to a selector related to ${resourceName}.${actionName}`,
    );
    return '';
  }

  if (!ownProps.__requestURLsByActionKey) {
    console.error(
      `You seem to have forgotten to use redux-rest-easy's connect on a Component which requested ${resourceName}.${actionName}`,
    );
    return '';
  }

  return ownProps.__requestURLsByActionKey[actionName];
};

export default getNormalizedURLFromOwnProps;
