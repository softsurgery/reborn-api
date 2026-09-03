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
      | { type: 'Unpublish' }
      | { type: 'Archive' },
  },
}).createMachine({
  context: {},
  id: 'Reborn - Job Flow',
  initial: 'Draft',
  states: {
    Draft: {
      meta: {
        isCandidateSelectionPaused: false,
        isUpdatable: true,
        title: 'Draft',
        category: 'Drafting',
        description:
          'Job is currently in draft mode. Details, pricing, and tags can be edited freely before publishing to the marketplace.',
        actor: 'Client',
        iconName: 'FileEdit',
      },
      on: {
        Post: {
          target: 'Posted',
          description:
            'Client finalizes job requirements and publishes the listing.',
        },
        Archive: {
          target: 'Archived',
          description: 'Archive the job listing.',
        },
      },
    },
    Posted: {
      meta: {
        isCandidateSelectionPaused: false,
        isUpdatable: true,
        title: 'Posted',
        category: 'Recruitment',
        description:
          'Job is live on the marketplace. Workers can submit proposals, and the client can browse candidates or send invitations.',
        actor: 'Multiple',
        iconName: 'Globe',
      },
      on: {
        'Choose Candidate': {
          target: 'Candidate Pending',
          description:
            'Client selects a candidate proposal or invitation response.',
        },
        Unpublish: {
          target: 'Draft',
          description: 'Client unpublishes the job back to draft mode.',
        },
      },
    },
    'Candidate Pending': {
      meta: {
        isCandidateSelectionPaused: false,
        isUpdatable: true,
        title: 'Candidate Pending',
        category: 'Recruitment',
        description:
          'A candidate is selected for the role and negotiation/verification is in progress before formal commencement.',
        actor: 'Client',
        iconName: 'UserCheck',
      },
      on: {
        'Refuse Candidate': {
          target: 'Posted',
          description:
            'Worker or Client refuses/withdraws candidacy; job re-enters Posted state.',
        },
        'Accept Candidate': {
          target: 'Not Started',
          description: 'Worker accepts the assignment confirmation.',
        },
      },
    },
    'Not Started': {
      meta: {
        isCandidateSelectionPaused: false,
        isUpdatable: true,
        title: 'Not Started',
        category: 'Execution',
        description:
          'Worker is assigned and confirmed. The job is scheduled but physical/remote execution has not yet commenced.',
        actor: 'Worker',
        iconName: 'Clock',
      },
      on: {
        Start: {
          target: 'Pending',
          description:
            'Worker starts executing the tasks and logs the start time.',
        },
      },
    },
    Pending: {
      meta: {
        isCandidateSelectionPaused: false,
        isUpdatable: true,
        title: 'In Progress (Pending)',
        category: 'Execution',
        description:
          'Active work execution is currently underway. Worker is performing milestones and tracking progress.',
        actor: 'Worker',
        iconName: 'PlayCircle',
      },
      on: {
        Finish: {
          target: 'Finished',
          description:
            'Worker marks work as completed and submits deliverables for client review.',
        },
        Hold: {
          target: 'On Hold',
          description:
            'Temporary hold initiated by worker or client due to dispute or blocked materials.',
        },
      },
    },
    Finished: {
      meta: {
        isCandidateSelectionPaused: false,
        isUpdatable: true,
        title: 'Finished (Awaiting Review)',
        category: 'Review & Payout',
        description:
          'Work execution concluded by worker. Deliverables are submitted and awaiting review.',
        actor: 'Multiple',
        iconName: 'CheckSquare',
      },
      on: {
        'Worker Review': {
          target: 'Reviewed By Worker',
          description:
            'Worker submits review and rating for the client experience.',
        },
      },
    },
    'On Hold': {
      meta: {
        isCandidateSelectionPaused: false,
        isUpdatable: true,
        title: 'On Hold',
        category: 'Execution',
        description:
          'Job execution is temporarily frozen pending administrative review or dispute resolution.',
        actor: 'Admin',
        iconName: 'PauseCircle',
      },
      on: {
        'Stop Hold': {
          target: 'Pending',
          description: 'Hold resolved; worker resumes active execution.',
        },
        'Mark Failed': {
          target: 'Failed',
          description: 'Admin terminates job permanently from hold state.',
        },
      },
    },
    'Reviewed By Worker': {
      meta: {
        isCandidateSelectionPaused: false,
        isUpdatable: true,
        title: 'Reviewed By Worker',
        category: 'Review & Payout',
        description:
          'Worker has submitted feedback. Client sign-off and review are now required to unlock final settlement.',
        actor: 'Client',
        iconName: 'MessageSquareCheck',
      },
      on: {
        'Client Review': {
          target: 'Reviewed By Worker & Client',
          description:
            'Client completes review, approving the deliverables and releasing escrow.',
        },
      },
    },
    'Reviewed By Worker & Client': {
      meta: {
        isCandidateSelectionPaused: false,
        isUpdatable: true,
        title: 'Reviewed By Both',
        category: 'Review & Payout',
        description:
          'Mutual reviews and ratings are completed. Financial settlement and payout release are queued.',
        actor: 'System',
        iconName: 'Award',
      },
      on: {
        'Mark Successful': {
          target: 'Successfull',
          description:
            'System verifies ledger transactions and marks the job as successful.',
        },
      },
    },
    Failed: {
      meta: {
        isCandidateSelectionPaused: false,
        isUpdatable: false,
        title: 'Failed / Cancelled',
        category: 'Terminal',
        description: 'Job was terminated, cancelled, or failed to complete.',
        actor: 'Admin',
        iconName: 'XCircle',
      },
      on: {
        Archive: {
          target: 'Archived',
          description: 'Archive the job listing.',
        },
      },
    },
    Successfull: {
      meta: {
        isCandidateSelectionPaused: false,
        isUpdatable: false,
        title: 'Successful (Completed)',
        category: 'Terminal',
        description:
          'Job workflow is successfully finalized. Payout has been released and contract archived.',
        actor: 'System',
        iconName: 'CheckCircle2',
      },
      on: {
        Archive: {
          target: 'Archived',
          description: 'Archive the job listing.',
        },
      },
    },
    Archived: {
      type: 'final',
      meta: {
        isCandidateSelectionPaused: false,
        isUpdatable: false,
        title: 'Archived',
        category: 'Terminal',
        description: 'Job is permanently archived.',
        actor: 'System',
        iconName: 'Archive',
      },
    },
  },
});
