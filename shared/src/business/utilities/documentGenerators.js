const {
  reactTemplateGenerator,
} = require('./generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');

const {
  generateChangeOfAddressTemplate,
} = require('./generateHTMLTemplateForPDF/generateChangeOfAddressTemplate');
const {
  generatePrintableDocketRecordTemplate,
} = require('./generateHTMLTemplateForPDF/generatePrintableDocketRecordTemplate');

const changeOfAddress = async ({ applicationContext, content }) => {
  const pdfContentHtml = await generateChangeOfAddressTemplate({
    applicationContext,
    content,
  });

  const { docketNumber } = content;

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

const docketRecord = async ({ applicationContext, data }) => {
  const pdfContentHtml = await generatePrintableDocketRecordTemplate({
    applicationContext,
    data,
  });

  const docketNumber = data.caseDetail.docketNumberWithSuffix;

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

const noticeOfDocketChange = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketEntryIndex,
    docketNumberWithSuffix,
    filingParties,
    filingsAndProceedings,
  } = data;

  const reactStandingPretrialOrderTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfDocketChange',
    data: {
      docketEntryIndex,
      filingParties,
      filingsAndProceedings,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: reactStandingPretrialOrderTemplate },
    options: {
      overwriteMain: true,
      title: 'Notice of Docket Change',
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
      docketNumber: docketNumberWithSuffix,
    });

  return pdf;
};

const standingPretrialOrder = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    footerDate,
    trialInfo,
  } = data;

  const reactStandingPretrialOrderTemplate = reactTemplateGenerator({
    componentName: 'StandingPretrialOrder',
    data: {
      footerDate,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      trialInfo,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: reactStandingPretrialOrderTemplate },
    options: {
      overwriteMain: true,
      title: 'Standing Pre-trial Order',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: docketNumberWithSuffix,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

const caseInventoryReport = async ({ applicationContext, data }) => {
  const {
    formattedCases,
    reportTitle,
    showJudgeColumn,
    showStatusColumn,
  } = data;

  const reactStandingPretrialOrderTemplate = reactTemplateGenerator({
    componentName: 'CaseInventoryReport',
    data: {
      formattedCases,
      reportTitle,
      showJudgeColumn,
      showStatusColumn,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: reactStandingPretrialOrderTemplate },
    options: {
      overwriteMain: true,
      title: 'Case Inventory Report',
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
    });

  return pdf;
};

module.exports = {
  caseInventoryReport,
  changeOfAddress,
  docketRecord,
  noticeOfDocketChange,
  standingPretrialOrder,
};
