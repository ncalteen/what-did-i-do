import * as core from '@actions/core'
import * as github from '@actions/github'
import * as graphql from './graphql.js'
import * as render from './render.js'
import * as utils from './utils.js'

/**
 * Action Entrypoint
 */
export async function run() {
  // Get the inputs
  const githubToken = core.getInput('token', { required: true })
  const otherTokens =
    core.getInput('other_tokens') === ''
      ? []
      : core.getInput('other_tokens').split(',')
  const numberOfDays = parseInt(core.getInput('num_days', { required: true }))
  const [owner, repository] = core
    .getInput('repository', { required: true })
    .split('/')
  const projectNumber =
    core.getInput('project_number') === ''
      ? undefined
      : parseInt(core.getInput('project_number'))

  core.info('Action Inputs:')
  core.info(`  Number of Days: ${numberOfDays}`)
  core.info(`  Owner: ${owner}`)
  core.info(`  Repository: ${repository}`)
  core.info(`  Project Number: ${projectNumber}`)

  // Get the start and end dates based on the number of days input
  const startDate = new Date(
    new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000
  )
  const endDate = new Date()

  core.info('Date Range:')
  core.info(`  Start: ${startDate.toISOString()}`)
  core.info(`  End: ${endDate.toISOString()}`)

  const octokit = github.getOctokit(githubToken)
  const username = await graphql.getAuthenticatedUser(octokit)

  // Get the contributions for each token
  const contributions = await utils.getContributions(
    [githubToken].concat(otherTokens),
    startDate
  )

  // Generate markdown from the template
  const body = render.generateMarkdown(
    contributions,
    endDate,
    startDate,
    username
  )

  // Write the output to a new issue and assign to the project
  await utils.createIssue(
    body,
    octokit,
    `${owner}/${repository}`,
    username,
    projectNumber
  )
}
