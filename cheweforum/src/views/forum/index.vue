<template>
  <div
    class="typography-blog-container bg-typography-bg text-typography-fg font-sans"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- 顶部导航栏 -->
    <nav class="top-navbar" :class="{ show: showTopNav }">
      <div class="top-navbar-content">
        <ul class="top-nav-list">
          <li>
            <a
              :class="{ current: currentRoute === 'home' }"
              href="#"
              @click.prevent="navigateTo('home')"
            >
              首页
            </a>
          </li>
          <li>
            <a
              :class="{ current: currentRoute === 'archive' }"
              href="#"
              @click.prevent="navigateTo('archive')"
            >
              财务
            </a>
          </li>
          <li>
            <a
              :class="{ current: currentRoute === 'categories' }"
              href="#"
              @click.prevent="navigateTo('categories')"
            >
              分类
            </a>
          </li>
          <li>
            <a
              :class="{ current: currentRoute === 'tags' }"
              href="#"
              @click.prevent="navigateTo('tags')"
            >
              标签
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 侧边栏 -->
    <aside class="side-container">
      <div class="vertical-text site-title font-dream-serif-w20 text-3xl">
        <div class="">
          {{ titleSecondary }}
        </div>
        <div class="">
          {{ titlePrimary }}
        </div>
      </div>

      <!-- 导航链接 -->
      <nav class="site-title-links">
        <ul class="list-none p-0">
          <li class="block my-1">
            <a
              :class="{ current: currentRoute === 'home' }"
              href="#"
              @click.prevent="navigateTo('home')"
            >
              首页
            </a>
          </li>
          <li class="block my-1">
            <a
              :class="{ current: currentRoute === 'archive' }"
              href="#"
              @click.prevent="navigateTo('archive')"
            >
              归档
            </a>
          </li>
          <li class="block my-1">
            <a
              :class="{ current: currentRoute === 'categories' }"
              href="#"
              @click.prevent="navigateTo('categories')"
            >
              分类
            </a>
          </li>
          <li class="block my-1">
            <a
              :class="{ current: currentRoute === 'tags' }"
              href="#"
              @click.prevent="navigateTo('tags')"
            >
              标签
            </a>
          </li>
          <!-- 社交链接 -->
          <li class="soc my-1" v-if="socialLinks.github">
            <a
              :href="`https://github.com/${socialLinks.github}`"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Github"
              class="inline-flex items-center gap-1"
            >
              <ShareIcon class="w-5 h-5" />
            </a>
          </li>
          <li class="soc my-1" v-if="socialLinks.twitter">
            <a
              :href="`https://twitter.com/${socialLinks.twitter}`"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              class="inline-flex items-center gap-1"
            >
              <ArrowTopRightOnSquareIcon class="w-5 h-5" />
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <main class="main-container font-sans">
      <div class="font-dream-sans-w20 mt-4 mb-6">
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
              <ChatBubbleLeftRightIcon class="w-4 h-4 align-middle inline" />
              <span> {{ post.comments }} 条评论</span>
            </span>
            <span
              class="meta-item"
              v-if="post.categories && post.categories.length > 0"
            >
              <FolderIcon class="w-4 h-4 align-middle inline" />
              <span
                v-for="(category, index) in post.categories"
                :key="category"
              >
                <a class="a-tag" href="#">{{ category }}</a>
                <span v-if="index < post.categories.length - 1">, </span>
              </span>
            </span>
            <span class="meta-item" v-if="post.tags && post.tags.length > 0">
              <TagIcon class="w-4 h-4 align-middle inline" />
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

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ShareIcon,
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftRightIcon,
  FolderIcon,
  TagIcon,
} from "@heroicons/vue/24/outline";
// 配置数据
const titlePrimary = ref("活版印字");
const titleSecondary = ref("Typography");
const route = useRoute();
const router = useRouter();
const currentRoute = computed(() => {
  // 根据当前路由路径判断当前路由名称
  if (route.path === '/') return 'home';
  if (route.path === '/plans') return 'archive';
  if (route.path === '/categories') return 'categories';
  if (route.path === '/tags') return 'tags';
  return 'home';
});
const currentPage = ref(1);
const postsPerPage = ref(10); // 保留用于后续扩展
const showPageCount = ref(false); // 隐藏分页计数，因为只显示一页

// 顶部导航栏显示控制
const showTopNav = ref(false);
const hideTimer = ref(null);
const TOP_THRESHOLD = 80; // 距离顶部多少像素时显示导航栏

// 社交链接
const socialLinks = ref({
  github: "your-github-username",
  twitter: "your-twitter-username",
});

