import { defineConfig } from "vitepress";
import { getPosts } from '../theme/serverUtils'
import path from "path";

import nav from "./nav";
import sidebar from "./sidebar";

const PAGESIZE = 10

// https://vitepress.dev/reference/site-config

export default defineConfig({
  title: "쥐깍쥐깍 블로그 챌린지",
  lang: "ko",
  description: "예술공학부 기반의 블로그 챌린지 스터디 쥐깍쥐깍입니다.",

  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../../"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // Sass의 모던 API 사용을 강제
        },
      },
    },
  },

  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    nav: nav,
    sidebar: sidebar,

    posts: await getPosts(PAGESIZE),

    socialLinks: [
      // You can add any icon from simple-icons (https://simpleicons.org/)
      { icon: "github", link: "https://github.com/zkzk-blog-challenge" },
      { icon: "notion", link: "https://www.notion.so/over-immersion/1e02634e00d5808aad7dd2624f89f21d" },
    ],

    lastUpdated: {
      text: '마지막 업데이트 날짜',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    editLink: {
        pattern: 'https://github.com/zkzk-blog-challenge/zkzk-blog-challenge.github.io/edit/main/:path',
        text: '✏️ 이 페이지 편집하기'
    },
  },

  srcExclude: ["**/README.md"],
  rewrites: {
    "pages/:slug*": ":slug*",
  },

  sitemap: {
    hostname: "https://zkzk-blog-challenge.github.io/",
    transformItems: (items) => {
      return items.map((item) => {
        item.url = item.url.replace(/\.html$/, "");
        return item;
      });
    },
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-P9FSHHKTBN",
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-P9FSHHKTBN');`,
    ],
    [
      "meta",
      {
        name: "naver-site-verification",
        content: "5912e8936a16866a425cfefd2311f36745d4f9f1",
      },
    ],
  ],

  transformPageData(pageData) {
    const canonicalUrl = `/${pageData.relativePath}`
      .replace(/index\.md$/, "")
      .replace(/\.md$/, ".html");

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push([
      "link",
      { rel: "canonical", href: canonicalUrl },
    ]);
  },
});