import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const DraftDocumentViewerDocument = connect(
  {
    archiveDraftDocumentModalSequence:
      sequences.archiveDraftDocumentModalSequence,
    caseDetail: state.caseDetail,
    draftDocumentViewerHelper: state.draftDocumentViewerHelper,
    iframeSrc: state.iframeSrc,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    openConfirmEditModalSequence: sequences.openConfirmEditModalSequence,
    openConfirmRemoveSignatureModalSequence:
      sequences.openConfirmRemoveSignatureModalSequence,
    viewerDraftDocumentToDisplay: state.viewerDraftDocumentToDisplay,
  },
  function DraftDocumentViewerDocument({
    archiveDraftDocumentModalSequence,
    caseDetail,
    draftDocumentViewerHelper,
    iframeSrc,
    openCaseDocumentDownloadUrlSequence,
    openConfirmEditModalSequence,
    openConfirmRemoveSignatureModalSequence,
    viewerDraftDocumentToDisplay,
  }) {
    return (
      <div
        className={classNames(
          'document-viewer--documents',
          !viewerDraftDocumentToDisplay && 'border border-base-lighter',
        )}
      >
        {!viewerDraftDocumentToDisplay && (
          <div className="padding-2">
            There is no document selected for preview
          </div>
        )}
        {viewerDraftDocumentToDisplay && (
          <>
            <h3>{draftDocumentViewerHelper.documentTitle}</h3>

            <div className="grid-row margin-bottom-1">
              <div className="grid-col-6">
                {draftDocumentViewerHelper.createdByLabel}
              </div>

              {draftDocumentViewerHelper.showDocumentNotSignedAlert && (
                <div className="grid-col-6 text-align-right text-secondary-dark text-semibold">
                  Signature required for this document.
                </div>
              )}
            </div>

            <div className="message-document-actions">
              {draftDocumentViewerHelper.showEditButtonNotSigned && (
                <Button
                  link
                  href={viewerDraftDocumentToDisplay.editUrl}
                  icon="edit"
                  id="draft-edit-button-not-signed"
                >
                  Edit
                </Button>
              )}

              {draftDocumentViewerHelper.showEditButtonSigned && (
                <Button
                  link
                  icon="edit"
                  id="edit-order-button"
                  onClick={() =>
                    openConfirmEditModalSequence({
                      docketNumber: caseDetail.docketNumber,
                      documentIdToEdit: viewerDraftDocumentToDisplay.documentId,
                    })
                  }
                >
                  Edit
                </Button>
              )}

              <Button
                link
                icon="trash"
                onClick={() =>
                  archiveDraftDocumentModalSequence({
                    docketNumber: caseDetail.docketNumber,
                    documentId: viewerDraftDocumentToDisplay.documentId,
                    documentTitle: viewerDraftDocumentToDisplay.documentTitle,
                    redirectToCaseDetail: true,
                  })
                }
              >
                Delete
              </Button>

              {draftDocumentViewerHelper.showApplySignatureButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDraftDocumentToDisplay.documentId}/sign/`}
                  icon="pencil-alt"
                >
                  Apply Signature
                </Button>
              )}

              {draftDocumentViewerHelper.showRemoveSignatureButton && (
                <Button
                  link
                  icon="pencil-alt"
                  onClick={() =>
                    openConfirmRemoveSignatureModalSequence({
                      documentIdToEdit: viewerDraftDocumentToDisplay.documentId,
                    })
                  }
                >
                  Remove Signature
                </Button>
              )}

              {draftDocumentViewerHelper.showAddDocketEntryButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/documents/${viewerDraftDocumentToDisplay.documentId}/add-court-issued-docket-entry`}
                  icon="plus-circle"
                  id="add-court-issued-docket-entry-button"
                >
                  Add Docket Entry
                </Button>
              )}

              <Button
                link
                icon="file-pdf"
                iconColor="white"
                onClick={() =>
                  openCaseDocumentDownloadUrlSequence({
                    docketNumber: caseDetail.docketNumber,
                    documentId: viewerDraftDocumentToDisplay.documentId,
                  })
                }
              >
                View Full PDF
              </Button>
            </div>
            {!process.env.CI && (
              <iframe
                src={iframeSrc}
                title={draftDocumentViewerHelper.documentTitle}
              />
            )}
          </>
        )}
      </div>
    );
  },
);
