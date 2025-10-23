import { defineConfig } from 'vitepress'

import { generateNav, generateSiderbar } from './navSidebar'

const nav = generateNav(process.cwd())
const sidebar = generateSiderbar(process.cwd())

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LzhPro私人笔记",
  description: "私人笔记，谨慎查阅",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      ...nav,
      { text: 'GitHub', link: 'https://github.com/Gar-b-age/CookLikeHOC' },
    ],
    sidebar:{
      ...sidebar
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
