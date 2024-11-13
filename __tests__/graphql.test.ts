import { jest } from '@jest/globals'
import type { Octokit } from '@octokit/rest'
import * as core from '../__fixtures__/core.js'
import * as octokit from '../__fixtures__/octokit.js'

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@octokit/rest', async () => {
  class Octokit {
    constructor() {
      return octokit
    }
  }

  return {
    Octokit
  }
})

const graphql = await import('../src/graphql.js')

describe('graphql', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getAuthenticatedUser', () => {
    it('Returns the authenticated user', async () => {
      octokit.graphql.mockResolvedValueOnce({
        viewer: { login: 'octocat' }
      } as never)

      await expect(graphql.getAuthenticatedUser(octokit)).resolves.toEqual(
        'octocat'
      )
    })
  })

  describe('getUserNodeId', () => {
    it('Returns the node ID for the user', async () => {
      octokit.request.mockResolvedValueOnce({
        data: { node_id: 'NODE_ID' }
      } as never)

      await expect(
        graphql.getUserNodeId(octokit as unknown as Octokit, 'octocat')
      ).resolves.toEqual('NODE_ID')
    })
  })

  describe('getProjectNodeId', () => {
    it('Returns the organization project node ID', async () => {
      octokit.graphql.mockResolvedValueOnce({
        organization: { projectV2: { id: 'PROJECT_ID' } }
      } as never)

      await expect(
        graphql.getProjectNodeId(octokit as unknown as Octokit, 'octoorg', 1)
      ).resolves.toEqual('PROJECT_ID')
    })

    it('Returns the user project node ID', async () => {
      octokit.graphql
        .mockRejectedValueOnce({
          errors: [{ type: 'NOT_FOUND' }]
        } as never)
        .mockResolvedValueOnce({
          user: { projectV2: { id: 'PROJECT_ID' } }
        } as never)

      await expect(
        graphql.getProjectNodeId(octokit as unknown as Octokit, 'octocat', 1)
      ).resolves.toEqual('PROJECT_ID')
    })

    it('Returns undefined if no project is found', async () => {
      octokit.graphql
        .mockRejectedValueOnce({
          errors: [{ type: 'NOT_FOUND' }]
        } as never)
        .mockRejectedValueOnce({
          errors: [{ type: 'NOT_FOUND' }]
        } as never)

      await expect(
        graphql.getProjectNodeId(octokit as unknown as Octokit, 'octocat', 1)
      ).resolves.toBeUndefined()
    })

    it('Returns undefined if no project number is provided', async () => {
      await expect(
        graphql.getProjectNodeId(
          octokit as unknown as Octokit,
          'octocat',
          undefined
        )
      ).resolves.toBeUndefined()
    })
  })

  describe('getRepositoryNodeId', () => {
    it('Returns the node ID for the repository', async () => {
      octokit.graphql.mockResolvedValueOnce({
        repository: { id: 'NODE_ID' }
      } as never)

      await expect(
        graphql.getRepositoryNodeId(
          octokit as unknown as Octokit,
          'octocat',
          'octorepo'
        )
      ).resolves.toEqual('NODE_ID')
    })
  })
})
