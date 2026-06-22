import { setup } from 'xstate';

export const jobMachine = setup({
  types: {
    context: {} as object,
    events: {} as
      | { type: 'Hold' }
      | { type: 'Post' }
      | { type: 'Start' }
      | { type: 'Finish' }
      | { type: 'Stop Hold' }
      | { type: 'Mark Failed' }
      | { type: 'Client Review' }
      | { type: 'Worker Review' }
      | { type: 'Mark Successful' }
      | { type: 'Accept Candidate' }
      | { type: 'Choose Candidate' }
      | { type: 'Refuse Candidate' }
      | { type: 'Unpublish' },
  },
}).createMachine({
  context: {},
  id: 'Reborn - Job Flow',
  initial: 'Draft',
  states: {
    Draft: {
      on: {
        Post: {
          target: 'Posted',
        },
      },
    },
    Posted: {
      on: {
        'Choose Candidate': {
          target: 'Candidate Pending',
        },
        Unpublish: {
          target: 'Draft',
        },
      },
    },
    'Candidate Pending': {
      on: {
        'Refuse Candidate': {
          target: 'Posted',
        },
        'Accept Candidate': {
          target: 'Not Started',
        },
      },
    },
    'Not Started': {
      on: {
        Start: {
          target: 'Pending',
        },
      },
    },
    Pending: {
      on: {
        Finish: {
          target: 'Finished',
        },
        Hold: {
          target: 'On Hold',
        },
      },
    },
    Finished: {
      on: {
        'Worker Review': {
          target: 'Reviewed By Worker',
        },
      },
    },
    'On Hold': {
      on: {
        'Stop Hold': {
          target: 'Pending',
        },
        'Mark Failed': {
          target: 'Failed',
        },
      },
    },
    'Reviewed By Worker': {
      on: {
        'Client Review': {
          target: 'Reviewed By Worker & Client',
        },
      },
    },
    Failed: {
      type: 'final',
    },
    'Reviewed By Worker & Client': {
      on: {
        'Mark Successful': {
          target: 'Successfull',
        },
      },
    },
    Successfull: {
      type: 'final',
    },
  },
});
