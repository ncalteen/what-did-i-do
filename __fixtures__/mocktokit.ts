export const mocktokit = {
  graphql: jest.fn(),
  paginate: jest.fn(),
  request: jest.fn(),
  rest: {
    issues: {
      addAssignees: jest.fn(),
      createComment: jest.fn()
    },
    orgs: {
      getMembershipForUser: jest.fn()
    },
    pulls: {
      requestReviewers: jest.fn()
    },
    teams: {
      getByName: jest.fn()
    },
    users: {
      getByUsername: jest.fn()
    }
  }
}
