# _What did I do?_ GitHub Action

This action helps track a user's work in GitHub. It's designed to generate an
issue that contains a summary of contributions on GitHub.com over a certain time
period. It can optionally leverage OpenAI to generate a summary of the
contributions.

## Inputs

- `token`
  - Default: `${{ secrets.GITHUB_TOKEN }}`
  - Description: GitHub.com authentication token
- `other_tokens`
  - Description: Comma-separated list of additional GitHub.com tokens
- `num_days`
  - Default: `14`
  - Description: Number of days to look back
- `openai_model`
  - Default: `gpt-4o-mini`
  - Description: OpenAI model to use for generating the summary
- `openai_project`
  - Description: OpenAI project to use for generating the summary
- `openai_token`
  - Description: OpenAI authentication token for generating the summary
- `project_number`
  - Description: (Optional) GitHub project number to add the issue to.
- `repository`
  - Default: `${{ github.repository }}`
  - Description: The repository to create the summary issue in (`owner/name`
    format)

> [!NOTE]
>
> _Why would I need multiple tokens?_ In situations where you work across
> multiple GitHub.com accounts (e.g. with Enterprise Managed Users), you may
> need to provide additional tokens to access contributions across all accounts.

The token permissions should include the following:

- Read access to repositories, issues, and pull requests
- Write access to issues
- (Optional) Write access to projects

## Outputs

None

## Example usage

> Make sure to update the version of the action!

```yaml
name: Report on @ncalteen's activity

# Run every 2 weeks, or manually
on:
  schedule:
    - cron: '0 0 1,15 * *'
  workflow_dispatch:

jobs:
  # Assign the issue to @ncalteen
  report:
    name: Generate Report
    runs-on: ubuntu-latest

    steps:
      - name: Build Report for @ncalteen
        id: report
        uses: ncalteen/what-did-i-do@vX.Y.Z
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          other_tokens: '${{ secrets.TOKEN_1 }},${{ secrets.TOKEN_2 }}'
          num_days: 14
          repository: ncalteen/todo
          projectNumber: 1
```
