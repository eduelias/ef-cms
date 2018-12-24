import { runCompute } from 'cerebral/test';

import { formattedWorkQueue } from '../../presenter/computeds/formattedWorkQueue';

export default test => {
  return it('Docket clerk docket work queue dashboard', async () => {
    await test.runSequence('gotoDocketSectionSequence');
    const workQueue = test.getState('workQueue');
    expect(workQueue.length).toBeGreaterThanOrEqual(2);
    const workItem = workQueue.find(
      workItem =>
        workItem.docketNumber === test.docketNumber &&
        workItem.document.documentType === 'Stipulated Decision',
    );
    expect(workItem).toBeDefined();
    test.documentId = workItem.document.documentId;
    test.workItemId = workItem.workItemId;

    expect(workItem.messages[0]).toMatchObject({
      message: 'a Stipulated Decision filed by respondent is ready for review',
      sentBy: 'Test Respondent',
      userId: 'respondent',
    });

    const formatted = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });
    expect(formatted[0].createdAtFormatted).toBeDefined();
    expect(formatted[0].messages[0].createdAtFormatted).toBeDefined();
  });
};
