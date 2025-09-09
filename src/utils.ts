import * as core from '@actions/core'
import * as github from '@actions/github'
import * as graphql from './graphql.js'
import * as queries from './queries.js'
import type {
  Contributions,
  GraphQLIssueContributionsByRepository,
  GraphQLPullRequestContributionsByRepository,
  GraphQLPullRequestReviewContributionsByRepository,
  GraphQLTotalContributions,
  IssueContributionsByRepository,
  PullRequestContributionsByRepository,
  PullRequestReviewContributionsByRepository
} from './types.js'

/**
 * Get the contributions for the user.
 *
 * @param tokenMap A list of GitHub token and API URL pairs.
 * @param startDate ISO 8601 date.
 * @param includeComments Whether to include comments in the contributions.
 * @returns Object with the total contribution stats.
 */
export async function getContributions(
  tokenMap: {
    token: string
    apiUrl: string
  }[],
  startDate: Date,
  includeComments: boolean
): Promise<Contributions> {
  const contributions: Contributions = {
    totalCommitContributions: 0,
    totalIssueContributions: 0,
    totalPullRequestContributions: 0,
    totalPullRequestReviewContributions: 0,
    totalRepositoriesWithContributedCommits: 0,
    totalRepositoriesWithContributedIssues: 0,
    totalRepositoriesWithContributedPullRequests: 0,
    totalRepositoriesWithContributedPullRequestReviews: 0,
    totalRepositoryContributions: 0,
    issueContributionsByRepository: {},
    pullRequestContributionsByRepository: {},
    pullRequestReviewContributionsByRepository: {}
  }

  let count = 1
  for (const tokenPair of tokenMap) {
    core.startGroup(`Getting Contributions: Token #${count++}`)

    // Create the Octokit client
    const octokit = github.getOctokit(tokenPair.token, {
      baseUrl: tokenPair.apiUrl
    })

    // Get the authenticated user
    const username = await graphql.getAuthenticatedUser(octokit)

    // Get contributions for this user with this client
    const clientContributions: GraphQLTotalContributions =
      await octokit.graphql(queries.TOTAL_CONTRIBUTION_COUNT, {
        username,
        startDate
      })
    core.info(JSON.stringify(clientContributions, null, 2))

    // Add the contributions to the running total
    contributions.totalCommitContributions +=
      clientContributions.user.contributionsCollection.totalCommitContributions
    contributions.totalRepositoriesWithContributedCommits +=
      clientContributions.user.contributionsCollection.totalRepositoriesWithContributedCommits
    contributions.totalIssueContributions +=
      clientContributions.user.contributionsCollection.totalIssueContributions
    contributions.totalRepositoriesWithContributedIssues +=
      clientContributions.user.contributionsCollection.totalRepositoriesWithContributedIssues
    contributions.totalPullRequestContributions +=
      clientContributions.user.contributionsCollection.totalPullRequestContributions
    contributions.totalRepositoriesWithContributedPullRequests +=
      clientContributions.user.contributionsCollection.totalRepositoriesWithContributedPullRequests
    contributions.totalPullRequestReviewContributions +=
      clientContributions.user.contributionsCollection.totalPullRequestReviewContributions
    contributions.totalRepositoriesWithContributedPullRequestReviews +=
      clientContributions.user.contributionsCollection.totalRepositoriesWithContributedPullRequestReviews
    contributions.totalRepositoryContributions +=
      clientContributions.user.contributionsCollection.totalRepositoryContributions

    // Get the issue contributions grouped by repository
    const clientIssueContributionsByRepository: IssueContributionsByRepository =
      await getIssueContributionsByRepository(
        octokit,
        username,
        startDate,
        includeComments
      )
    core.info(JSON.stringify(clientIssueContributionsByRepository, null, 2))

    // Get the pull request contributions grouped by repository
    const clientPullRequestContributionsByRepository: PullRequestContributionsByRepository =
      await getPullRequestContributionsByRepository(
        octokit,
        username,
        startDate,
        includeComments
      )
    core.info(
      JSON.stringify(clientPullRequestContributionsByRepository, null, 2)
    )

    // Get the pull request review contributions grouped by repository
    const clientPullRequestReviewContributionsByRepository: PullRequestReviewContributionsByRepository =
      await getPullRequestReviewContributionsByRepository(
        octokit,
        username,
        startDate
      )
    core.info(
      JSON.stringify(clientPullRequestReviewContributionsByRepository, null, 2)
    )

    // Extend the contribution map
    contributions.issueContributionsByRepository = {
      ...contributions.issueContributionsByRepository,
      ...clientIssueContributionsByRepository
    }
    contributions.pullRequestContributionsByRepository = {
      ...contributions.pullRequestContributionsByRepository,
      ...(await getPullRequestContributionsByRepository(
        octokit,
        username,
        startDate,
        includeComments
      ))
    }
    contributions.pullRequestReviewContributionsByRepository = {
      ...contributions.pullRequestReviewContributionsByRepository,
      ...(await getPullRequestReviewContributionsByRepository(
        octokit,
        username,
        startDate
      ))
    }

    core.endGroup()
  }

  return contributions
}