// 示例文章数据
const allPosts = ref([
  {
    id: 1,
    title: "欢迎来到 CheweHub 博客",
    date: new Date("2025-01-15"),
    abstract:
      "这是第一篇博客文章，介绍了 CheweHub 博客系统的特色和功能。我们将分享技术见解、开发经验以及生活中的点滴。",
    comments: 5,
    categories: ["公告", "介绍"],
    tags: ["博客", "欢迎"],
  },
  {
    id: 2,
    title: "Typography 设计规范的实践",
    date: new Date("2025-01-10"),
    abstract:
      "深入探讨 Typography 主题的设计理念和实现细节，包括色彩系统、字体选择、布局设计等方面的最佳实践。",
    comments: 3,
    categories: ["设计", "前端"],
    tags: ["Typography", "设计规范", "CSS"],
  },
  {
    id: 3,
    title: "Vue 3 组合式 API 的最佳实践",
    date: new Date("2025-01-05"),
    abstract:
      "分享在使用 Vue 3 Composition API 过程中的经验和技巧，包括响应式数据管理、组合式函数的复用等。",
    comments: 8,
    categories: ["前端", "Vue"],
    tags: ["Vue3", "Composition API", "前端开发"],
  },
  {
    id: 4,
    title: "Spring Boot 微服务架构探索",
    date: new Date("2025-01-01"),
    abstract:
      "探讨 Spring Boot 在微服务架构中的应用，包括服务拆分、配置管理、服务间通信等方面的实践经验。",
    comments: 12,
    categories: ["后端", "Java"],
    tags: ["Spring Boot", "微服务", "Java"],
  },
]);

// 计算属性 - 显示所有文章
const posts = computed(() => {
  return allPosts.value;
});

const totalPages = computed(() => {
  return 1;
});

// 方法
const navigateTo = (routeName) => {
  // 路由名称到路径的映射
  const routeMap = {
    'home': '/',
    'archive': '/plans',
    'categories': '/categories',
    'tags': '/tags'
  };
  
  const path = routeMap[routeName];
  if (path) {
    router.push(path);
  }
};

const viewPost = (post) => {
  // 查看文章详情
  console.log("查看文章:", post.title);
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // 不需要滚动，因为页面固定高度无滚动
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// 处理鼠标移动事件
const handleMouseMove = (event) => {
  const y = event.clientY;

  // 如果鼠标在顶部区域，显示导航栏
  if (y <= TOP_THRESHOLD) {
    showTopNav.value = true;
    // 清除隐藏定时器
    if (hideTimer.value) {
      clearTimeout(hideTimer.value);
      hideTimer.value = null;
    }
  } else {
    // 鼠标离开顶部区域，延迟隐藏
    if (!hideTimer.value) {
      hideTimer.value = setTimeout(() => {
        showTopNav.value = false;
        hideTimer.value = null;
      }, 300); // 300ms 延迟，避免快速移动时闪烁
    }
  }
};

// 处理鼠标离开容器事件
const handleMouseLeave = () => {
  showTopNav.value = false;
  if (hideTimer.value) {
    clearTimeout(hideTimer.value);
    hideTimer.value = null;
  }
};

// 生命周期
onMounted(() => {
  // 禁用页面滚动
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  // 添加淡入动画
  const postElements = document.querySelectorAll(".post-container");
  postElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("fade-in");
    }, index * 100);
  });
});

// 组件卸载时恢复滚动
onUnmounted(() => {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  // 清理定时器
  if (hideTimer.value) {
    clearTimeout(hideTimer.value);
    hideTimer.value = null;
  }
});
</script>

<style lang="scss" scoped>
// Typography 风格变量（使用统一配置的颜色）
$backgroundColor: #ffffff;
$foregroundColor: #2e405b;
$foregroundColorDark: #1a2d42;
$foregroundColorLight: #3d5670;

// 顶部导航栏样式
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: $backgroundColor;
  border-bottom: 2px solid $foregroundColor;
  z-index: 1000;
  opacity: 0;
  transform: translateY(-100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;

  &.show {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .top-navbar-content {
    max-width: 1920px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 40px;
  }

  .top-nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 40px;
    align-items: center;

    li {
      margin: 0;
    }

    a {
      color: $foregroundColor;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
      padding: 8px 16px;
      border-bottom: 2px solid transparent;
      transition: color 0.3s ease, border-color 0.3s ease;

      &:hover {
        color: $foregroundColorDark;
        border-bottom-color: $foregroundColor;
      }

      &.current {
        color: $foregroundColorDark;
        border-bottom-color: $foregroundColor;
      }
    }
  }

  @media (max-width: 768px) {
    height: 50px;

    .top-navbar-content {
      padding: 0 20px;
    }

    .top-nav-list {
      gap: 20px;

      a {
        font-size: 14px;
        padding: 6px 12px;
      }
    }
  }
}

