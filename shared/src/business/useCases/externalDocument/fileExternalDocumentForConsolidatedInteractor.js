const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  DOCKET_SECTION,
  DOCUMENT_RELATIONSHIPS,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { capitalize, pick } = require('lodash');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

exports.fileExternalDocumentForConsolidatedInteractor = async ({
  applicationContext,
  docketNumbersForFiling,
  documentIds,
  documentMetadata,
  leadDocketNumber,
  //filingPartyNames? filingPartyMap?,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.FILE_IN_CONSOLIDATED)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const consolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber,
    });

  // TODO: Return error if lead case not found?

  const casesForDocumentFiling = [];
  const docketNumbersForDocumentFiling = [];

  const consolidatedCaseEntities = consolidatedCases.map(consolidatedCase => {
    const { docketNumber } = consolidatedCase;
    const caseEntity = new Case(consolidatedCase, { applicationContext });

    if (docketNumbersForFiling.includes(consolidatedCase.docketNumber)) {
      // this serves the purpose of offering two different
      // look-ups to be used further down while minimizing
      // iterations over the case array
      docketNumbersForDocumentFiling.push(docketNumber);
      casesForDocumentFiling.push(caseEntity);
    }

    return caseEntity;
  });

  const caseWithLowestDocketNumber = Case.sortByDocketNumber(
    casesForDocumentFiling,
  ).shift();

  const {
    secondaryDocument,
    secondarySupportingDocuments,
    supportingDocuments,
    ...primaryDocumentMetadata
  } = documentMetadata;

  const baseMetadata = pick(primaryDocumentMetadata, [
    'partyPrimary',
    'partySecondary',
    'partyIrsPractitioner',
    'practitioner',
    'docketNumber',
  ]);

  if (secondaryDocument) {
    secondaryDocument.lodged = true;
  }
  if (secondarySupportingDocuments) {
    secondarySupportingDocuments.forEach(item => {
      item.lodged = true;
    });
  }

  const documentsToAdd = [
    [
      documentIds.shift(),
      primaryDocumentMetadata,
      DOCUMENT_RELATIONSHIPS.PRIMARY,
    ],
  ];

  if (supportingDocuments) {
    for (let i = 0; i < supportingDocuments.length; i++) {
      documentsToAdd.push([
        documentIds.shift(),
        supportingDocuments[i],
        DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
      ]);
    }
  }

  documentsToAdd.push([
    documentIds.shift(),
    secondaryDocument,
    DOCUMENT_RELATIONSHIPS.SECONDARY,
  ]);

  if (secondarySupportingDocuments) {
    for (let i = 0; i < secondarySupportingDocuments.length; i++) {
      documentsToAdd.push([
        documentIds.shift(),
        secondarySupportingDocuments[i],
        DOCUMENT_RELATIONSHIPS.SUPPORTING,
      ]);
    }
  }

  const saveCasesMap = {};
  const saveWorkItems = [];
  const sendEmails = [];

  for (let [documentId, metadata, relationship] of documentsToAdd) {
    if (documentId && metadata) {
      // TODO: Double check what is auto-generated here,
      // as this may not be entirely necessary
      const rawDocument = new Document(
        {
          ...baseMetadata,
          ...metadata,
          documentId,
          documentType: metadata.documentType,
          relationship,
          userId: user.userId,
        },
        { applicationContext },
      ).toRawObject();

      for (let caseEntity of consolidatedCaseEntities) {
        const isFilingDocumentForCase = docketNumbersForDocumentFiling.includes(
          caseEntity.docketNumber,
        );

        const documentEntity = new Document(
          {
            ...rawDocument,
            ...caseEntity.getCaseContacts({
              contactPrimary: true,
              contactSecondary: true,
            }),
          },
          {
            applicationContext,
          },
        );

        if (isFilingDocumentForCase) {
          const isCaseForWorkItem =
            caseEntity.docketNumber === caseWithLowestDocketNumber.docketNumber;

          const servedParties = aggregatePartiesForService(caseEntity);

          if (isCaseForWorkItem) {
            // The case with the lowest docket number
            // in the filing gets the work item
            const workItem = new WorkItem(
              {
                assigneeId: null,
                assigneeName: null,
                associatedJudge: caseEntity.associatedJudge,
                caseIsInProgress: caseEntity.inProgress,
                caseStatus: caseEntity.status,
                caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseEntity)),
                docketNumber: caseEntity.docketNumber,
                docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
                document: {
                  ...documentEntity.toRawObject(),
                  createdAt: documentEntity.createdAt,
                },
                isQC: true,
                section: DOCKET_SECTION,
                sentBy: user.name,
                sentByUserId: user.userId,
              },
              { applicationContext },
            );

            const message = new Message(
              {
                from: user.name,
                fromUserId: user.userId,
                message: `${documentEntity.documentType} filed by ${capitalize(
                  user.role,
                )} is ready for review.`,
              },
              { applicationContext },
            );

            workItem.addMessage(message);
            documentEntity.addWorkItem(workItem);

            if (metadata.isPaper) {
              workItem.setAsCompleted({
                message: 'completed',
                user,
              });

              workItem.assignToUser({
                assigneeId: user.userId,
                assigneeName: user.name,
                section: user.section,
                sentBy: user.name,
                sentBySection: user.section,
                sentByUserId: user.userId,
              });
            }

            saveWorkItems.push(
              applicationContext
                .getPersistenceGateway()
                .saveWorkItemForNonPaper({
                  applicationContext,
                  workItem: workItem.validate().toRawObject(),
                }),
            );
          }

          caseEntity.addDocumentWithoutDocketRecord(documentEntity);

          if (documentEntity.isAutoServed()) {
            documentEntity.setAsServed(servedParties.all);

            await applicationContext
              .getUseCaseHelpers()
              .sendServedPartiesEmails({
                applicationContext,
                caseEntity,
                documentEntity,
                servedParties,
              });
          }
        }

        const docketRecordEntity = new DocketRecord(
          {
            description: metadata.documentTitle,
            documentId: documentEntity.documentId,
            eventCode: documentEntity.eventCode,
            filingDate: documentEntity.receivedAt,
          },
          { applicationContext },
        );

        caseEntity.addDocketRecord(docketRecordEntity);

        saveCasesMap[
          caseEntity.docketNumber
        ] = await applicationContext.getPersistenceGateway().updateCase({
          applicationContext,
          caseToUpdate: caseEntity.validate().toRawObject(),
        });
      } // consolidatedCases
    }
  } // documentsToAdd
  const saveCases = Object.keys(saveCasesMap).map(
    docketNumber => saveCasesMap[docketNumber],
  );

  const savedCases = await Promise.all(saveCases);
  await Promise.all(saveWorkItems);
  await Promise.all(sendEmails);

  return savedCases;
};
