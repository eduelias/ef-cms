const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 * Case Note entity
 *
 * @param {object} rawProps the raw case note data
 * @constructor
 */
function CaseNote(rawProps) {
  this.notes = rawProps.notes;
}

CaseNote.errorToMessageMap = {
  notes: 'Notes can not be empty.',
};

CaseNote.schema = joi.object().keys({
  notes: joi.string().required(),
});

joiValidationDecorator(
  CaseNote,
  CaseNote.schema,
  undefined,
  CaseNote.errorToMessageMap,
);

module.exports = { CaseNote };
