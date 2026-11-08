# github.profile.details

A simple Node.js CLI that fetches the public profile of a GitHub user and prints their name, username, profile URL, number of public repositories, and number of followers.

Project URL: https://roadmap.sh/projects/nodejs-github-profile-details

Repository: https://github.com/muhamadijlal/roadmap.sh

## Requirements

- Node.js 18 or newer (uses the built-in `fetch`)
- Internet connection (data comes from the public GitHub API)

## Installation

```bash
git clone https://github.com/muhamadijlal/roadmap.sh.git
cd roadmap.sh/github.profile.details
```

No dependencies to install.

## Usage

```bash
node github-profile.js <github-username>
```

Example:

```bash
node github-profile.js muhamadijlal
```

### Example output

```
        Name: haidarijlal.
        Username: muhamadijlal
        Profile: https://github.com/muhamadijlal
        Public repos: 49
        Followers: 3
```

If the user has no display name, `Name` shows `not set`.

### Errors

Errors are printed to stderr and the program exits with code `1`:

```
error: please provide a GitHub username
error: GitHub user not found: some-unknown-user
error: GitHub request failed with status 403
error: could not reach GitHub
```

Note: unauthenticated GitHub API requests are rate limited, so repeated runs may fail with status 403.

## How it works

1. Reads the username from the first CLI argument (`process.argv`).
2. Calls `https://api.github.com/users/<username>` with `fetch`, encoding the username using `encodeURIComponent`.
3. Prints the selected fields from the JSON response, or an error message when the request fails.

## License

ISC
