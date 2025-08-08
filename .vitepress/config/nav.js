const homeMenu = { text: "홈", link: "/" };

const rulesMenu = { 
  text: "규칙", 
  items: [
    {
      items: [
        { text: "챌린지 규칙", link: "/rules/rulebook" },
        { text: "블로그 가이드", link: "/rules/blog-guide" },
        { text: "신청하기", link: "/rules/check-in" },
      ],
    },
  ],
};

// const blogMenu = {
//   text: "블로그",
//   link: "/blogs",
// };

const postsMenu = {
  text: "아카이브",
  link: "/posts",
};

export default [
  homeMenu, 
  rulesMenu,
  // blogMenu, 
  postsMenu
];