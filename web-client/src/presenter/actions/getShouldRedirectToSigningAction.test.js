import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getShouldRedirectToSigningAction } from './getShouldRedirectToSigningAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

let yesMock;
let noMock;

describe('getShouldRedirectToSigningAction', () => {
  beforeAll(() => {
    yesMock = jest.fn();
    noMock = jest.fn();

    presenter.providers.path = {
      no: noMock,
      yes: yesMock,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the yes path for court issued documents that DO NOT have a Notice event code', async () => {
    await runAction(getShouldRedirectToSigningAction, {
      modules: {
        presenter,
      },
      props: {
        documentId: '123',
        eventCode: 'O',
      },
      state: {},
    });
    expect(yesMock).toHaveBeenCalled();
  });

  it('should call the no path for court issued documents that have a Notice event code', async () => {
    await runAction(getShouldRedirectToSigningAction, {
      modules: {
        presenter,
      },
      props: {
        documentId: '123',
        eventCode: 'NOT',
      },
      state: {},
    });
    expect(noMock).toHaveBeenCalled();
  });
});
