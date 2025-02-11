import * as fs from 'fs'
import mustache from 'mustache'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as path from 'path'
import type {
  Contributions,
  IssueSummary,
  PullRequestReviewSummary,
  PullRequestSummary,
  RepositorySummary
} from './types.js'

/**
 * Generates the OpenAI prompt for the user.
 *
 * @param handle The GitHub handle of the user.
 * @returns The OpenAI prompt.
 */
export function generatePrompt(handle: string): string {
  return mustache.render(
    fs.readFileSync(
      path.resolve(
        dirname(fileURLToPath(import.meta.url)),
        '../templates/prompt.mustache'
      ),
      'utf-8'
    ),
    { handle }
  )
}

/**
 * Generates the Markdown summary of contributions for a user.
 *
 * @param contributions The contribution map for the user.
 * @param endDate The end date for the contributions.
 * @param startDate The start date for the contributions.
 * @param username The username of the user.
 * @returns Generated Markdown summary for the user.
 */
export function generateMarkdown(
  contributions: Contributions,
  endDate: Date,
  startDate: Date,
  username: string
): string {
  // Build the context to pass to the mustache template
  const context = {
    endDate: endDate.toISOString().substring(0, 10),
    issues: generateIssueSummary(contributions),
    pullRequests: generatePullRequestSummary(contributions),
    pullRequestReviews: generatePullRequestReviewSummary(contributions),
    repositories: generateRepositorySummary(contributions),
    startDate: startDate.toISOString().substring(0, 10),
    summary: {
      commits: contributions.totalCommitContributions,
      issues: contributions.totalIssueContributions,
      pullRequests: contributions.totalPullRequestContributions,
      pullRequestReviews: contributions.totalPullRequestReviewContributions,
      repositoriesWithCommits:
        contributions.totalRepositoriesWithContributedCommits,
      repositoriesWithIssues:
        contributions.totalRepositoriesWithContributedIssues,
      repositoriesWithPullRequests:
        contributions.totalRepositoriesWithContributedPullRequests,
      repositoriesWithPullRequestReviews:
        contributions.totalRepositoriesWithContributedPullRequestReviews
    },
    username
  }

  return mustache.render(
    fs.readFileSync(
      path.resolve(
        dirname(fileURLToPath(import.meta.url)),
        '../templates/issue.mustache'
      ),
      'utf-8'
    ),
    context
  )
}

/**
 * Generates the repository summary to pass to the template renderer.
 *
 * @param contributions The contributions from getContributions().
 * @returns The repository summary to pass to the template renderer.
 */
export function generateRepositorySummary(
  contributions: Contributions
): RepositorySummary[] {
  const repositories: { [key: string]: RepositorySummary } = {}

  // Create a map for each repository summary row
  for (const key of Object.keys(
    contributions.issueContributionsByRepository
  ).concat(
    Object.keys(contributions.pullRequestContributionsByRepository).concat(
      Object.keys(contributions.pullRequestReviewContributionsByRepository)
    )
  )) {
    repositories[key] = {
      issues: 0,
      name: key,
      pullRequests: 0,
      pullRequestReviews: 0,
      url: `https://github.com/${key}`
    }
  }

  // Populate the rows with data
  for (const [key, value] of Object.entries(
    contributions.issueContributionsByRepository
  ))
    repositories[key].issues = value.totalCount
  for (const [key, value] of Object.entries(
    contributions.pullRequestContributionsByRepository
  ))
    repositories[key].pullRequests = value.totalCount
  for (const [key, value] of Object.entries(
    contributions.pullRequestReviewContributionsByRepository
  ))
    repositories[key].pullRequestReviews = value.totalCount

  // Sort by repository full name
  /* istanbul ignore next */
  return Object.values(repositories).sort((a, b) =>
    a.name.toLowerCase() < b.name.toLowerCase()
      ? -1
      : a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : 0
  )
}

/**
 * Generate the issue summary to pass to the template renderer.
 *
 * @param contributions The contributions from getContributions().
 * @returns The issue summary to pass to the template renderer.
 */
export function generateIssueSummary(
  contributions: Contributions
): IssueSummary[] {
  const issues: IssueSummary[] = []

  for (const [key, value] of Object.entries(
    contributions.issueContributionsByRepository
  )) {
    for (const element of value.contributions) {
      issues.push({
        createdAt: element.createdAt.toISOString().substring(0, 10),
        number: element.number,
        repository: key,
        repositoryUrl: value.url,
        status: element.state,
        title: element.title,
        url: element.url
      })
    }
  }

  // Sort by repository full name and issue number
  /* istanbul ignore next */
  return issues.sort((a, b) =>
    a.repository.toLowerCase() < b.repository.toLowerCase()
      ? -1
      : a.repository.toLowerCase() > b.repository.toLowerCase()
        ? 1
        : a.number < b.number
          ? -1
          : a.number > b.number
            ? 1
            : 0
  )
}

/**
 * Generate the pull request summary to pass to the template renderer.
 *
 * @param contributions The contributions from getContributions().
 * @returns The pull request summary to pass to the template renderer.
 */
export function generatePullRequestSummary(
  contributions: Contributions
): PullRequestSummary[] {
  const pullRequests: PullRequestSummary[] = []

  for (const [key, value] of Object.entries(
    contributions.pullRequestContributionsByRepository
  )) {
    for (const element of value.contributions) {
      pullRequests.push({
        createdAt: element.createdAt.toISOString().substring(0, 10),
        number: element.number,
        repository: key,
        repositoryUrl: value.url,
        status: element.state,
        title: element.title,
        url: element.url
      })
    }
  }

  // Sort by repository full name and pull request number
  /* istanbul ignore next */
  return pullRequests.sort((a, b) =>
    a.repository.toLowerCase() < b.repository.toLowerCase()
      ? -1
      : a.repository.toLowerCase() > b.repository.toLowerCase()
        ? 1
        : a.number < b.number
          ? -1
          : a.number > b.number
            ? 1
            : 0
  )
}

/**
 * Generate the pull request review summary to pass to the template renderer.
 *
 * @param contributions The contributions from getContributions().
 * @returns The pull request review summary to pass to the template renderer.
 */
export function generatePullRequestReviewSummary(
  contributions: Contributions
): PullRequestReviewSummary[] {
  const pullRequestReviews: PullRequestReviewSummary[] = []

  for (const [key, value] of Object.entries(
    contributions.pullRequestContributionsByRepository
  )) {
    for (const element of value.contributions) {
      pullRequestReviews.push({
        createdAt: element.createdAt.toISOString().substring(0, 10),
        number: element.number,
        repository: key,
        repositoryUrl: value.url,
        reviewDecision: element.reviewDecision,
        status: element.state,
        title: element.title,
        url: element.url
      })
    }
  }

  // Sort by repository full name and pull request number
  /* istanbul ignore next */
  return pullRequestReviews.sort((a, b) =>
    a.repository.toLowerCase() < b.repository.toLowerCase()
      ? -1
      : a.repository.toLowerCase() > b.repository.toLowerCase()
        ? 1
        : a.number < b.number
          ? -1
          : a.number > b.number
            ? 1
            : 0
  )
}
