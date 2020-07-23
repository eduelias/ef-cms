import { gotoCaseDetailSequence } from './gotoCaseDetailSequence';
import { setCaseDetailReadOnlyAction } from '../actions/setCaseDetailReadOnlyAction';

export const gotoCaseDetailReadOnlySequence = [
  setCaseDetailReadOnlyAction,
  ...gotoCaseDetailSequence,
];
