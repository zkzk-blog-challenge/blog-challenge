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

const blogMenu = {
  text: "블로그",
  link: "/blogs",
};

const postsMenu = {
  text: "아카이브",
  link: "/posts",
};

// const linkMenu = {
//   text: "링크 모음",
//   items: [
//     {
//       items: [
//         { text: "JS", link: "/posts/links/javascript" },
//         { text: "CSS", link: "/posts/links/typescript" },
//       ],
//     },
//     {
//       items: [
//         { text: "VUE", link: "/posts/links/vue" },
//         { text: "REACT", link: "/posts/links/react" },
//       ],
//     },
//     {
//       items: [{ text: "AI", link: "/posts/links/ai" }],
//     },
//     {
//       items: [{ text: "IOS", link: "/posts/links/ios" }],
//     },
//     {
//       items: [{ text: "etc", link: "/posts/links/etc" }],
//     },
//   ],
// };

export default [homeMenu, rulesMenu, blogMenu, postsMenu];