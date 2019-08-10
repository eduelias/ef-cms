import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SectionWorkQueueInProgress = connect(
  {
    assignSelectedWorkItemsSequence: sequences.assignSelectedWorkItemsSequence,
    documentHelper: state.documentHelper,
    sectionWorkQueue: state.formattedWorkQueue,
    selectAssigneeSequence: sequences.selectAssigneeSequence,
    selectWorkItemSequence: sequences.selectWorkItemSequence,
    selectedWorkItems: state.selectedWorkItems,
    setFocusedWorkItem: sequences.setFocusedWorkItemSequence,
    users: state.users,
    workQueueHelper: state.workQueueHelper,
  },
  ({
    assignSelectedWorkItemsSequence,
    documentHelper,
    sectionWorkQueue,
    selectAssigneeSequence,
    selectedWorkItems,
    selectWorkItemSequence,
    setFocusedWorkItem,
    users,
    workQueueHelper,
  }) => {
    return (
      <React.Fragment>
        {workQueueHelper.showSendToBar && (
          <div className="action-section">
            <span
              aria-label="selected work items count"
              className="assign-work-item-count"
            >
              <FontAwesomeIcon icon="check" />
              {selectedWorkItems.length}
            </span>
            <select
              aria-label="select a assignee"
              className="usa-select"
              id="options"
              name="options"
              onChange={event => {
                selectAssigneeSequence({
                  assigneeId: event.target.value,
                  assigneeName:
                    event.target.options[event.target.selectedIndex].text,
                });
                assignSelectedWorkItemsSequence();
              }}
            >
              <option value>Assign to...</option>
              {users.map(user => (
                <option key={user.userId} value={user.userId}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <table
          aria-describedby="tab-work-queue"
          className="usa-table work-queue subsection"
          id="section-work-queue"
        >
          <thead>
            <tr>
              {workQueueHelper.showSelectColumn && <th colSpan="2">&nbsp;</th>}
              <th aria-label="Docket Number">Docket</th>
              <th>Filed</th>
              {!workQueueHelper.hideIconColumn && (
                <th aria-label="Status Icon" className="padding-right-0" />
              )}
              <th>Document</th>
              {!workQueueHelper.hideFiledByColumn && <th>Filed By</th>}
              <th>Case Status</th>
              {workQueueHelper.showAssignedToColumn && (
                <th>{workQueueHelper.assigneeColumnTitle}</th>
              )}
              {!workQueueHelper.hideFromColumn && <th>From</th>}
              {!workQueueHelper.hideSectionColumn && <th>Section</th>}
            </tr>
          </thead>
          {sectionWorkQueue.map((item, idx) => (
            <tbody
              key={idx}
              onClick={() =>
                setFocusedWorkItem({
                  queueType: 'workQueue',
                  uiKey: item.uiKey,
                })
              }
            >
              <tr>
                {workQueueHelper.showSelectColumn && (
                  <>
                    <td className="focus-toggle">
                      <button
                        aria-controls={`detail-${item.workItemId}`}
                        aria-expanded={item.isFocused}
                        aria-label="Expand message detail"
                        className="focus-button usa-button usa-button--unstyled"
                      />{' '}
                    </td>
                    <td
                      className="message-select-control"
                      onClick={e => {
                        selectWorkItemSequence({
                          workItem: item,
                        });
                        e.stopPropagation();
                      }}
                    >
                      <input
                        aria-label="Select work item"
                        checked={item.selected}
                        className="usa-checkbox__input"
                        id={item.workItemId}
                        type="checkbox"
                        onChange={e => {
                          selectWorkItemSequence({
                            workItem: item,
                          });
                          e.stopPropagation();
                        }}
                      />
                      <label
                        className="usa-checkbox__label padding-top-05"
                        htmlFor={item.workItemId}
                        id={`label-${item.workItemId}`}
                      />
                    </td>
                  </>
                )}
                <td className="message-queue-row">
                  <span className="no-wrap">{item.docketNumberWithSuffix}</span>
                </td>
                <td className="message-queue-row">
                  <span className="no-wrap">{item.received}</span>
                </td>
                {!workQueueHelper.hideIconColumn && (
                  <td className="message-queue-row has-icon padding-right-0">
                    {item.showBatchedStatusIcon && (
                      <FontAwesomeIcon
                        aria-hidden="true"
                        className="iconStatusBatched"
                        icon={['far', 'clock']}
                        size="lg"
                      />
                    )}
                    {item.showRecalledStatusIcon && (
                      <FontAwesomeIcon
                        aria-hidden="false"
                        aria-label="recalled from IRS"
                        className="iconStatusRecalled"
                        icon={['far', 'clock']}
                        size="lg"
                      />
                    )}
                    {item.showUnassignedIcon && (
                      <FontAwesomeIcon
                        aria-hidden="true"
                        className="iconStatusUnassigned"
                        icon={['fas', 'question-circle']}
                        size="lg"
                      />
                    )}
                  </td>
                )}
                <td className="message-queue-row message-queue-document">
                  <div className="message-document-title">
                    <a
                      className="case-link"
                      href={documentHelper({
                        docketNumber: item.docketNumber,
                        documentId: item.document.documentId,
                        messageId: item.currentMessage.messageId,
                      })}
                      onClick={e => {
                        e.stopPropagation();
                      }}
                    >
                      {item.document.documentType}
                    </a>
                  </div>
                  {workQueueHelper.showMessageContent && (
                    <div
                      className="message-document-detail"
                      id={`detail-${item.workItemId}`}
                    >
                      {item.currentMessage.message}
                    </div>
                  )}
                </td>
                {!workQueueHelper.hideFiledByColumn && (
                  <td className="message-queue-row">{item.document.filedBy}</td>
                )}
                <td className="message-queue-row">{item.caseStatus}</td>
                {workQueueHelper.showAssignedToColumn && (
                  <td className="to message-queue-row">{item.assigneeName}</td>
                )}
                {!workQueueHelper.hideFromColumn && (
                  <td className="message-queue-row">
                    {item.currentMessage.from}
                  </td>
                )}
                {!workQueueHelper.hideSectionColumn && (
                  <td className="message-queue-row">{item.sentBySection}</td>
                )}
              </tr>
            </tbody>
          ))}
        </table>
      </React.Fragment>
    );
  },
);
