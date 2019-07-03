const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../../../persistence/s3/getUploadPolicy');

/**
 * CaseInternal Entity
 * Represents a Case with required documents that a Petitions Clerk is attempting to add to the system.
 * @param rawCase
 * @constructor
 */
function CaseInternal(rawCase) {
  this.caseCaption = rawCase.caseCaption;
  this.ownershipDisclosureFile = rawCase.ownershipDisclosureFile;
  this.petitionFile = rawCase.petitionFile;
  this.petitionFileSize = rawCase.petitionFileSize;
  this.receivedAt = rawCase.receivedAt;
  this.stinFile = rawCase.stinFile;
  this.stinFileSize = rawCase.stinFileSize;
}

CaseInternal.errorToMessageMap = {
  caseCaption: 'Case Caption is required.',
  petitionFile: 'The Petition file was not selected.',
  petitionFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Petition file size is empty.',
  ],
  receivedAt: [
    {
      contains: 'must be less than or equal to',
      message: 'The received date is in the future. Please enter a valid date.',
    },
    'Please enter a valid date.',
  ],
  stinFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your STIN file size is empty.',
  ],
};

const paperRequirements = joi.object().keys({
  caseCaption: joi.string().required(),
  ownershipDisclosureFile: joi.object().optional(),
  petitionFile: joi.object().required(),
  petitionFileSize: joi.when('petitionFile', {
    is: joi.exist(),
    otherwise: joi.optional().allow(null),
    then: joi
      .number()
      .required()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  }),
  receivedAt: joi
    .date()
    .iso()
    .max('now')
    .required(),
  stinFile: joi.object().optional(),
  stinFileSize: joi.when('stinFile', {
    is: joi.exist(),
    otherwise: joi.optional().allow(null),
    then: joi
      .number()
      .required()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  }),
});

joiValidationDecorator(
  CaseInternal,
  paperRequirements,
  function() {
    return !this.getFormattedValidationErrors();
  },
  CaseInternal.errorToMessageMap,
);

module.exports = { CaseInternal };
