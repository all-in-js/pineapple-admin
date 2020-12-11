<template>
  <div class="nav">
    <div class="logo-info">
      <router-link
        class="site-title"
        to="/">svg-icons</router-link>
      <a href="/">v2.0.1</a>
    </div>
    <div class="nav-items">
      <div class="nav-item">
        <simple-icon name="icon-doc_a"></simple-icon>
        使用文档
      </div>
      <div class="nav-item">
        <simple-icon name="icon-history"></simple-icon>
        历史记录
      </div>
      <div class="nav-item">
        <simple-icon name="icon-gitlab"></simple-icon>
        gitlab
      </div>
      <div class="nav-item">
        <span>EN</span>/<span>ZH</span>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleIcon from '/@/components/simple-icon.vue';

export default {
  components: {
    SimpleIcon
  }
};
</script>
<style lang="scss" scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  line-height: 50px;
  padding: 0 0 0 15px;
  border-bottom: 1px solid #eee;
}
.logo-info {
  .site-title {
    font-size: 18px;
    margin-right: 5px;
    color: unset;
    font-weight: bold;
    text-decoration: none;
  }
}
.nav-items {
  display: flex;
  .nav-item {
    color: #666;
    margin: 15px;
    cursor: pointer;
    &:hover {
      color: #0366d6;
    }
  }
}
.iconfont {
  vertical-align: top;
  color: #9d9ea2;
  margin-right: 3px;
}
</style>