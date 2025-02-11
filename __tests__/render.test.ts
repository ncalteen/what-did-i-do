import { jest } from '@jest/globals'
import { Contributions } from '../src/types.js'

const mustache_render = jest.fn()

jest.unstable_mockModule('mustache', () => {
  return {
    default: {
      render: mustache_render
    },
    render: mustache_render
  }
})

const render = await import('../src/render.js')

const contributions: Contributions = {
  totalCommitContributions: 1,
  totalIssueContributions: 1,
  totalPullRequestContributions: 1,
  totalPullRequestReviewContributions: 1,
  totalRepositoriesWithContributedCommits: 1,
  totalRepositoriesWithContributedIssues: 1,
  totalRepositoriesWithContributedPullRequests: 1,
  totalRepositoriesWithContributedPullRequestReviews: 1,
  totalRepositoryContributions: 1,
  issueContributionsByRepository: {
    'octocat/hello-world': {
      contributions: [
        {
          body: 'Hello, world!',
          comments: {
            nodes: []
          },
          createdAt: new Date(),
          number: 1,
          state: 'OPEN',
          title: 'Hello, world!',
          url: 'https://github.com/octocat/hello-world/issues/1'
        }
      ],
      totalCount: 1,
      url: 'https://github.com/octocat/hello-world'
    }
  },
  pullRequestContributionsByRepository: {
    'octocat/hello-world': {
      contributions: [
        {
          body: 'Hello, world!',
          closed: false,
          comments: {
            nodes: []
          },
          createdAt: new Date(),
          isDraft: false,
          merged: false,
          number: 1,
          state: 'OPEN',
          title: 'Hello, world!',
          url: 'https://github.com/octocat/hello-world/pull/1'
        }
      ],
      totalCount: 1,
      url: 'https://github.com/octocat/hello-world'
    }
  },
  pullRequestReviewContributionsByRepository: {
    'octocat/hello-world': {
      contributions: [
        {
          pullRequest: {
            body: 'Hello, world!',
            closed: false,
            createdAt: new Date(),
            merged: false,
            number: 1,
            state: 'OPEN',
            title: 'Hello, world!',
            url: 'https://github.com/octocat/hello-world/pull/1'
          },
          pullRequestReview: {
            body: 'Hello, world!',
            createdAt: new Date(),
            state: 'APPROVED'
          }
        }
      ],
      totalCount: 1,
      url: 'https://github.com/octocat/hello-world'
    }
  }
}

describe('render', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('generateMarkdown', () => {
    it('Generates the Markdown summary for the user', () => {
      render.generateMarkdown(contributions, new Date(), new Date(), 'octocat')

      expect(mustache_render).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object)
      )
    })
  })

  describe('generateRepositorySummary', () => {
    it('Generates the repository summary for the user', () => {
      const repositories = render.generateRepositorySummary(contributions)

      expect(repositories).toEqual([
        {
          issues: 1,
          name: 'octocat/hello-world',
          pullRequests: 1,
          pullRequestReviews: 1,
          url: 'https://github.com/octocat/hello-world'
        }
      ])
    })
  })
})
