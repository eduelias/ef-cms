import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const HeaderDashboardInternal = connect(
  {
    chooseWorkQueueSequence: sequences.chooseWorkQueueSequence,
    refreshSectionInboxCountSequence:
      sequences.refreshSectionInboxCountSequence,
    workQueueHelper: state.workQueueHelper,
  },
  ({
    chooseWorkQueueSequence,
    refreshSectionInboxCountSequence,
    workQueueHelper,
  }) => {
    return (
      <div className="big-blue-header">
        <div className="grid-container">
          <h1 tabIndex="-1">{workQueueHelper.workQueueTitle}</h1>
          <span
            className="unread margin-right-2"
            aria-label="unread work item count"
          >
            {workQueueHelper.inboxCount}
          </span>
          {workQueueHelper.showIndividualWorkQueue && (
            <button
              className="button-switch-box usa-button usa-button--unstyled"
              onClick={() => {
                chooseWorkQueueSequence({
                  box: workQueueHelper.currentBoxView,
                  queue: 'section',
                });
                refreshSectionInboxCountSequence();
              }}
            >
              <FontAwesomeIcon icon={['far', 'clone']} />
              Switch to Section {workQueueHelper.workQueueType}
            </button>
          )}
          {workQueueHelper.showSectionWorkQueue && (
            <button
              className="button-switch-box usa-button usa-button--unstyled"
              onClick={() => {
                chooseWorkQueueSequence({
                  box: workQueueHelper.currentBoxView,
                  queue: 'my',
                });
              }}
            >
              <FontAwesomeIcon icon={['far', 'clone']} />
              Switch to My {workQueueHelper.workQueueType}
            </button>
          )}
        </div>
      </div>
    );
  },
);
