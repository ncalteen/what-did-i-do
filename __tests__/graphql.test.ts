import { mocktokit } from '__fixtures__/mocktokit.js'
import * as graphql from 'src/graphql.js'

describe('graphql', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getAuthenticatedUser', () => {
    it('Returns the authenticated user', async () => {
      mocktokit.graphql.mockResolvedValueOnce({
        viewer: { login: 'octocat' }
      })

      await expect(graphql.getAuthenticatedUser(mocktokit)).resolves.toEqual(
        'octocat'
      )
    })
  })

  describe('getUserNodeId', () => {
    it('Returns the node ID for the user', async () => {
      mocktokit.request.mockResolvedValueOnce({
        data: { node_id: 'NODE_ID' }
      })

      await expect(
        graphql.getUserNodeId(mocktokit, 'octocat')
      ).resolves.toEqual('NODE_ID')
    })
  })

  describe('getProjectNodeId', () => {
    it('Returns the organization project node ID', async () => {
      mocktokit.graphql.mockResolvedValueOnce({
        organization: { projectV2: { id: 'PROJECT_ID' } }
      })

      await expect(
        graphql.getProjectNodeId(mocktokit, 'octoorg', 1)
      ).resolves.toEqual('PROJECT_ID')
    })

    it('Returns the user project node ID', async () => {
      mocktokit.graphql
        .mockRejectedValueOnce({
          errors: [{ type: 'NOT_FOUND' }]
        })
        .mockResolvedValueOnce({
          user: { projectV2: { id: 'PROJECT_ID' } }
        })

      await expect(
        graphql.getProjectNodeId(mocktokit, 'octocat', 1)
      ).resolves.toEqual('PROJECT_ID')
    })

    it('Returns undefined if no project is found', async () => {
      mocktokit.graphql
        .mockRejectedValueOnce({
          errors: [{ type: 'NOT_FOUND' }]
        })
        .mockRejectedValueOnce({
          errors: [{ type: 'NOT_FOUND' }]
        })

      await expect(
        graphql.getProjectNodeId(mocktokit, 'octocat', 1)
      ).resolves.toBeUndefined()
    })

    it('Returns undefined if no project number is provided', async () => {
      await expect(
        graphql.getProjectNodeId(mocktokit, 'octocat', undefined)
      ).resolves.toBeUndefined()
    })
  })

  describe('getRepositoryNodeId', () => {
    it('Returns the node ID for the repository', async () => {
      mocktokit.graphql.mockResolvedValueOnce({
        repository: { id: 'NODE_ID' }
      })

      await expect(
        graphql.getRepositoryNodeId(mocktokit, 'octocat', 'octorepo')
      ).resolves.toEqual('NODE_ID')
    })
  })
})
