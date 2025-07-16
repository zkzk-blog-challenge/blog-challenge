const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

const token = process.env.GITHUB_TOKEN;
const repo = process.env.REPO;
const [owner, repoName] = repo.split("/");

const octokit = new Octokit({ auth: token });

const getUnixTimestamp = (dateStr) => Math.floor(new Date(dateStr).getTime() / 1000);

const now = new Date();
const thisSunday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const deadline = thisSunday.getTime() / 1000 - 1; // 토요일 23:59:59 KST 기준으로

async function run() {
  const { data: pulls } = await octokit.pulls.list({
    owner,
    repo: repoName,
    state: "open",
    base: "main",
  });

  for (const pr of pulls) {
    const prNumber = pr.number;

    const { data: files } = await octokit.pulls.listFiles({
      owner,
      repo: repoName,
      pull_number: prNumber,
    });

    let onTime = true;

    for (const file of files) {
      if (!file.filename.endsWith(".json")) continue;

      const res = await fetch(file.raw_url);
      const json = await res.json();
      const cDate = json.cDate;

      if (!cDate || typeof cDate !== "number") continue;
      if (cDate > deadline) onTime = false;
    }

    const label = onTime ? "출석" : "지각";

    await octokit.issues.addLabels({
      owner,
      repo: repoName,
      issue_number: prNumber,
      labels: [label],
    });

    await octokit.pulls.merge({
      owner,
      repo: repoName,
      pull_number: prNumber,
      merge_method: "merge", // 일반 병합
    });

    console.log(`✅ PR #${prNumber} merged with label: ${label}`);
  }
}

run().catch((e) => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
