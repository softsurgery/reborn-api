import { setup } from 'xstate';

export const jobRequestMachine = setup({
  types: {
    context: {} as object,
    events: {} as
      | { type: 'Approve' }
      | { type: 'Reject' }
      | { type: 'Cancel' }
      | { type: 'Waitlist' },
  },
}).createMachine({
  context: {},
  id: 'Reborn - Job Request Flow',
  initial: 'pending',
  states: {
    pending: {
      meta: {
        isUpdatable: true,
        title: 'Pending',
        category: 'Request',
        description: 'Job request is pending client review.',
        actor: 'Client',
        iconName: 'Clock',
      },
      on: {
        Approve: {
          target: 'approved',
          description: 'Client approves the job request.',
        },
        Reject: {
          target: 'rejected',
          description: 'Client rejects the job request.',
        },
        Waitlist: {
          target: 'waitlist',
          description: 'Client waitlists the job request.',
        },
        Cancel: {
          target: 'rejected',
          description: 'Worker cancels their job request.',
        },
      },
    },
    waitlist: {
      meta: {
        isUpdatable: true,
        title: 'Waitlisted',
        category: 'Request',
        description: 'Job request is waitlisted by the client.',
        actor: 'Client',
        iconName: 'Clock',
      },
      on: {
        Approve: {
          target: 'approved',
          description: 'Client approves the waitlisted job request.',
        },
        Reject: {
          target: 'rejected',
          description: 'Client rejects the waitlisted job request.',
        },
        Cancel: {
          target: 'rejected',
          description: 'Worker cancels their waitlisted job request.',
        },
      },
    },
    approved: {
      type: 'final',
      meta: {
        isUpdatable: false,
        title: 'Approved',
        category: 'Terminal',
        description:
          'Job request was approved and a contract should be initiated.',
        actor: 'Client',
        iconName: 'CheckCircle2',
      },
    },
    rejected: {
      type: 'final',
      meta: {
        isUpdatable: false,
        title: 'Rejected / Cancelled',
        category: 'Terminal',
        description:
          'Job request was rejected by the client or cancelled by the worker.',
        actor: 'Multiple',
        iconName: 'XCircle',
      },
    },
  },
});
