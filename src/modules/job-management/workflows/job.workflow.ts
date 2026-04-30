import { setup } from 'xstate';

export const machine = setup({
  types: {
    context: {} as {
      isUpdatable: boolean;
    },
    events: {} as
      | { type: 'Post' }
      | { type: 'Cancel' }
      | { type: 'Choose Candidate' }
      | { type: 'Refuse Candidate' }
      | { type: 'Review' }
      | { type: 'Accept Candidate' }
      | { type: 'Start' }
      | { type: 'Finish' }
      | { type: 'Worker Review' }
      | { type: 'Client Review' }
      | { type: 'Mark Successful' }
      | { type: 'Hold' }
      | { type: 'Repost' }
      | { type: 'Stop Hold' }
      | { type: 'Mark Failed' },
  },
}).createMachine({
  context: {
    isUpdatable: true,
  },
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
        Cancel: {
          target: 'Canceled',
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
    Canceled: {
      on: {
        Repost: {
          target: 'Posted',
        },
        Review: {
          target: 'Draft',
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
