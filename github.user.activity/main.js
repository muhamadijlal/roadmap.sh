#!/usr/bin/env node

function printError(e) {
  console.error(`error: ${e.message}`);
  if (e.cause) console.error(`  cause: ${e.cause}`);
  process.exitCode = 1;
}

async function getUserEvents(username) {
  let res;
  try {
    res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/events`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "github-activity-cli",
        },
      },
    );
  } catch (err) {
    throw new Error("gagal menghubungi GitHub API", { cause: err });
  }

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`user "${username}" tidak ditemukan`);
    }
    if (res.status === 403) {
      throw new Error("kena rate limit GitHub, coba lagi nanti");
    }
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Gabungkan event yang "sama" jadi satu grup + hitung jumlahnya
function groupEvents(events) {
  const groups = new Map();

  for (const event of events) {
    const detail = event.payload.action ?? event.payload.ref_type ?? "";
    const key = `${event.type}|${event.repo.name}|${detail}`;

    if (groups.has(key)) {
      groups.get(key).count++;
    } else {
      groups.set(key, { event, count: 1 });
    }
  }

  return [...groups.values()];
}

function times(count) {
  return count === 1 ? "" : ` (${count}x)`;
}

function formatGroup({ event, count }) {
  const repo = event.repo.name;
  const p = event.payload;

  switch (event.type) {
    case "PushEvent":
      return `Pushed ${count} ${count === 1 ? "time" : "times"} to ${repo}`;
    case "IssuesEvent":
      return `${capitalize(p.action)} ${count} issue(s) in ${repo}`;
    case "IssueCommentEvent":
      return `Commented on issues in ${repo}${times(count)}`;
    case "PullRequestEvent":
      return `${capitalize(p.action)} ${count} pull request(s) in ${repo}`;
    case "WatchEvent":
      return `Starred ${repo}`;
    case "ForkEvent":
      return `Forked ${repo}${times(count)}`;
    case "CreateEvent":
      return `Created ${p.ref_type} in ${repo}${times(count)}`;
    case "DeleteEvent":
      return `Deleted ${p.ref_type} in ${repo}${times(count)}`;
    default:
      return `${event.type.replace("Event", "")} in ${repo}${times(count)}`;
  }
}

function capitalize(text = "") {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function main() {
  const username = process.argv.at(2);

  if (!username) {
    throw new Error("usage: github-activity <username>");
  }

  const events = await getUserEvents(username);

  if (events.length === 0) {
    console.log(`Belum ada aktivitas terbaru dari ${username}.`);
    return;
  }

  for (const group of groupEvents(events)) {
    console.log(`+ ${formatGroup(group)}`);
  }
}

main().catch(printError);
