import * as core from '@actions/core'
import type { GraphqlResponseError } from '@octokit/graphql'
import { Organization, User } from '@octokit/graphql-schema'
import * as queries from './queries.js'

/**
 * Get the currently authenticated user.
 *
 * @param octokit The authenticated Octokit instance.
 * @returns The username of the authenticated user.
 */
export async function getAuthenticatedUser(octokit: any): Promise<string> {
  const response = await octokit.graphql({
    query: queries.AUTHENTICATED_USER
  })

  return response.viewer.login
}

/**
 * Get the GraphQL node ID of a user.
 *
 * @param octokit The authenticated Octokit instance.
 * @param username The user to get the node ID for.
 * @returns The GraphQL node ID of the user.
 */
export async function getUserNodeId(
  octokit: any,
  username: string
): Promise<string> {
  const response = await octokit.request('GET /users/:username', {
    username
  })

  return response.data.node_id
}

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
export async function getProjectNodeId(
  octokit: any,
  owner: string,
  projectNumber: number | undefined
): Promise<string | undefined> {
  if (projectNumber === undefined) return undefined

  try {
    // Try to get the project from the organization
    const response = await octokit.graphql({
      query: queries.ORG_PROJECT_NODE_ID,
      organization: owner,
      projectNumber
    })

    return response.organization.projectV2.id
  } catch (error: any) {
    const errorWithType = error as GraphqlResponseError<Organization>

    /* istanbul ignore next */
    if (errorWithType.errors && errorWithType.errors[0].type !== 'NOT_FOUND')
      throw error
  }

  try {
    // Try to get the project from the user
    const response = await octokit.graphql({
      query: queries.USER_PROJECT_NODE_ID,
      login: owner,
      projectNumber
    })

    return response.user.projectV2.id
  } catch (error: any) {
    const errorWithType = error as GraphqlResponseError<User>

    /* istanbul ignore next */
    if (errorWithType.errors && errorWithType.errors[0].type !== 'NOT_FOUND')
      throw error
  }

  core.error("The project wasn't found for the user or organization.")
  return undefined
}

/**
 * Get the GraphQL node ID of a repository.
 *
 * @param octokit The authenticated Octokit instance.
 * @param owner The owner (user) of the repository.
 * @param name The name of the repository.
 * @returns The node ID of the repository.
 */
export async function getRepositoryNodeId(
  octokit: any,
  owner: string,
  name: string
): Promise<string> {
  const response = await octokit.graphql({
    query: queries.REPOSITORY_NODE_ID,
    owner,
    name
  })

  return response.repository.id
}
