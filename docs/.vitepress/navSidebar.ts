import fs from 'node:fs'
import path from 'node:path'
import type { DefaultTheme } from 'vitepress'

export type SidebarItem = DefaultTheme.SidebarItem
export type NavItem = DefaultTheme.NavItem
export type Sidebar = DefaultTheme.Sidebar

const DOC_EXT = ['.md']
const EXCLUDED_DIRS = new Set([
  '.git',
  '.github',
  '.vitepress',
  'node_modules',
  'images',
  'docker_support',
  'public',
  'docs',
  'images',
  'docker_support',
  'index.md',
])

function isDirectory(p: string) {
  return fs.existsSync(p) && fs.statSync(p).isDirectory()
}

function isMarkdown(p: string) {
  return fs.existsSync(p) && fs.statSync(p).isFile() && DOC_EXT.includes(path.extname(p))
}

function titleFromName(name: string) {
  // strip extension & use as-is (Chinese names kept)
  return name.replace(/\.md$/i, '')
}

function sortByPinyinOrName(a: string, b: string) {
  return a.localeCompare(b, 'zh-Hans-CN-u-co-pinyin')
}
/**
 * 生成Nav
 * @param rootDir 
 * @returns 
 */
export function generateNav(rootDir: string) {
  rootDir = path.join(rootDir, 'docs');
  const entries = fs.readdirSync(rootDir, {withFileTypes: true})
  const nav: NavItem[] = []
  for(const item of entries){
    const fullPath = path.join(rootDir, item.name);
    if(EXCLUDED_DIRS.has(item.name)) continue;
    if(item.isDirectory()){
      nav.push({
        text: item.name,
        link: "/" + item.name,
      });
    }
    if(item.isFile()){
      nav.push({
        text: titleFromName(item.name),
        link: "/" + titleFromName(item.name),
      })
    }
  }
  return nav
}

/**
 * 生成Siderbar
 * @param rootDir 
 * @returns 
 */
export function generateSiderbar(rootDir: string) {
  rootDir = path.join(rootDir, 'docs');
  const entries = fs.readdirSync(rootDir, {withFileTypes: true})
  
  const siderbar:Record<string, SidebarItem[]> = {}
  for(const item of entries){
    const fullPath = path.join(rootDir, item.name);
    if(EXCLUDED_DIRS.has(item.name)){
      continue;
    }
    if(item.isDirectory()){
      siderbar[item.name] = generateSidebar(rootDir, item.name, item.name);
    }
  }
  return siderbar
}


// 2. 递归函数
/**
 * 递归地扫描目录并生成 VitePress 侧边栏配置
 * @param dirPath 相对于 docs 目录的路径，例如 'soft-test'
 * @param docsRoot VitePress 文档的根目录，通常是项目的 'docs' 目录
 * @param currentBaseLink 当前侧边栏链接的基础路径，例如 '/soft-test/'
 * @returns SidebarItem 数组
 */
function generateSidebar(
  dirPath: string,
  folderName: string,
  currentBaseLink: string = ''
): SidebarItem[] {
  const items: SidebarItem[] = [];
  const fullPath = path.join(dirPath, folderName);

  // 确保目录存在
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
    return items;
  }

  // 读取目录内容
  const files = fs.readdirSync(fullPath, {withFileTypes: true})

  // 过滤和排序：先目录，后文件
  files.sort((a, b) => {
    const aIsDir = fs.statSync(path.join(fullPath, a.name)).isDirectory();
    const bIsDir = fs.statSync(path.join(fullPath, b.name)).isDirectory();
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const item of files) {
    const fileName = item.name;
    if(item.isFile()){
      items.push({
        'text': fileName === 'index.md'?'首页':titleFromName(fileName),
        'link': path.join(currentBaseLink, titleFromName(fileName))
      });
    }
    if(item.isDirectory()){
      const list = generateSidebar(fullPath, fileName, path.join(currentBaseLink, fileName));
      items.push({
        'text': fileName === 'index.md'?'首页':titleFromName(fileName),
        'items': list,
      });
    }
  }
  return items;
}
