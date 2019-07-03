const { put } = require('../requests');

/**
 * submitPendingCaseAssociationRequestInteractor
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.submitPendingCaseAssociationRequestInteractor = ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();
  return put({
    applicationContext,
    endpoint: `/users/${user.userId}/case/${caseId}/pending`,
  });
};