.typography-blog-container {
  width: 100vw;
  min-width: 320px;
  height: 100vh;
  background-color: $backgroundColor;
  color: $foregroundColor;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  overflow-y: hidden;
  overflow-x: visible;
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
  min-width: 200px;
  max-width: 350px;
  height: 100vh;
  position: fixed;
  right: 0;
  padding: 80px 20px;
  text-align: left;
  flex-shrink: 0;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: visible;

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    height: auto;
    padding: 80px 30px 0 30px;
    overflow: visible;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 30%;
    min-width: 180px;
    max-width: 280px;
  }

  // 极小屏幕
  @media (max-width: 480px) {
    padding: 60px 15px 0 15px;
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
  @apply font-bold not-italic w-auto h-auto text-left text-[0.5em] pb-[50px];
  margin: 0 0 0 -2px;
  border-left: solid $foregroundColor 2px;
  transition: padding 0.8s ease, background 0.8s ease, color 0.8s ease;

  &:hover {
    @apply py-[15px] pb-[35px];
    color: $backgroundColor !important;
    background: $foregroundColor !important;
    border-left: solid $foregroundColor 2px;

    * {
      color: $backgroundColor !important;
    }
  }

  * {
    @apply text-left font-bold mt-0 mr-0;
    margin-left: 10px;
    transition: color 0.8s ease;
    // 字体通过 Tailwind 类 font-serif 应用，无需在此定义
  }

  @media (max-width: 768px) {
    @apply m-0 p-0 text-center;
    border-left: none;

    * {
      @apply text-center;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }

    &:hover {
      color: $backgroundColor !important;
      background: $foregroundColor !important;
      @apply p-0 border-none;
    }
  }
}

.site-title-large {
  @apply text-[50px] pt-0;

  @media (max-width: 768px) {
    @apply text-[38px];
  }

  @media only screen and (max-height: 860px) {
    @apply text-[32px];
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    @apply text-[42px];
  }
}

.site-title-small {
  @apply text-[30px] pt-[1px];

  @media (max-width: 768px) {
    @apply text-[22px];
  }

  @media only screen and (max-height: 860px) {
    @apply text-[20px];
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    @apply text-[26px];
  }
}

.a-title {
  @apply no-underline bg-transparent;
  border-bottom: solid transparent 2px;

  // 禁用链接自身的 hover 效果，由父容器统一控制
  &:hover,
  &:focus {
    @apply bg-transparent;
    // 不改变颜色，由父容器的 hover 控制
    color: inherit;
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

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: block;
  }

  li {
    display: block;
    margin: 4px 0;
  }

  @media (max-width: 768px) {
    position: static;
    padding: 10px 0;
    margin: 10px 0;
    text-align: center;

    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }

    li {
      display: inline-block;
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
  min-width: 300px;
  height: 100vh;
  text-align: left;
  margin: 0;
  padding: 80px 40px;
  padding-right: calc(
    25% + 40px
  ); // 为固定定位的侧边栏预留空间（25% + 原有padding）
  overflow-y: auto;
  overflow-x: visible;
  float: left;
  box-sizing: border-box;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    height: auto;
    min-height: calc(100vh - 200px);
    padding: 20px 30px; // 移动端恢复正常的padding
    overflow-y: visible;
    overflow-x: visible;
    float: none;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 70%;
    min-width: 400px;
    padding: 60px 30px;
    padding-right: calc(30% + 30px); // 中等屏幕时侧边栏宽度为30%
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
    min-width: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
}

// 链接样式
a {
  @apply p-0 cursor-pointer no-underline;
  color: $foregroundColor;
  transition: color 0.3s ease, background-color 0.3s ease;
  border-bottom: solid $foregroundColor 2px;

  &:hover,
  &:focus {
    @apply no-underline;
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
  @apply mb-5 font-normal opacity-0 w-full max-w-full box-border;

  &.fade-in {
    animation: fadein 1s ease-out forwards;
  }
}

.post-title {
  @apply text-2xl font-bold my-[3px];
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    @apply text-xl;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    @apply text-[22px];
  }
}

.post-meta {
  @apply text-base my-2.5;
  word-wrap: break-word;

  @media (max-width: 768px) {
    @apply text-sm;
  }

  .meta-item {
    @apply mr-2.5 inline-block whitespace-nowrap;
  }
}

.post-abstract {
  @apply text-lg leading-[1.5em];
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    @apply text-base;
  }
}

// 页脚
footer {
  @apply mt-2.5 pt-0 text-xs font-bold;

  * {
    @apply m-0;
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
