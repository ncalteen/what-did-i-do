import type { Contributions, IssueContributionsByRepository, PullRequestContributionsByRepository, PullRequestReviewContributionsByRepository } from './types.js';
/**
 * Get the contributions for the user.
 *
 * @param tokens A list of GitHub tokens.
 * @param startDate ISO 8601 date.
 * @param includeComments Whether to include comments in the contributions.
 * @returns Object with the total contribution stats.
 */
export declare function getContributions(tokens: string[], startDate: Date, includeComments: boolean): Promise<Contributions>;
/**
 * Gets the issue contributions grouped by repository.
 *
 * @param octokit The authenticated Octokit instance.
 * @param username The GitHub username.
 * @param startDate The start date for the contributions.
 * @returns The issue contributions grouped by repository.
 */
export declare function getIssueContributionsByRepository(octokit: any, username: string, startDate: Date, includeComments: boolean): Promise<IssueContributionsByRepository>;
/**
 * Gets the pull request contributions grouped by repository.
 *
 * @param octokit The authenticated Octokit instance.
 * @param username The GitHub username.
 * @param startDate The start date for the contributions.
 * @param includeComments Whether to include comments in the contributions.
 * @returns The pull request contributions grouped by repository.
 */
export declare function getPullRequestContributionsByRepository(octokit: any, username: string, startDate: Date, includeComments: boolean): Promise<PullRequestContributionsByRepository>;
/**
 * Gets the pull request review contributions grouped by repository.
 *
 * @param octokit The authenticated Octokit instance.
 * @param username The GitHub username.
 * @param startDate The start date for the contributions.
 * @returns The pull request review contributions grouped by repository.
 */
export declare function getPullRequestReviewContributionsByRepository(octokit: any, username: string, startDate: Date): Promise<PullRequestReviewContributionsByRepository>;
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
export declare function createIssue(body: string, octokit: any, repository: string, username: string, projectNumber?: number): Promise<number>;
