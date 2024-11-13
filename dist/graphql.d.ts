import type { Octokit } from '@octokit/rest';
/**
 * Get the currently authenticated user.
 *
 * @param octokit The authenticated Octokit instance.
 * @returns The username of the authenticated user.
 */
export declare function getAuthenticatedUser(octokit: any): Promise<string>;
/**
 * Get the GraphQL node ID of a user.
 *
 * @param octokit The authenticated Octokit instance.
 * @param username The user to get the node ID for.
 * @returns The GraphQL node ID of the user.
 */
export declare function getUserNodeId(octokit: Octokit, username: string): Promise<string>;
/**
 * Get the GraphQL node ID of a project.
 *
 * This may be owned by an organization or a user, so this method checks both.
 *
 * @param octokit The authenticated Octokit instance.
 * @param owner The owner (organization or user) of the project.
 * @param projectNumber The number of the project.
 * @returns The global ID of the project or undefined if it wasn't found.
 */
export declare function getProjectNodeId(octokit: Octokit, owner: string, projectNumber: number | undefined): Promise<string | undefined>;
/**
 * Get the GraphQL node ID of a repository.
 *
 * @param octokit The authenticated Octokit instance.
 * @param owner The owner (user) of the repository.
 * @param name The name of the repository.
 * @returns The node ID of the repository.
 */
export declare function getRepositoryNodeId(octokit: Octokit, owner: string, name: string): Promise<string>;
