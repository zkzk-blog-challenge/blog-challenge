import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import BaseLayout from "./BaseLayout.vue";
import Archives from "./components/Archives.vue";
import BlogArchives from "./components/BlogArchives.vue";
import Category from "./components/Category.vue";
import Tags from "./components/Tags.vue";
import Pages from "./components/Pages.vue";
import Comment from "./components/UtterancComment.vue";

import "./style.css";   // style 파일은 custom.css 등 네이밍만 다를 뿐, 자유롭게

export default {
  ...DefaultTheme,
  Layout: BaseLayout,
  enhanceApp({ app }) {
    // 글로벌 컴포넌트 등록
    app.component("Tags", Tags);
    app.component("Category", Category);
    app.component("Archives", Archives);
    app.component("BlogArchives", BlogArchives);
    app.component("Pages", Pages);
    app.component("Comment", Comment);
  },
} satisfies Theme;
