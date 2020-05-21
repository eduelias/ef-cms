import { state } from 'cerebral';

export const getErrorText = (validationErrors, index, statistic) => {
  if (!Array.isArray(validationErrors.statistics))
    return validationErrors.statistics;

  const error = validationErrors.statistics.find(s => s.index === index);

  if (error) {
    if (statistic.yearOrPeriod === 'Year') {
      return 'Enter year, deficiency amount, and total penalties';
    } else {
      return 'Enter period, deficiency amount, and total penalties';
    }
  }
};

/**
 * gets the statistics form helper fields
 *
 * @param {Function} get the cerebral get function used
 * for getting state.form.partyType and state.constants
 * @param {object} applicationContext the application context
 * @returns {object} partyTypes constant, showPrimary/SecondaryContact,
 * showOwnershipDisclosureStatement, and ownershipDisclosureStatementDocumentId
 */
export const statisticsFormHelper = (get, applicationContext) => {
  const { CASE_TYPES_MAP } = applicationContext.getConstants();
  const form = get(state.form);

  const showStatisticsForm =
    form.caseType === CASE_TYPES_MAP.deficiency && form.hasVerifiedIrsNotice;

  const showAddMoreStatisticsButton =
    form.statistics && form.statistics.length < 12;

  const statisticOptions = [];

  (form.statistics || []).forEach(statistic => {
    if (statistic.yearOrPeriod === 'Year') {
      statisticOptions.push({ showYearInput: true });
    } else {
      statisticOptions.push({ showPeriodInput: true });
    }
  });

  const penalties = get(state.modal.penalties);
  const showAddAnotherPenaltyButton = penalties && penalties.length < 10;

  return {
    getErrorText,
    showAddAnotherPenaltyButton,
    showAddMoreStatisticsButton,
    showStatisticsForm,
    statisticOptions,
  };
};