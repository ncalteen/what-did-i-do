/** Authenticated User's Login */
export const AUTHENTICATED_USER = `
  query {
    viewer {
      login
    }
  }
`

/** Total Contribution Count */
export const TOTAL_CONTRIBUTION_COUNT = `
  query ($username: String!, $startDate: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $startDate) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions

        totalRepositoriesWithContributedCommits
        totalRepositoriesWithContributedIssues
        totalRepositoriesWithContributedPullRequests
        totalRepositoriesWithContributedPullRequestReviews

        totalRepositoryContributions
      }
    }
  }
`

/** Issue Contributions (Grouped by Repository) */
export const ISSUE_CONTRIBUTIONS_BY_REPOSITORY = `
  query ($username: String!, $startDate: DateTime!, $endCursor: String) {
    user(login: $username) {
      contributionsCollection(from: $startDate) {
        issueContributionsByRepository(maxRepositories: 50) {
          contributions(first: 50, after: $endCursor) {
            nodes {
              issue {
                assignees(first: 50) {
                  nodes {
                    login
                  }
                }
                body
                createdAt
                number
                state
                title
                url
                viewerDidAuthor
              }
            }  
            pageInfo {
              endCursor
              hasNextPage
            }
            totalCount
          }  
          repository {
            nameWithOwner
            url
          }
        }
      }
    }
  }
`

/** Pull Request Contributions (Grouped by Repository) */
export const PULL_REQUEST_CONTRIBUTIONS_BY_REPOSITORY = `
  query ($username: String!, $startDate: DateTime!, $endCursor: String) {
    user(login: $username) {
      contributionsCollection(from: $startDate) {
        pullRequestContributionsByRepository(maxRepositories: 50) {
          contributions(first: 50, after: $endCursor) {
            nodes {
              pullRequest {
                assignees(first: 10) {
                  nodes {
                    login
                  }
                }
                body
                changedFiles
                closed
                createdAt
                editor {
                  login
                }
                isDraft
                merged
                number
                reviewDecision
                state
                title
                url
                viewerDidAuthor
                viewerLatestReview {
                  state
                }
                viewerLatestReviewRequest {
                  id
                }
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
            totalCount
          }
          repository {
            nameWithOwner
            url
          }
        }
      }
    }
  }
`

export const PULL_REQUEST_REVIEW_CONTRIBUTIONS_BY_REPOSITORY = `
  query ($username: String!, $startDate: DateTime!, $endCursor: String) {
    user(login: $username) {
      contributionsCollection(from: $startDate) {
        pullRequestReviewContributionsByRepository(maxRepositories: 50) {
          contributions(first: 50, after: $endCursor) {
            nodes {
              pullRequest {
                author {
                  login
                }
                body
                closed
                createdAt
                merged
                number
                state
                title
                url
                viewerDidAuthor
                viewerLatestReview {
                  state
                }
                viewerLatestReviewRequest {
                  id
                }
              }
              pullRequestReview {
                body
                createdAt
                state
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
            totalCount
          }
          repository {
            nameWithOwner
            url
          }
        }
      }
    }
  }
`

/** Get a User's Contributions */
export const CONTRIBUTIONS = `
  query ($username: String!, $startDate: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $startDate) {
        pullRequestReviewContributionsByRepository {
          repository {
            nameWithOwner
            url
          }
          contributions(first: 100) {
            totalCount
            nodes {
              pullRequest {
                title
                url
                createdAt
                state
              }
            }
          }
        }
      }
    }
  }
`

/** Gets the Global Node ID of a Project */
export const ORG_PROJECT_NODE_ID = `
  query ($organization: String!, $projectNumber: Int!) {
    organization(login: $organization) {
      projectV2(number: $projectNumber) {
        id
      }
    }
  }
`

/** Gets the User Project Node ID */
export const USER_PROJECT_NODE_ID = `
  query ($login: String!, $projectNumber: Int!) {
    user(login: $login) {
      projectV2(number: $projectNumber) {
        id
      }
    }
  }
`

/** Gets the Repository Node ID */
export const REPOSITORY_NODE_ID = `
  query ($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
    }
  }
`

/** Adds an Issue to a Project */
export const ADD_ISSUE_TO_PROJECT = `
  mutation ($projectId: ID!, $issueId: ID!) {
    addProjectV2ItemById(input: {projectId: $projectId, contentId: $issueId}) {
      item {
        id
      }
    }
  }
`

/** Creates an Issue */
export const CREATE_ISSUE = `
  mutation ($userId: ID!, $repositoryId: ID!, $body: String!, $title: String!) {
    createIssue(input: {
      assigneeIds: [$userId],
      body: $body,
      repositoryId: $repositoryId,
      title: $title
    }) {
      issue {
        id
      }
    }
  }
`
