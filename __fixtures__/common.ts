const today: Date = new Date()

export const baseTimestamp: string = today.toISOString()
export const commentId: string = 'IssueComment_1'
export const issueBody: string = `### The Name of the Thing

this-is-the-thing

### The Nickname of the Thing

the-thing

### The Color of the Thing

black

### The Shape of the Thing

square

### The Sounds of the Thing

mi, so

### The Topics About the Thing

fun

### The Description of the Thing

This is a description of the thing.

### The Notes About the Thing

These are notes about the thing.

### The Code of the Thing

const thing = new Thing();
thing.doSomething();

### The String Method of the Code of the Thing

thing.toString();

### Is the Thing a Thing?

- [x] Yes
- [ ] No

### Is the Thing Useful?

- [x] Yes
- [ ] Sometimes
- [ ] No

### Read Team

IssueOps-Demo-Readers

### Write Team

IssueOps-Demo-Writers`
export const issueCommentEventPayloadPath: string =
  '__fixtures__/events/issue_comment.json'
export const issuesEventPayloadPath: string = '__fixtures__/events/issues.json'
export const issueFormTemplate: string = 'example-request.yml'
export const issueNumber: number = 1
export const issueId: string = 'Issue_1'
export const owner: string = 'issue-ops'
export const pullRequestEventPayloadPath: string =
  '__fixtures__/events/pull_request.json'
export const pullRequestId: string = 'PullRequest_1'
export const pullRequestReviewEventPayloadPath: string =
  '__fixtures__/events/pull_request_review.json'
export const repository: string = 'state-machine'
export const stateMachineConfigFile: string = 'state-machine-config.yml'
export const token: string = 'MY_GITHUB_TOKEN'
export const workspace: string = `${process.env.HOME}/Workspace/local-workspace`

/**
 * Generates a GrapQL node ID for a given order.
 *
 * The node ID is generated in the `name_###` format, where `name` is the name
 * of the node and `###` is the order of the node, padded with zeroes to 3
 * digits.
 *
 * @param order The order to generate a node ID for.
 * @param name The name of the node.
 * @returns The node ID in `name_###` format.
 */
export function createNodeId(order: number, name: string): string {
  return `${name}_${order.toString().padStart(3, '0')}`
}

/**
 * Generates a timestamp for a given order.
 *
 * The year, month and day are taken from the current date. The hour, minute and
 * second are calculated from the provided order.
 *
 * @param order The order to generate a timestamp for.
 * @returns The timestamp in `YYYY-MM-DDTHH:MM:SSZ` format.
 */
export function createTimestamp(order: number): string {
  const timestamp: Date = new Date(today.getTime())
  timestamp.setSeconds(timestamp.getSeconds() + order * 10)
  return timestamp.toISOString()
}
