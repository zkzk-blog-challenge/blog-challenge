const STATUS_CODE = {
  "미제출": 0,
  "제출": 1,
  "지각": 2,
};

export class SubmissionManager {
  constructor(indexPath = "/submissions/index.json", basePath = "/submissions") {
    this.indexPath = indexPath;
    this.basePath = basePath;
    this.participants = []; // { name, id, blog }
  }

  async init() {
    const res = await fetch(this.indexPath);
    const data = await res.json();
    this.participants = data.participants || [];
    console.log("[SubmissionManager] 참가자 로딩 완료:", this.participants.length);
  }

  /**
   * 주차별 제출 리스트 로딩
   * @param {string} week ex) "2025-C1-W1"
   * @returns {Promise<Array<{ name, id, blog, week, status, submittedAt?, link? }>>}
   */
async loadWeekSubmissions(week) {
    const list = [];

    for (const p of this.participants) {
      const filePath = `${this.basePath}/${week}/${p.id}.json`;

      try {
        const res = await fetch(filePath);
        if (!res.ok) throw new Error("Not Found");

        const data = await res.json();
        const due = new Date(data.metaData.dueDate);
        const submitted = new Date(data.metaData.submittedAt);
        const isLate = submitted > due;
        const status = isLate ? STATUS_CODE["지각"] : STATUS_CODE["제출"];

        list.push({
          name: p.name,
          id: p.id,
          blog: p.blog,
          week,
          status,
          link: data.link,
          submittedAt: data.metaData.submittedAt,
        });
      } catch (err) {
        console.warn(`❌ 제출 파일 없음 또는 오류: ${filePath}`, err);

        list.push({
          name: p.name,
          id: p.id,
          blog: p.blog,
          week,
          status: STATUS_CODE["미제출"],
          link: null,
          submittedAt: null,
        });
      }
    }
  
    console.log(`[SubmissionManager] ${week} 제출 현황 로딩 완료`);
    return list;
  }

  /**
   * 출석 전체 주차 로딩
   * @param {Array<string>} weekList ["2025-C1-W1", "2025-C1-W2", ...]
   * @returns {Promise<Object>} { [name]: { [week]: status (0, 1, 2) } }
   */
  async loadAttendanceMap(weekList) {
    const attendance = {};
    for (const p of this.participants) {
      attendance[p.name] = {};
    }

    for (const week of weekList) {
      const weekSubmissions = await this.loadWeekSubmissions(week);
      for (const s of weekSubmissions) {
        attendance[s.name][week] = s.status;
      }
    }

    return attendance;
  }
}