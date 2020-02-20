export default (test, createdCasesIndex) => {
  return it('Petitions clerk manually adds a case to an calendared trial session', async () => {
    const caseToAdd = test.createdCases[createdCasesIndex];

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseToAdd,
    });

    await test.runSequence('openAddToTrialModalSequence');

    await test.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: test.trialSessionId,
    });

    await test.runSequence('addCaseToTrialSessionSequence');

    expect(test.getState('caseDetail.trialDate')).toBeDefined();
  });
};