/**
 * Gets the issue contributions grouped by repository.
 *
 * @param octokit The authenticated Octokit instance.
 * @param username The GitHub username.
 * @param startDate The start date for the contributions.
 * @returns The issue contributions grouped by repository.
 */
export async function getIssueContributionsByRepository(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  octokit: any,
  username: string,
  startDate: Date,
  includeComments: boolean
): Promise<IssueContributionsByRepository> {
  const issueContributionsByRepository: IssueContributionsByRepository = {}

  let endCursor: string | undefined = undefined
  let issueContributions: GraphQLIssueContributionsByRepository =
    await octokit.graphql(queries.ISSUE_CONTRIBUTIONS_BY_REPOSITORY, {
      username,
      startDate,
      endCursor
    })

  for (const element of issueContributions.user.contributionsCollection
    .issueContributionsByRepository) {
    issueContributionsByRepository[element.repository.nameWithOwner] = {
      contributions: element.contributions.nodes
        .map((node) => {
          return {
            body: node.issue.body,
            comments: includeComments ? node.issue.comments : { nodes: [] },
            createdAt: new Date(node.issue.createdAt),
            number: node.issue.number,
            state: node.issue.state,
            title: node.issue.title,
            url: node.issue.url
          }
        })
        .filter((node) => {
          // Filter out issues created by this action
          return !node.body.startsWith(`# Contributions - @${username}`)
        }),
      totalCount: element.contributions.totalCount,
      url: element.repository.url
    }
  }

  // Paginate through the results
  while (
    issueContributions.user.contributionsCollection.issueContributionsByRepository.some(
      (element) => element.contributions.pageInfo.hasNextPage
    )
  ) {
    endCursor =
      issueContributions.user.contributionsCollection.issueContributionsByRepository.find(
        (element) => element.contributions.pageInfo.hasNextPage
      )?.contributions.pageInfo.endCursor

    issueContributions = await octokit.graphql(
      queries.ISSUE_CONTRIBUTIONS_BY_REPOSITORY,
      {
        username,
        startDate,
        endCursor
      }
    )

    for (const element of issueContributions.user.contributionsCollection
      .issueContributionsByRepository) {
      issueContributionsByRepository[
        element.repository.nameWithOwner
      ].contributions.concat(
        element.contributions.nodes.map((node) => {
          return {
            body: node.issue.body,
            comments: includeComments ? node.issue.comments : { nodes: [] },
            createdAt: new Date(node.issue.createdAt),
            number: node.issue.number,
            state: node.issue.state,
            title: node.issue.title,
            url: node.issue.url
          }
        })
      )
    }
  }

  return issueContributionsByRepository
}

/**
 * Gets the pull request contributions grouped by repository.
 *
 * @param octokit The authenticated Octokit instance.
 * @param username The GitHub username.
 * @param startDate The start date for the contributions.
 * @param includeComments Whether to include comments in the contributions.
 * @returns The pull request contributions grouped by repository.
 */
