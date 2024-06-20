import { mocktokit } from '__fixtures__/mocktokit.js'

export const getOctokit = () => mocktokit

export const context = {
  repo: {
    owner: 'owner',
    repo: 'repo'
  }
}
