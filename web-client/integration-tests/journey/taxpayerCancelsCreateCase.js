export default test => {
  it('taxpayer navigates to create case and cancels', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');
    expect(test.getState('showModal')).toBeFalsy();
    expect(test.getState('form')).toEqual({
      contactPrimary: {},
      wizardStep: '1',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Seattle, Washington',
    });
    expect(test.getState('form.preferredTrialCity')).toEqual(
      'Seattle, Washington',
    );

    await test.runSequence('formCancelToggleCancelSequence'); // someone clicks cancel
    expect(test.getState('showModal')).toBeTruthy();
    await test.runSequence('formCancelToggleCancelSequence'); // someone aborts cancellation
    expect(test.getState('currentPage')).toEqual('StartCaseWizard');

    await test.runSequence('formCancelToggleCancelSequence');
    await test.runSequence('closeModalAndReturnToDashboardSequence');
    expect(test.getState('showModal')).toBeFalsy();
    expect(test.getState('currentPage')).toEqual('DashboardPetitioner');
  });
};
