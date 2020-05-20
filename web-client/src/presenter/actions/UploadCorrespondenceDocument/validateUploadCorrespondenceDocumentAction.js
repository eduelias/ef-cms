import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * validate the upload correspondence document form
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateUploadCorrespondenceDocumentAction = ({ get, path }) => {
  const { freeText, primaryDocumentFile } = get(state.form);

  let errors = {};
  let errorDisplayOrder = ['freeText', 'primaryDocumentFile'];

  if (!freeText) {
    errors.freeText = 'Enter a description';
  }

  if (!primaryDocumentFile) {
    errors.primaryDocumentFile = 'Upload a document';
  }

  console.log('freeText', freeText);
  console.log('errors', errors);
  console.log('primaryDocumentFile', primaryDocumentFile);

  if (isEmpty(errors)) {
    return path.success();
  } else {
    return path.error({
      errorDisplayOrder,
      errors,
    });
  }
};
