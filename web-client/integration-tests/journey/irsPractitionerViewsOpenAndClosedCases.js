import { refreshElasticsearchIndex } from '../helpers';

export const irsPractitionerViewsOpenAndClosedCases = test => {
  return it('irs practitoner views open and closed cases', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('currentPage')).toEqual('DashboardRespondent');
    expect(test.getState('openCases').length).toBeGreaterThan(0);
    expect(test.getState('closedCases').length).toBe(0);
  });
};
