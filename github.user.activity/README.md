# github.user.activity

A simple Node.js CLI that fetches the recent public activity of a GitHub user and prints it in the terminal. Similar events (same type, repository, and action) are grouped into one line with a count.

Project URL: https://roadmap.sh/projects/github-user-activity

Repository: https://github.com/muhamadijlal/roadmap.sh

## Requirements

- Node.js 18 or newer (the built-in `fetch` and ES modules are used)
- Internet connection (data comes from the GitHub REST API, no token needed)

## Installation

```bash
git clone https://github.com/muhamadijlal/roadmap.sh.git
cd roadmap.sh/github.user.activity
```

No dependencies to install.

Optional: expose the `github-activity` command globally.

```bash
npm link
```

## Usage

```bash
node main.js <username>
# or, after `npm link`
github-activity <username>
```

### Example

```bash
node main.js muhamadijlal
# + Pushed 3 times to muhamadijlal/roadmap.sh
# + Created branch in muhamadijlal/roadmap.sh
# + Starred some-user/some-repo
```

Output depends on the user's real recent activity.

### Supported events

| GitHub event | Output |
| --- | --- |
| `PushEvent` | `Pushed N times to <repo>` |
| `IssuesEvent` | `Opened N issue(s) in <repo>` (action varies) |
| `IssueCommentEvent` | `Commented on issues in <repo>` |
| `PullRequestEvent` | `Opened N pull request(s) in <repo>` (action varies) |
| `WatchEvent` | `Starred <repo>` |
| `ForkEvent` | `Forked <repo>` |
| `CreateEvent` | `Created <repository/branch/tag> in <repo>` |
| `DeleteEvent` | `Deleted <branch/tag> in <repo>` |
| other | `<Type> in <repo>` |

## Errors

The CLI prints `error: <message>` to stderr and exits with code `1` when:

- no username is given (`usage: github-activity <username>`),
- the user does not exist (HTTP 404),
- the GitHub API rate limit is hit (HTTP 403), since requests are unauthenticated,
- any other non-OK response is returned by the GitHub API,
- the GitHub API cannot be reached (network problem; the cause is printed too).

If the user has no recent public activity, a message saying so is printed instead.

## Notes

- The GitHub events API only returns recent public events (up to 30 per request).
