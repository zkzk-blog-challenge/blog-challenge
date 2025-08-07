const blogsPages = {
  "/blogs/": [
    {
      text: "소개",
      collapsed: false,
      items: [
        { text: "블로그 챌린지 연혁", link: "/info/timeline" },
        { text: "챌린지 참여자", link: "/info/users" },
      ],
    },
    {
      text: "큐레이션",
      collapsed: false,
      items: [
        { text: "🔥명예의 전당", link: "/curation/blog-guide" },
        { text: "1기 큐레이션", link: "/curation/rulebook" },
      ],
    },
    {
      text: "활동",
      collapsed: false,
      items: [
        { 
          text: "1기 활동", 
          collapsed: true,
          items: [
            { text: "제 1회 깃허브 쓰기 운동", link: "/events/rulebook" },
            { text: "1기 회고 활동", link: "/events/blog-guide" },
          ],
        },
      ],
    }
  ],
};

const postsPages = {
  "/posts/": [
    {
      text: "아카이브",
      collapsed: false,
      items: [
        { text: "1기 (250501~250830)", link: "/posts/2025-C1" },
        // { text: "2기 (250501~250830)", link: "/posts/2025-C2" },
      ],
    }
  ],
};

const infoPages = {
  "/rules/": [
    {
      text: "규칙",
      collapsed: false,
      items: [
        { text: "챌린지 규칙", link: "/rules/rulebook" },
        { text: "블로그 가이드", link: "/rules/blog-guide" },
        { text: "신청하기", link: "/rules/check-in" },
      ],
    },
  ],
};

// const componentPages = {
//   "/posts/component/": [
//     {
//       text: "Components",
//       items: [],
//     },
//   ],
// };


export default {
  ...blogsPages,
  ...postsPages,
  ...infoPages,
  // ...componentPages,
};