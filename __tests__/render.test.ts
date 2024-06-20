import mustache from 'mustache'
import * as render from 'src/render.js'
import { Contributions } from 'src/types.js'

const mustache_renderMock = jest.spyOn(mustache, 'render').mockImplementation()

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
          createdAt: new Date(),
          number: 1,
          state: 'OPEN',
          title: 'Hello, world!',
          url: 'https://github.com/octocat/hello-world/issues/1',
          viewerDidAuthor: true,
          viewerIsAssigned: true
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
          changedFiles: 1,
          closed: false,
          createdAt: new Date(),
          isDraft: false,
          merged: false,
          number: 1,
          state: 'OPEN',
          title: 'Hello, world!',
          url: 'https://github.com/octocat/hello-world/pull/1',
          viewerDidAuthor: true,
          viewerDidEdit: false,
          viewerIsAssigned: false,
          viewerReviewRequested: false
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
            url: 'https://github.com/octocat/hello-world/pull/1',
            viewerDidAuthor: true
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

      expect(mustache_renderMock).toHaveBeenCalledWith(
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
