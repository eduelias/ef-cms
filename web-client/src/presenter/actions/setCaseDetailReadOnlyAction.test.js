import { runAction } from 'cerebral/test';
import { setCaseDetailReadOnlyAction } from './setCaseDetailReadOnlyAction';

describe('setCaseDetailReadOnlyAction', () => {
  it('sets the caseDetailReadOnly flag on state', async () => {
    const result = await runAction(setCaseDetailReadOnlyAction, {
      state: {
        caseDetailReadOnly: null,
      },
    });

    expect(result.state.caseDetailReadOnly).toEqual(true);
  });
});
