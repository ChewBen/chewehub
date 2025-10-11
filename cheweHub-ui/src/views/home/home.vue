<template>
  <el-container class="home-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="nav-left">
        <span class="nav-item">LIBRARY</span>
        <span class="nav-item">AUTHORS</span>
        <span class="nav-item">ABOUT</span>
      </div>
      <div class="logo">COMICNEST</div>
      <div class="nav-right">
        <span class="nav-item">SEARCH</span>
        <span class="nav-item">AI-ADVISOR</span>
        <span class="nav-item">PROFILE</span>
      </div>
    </el-header>

    <!-- 主体内容 -->
    <el-main>
      <div class="card-slider">
        <div
            v-for="(item, idx) in comics"
            :key="item.id"
            class="comic-card "
            :style="{ left: `${idx * 60}px`, zIndex: comics.length - idx }"
        >
          <div class="card-index">{{ idx + 1 < 10 ? '0' + (idx + 1) : idx + 1 }}</div>
          <img :src="item.cover" class="cover-img"/>
        </div>
      </div>

      <!-- 添加一个测试区域来验证 Tailwind 样式 -->
      <div class="mt-8   bg-blue-100 rounded-lg">
        <h2 class="text-2xl font-bold text-red-400 mb-4">Tailwind CSS 测试</h2>
        <p class="text-gray-700 mb-4">如果你能看到这个蓝色背景的卡片，说明 Tailwind CSS 已经正常工作！</p>
        <button class="bg-blue-500 hover:bg-blue-700 text-red-400 font-bold py-2 px-4 rounded">
          测试按钮
        </button>
      </div>
    </el-main>
    <!-- 底部栏 -->
    <el-footer class="footer">
      <div class="footer-left">
        <span class="">POWERED BY BC</span>
        <span>|</span>
        <span>TERMS</span>
      </div>
      <div class="footer-right">
        <span>TIKTOK</span>
        <span>FACEBOOK</span>
        <span>INSTAGRAM</span>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      comics: [
        {id: 1, cover: 'https://example.com/cover1.jpg'},
        {id: 2, cover: 'https://example.com/cover2.jpg'},
        // ...补充更多图片
      ]
    }
  },
  components: {},
  mounted() {
  }
}
</script>

<style lang="scss">
.home-container {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  border-bottom: 1px solid #eee;

  .nav-left, .nav-right {
    display: flex;
    gap: 24px;

    .nav-item {
      font-weight: bold;
      cursor: pointer;
    }
  }

  .logo {
    font-size: 28px;
    letter-spacing: 4px;
    text-align: center;
    flex: 1;
  }
}

.card-slider {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin: 40px 0;
  position: relative;
  height: 400px;

  .comic-card {
    position: absolute;
    transition: all 0.3s;
    width: 220px;
    height: 320px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    overflow: hidden;

    .card-index {
      position: absolute;
      top: 0;
      left: 0;
      background: #f5f5f5;
      color: #888;
      font-size: 16px;
      padding: 4px 12px;
      border-bottom-right-radius: 8px;
    }

    .cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  border-top: 1px solid #eee;

  .footer-left, .footer-right {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: #888;
  }
}
</style>
