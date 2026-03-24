<template>
  <div class="typography-blog-container bg-typography-bg text-typography-fg font-sans">
    <!-- 侧边栏 -->
    <aside class="side-container">
      <div class="vertical-text site-title font-serif">
        <h3 class="site-title-small">
          <a class="a-title" href="#">{{ titleSecondary }}</a>
        </h3>
        <h1 class="site-title-large">
          <a class="a-title" href="#">{{ titlePrimary }}</a>
        </h1>
      </div>

      <!-- 导航链接 -->
      <nav class="site-title-links">
        <ul class="list-none p-0">
          <li class="block my-1">
            <a :class="{ current: currentRoute === 'home' }" href="#" @click.prevent="navigateTo('home')">
              首页
            </a>
          </li>
          <li class="block my-1">
            <a :class="{ current: currentRoute === 'archive' }" href="#" @click.prevent="navigateTo('archive')">
              归档
            </a>
          </li>
          <li class="block my-1">
            <a :class="{ current: currentRoute === 'categories' }" href="#" @click.prevent="navigateTo('categories')">
              分类
            </a>
          </li>
          <li class="block my-1">
            <a :class="{ current: currentRoute === 'tags' }" href="#" @click.prevent="navigateTo('tags')">
              标签
            </a>
          </li>
          <!-- 社交链接 -->
          <li class="soc my-1" v-if="socialLinks.github">
            <a :href="`https://github.com/${socialLinks.github}`" target="_blank" rel="noopener noreferrer"
               aria-label="Github" class="inline-flex items-center gap-1">
              <el-icon>
                <Share/>
              </el-icon>
            </a>
          </li>
          <li class="soc my-1" v-if="socialLinks.twitter">
            <a :href="`https://twitter.com/${socialLinks.twitter}`" target="_blank" rel="noopener noreferrer"
               aria-label="Twitter" class="inline-flex items-center gap-1">
              <el-icon>
                <Promotion/>
              </el-icon>
            </a>
          </li>
        </ul>
      </nav>

      <!-- 页脚 -->
      <footer class="site-nav-footer">
        <p class="m-0">© 2025 CheweHub</p>
      </footer>
    </aside>

    <!-- 主内容区 -->
    <main class="main-container font-sans">
      <div class="dream-han-sans-w20-text mt-4 mb-6">
        <p>我的</p>
      </div>
      <div class="content">
        <!-- 文章列表 -->
        <article
            v-for="post in posts"
            :key="post.id"
            class="post-container fade-in"
        >
          <h2 class="post-title">
            <a href="#" @click.prevent="viewPost(post)">{{ post.title }}</a>
          </h2>

          <div class="post-meta">
            <span class="meta-item date">{{ formatDate(post.date) }}</span>
            <span class="meta-item" v-if="post.comments > 0">
              <el-icon class="align-middle"><ChatDotRound/></el-icon>
              <span> {{ post.comments }} 条评论</span>
            </span>
            <span class="meta-item" v-if="post.categories && post.categories.length > 0">
              <el-icon class="align-middle"><Folder/></el-icon>
              <span v-for="(category, index) in post.categories" :key="category">
                <a class="a-tag" href="#">{{ category }}</a>
                <span v-if="index < post.categories.length - 1">, </span>
              </span>
            </span>
            <span class="meta-item" v-if="post.tags && post.tags.length > 0">
              <el-icon class="align-middle"><PriceTag/></el-icon>
              <span v-for="(tag, index) in post.tags" :key="tag">
                <a class="a-tag" href="#">{{ tag }}</a>
                <span v-if="index < post.tags.length - 1">, </span>
              </span>
            </span>
          </div>

          <p class="post-abstract">{{ post.abstract }}</p>
        </article>
      </div>

      <!-- 移动端页脚 -->
      <footer class="site-bottom-footer visible-xs">
        <p class="m-0">© 2025 CheweHub</p>
      </footer>
    </main>
  </div>
</template>

<script setup name="Forum">
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {Share, Promotion, ChatDotRound, Folder, PriceTag, ArrowLeft, ArrowRight} from '@element-plus/icons-vue'
// 配置数据
const titlePrimary = ref('活版印字')
const titleSecondary = ref('Typography')
const currentRoute = ref('home')
const currentPage = ref(1)
const postsPerPage = ref(10) // 保留用于后续扩展
const showPageCount = ref(false) // 隐藏分页计数，因为只显示一页

// 社交链接
const socialLinks = ref({
  github: 'your-github-username',
  twitter: 'your-twitter-username'
})

