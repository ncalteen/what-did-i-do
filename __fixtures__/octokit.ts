import { jest } from '@jest/globals'

export const graphql = jest.fn()
export const paginate = jest.fn()
export const request = jest.fn()
export const rest = {
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