export async function getPullRequestContributionsByRepository(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  octokit: any,
  username: string,
  startDate: Date,
  includeComments: boolean
): Promise<PullRequestContributionsByRepository> {
  const pullRequestContributionsByRepository: PullRequestContributionsByRepository =
    {}

  let endCursor: string | undefined = undefined
  let pullRequestContributions: GraphQLPullRequestContributionsByRepository =
    await octokit.graphql(queries.PULL_REQUEST_CONTRIBUTIONS_BY_REPOSITORY, {
      username,
      startDate,
      endCursor
    })

  for (const element of pullRequestContributions.user.contributionsCollection
    .pullRequestContributionsByRepository) {
    pullRequestContributionsByRepository[element.repository.nameWithOwner] = {
      contributions: element.contributions.nodes.map((node) => {
        return {
          body: node.pullRequest.body,
          closed: node.pullRequest.closed,
          comments: includeComments ? node.pullRequest.comments : { nodes: [] },
          createdAt: new Date(node.pullRequest.createdAt),
          isDraft: node.pullRequest.isDraft,
          merged: node.pullRequest.merged,
          number: node.pullRequest.number,
          reviewDecision: node.pullRequest.reviewDecision,
          state: node.pullRequest.state,
          title: node.pullRequest.title,
          url: node.pullRequest.url
        }
      }),
      totalCount: element.contributions.totalCount,
      url: element.repository.url
    }
  }

  // Paginate through the results
  while (
    pullRequestContributions.user.contributionsCollection.pullRequestContributionsByRepository.some(
      (element) => element.contributions.pageInfo.hasNextPage
    )
  ) {
    endCursor =
      pullRequestContributions.user.contributionsCollection.pullRequestContributionsByRepository.find(
        (element) => element.contributions.pageInfo.hasNextPage
      )?.contributions.pageInfo.endCursor

    pullRequestContributions = await octokit.graphql(
      queries.PULL_REQUEST_CONTRIBUTIONS_BY_REPOSITORY,
      {
        username,
        startDate,
        endCursor
      }
    )

    for (const element of pullRequestContributions.user.contributionsCollection
      .pullRequestContributionsByRepository) {
      pullRequestContributionsByRepository[
        element.repository.nameWithOwner
      ].contributions.concat(
        element.contributions.nodes.map((node) => {
          return {
            body: node.pullRequest.body,
            closed: node.pullRequest.closed,
            comments: includeComments
              ? node.pullRequest.comments
              : { nodes: [] },
            createdAt: new Date(node.pullRequest.createdAt),
            isDraft: node.pullRequest.isDraft,
            merged: node.pullRequest.merged,
            number: node.pullRequest.number,
            reviewDecision: node.pullRequest.reviewDecision,
            state: node.pullRequest.state,
            title: node.pullRequest.title,
            url: node.pullRequest.url
          }
        })
      )
    }
  }

  return pullRequestContributionsByRepository
}

/**
 * Gets the pull request review contributions grouped by repository.
 *
 * @param octokit The authenticated Octokit instance.
 * @param username The GitHub username.
 * @param startDate The start date for the contributions.
 * @returns The pull request review contributions grouped by repository.
 */