// 示例文章数据
const allPosts = ref([
  {
    id: 1,
    title: '欢迎来到 CheweHub 博客',
    date: new Date('2025-01-15'),
    abstract: '这是第一篇博客文章，介绍了 CheweHub 博客系统的特色和功能。我们将分享技术见解、开发经验以及生活中的点滴。',
    comments: 5,
    categories: ['公告', '介绍'],
    tags: ['博客', '欢迎']
  },
  {
    id: 2,
    title: 'Typography 设计规范的实践',
    date: new Date('2025-01-10'),
    abstract: '深入探讨 Typography 主题的设计理念和实现细节，包括色彩系统、字体选择、布局设计等方面的最佳实践。',
    comments: 3,
    categories: ['设计', '前端'],
    tags: ['Typography', '设计规范', 'CSS']
  },
  {
    id: 3,
    title: 'Vue 3 组合式 API 的最佳实践',
    date: new Date('2025-01-05'),
    abstract: '分享在使用 Vue 3 Composition API 过程中的经验和技巧，包括响应式数据管理、组合式函数的复用等。',
    comments: 8,
    categories: ['前端', 'Vue'],
    tags: ['Vue3', 'Composition API', '前端开发']
  },
  {
    id: 4,
    title: 'Spring Boot 微服务架构探索',
    date: new Date('2025-01-01'),
    abstract: '探讨 Spring Boot 在微服务架构中的应用，包括服务拆分、配置管理、服务间通信等方面的实践经验。',
    comments: 12,
    categories: ['后端', 'Java'],
    tags: ['Spring Boot', '微服务', 'Java']
  }
])

// 计算属性 - 显示所有文章
const posts = computed(() => {
  return allPosts.value
})

const totalPages = computed(() => {
  return 1
})

// 方法
const navigateTo = (route) => {
  currentRoute.value = route
  // 这里可以添加路由跳转逻辑
}

const viewPost = (post) => {
  // 查看文章详情
  console.log('查看文章:', post.title)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 不需要滚动，因为页面固定高度无滚动
  }
}

const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 生命周期
onMounted(() => {
  // 禁用页面滚动
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'

  // 添加淡入动画
  const postElements = document.querySelectorAll('.post-container')
  postElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('fade-in')
    }, index * 100)
  })
})

// 组件卸载时恢复滚动
onUnmounted(() => {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})
</script>

<style lang="scss" scoped>
// 引入统一的颜色配置
@import '@/assets/styles/typography-colors.scss';

// Typography 风格变量（使用统一配置的颜色）
$backgroundColor: $typography-bg;
$foregroundColor: $typography-fg;
$foregroundColorDark: $typography-fg-dark;
$foregroundColorLight: $typography-fg-light;

// 使用 Tailwind 配置的统一字体（通过 Tailwind 类应用，如 font-sans、font-serif）

.typography-blog-container {
  width: 100vw;
  min-width: 320px; // 最小宽度，确保小屏幕也能显示
  height: 100vh;
  background-color: $backgroundColor;
  color: $foregroundColor;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  overflow-y: hidden; // 禁用纵向滚动
  overflow-x: visible; // 允许横向内容全部显示
  position: fixed;
  top: 0;
  left: 0;

  // 背景纹理
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACFJREFUeNpiZGBg4GegAsBlCD8TqSYNQg2Mo6FEBAAIMACdPABtrSW/IQAAAABJRU5ErkJggg==");
  background-repeat: repeat;
  background-attachment: fixed;

  // 响应式：确保小屏幕也能完整显示
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    position: relative;
    overflow-y: auto;
    overflow-x: visible;
  }

  // 中等屏幕优化
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 100%;
  }

  // 超大屏幕优化
  @media (min-width: 1920px) {
    max-width: 1920px;
    margin: 0 auto;
  }
}

// 侧边栏样式
.side-container {
  width: 25%;
  min-width: 200px; // 最小宽度确保内容不挤压
  max-width: 350px; // 最大宽度，防止过宽
  height: 100vh;
  position: fixed;
  right: 0;
  padding: 80px 20px;
  text-align: left;
  flex-shrink: 0; // 防止收缩
  box-sizing: border-box;
  overflow-y: auto; // 如果内容超出，允许滚动
  overflow-x: visible;

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    height: auto;
    padding: 40px 30px 0 30px;
    overflow: visible;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 30%;
    min-width: 180px;
    max-width: 280px;
  }

  // 极小屏幕
  @media (max-width: 480px) {
    padding: 20px 15px 0 15px;
  }
}

// 垂直文本
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: upright;

  * {
    line-height: 1;
    text-align: left;
  }

  @media (max-width: 768px) {
    writing-mode: horizontal-tb;
  }
}

// 站点标题
.site-title {
  font-weight: bolder;
  font-style: normal;
  width: auto;
  height: auto;
  margin: 0 0 0 -2px;
  text-align: left;
  font-size: 0.5em;
  padding: 0 0 50px 0;
  border-left: solid $foregroundColor 2px;
  transition: padding 0.8s ease, background 0.8s ease;

  &:hover {
    padding: 15px 0 35px 0;
    color: $backgroundColor !important;
    background: $foregroundColor !important;
    border-left: solid $foregroundColor 2px;

    * {
      color: $backgroundColor !important;
    }
  }

  * {
    text-align: left;
    font-weight: bolder;
    margin-top: 0;
    margin-left: 10px;
    margin-right: 0;
    // 字体通过 Tailwind 类 font-serif 应用，无需在此定义
  }

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
    border-left: none;
    text-align: center;

    * {
      text-align: center;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }

    &:hover {
      color: $foregroundColor !important;
      background: transparent !important;
      padding: 0;
      border: none;
    }
  }
}

