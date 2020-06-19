const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} = require('../../utilities/DateHandler');
const {
  getTodaysOpinionsInteractor,
} = require('./getTodaysOpinionsInteractor');
const { OPINION_DOCUMENT_TYPES } = require('../../entities/EntityConstants');

describe('getTodaysOpinionsInteractor', () => {
  const mockOpinionSearchResult = [
    {
      caseCaption: 'Reuben Blair, Petitioner',
      caseId: '24fcb050-9c95-4d69-a149-96acba0196b8',
      contactPrimary: {
        address1: '66 East Clarendon Parkway',
        address2: 'Ut culpa cum sint ',
        address3: 'In laboris hic volup',
        city: 'Omnis dignissimos at',
        countryType: 'domestic',
        email: 'petitioner',
        name: 'Reuben Blair',
        phone: '+1 (338) 996-7072',
        postalCode: '92017',
        serviceIndicator: 'Electronic',
        state: 'DC',
      },
      contactSecondary: {},
      docketNumber: '103-20',
      docketNumberSuffix: 'L',
      documentId: '6945cdff-fd12-422b-bf2c-63b792b7f618',
      documentTitle: 'Memorandum Opinion Judge Armen',
      filingDate: '2020-05-12T18:42:10.471Z',
      irsPractitioners: [],
      isSealed: false,
      numberOfPages: 1,
      privatePractitioners: [],
      signedJudgeName: 'Maurice B. Foley',
    },
  ];

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue(mockOpinionSearchResult);
  });

  it('should only search for opinion document types', async () => {
    await getTodaysOpinionsInteractor({
      applicationContext,
    });

    const { day, month, year } = deconstructDate(createISODateString());
    const currentDateStart = createStartOfDayISO({ day, month, year });
    const currentDateEnd = createEndOfDayISO({ day, month, year });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: OPINION_DOCUMENT_TYPES,
      endDate: currentDateEnd,
      startDate: currentDateStart,
    });
  });
});