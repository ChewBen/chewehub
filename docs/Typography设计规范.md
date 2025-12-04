# Typography 风格前端设计规范

## 📋 目录

1. [设计理念](#设计理念)
2. [Tailwind CSS 使用规范](#tailwind-css-使用规范)
3. [色彩系统](#色彩系统)
4. [字体系统](#字体系统)
5. [布局系统](#布局系统)
6. [交互设计](#交互设计)
7. [动画效果](#动画效果)
8. [组件规范](#组件规范)
9. [响应式设计](#响应式设计)
10. [代码实现示例](#代码实现示例)

---

## 设计理念

**Typography（活版印字）** 主题专注于：

- **排版至上**：强调文字的可读性和美感
- **极简主义**：去除多余装饰，专注内容
- **优雅简洁**：通过精心的排版和间距营造优雅感
- **阅读体验**：大字号、宽松行距，提升阅读舒适度

---

## Tailwind CSS 使用规范

### 优先级原则

**核心原则：能使用 Tailwind CSS 的尽量使用，减少自定义 CSS**

1. **优先使用 Tailwind 工具类**：对于常见的布局、间距、颜色、字体等样式，优先使用 Tailwind 的工具类
2. **自定义样式仅用于特殊效果**：只有在 Tailwind 无法实现或过于复杂的情况下，才使用自定义 SCSS/CSS
3. **混合使用策略**：可以同时使用 Tailwind 类和自定义样式，但要保持一致性

### Tailwind 使用场景

#### ✅ 推荐使用 Tailwind 的场景

**布局类：**
```vue
<!-- 使用 Tailwind -->
<div class="flex items-center justify-between">
<div class="grid grid-cols-3 gap-4">
<div class="flex flex-col md:flex-row">
```

**间距类：**
```vue
<!-- 使用 Tailwind -->
<div class="p-4 m-2 mt-8 mb-4">
<div class="gap-4 space-x-2">
```

**文字样式：**
```vue
<!-- 使用 Tailwind -->
<h1 class="text-2xl font-bold text-center">
<p class="text-gray-600 text-sm">
```

**响应式：**
```vue
<!-- 使用 Tailwind -->
<div class="w-full md:w-1/2 lg:w-1/3">
<div class="hidden md:block">
```

**列表样式：**
```vue
<!-- 使用 Tailwind -->
<ul class="list-none p-0">
<li class="block my-1">
```

**工具类：**
```vue
<!-- 使用 Tailwind -->
<div class="inline-flex items-center gap-1">
<div class="m-0 p-0">
<div class="align-middle">
```

#### ❌ 不推荐使用 Tailwind 的场景

**复杂的自定义动画：**
```scss
// 使用自定义 CSS
@keyframes fadein {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**特殊的排版效果（如垂直文字）：**
```scss
// 使用自定义 CSS
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
```

**复杂的悬停效果：**
```scss
// 使用自定义 CSS
.site-title:hover {
  padding: 15px 0 35px 0;
  color: $backgroundColor !important;
  background: $foregroundColor !important;
}
```

**主题变量和品牌色：**
```scss
// 使用 SCSS 变量
$foregroundColor: #2e405b;
$backgroundColor: #ffffff;
```

### 实际应用示例

#### 示例 1：文章列表项

```vue
<template>
  <article class="mb-5 opacity-0 fade-in">
    <h2 class="text-2xl font-bold my-1">
      <a href="#">{{ post.title }}</a>
    </h2>
    <div class="text-base my-2">
      <span class="inline-block mr-2">{{ formatDate(post.date) }}</span>
      <span v-if="post.comments > 0" class="inline-block mr-2">
        <el-icon class="align-middle"><ChatDotRound/></el-icon>
        <span>{{ post.comments }} 条评论</span>
      </span>
    </div>
    <p class="text-lg leading-relaxed">{{ post.abstract }}</p>
  </article>
</template>
```

#### 示例 2：导航菜单

```vue
<template>
  <nav>
    <ul class="list-none p-0">
      <li class="block my-1">
        <a :class="{ current: currentRoute === 'home' }" href="#">首页</a>
      </li>
      <li class="block my-1">
        <a href="#">归档</a>
      </li>
    </ul>
  </nav>
</template>
```

#### 示例 3：响应式布局

```vue
<template>
  <div class="flex flex-col md:flex-row h-screen">
    <aside class="w-full md:w-1/4 fixed md:relative">
      <!-- 侧边栏内容 -->
    </aside>
    <main class="w-full md:w-3/4 overflow-y-auto">
      <!-- 主内容 -->
    </main>
  </div>
</template>
```

### 最佳实践

1. **保持一致性**：同类元素使用相同的 Tailwind 类组合
2. **避免过度嵌套**：Tailwind 类应该简洁明了
3. **合理使用响应式前缀**：`sm:`, `md:`, `lg:`, `xl:` 等
4. **组合使用**：可以将 Tailwind 类与自定义类组合使用

```vue
<!-- 组合使用示例 -->
<div class="post-container flex flex-col mb-5">
  <!-- Tailwind 类 + 自定义类 -->
</div>
```

### 代码审查清单

- [ ] 是否优先使用了 Tailwind 工具类？
- [ ] 自定义样式是否有必要（Tailwind 无法实现）？
- [ ] 响应式是否使用了 Tailwind 断点？
- [ ] 间距是否使用了 Tailwind 的 spacing 系统？
- [ ] 颜色是否使用了 Tailwind 的 color 系统（如果是标准色）？

---

## 色彩系统

### 配色方案

Typography 采用双色配色系统，支持明暗两种主题：

#### 浅色主题（Light）

```scss
// 浅色主题配色
$backgroundColor: #ffffff;    // 背景色：纯白色
$foregroundColor: #2e405b;   // 前景色：深蓝灰色
```

#### 深色主题（Dark）

```scss
// 深色主题配色
$backgroundColor: #2e405b;   // 背景色：深蓝灰色
$foregroundColor: #ffffff;   // 前景色：纯白色
```

### 颜色使用规则

1. **背景与前景对比**：始终保持高对比度以确保可读性
2. **单一配色**：除链接外，仅使用两种主要颜色
3. **背景纹理**：使用极淡的点状纹理增加层次感

```scss
// 背景纹理（根据明暗主题自动切换）
body {
  background: url("data:image/png;base64,..."); // 点状纹理
  background-repeat: repeat;
  background-attachment: fixed;
}
```

---

## 字体系统

### 字体家族

#### 正文字体（Sans-serif）

```scss
$fontList: "Source Sans Pro", 
           "Roboto", 
           "Helvetica", 
           "Helvetica Neue",
           "Source Han Sans SC",      // 中文简体
           "Source Han Sans TC",      // 中文繁体
           "PingFang SC",             // 苹果简体
           "PingFang HK",             // 苹果繁体
           "PingFang TC",             // 苹果繁体
           sans-serif;
```

**特点**：
- 无衬线字体，现代感强
- 多语言支持（中英日韩）
- 优先使用系统字体提升性能

#### 标题字体（Serif）

```scss
$titleFontList: "HiraMinProN-W6",
                "Source Han Serif CN",    // 思源宋体简体
                "Source Han Serif SC",
                "Source Han Serif TC",    // 思源宋体繁体
                serif;
```

**特点**：
- 衬线字体，优雅古典
- 仅用于标题和特殊强调
- 营造传统印刷感

#### 代码字体（Monospace）

```scss
$codeFont: Monaco, 
           Menlo, 
           "Source Code Pro", 
           "Cascadia Code", 
           Consolas, 
           monospace;
```

### 字号层级

```scss
// 标题字号（从大到小）
h1 { font-size: 42px; }   // 主标题
h2 { font-size: 36px; }   // 二级标题
h3 { font-size: 30px; }   // 三级标题
h4 { font-size: 24px; }   // 四级标题
h5 { font-size: 18px; }   // 五级标题
h6 { font-size: 14px; }   // 六级标题

// 正文字号
body { 
  font-size: 18px;        // 大字号正文
  line-height: 1.5em;     // 宽松行高
}

// 辅助文字
.post-meta { font-size: 16px; }
footer { font-size: 12px; }
```

### 字重规则

- **标题**：`font-weight: bolder`（粗体）
- **正文**：`font-weight: normal`（正常）
- **链接**：`font-weight: bold`（加粗）

### 字体渲染

```scss
body {
  -webkit-font-smoothing: antialiased;  // WebKit 字体平滑
  -moz-osx-font-smoothing: grayscale;   // Firefox 字体平滑
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.04); // 极淡文字阴影
}
```

---

## 布局系统

### 整体布局

Typography 采用 **左右分栏布局**：

```
┌─────────────────────────────────────────┐
│  Sidebar (固定)  │  Main Content (流动)  │
│  宽度: 25%       │  宽度: 75%            │
│  固定定位        │  左浮动               │
│  垂直标题        │  文章内容             │
└─────────────────────────────────────────┘
```

### 侧边栏（Sidebar）

```scss
.side-container {
  height: 100vh;           // 全屏高度
  position: fixed;         // 固定定位
  right: 0;                // 右侧对齐
  padding: 80px 20px;      // 内边距
  width: 25%;              // 宽度占比
}
```

**内容**：
- 垂直标题（主标题 + 副标题）
- 导航链接
- 社交图标
- 页脚信息

### 主内容区（Main Content）

```scss
.main-container {
  text-align: left;
  margin: 0;
  padding: 80px 40px;      // 宽松的内边距
  overflow: hidden;
  float: left;
  width: 75%;              // 宽度占比
}
```

### 垂直文本

侧边栏标题采用垂直排版：

```scss
.vertical-text {
  writing-mode: vertical-rl;  // 从右到左垂直排版
  text-orientation: upright;
  
  * {
    line-height: 1;        // 垂直排版时行高为1
    text-align: left;      // 文本左对齐
  }
}
```

---

## 交互设计

### 链接样式

#### 默认状态

```scss
a {
  color: $foregroundColor;
  border-bottom: solid $foregroundColor 2px;  // 底部边框线
  padding: 0;
  transition: color 0.3s ease, 
              background-color 0.3s ease;
}
```

**特点**：
- 无下划线，使用底部边框代替
- 边框粗细：`2px`
- 颜色与前景色一致

#### 悬停状态

```scss
a:hover {
  color: $backgroundColor !important;        // 文字颜色反转
  background-color: $foregroundColor;       // 背景色反转
  border-bottom: solid transparent 2px;     // 边框透明
}
```

**设计理念**：
- 颜色完全反转（前景↔背景）
- 平滑过渡动画（0.3s）
- 突出可点击性

#### 当前页链接

```scss
.current {
  border-bottom: solid $foregroundColor 3px !important;  // 更粗的边框
}
```

### 标题悬停效果

```scss
.site-title {
  border-left: solid $foregroundColor 2px;  // 左侧装饰边框
  padding: 0 0 50px 0;
  transition: padding 0.8s ease, 
              background 0.8s ease;
  
  &:hover {
    padding: 15px 0 35px 0;                  // 内边距变化
    color: $backgroundColor !important;      // 颜色反转
    background: $foregroundColor !important; // 背景反转
  }
}
```

### 按钮设计

- 无边框按钮
- 使用链接样式代替
- 悬停时背景填充

---

## 动画效果

### 淡入动画

```scss
// 淡入
@keyframes fadein {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fadeIn {
  animation: fadein 1s ease-out;
}

// 从右侧淡入
@keyframes fadein-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
}

.fadeInRight {
  animation: fadein-right 1s ease-out;
}

// 从上方淡入
@keyframes fadein-top {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}

.fadeInTop {
  animation: fadein-top 1s ease-out;
}
```

### 动画使用规则

1. **初始状态**：元素设置 `opacity: 0` 和 `invisible` 类
2. **触发时机**：页面加载完成后添加动画类
3. **持续时间**：统一使用 `1s`
4. **缓动函数**：统一使用 `ease-out`

---

## 组件规范

### 文章卡片

```scss
.post-container {
  margin: 0 0 20px 0;
  font-weight: normal;
}

.post-title {
  font-size: 24px;
  font-weight: bold;
  margin: 3px 0;
}

.post-meta {
  font-size: 16px;
  margin: 10px 0;
  
  .meta-item {
    margin: 0 10px 0 0;
  }
}

.post-abstract {
  font-size: 18px;
}
```

### 导航菜单

```scss
.site-title-links {
  font-weight: bold;
  padding: 60px 0;
  position: fixed;
  bottom: 20px;
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  ul li {
    display: block;
    margin: 5px 0;
    font-size: 18px;
  }
}
```

### 社交图标

```scss
.soc {
  margin: 0 5px 0 0;
  font-size: 18px !important;
  
  a {
    border-bottom: solid transparent 2px;
    
    &:hover {
      color: darken($foregroundColor, 10%) !important;
      background-color: transparent !important;
      border-bottom: none;
    }
  }
}
```

### 页脚

```scss
footer {
  margin-top: 10px;
  padding-top: 0;
  font-size: 12px;
  font-weight: bold;
  
  * {
    margin: 0;
  }
}
```

---

## 响应式设计

### 断点定义

#### 使用 Tailwind 响应式断点

```vue
<!-- 使用 Tailwind 响应式类 -->
<div class="w-full md:w-3/4 lg:w-2/3">
<div class="hidden md:block">
<div class="text-sm md:text-base lg:text-lg">
```

**Tailwind 默认断点：**
- `sm:` - 640px 及以上
- `md:` - 768px 及以上
- `lg:` - 1024px 及以上
- `xl:` - 1280px 及以上
- `2xl:` - 1536px 及以上

#### 自定义断点（SCSS）

```scss
// 移动端断点
@media (max-width: 768px) {
  // 移动端样式
}

// 小屏幕高度
@media only screen and (max-height: 860px) {
  // 小屏幕高度样式
}

// 极低高度
@media only screen and (max-height: 600px) {
  // 极低高度样式
}
```

### 移动端适配规则

1. **布局变化**：
   - 侧边栏从固定定位改为相对定位
   - 垂直文本改为水平文本
   - 左右分栏改为上下堆叠

2. **字号调整**：
   - 各标题字号相应减小
   - 正文保持 16px

3. **间距调整**：
   - 内边距减小（从 80px 到 20-30px）
   - 移除固定定位元素

```scss
@media (max-width: 768px) {
  .site-title {
    border-left: none;        // 移除左侧边框
    text-align: center;       // 居中对齐
  }
  
  .vertical-text {
    writing-mode: horizontal-tb;  // 改为水平排版
  }
  
  .side-container {
    position: relative;       // 改为相对定位
    height: auto;             // 高度自适应
  }
  
  .main-container {
    padding: 20px 30px;       // 减小内边距
  }
}
```

---

## 代码实现示例

### CSS/SCSS 基础结构

```scss
// 变量定义
$backgroundColor: #ffffff;
$foregroundColor: #2e405b;
$fontList: "Source Sans Pro", "Roboto", sans-serif;
$titleFontList: "Source Han Serif CN", serif;

// 基础样式
html, body {
  font-family: $fontList;
  color: $foregroundColor;
  font-size: 18px;
  line-height: 1.5em;
  background: $backgroundColor;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// 链接样式
a {
  color: $foregroundColor;
  border-bottom: solid $foregroundColor 2px;
  transition: color 0.3s ease, background-color 0.3s ease;
  
  &:hover {
    color: $backgroundColor !important;
    background-color: $foregroundColor;
    border-bottom: solid transparent 2px;
  }
}
```

### Vue 组件示例

```vue
<template>
  <div class="typography-layout">
    <!-- 侧边栏 -->
    <aside class="side-container">
      <div class="vertical-text site-title">
        <h3 class="site-title-small">{{ subtitle }}</h3>
        <h1 class="site-title-large">{{ title }}</h1>
      </div>
      <nav class="site-title-links">
        <!-- 导航链接 -->
      </nav>
    </aside>
    
    <!-- 主内容区 -->
    <main class="main-container">
      <article class="post-container">
        <h2 class="post-title">{{ postTitle }}</h2>
        <div class="post-meta">
          <span class="meta-item">{{ date }}</span>
        </div>
        <div class="post-abstract">
          {{ content }}
        </div>
      </article>
    </main>
  </div>
</template>

<style lang="scss">
// 导入 Typography 样式变量和规则
@import './typography-variables.scss';
@import './typography-styles.scss';
</style>
```

### React 组件示例

```jsx
import React from 'react';
import './TypographyStyle.scss';

const TypographyLayout = ({ title, subtitle, children }) => {
  return (
    <div className="typography-layout">
      <aside className="side-container">
        <div className="vertical-text site-title">
          <h3 className="site-title-small">{subtitle}</h3>
          <h1 className="site-title-large">{title}</h1>
        </div>
      </aside>
      
      <main className="main-container">
        {children}
      </main>
    </div>
  );
};

export default TypographyLayout;
```

---

## 设计原则总结

### 核心原则

1. **极简至上**：去除所有不必要的装饰元素
2. **排版优先**：通过精心设计的字体和间距传达美感
3. **高对比度**：确保文字在任何背景下都清晰可读
4. **优雅交互**：平滑的过渡动画和清晰的状态反馈
5. **内容为王**：所有设计都为内容服务

### 实现建议

1. **使用 SCSS 变量**：便于主题切换和维护
2. **模块化样式**：将样式拆分为独立模块
3. **响应式优先**：从移动端开始设计，逐步增强
4. **性能优化**：使用系统字体，减少外部资源加载
5. **可访问性**：确保足够的对比度和清晰的状态反馈

---

## 快速参考

### 颜色值

```scss
// 浅色主题
$bg-light: #ffffff;
$fg-light: #2e405b;

// 深色主题
$bg-dark: #2e405b;
$fg-dark: #ffffff;
```

### 字号速查

```
h1: 42px    h4: 24px    body: 18px
h2: 36px    h5: 18px    meta: 16px
h3: 30px    h6: 14px    footer: 12px
```

### 间距规范

```
侧边栏内边距: 80px 20px
主内容区内边距: 80px 40px
文章间距: 20px
链接边框: 2px
```

### 动画时长

```
过渡动画: 0.3s
悬停效果: 0.8s
淡入动画: 1s
```

---

**文档版本**: v1.0  
**最后更新**: 2025-01-XX  
**参考来源**: hexo-theme-typography by SumiMakito