.site-title-large {
  font-size: 50px;
  padding-top: 0;

  @media (max-width: 768px) {
    font-size: 38px;
  }

  @media only screen and (max-height: 860px) {
    font-size: 32px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 42px;
  }
}

.site-title-small {
  font-size: 30px;
  padding-top: 1px;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media only screen and (max-height: 860px) {
    font-size: 20px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 26px;
  }
}

.a-title {
  text-decoration: none;
  background-color: transparent;
  border-bottom: solid transparent 2px;

  &:hover,
  &:focus {
    background-color: transparent;
  }
}

// 导航链接
.site-title-links {
  font-weight: bold;
  font-style: normal;
  margin: 0;
  padding: 60px 0;
  text-align: left;
  position: fixed;
  bottom: 20px;

  @media (max-width: 768px) {
    position: unset;
    padding: 10px 0;
    margin: 10px 0;
    text-align: center;

    ul li {
      display: inline;
      margin: 0 3px;
      font-size: 16px;
    }
  }

  @media only screen and (max-height: 860px) {
    ul li {
      font-size: 14px;
      line-height: 1.3;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 40px 0;
  }
}

// 主内容区 - 使用 Tailwind 类配合自定义样式
.main-container {
  width: 75%;
  min-width: 300px; // 最小宽度，确保内容可读
  height: 100vh;
  text-align: left;
  margin: 0;
  padding: 80px 40px;
  overflow-y: auto;
  overflow-x: visible; // 允许横向内容全部显示
  float: left;
  box-sizing: border-box;
  flex: 1; // 占据剩余空间

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    height: auto;
    min-height: calc(100vh - 200px);
    padding: 20px 30px;
    overflow-y: visible;
    overflow-x: visible;
    float: none;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 70%;
    min-width: 400px;
    padding: 60px 30px;
  }

  @media only screen and (max-height: 860px) {
    padding-top: 40px;
    padding-bottom: 60px;
  }

  // 极小屏幕
  @media (max-width: 480px) {
    padding: 15px 15px;
  }

  .content {
    height: auto;
    overflow: visible;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    min-width: 0; // 允许收缩
    word-wrap: break-word; // 确保文字不溢出
    overflow-wrap: break-word;
  }
}

// 链接样式
a {
  color: $foregroundColor;
  transition: color 0.3s ease, background-color 0.3s ease;
  border-bottom: solid $foregroundColor 2px;
  padding: 0;
  cursor: pointer;
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: none;
  }

  &:hover {
    color: $backgroundColor !important;
    background-color: $foregroundColor;
    border-bottom: solid transparent 2px;
  }

  &:focus {
    color: $foregroundColorDark;
  }
}

.current {
  border-bottom: solid $foregroundColor 3px !important;
}

.a-tag {
  background-color: transparent;
  color: $foregroundColor !important;
  border-bottom: none;

  &:hover {
    background-color: transparent;
    color: $foregroundColor !important;
    border-bottom: none;
  }
}

// 社交图标
.soc {
  margin: 0 5px 0 0;
  font-size: 18px !important;

  a {
    border-bottom: solid transparent 2px;
    display: inline-flex;
    align-items: center;
    gap: 5px;

    :deep(.el-icon) {
      font-size: 18px;
    }

    &:hover {
      color: $foregroundColorLight !important;
      background-color: transparent !important;
      text-decoration: none;
      border-bottom: solid transparent 2px;
    }
  }

  @media (max-width: 768px) {
    display: block !important;
  }
}

// 文章容器
.post-container {
  margin: 0 0 20px 0;
  font-weight: normal;
  opacity: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  &.fade-in {
    animation: fadein 1s ease-out forwards;
  }
}

.post-title {
  font-size: 24px;
  font-weight: bold;
  margin: 3px 0;
  word-wrap: break-word; // 防止文字溢出
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 22px;
  }
}

.post-meta {
  font-size: 16px;
  margin: 10px 0;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  .meta-item {
    margin: 0 10px 0 0;
    display: inline-block;
    white-space: nowrap;
  }
}

.post-abstract {
  font-size: 18px;
  line-height: 1.5em;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 16px;
  }
}

// 页脚
footer {
  margin-top: 10px;
  padding-top: 0;
  font-size: 12px;
  font-weight: bold;

  * {
    margin: 0;
  }
}

.site-nav-footer {
  @media (max-width: 768px) {
    display: none !important;
  }
}

.site-bottom-footer {
  display: none !important;

  @media (max-width: 768px) {
    display: block !important;
    padding-top: 30px;
    padding-bottom: 35px;
  }
}

// 动画
@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式工具类
@media (max-width: 768px) {
  .visible-xs {
    display: block !important;
  }
}

@media (min-width: 769px) {
  .visible-xs {
    display: none !important;
  }
}
</style>
