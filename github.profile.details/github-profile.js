function errorMessage(message) {
  console.error(`error: ${message}`);
  process.exitCode = 1;
}

async function fetchGithubProfile(username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "github-profile-cli",
        },
      },
    );

    if (response.status === 404) {
      errorMessage(`GitHub user not found: ${username}`);
      return;
    }

    if (!response.ok) {
      errorMessage(`GitHub request failed with status ${response.status}`);
      return;
    }

    const data = await response.json();

    return data
      ? {
          name: data.name || "not set",
          username: data.login,
          profile: data.html_url,
          public_repos: data.public_repos,
          followers: data.followers,
        }
      : {};
  } catch {
    errorMessage("could not reach GitHub");
    return;
  }
}

async function main() {
  const userprofile = process.argv.at(2);

  if (!userprofile) {
    errorMessage("please provide a GitHub username");
    return;
  }

  try {
    const data = await fetchGithubProfile(userprofile);

    if (!data) {
      return;
    }

    console.log(`
        Name: ${data.name}
        Username: ${data.username}
        Profile: ${data.profile}
        Public repos: ${data.public_repos}
        Followers: ${data.followers}`);
  } catch (error) {
    errorMessage(error);
  }
}

main();
