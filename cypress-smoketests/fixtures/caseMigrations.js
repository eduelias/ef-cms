const faker = require('faker');
const {
  PARTY_TYPES,
} = require('../../shared/src/business/entities/EntityConstants');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');

exports.BASE_CASE = {
  ...MOCK_CASE,
  associatedJudge: 'Chief Judge',
  caseCaption: 'A Migrated Casee',
  caseId: undefined,
  preferredTrialCity: 'Washington, District of Columbia',
  status: 'Calendared',
};

exports.CASE_WITH_OTHER_PETITIONERS = {
  ...exports.BASE_CASE,
  otherPetitioners: [
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: PARTY_TYPES.petitioner,
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: PARTY_TYPES.petitioner,
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: PARTY_TYPES.petitioner,
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: PARTY_TYPES.petitioner,
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: PARTY_TYPES.petitioner,
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: PARTY_TYPES.petitioner,
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: PARTY_TYPES.petitioner,
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: PARTY_TYPES.petitioner,
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: PARTY_TYPES.petitioner,
    },
  ],
};

exports.CASE_WITH_OTHER_FILERS = {
  ...exports.BASE_CASE,
  otherFilers: [
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      otherFilerType: 'Intervenor',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      otherFilerType: 'Participant',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      otherFilerType: 'Participant',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      otherFilerType: 'Participant',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      otherFilerType: 'Participant',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      otherFilerType: 'Participant',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      otherFilerType: 'Participant',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      otherFilerType: 'Participant',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: 'domestic',
      name: faker.name.findName(),
      otherFilerType: 'Participant',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
    },
  ],
};
