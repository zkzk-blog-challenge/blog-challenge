// .github/scripts/auto-merge-and-label.js

const { Octokit } = require("@octokit/rest");

const token = process.env.GITHUB_TOKEN;
const repo = process.env.REPO;
const [owner, repoName] = repo.split("/");

const octokit = new Octokit({ auth: token });

function getDeadlineTimestamp() {
  const now = new Date();
  const sunday = new Date(now);
  sunday.setUTCHours(14, 59, 59, 999); // UTC 일요일 14:59:59 = KST 토요일 23:59:59
  return Math.floor(sunday.getTime() / 1000);
}

async function run() {
  const deadline = getDeadlineTimestamp();

  const { data: pulls } = await octokit.pulls.list({
    owner,
    repo: repoName,
    state: "open",
    base: "main",
  });

  for (const pr of pulls) {
    const prNumber = pr.number;

    try {
      const { data: files } = await octokit.pulls.listFiles({
        owner,
        repo: repoName,
        pull_number: prNumber,
      });

      let onTime = true;
      for (const file of files) {
        if (!file.filename.endsWith(".json")) continue;

        const res = await fetch(file.raw_url); // Node 18+ 내장 fetch 사용
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
        merge_method: "merge",
      });

      console.log(`✅ PR #${prNumber} merged with label: ${label}`);
    } catch (e) {
      console.error(`❌ PR #${prNumber} 처리 중 오류:`, e.message);
    }
  }
}

run().catch((e) => {
  console.error("❌ 전체 실패:", e.message);
  process.exit(1);
});