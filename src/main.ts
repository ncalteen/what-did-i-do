import * as core from '@actions/core'
import * as github from '@actions/github'
import { OpenAI } from 'openai'
import * as graphql from './graphql.js'
import * as render from './render.js'
import * as utils from './utils.js'

export async function run() {
  // Get the inputs
  const contributionTokens = core.getInput('contribution_tokens_api_urls', {
    required: true,
    trimWhitespace: true
  })
  const numberOfDays = parseInt(core.getInput('num_days', { required: true }))
  const openAIModel = core.getInput('openai_model')
  const openAIProject = core.getInput('openai_project')
  const openAIToken = core.getInput('openai_token')
  const summaryIssueApiUrl = core.getInput('summary_issue_api_url', {
    required: true,
    trimWhitespace: true
  })
  const summaryIssueToken = core.getInput('summary_issue_token', {
    required: true,
    trimWhitespace: true
  })
  const projectNumber =
    core.getInput('project_number') === ''
      ? undefined
      : parseInt(core.getInput('project_number'))
  const [owner, repository] = core
    .getInput('repository', { required: true })
    .split('/')
  const includeComments = core.getBooleanInput('include_comments')

  core.info('Action Inputs:')
  core.info(`  Owner: ${owner}`)
  core.info(`  Repository: ${repository}`)
  core.info(`  Number of Days: ${numberOfDays}`)
  core.info(`  Project Number: ${projectNumber}`)
  core.info(`  Include Comments: ${includeComments}`)

  // Parse the tokens and API URLs
  const contributionTokenMap = contributionTokens
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [token, apiUrl] = line.split('@').map((part) => part.trim())
      return { token, apiUrl: apiUrl || 'https://api.github.com' }
    })

  // Get the start and end dates based on the number of days input
  const startDate = new Date(
    new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000
  )
  const endDate = new Date()

  core.info('Date Range:')
  core.info(`  Start: ${startDate.toISOString()}`)
  core.info(`  End: ${endDate.toISOString()}`)

  const octokit = github.getOctokit(summaryIssueToken, {
    baseUrl: summaryIssueApiUrl
  })
  const username = await graphql.getAuthenticatedUser(octokit)

  // Get the contributions for each token
  const contributions = await utils.getContributions(
    contributionTokenMap,
    startDate,
    includeComments
  )

  // Generate markdown from the template
  const body = render.generateMarkdown(
    contributions,
    endDate,
    startDate,
    username
  )

  // Write the output to a new issue and assign to the project
  const issueNumber = await utils.createIssue(
    body,
    octokit,
    `${owner}/${repository}`,
    username,
    projectNumber
  )

  // Call the OpenAI API to generate a summary
  if (openAIToken !== '' && openAIProject !== '' && openAIModel !== '') {
    const openai = new OpenAI({
      project: openAIProject,
      apiKey: openAIToken
    })

    const completions = await openai.chat.completions.create({
      model: openAIModel,
      messages: [
        { role: 'user', content: render.generatePrompt(username) },
        { role: 'user', content: JSON.stringify(contributions) }
      ]
    })

    // Comment on the issue with the summary
    if (completions.choices[0].message.content)
      await octokit.rest.issues.createComment({
        owner,
        repo: repository,
        issue_number: issueNumber,
        body: completions.choices[0].message.content
      })
  }
}
