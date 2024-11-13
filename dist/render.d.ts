import type { Contributions, IssueSummary, PullRequestReviewSummary, PullRequestSummary, RepositorySummary } from './types.js';
/**
 * Generates the OpenAI prompt for the user.
 *
 * @param handle The GitHub handle of the user.
 * @returns The OpenAI prompt.
 */
export declare function generatePrompt(handle: string): string;
/**
 * Generates the Markdown summary of contributions for a user.
 *
 * @param contributions The contribution map for the user.
 * @param endDate The end date for the contributions.
 * @param startDate The start date for the contributions.
 * @param username The username of the user.
 * @returns Generated Markdown summary for the user.
 */
export declare function generateMarkdown(contributions: Contributions, endDate: Date, startDate: Date, username: string): string;
/**
 * Generates the repository summary to pass to the template renderer.
 *
 * @param contributions The contributions from getContributions().
 * @returns The repository summary to pass to the template renderer.
 */
export declare function generateRepositorySummary(contributions: Contributions): RepositorySummary[];
/**
 * Generate the issue summary to pass to the template renderer.
 *
 * @param contributions The contributions from getContributions().
 * @returns The issue summary to pass to the template renderer.
 */
export declare function generateIssueSummary(contributions: Contributions): IssueSummary[];
/**
 * Generate the pull request summary to pass to the template renderer.
 *
 * @param contributions The contributions from getContributions().
 * @returns The pull request summary to pass to the template renderer.
 */
export declare function generatePullRequestSummary(contributions: Contributions): PullRequestSummary[];
/**
 * Generate the pull request review summary to pass to the template renderer.
 *
 * @param contributions The contributions from getContributions().
 * @returns The pull request review summary to pass to the template renderer.
 */
export declare function generatePullRequestReviewSummary(contributions: Contributions): PullRequestReviewSummary[];
