# _What did I do?_ GitHub Action

This action helps track a user's work in GitHub. It's designed to generate an
issue that contains a summary of contributions on GitHub.com over a certain time
period. It can optionally leverage OpenAI to generate a summary of the
contributions.

## Version 5 Breaking Changes

The inputs have been **heavily** modified in version 5. Please see the inputs
section below, as well as the [`action.yml`](./action.yml) file for the full
list of inputs.

This change was made to support multiple GitHub tokens and API URLs, such as
when working with multiple GitHub.com accounts (e.g. Enterprise Managed Users)
or across API boundaries (e.g. `ghe.com`).

## Inputs

- `contribution_tokens_api_urls`

  A newline-separated list of GitHub tokens and API URLs for authentication. For
  example, if you have separate account(s) for GitHub Enterprise Cloud and
  GitHub Enterprise Cloud with Data Residency (ghe.com). The format for each
  entry is `token@api_url`, where `api_url` is optional and defaults to
  `https://api.github.com`.

  ```plain
  DOTCOM_TOKEN@https://api.github.com
  GHE_TOKEN@https://api.mycompany.ghe.com
  EMU_TOKEN@https://api.github.com
  ```

- `include_comments`

  Set this to true to include comment bodies in the prompt sent to OpenAI (this
  can result in the context length being exceeded!). Defaults to false.

- `num_days`

  The number of days to look back. Defaults to 14.

- `openai_model`

  (Optional) OpenAI API model for generating the summary. This will be added as
  a comment to the issue that is created. Defaults to `gpt-4o-mini`.

- `openai_project`

  (Optional) OpenAI API project for generating the summary. This will be added
  as a comment to the issue that is created.

- `openai_token`

  (Optional) OpenAI API token for generating the summary. This will be added as
  a comment to the issue that is created.

- `summary_issue_api_url`

  The GitHub API URL to use for creating the summary issue. Defaults to
  `https://api.github.com`.

- `summary_issue_token`

  GitHub.com authentication token with permissions to write issues (and
  optionally projects). This is used to create the summary issue.

- `project_number`

  (Optional) The project number to create the summary issue in.

- `repository`

  The owner and repository to create the summary issue in. Defaults to the
  repository where this action is invoked. Format: `owner/repo.` If you want to
  create the issue in a different repository than the one where you are running
  this action, ensure the `token` input has sufficient permissions.'

> [!NOTE]
>
> _Why would I need multiple tokens?_ In situations where you work across
> multiple GitHub.com accounts (e.g. with Enterprise Managed Users) or across
> API boundaries (e.g. `ghe.com`), you may need to provide additional tokens to
> access contributions across all accounts.

The token permissions should include the following:

- Read access to repositories, issues, and pull requests
- Read access to your user profile (`read:user`)
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
          contribution_tokens_api_urls: |
            ${{ secrets.MY_GHEC_TOKEN }}@https://api.github.com
            ${{ secrets.MY_GHE_TOKEN }}@https://api.mycompany.ghe.com
          include_comments: false
          num_days: 14
          openai_model: gpt-4o-mini
          openai_project: ${{ secrets.OPENAI_PROJECT }}
          openai_token: ${{ secrets.OPENAI_TOKEN }}
          summary_issue_api_url: https://api.github.com
          summary_issue_token: ${{ secrets.MY_GITHUB_TOKEN }}
          project_number: 1
          repository: ${{ github.repository }}
```
