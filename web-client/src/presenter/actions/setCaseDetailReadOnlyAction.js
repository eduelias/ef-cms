import { state } from 'cerebral';

/**
 * sets the state.caseDetailReadOnly
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.caseDetailReadOnly
 */
export const setCaseDetailReadOnlyAction = ({ store }) => {
  store.set(state.caseDetailReadOnly, true);
};
