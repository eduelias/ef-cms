import { NewCaseMessage } from '../../../shared/src/business/entities/NewCaseMessage';
import { createCaseMessageModalHelper as createCaseMessageModalHelperComputed } from '../../src/presenter/computeds/createCaseMessageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const createCaseMessageModalHelper = withAppContextDecorator(
  createCaseMessageModalHelperComputed,
);

export const petitionsClerkCreatesNewMessageOnCase = test => {
  const getHelper = () => {
    return runCompute(createCaseMessageModalHelper, {
      state: test.getState(),
    });
  };

  return it('petitions clerk creates new message on a case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openCreateCaseMessageModalSequence');

    await test.runSequence('updateCreateCaseMessageValueInModalSequence', {
      key: 'toSection',
      value: 'petitions',
    });

    await test.runSequence('updateCreateCaseMessageValueInModalSequence', {
      key: 'toUserId',
      value: '4805d1ab-18d0-43ec-bafb-654e83405416', //petitionsclerk1
    });

    const messageDocument = getHelper().documents[0];
    test.testMessageDocumentId = messageDocument.documentId;

    await test.runSequence('updateCreateCaseMessageAttachmentsSequence', {
      documentId: messageDocument.documentId,
    });

    expect(test.getState('modal.form.subject')).toEqual(
      messageDocument.documentType,
    );

    // Add four more attachments to reach the maximum of five.
    for (let i = 0; i < 4; i++) {
      // currently doesn't matter if we add the same document over and over
      await test.runSequence('updateCreateCaseMessageAttachmentsSequence', {
        documentId: messageDocument.documentId,
      });
    }

    const helper = getHelper();
    expect(helper.showAddDocumentForm).toEqual(false);
    expect(helper.showAddMoreDocumentsButton).toEqual(false);
    expect(helper.showMessageAttachments).toEqual(true);

    test.testMessageSubject = `what kind of bear is best? ${Date.now()}`;

    await test.runSequence('updateCreateCaseMessageValueInModalSequence', {
      key: 'subject',
      value: test.testMessageSubject,
    });

    await test.runSequence('createCaseMessageSequence');

    expect(test.getState('validationErrors')).toEqual({
      message: NewCaseMessage.VALIDATION_ERROR_MESSAGES.message,
    });

    await test.runSequence('updateCreateCaseMessageValueInModalSequence', {
      key: 'message',
      value: 'bears, beets, battlestar galactica',
    });

    await test.runSequence('createCaseMessageSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
