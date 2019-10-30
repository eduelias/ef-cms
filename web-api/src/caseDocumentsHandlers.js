require('core-js/stable');
require('regenerator-runtime/runtime');

module.exports = {
  addCoversheetLambda: require('./documents/addCoversheetLambda').handler,
  archiveDraftDocumentLambda: require('./documents/archiveDraftDocumentLambda')
    .handler,
  completeDocketEntryQCLambda: require('./documents/completeDocketEntryQCLambda')
    .handler,
  createWorkItemLambda: require('./workitems/createWorkItemLambda').handler,
  fileCourtIssuedOrderToCaseLambda: require('./documents/fileCourtIssuedOrderToCaseLambda')
    .handler,
  fileDocketEntryToCaseLambda: require('./documents/fileDocketEntryToCaseLambda')
    .handler,
  fileExternalDocumentToCaseLambda: require('./documents/fileExternalDocumentToCaseLambda')
    .handler,
  saveIntermediateDocketEntryLambda: require('./documents/saveIntermediateDocketEntryLambda')
    .handler,
  serveSignedStipDecisionLambda: require('./cases/serveSignedStipDecisionLambda')
    .handler,
  signDocumentLambda: require('./documents/signDocumentLambda').handler,
  updateCourtIssuedOrderToCaseLambda: require('./documents/updateCourtIssuedOrderToCaseLambda')
    .handler,
  updateDocketEntryOnCaseLambda: require('./documents/updateDocketEntryOnCaseLambda')
    .handler,
};