export async function getPullRequestReviewContributionsByRepository(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  octokit: any,
  username: string,
  startDate: Date
): Promise<PullRequestReviewContributionsByRepository> {
  const pullRequestReviewContributionsByRepository: PullRequestReviewContributionsByRepository =
    {}

  let endCursor: string | undefined = undefined
  let pullRequestReviewContributions: GraphQLPullRequestReviewContributionsByRepository =
    await octokit.graphql(
      queries.PULL_REQUEST_REVIEW_CONTRIBUTIONS_BY_REPOSITORY,
      {
        username,
        startDate,
        endCursor
      }
    )

  for (const element of pullRequestReviewContributions.user
    .contributionsCollection.pullRequestReviewContributionsByRepository) {
    pullRequestReviewContributionsByRepository[
      element.repository.nameWithOwner
    ] = {
      contributions: element.contributions.nodes
        .filter((node) => {
          // Filter out PRs created by Dependabot
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          !node.pullRequest.author?.login.includes('dependabot')
        })
        .map((node) => {
          return {
            pullRequest: {
              body: node.pullRequest.body,
              closed: node.pullRequest.closed,
              createdAt: new Date(node.pullRequest.createdAt),
              merged: node.pullRequest.merged,
              number: node.pullRequest.number,
              state: node.pullRequest.state,
              title: node.pullRequest.title,
              url: node.pullRequest.url
            },
            pullRequestReview: {
              body: node.pullRequestReview.body,
              createdAt: new Date(node.pullRequestReview.createdAt),
              state: node.pullRequestReview.state
            }
          }
        }),
      totalCount: element.contributions.totalCount,
      url: element.repository.url
    }
  }

  // Paginate through the results
  while (
    pullRequestReviewContributions.user.contributionsCollection.pullRequestReviewContributionsByRepository.some(
      (element) => element.contributions.pageInfo.hasNextPage
    )
  ) {
    endCursor =
      pullRequestReviewContributions.user.contributionsCollection.pullRequestReviewContributionsByRepository.find(
        (element) => element.contributions.pageInfo.hasNextPage
      )?.contributions.pageInfo.endCursor

    pullRequestReviewContributions = await octokit.graphql(
      queries.PULL_REQUEST_REVIEW_CONTRIBUTIONS_BY_REPOSITORY,
      {
        username,
        startDate,
        endCursor
      }
    )

    for (const element of pullRequestReviewContributions.user
      .contributionsCollection.pullRequestReviewContributionsByRepository) {
      pullRequestReviewContributionsByRepository[
        element.repository.nameWithOwner
      ].contributions.concat(
        element.contributions.nodes.map((node) => {
          return {
            pullRequest: {
              body: node.pullRequest.body,
              closed: node.pullRequest.closed,
              createdAt: new Date(node.pullRequest.createdAt),
              merged: node.pullRequest.merged,
              number: node.pullRequest.number,
              state: node.pullRequest.state,
              title: node.pullRequest.title,
              url: node.pullRequest.url
            },
            pullRequestReview: {
              body: node.pullRequestReview.body,
              createdAt: new Date(node.pullRequestReview.createdAt),
              state: node.pullRequestReview.state
            }
          }
        })
      )
    }
  }

  return pullRequestReviewContributionsByRepository
}

/**
 * Creates a GitHub issue in the specified repository.
 *
 * If a project number is provided, the issue will be added to the project.
 *
 * @param body The generated issue body.
 * @param octokit The authenticated Octokit instance.
 * @param repository The repository name (owner/name format).
 * @param username The GitHub username to assign the issue to.
 * @param projectNumber (Optional) The project to add the issue to.
 * @returns The issue number.
 */
export async function createIssue(
  body: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  octokit: any,
  repository: string,
  username: string,
  projectNumber?: number
): Promise<number> {
  const title = `GitHub Contributions (${new Date().toISOString().substring(0, 10)})`
  const [owner, name] = repository.split('/')
  core.info(`Creating issue in ${owner}/${name}`)

  // Get the GraphQL node ID of the user, repository, and project
  const userId = await graphql.getUserNodeId(octokit, username)
  const projectId = await graphql.getProjectNodeId(
    octokit,
    owner,
    projectNumber
  )
  const repositoryId = await graphql.getRepositoryNodeId(octokit, owner, name)

  const response = await octokit.graphql(queries.CREATE_ISSUE, {
    userId,
    repositoryId,
    body,
    title
  })

  if (projectId)
    await octokit.graphql(queries.ADD_ISSUE_TO_PROJECT, {
      projectId,
      issueId: response.createIssue.issue.id
    })

  return response.createIssue.issue.number
}
