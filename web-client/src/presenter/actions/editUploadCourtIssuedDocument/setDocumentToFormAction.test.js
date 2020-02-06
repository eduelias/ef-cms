import { runAction } from 'cerebral/test';
import { setDocumentToFormAction } from './setDocumentToFormAction';

const documentIdToEdit = '123';
const documentToMatch = {
  documentId: documentIdToEdit,
  documentType: 'Order',
};

describe('setDocumentToFormAction', () => {
  it('sets state.form for the given case and documentId', async () => {
    const result = await runAction(setDocumentToFormAction, {
      props: {
        caseDetail: {
          caseId: 'c123',
          documents: [
            {
              documentId: '321',
              documentType: 'Petition',
            },
            documentToMatch,
          ],
        },
        documentId: documentIdToEdit,
      },
    });
    expect(result.state.form).toEqual(documentToMatch);
    expect(result.state.screenMetadata.selectedDocument).toEqual(
      documentToMatch,
    );
  });

  it('does nothing if documentId isdoes not match a document', async () => {
    const result = await runAction(setDocumentToFormAction, {
      props: {
        caseDetail: {
          caseId: 'c123',
          documents: [
            {
              documentId: '321',
              documentType: 'Petition',
            },
            documentToMatch,
          ],
        },
        documentId: '890',
      },
    });
    expect(result.state.documentToEdit).toBeUndefined();
    expect(result.state.form).toBeUndefined();
  });
});
