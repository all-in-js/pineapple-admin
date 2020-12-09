<template>
  <div class="si-install-code highlight highlight-source-shell">
    <simple-icon
      class="si-install-copy-bar"
      size="14px"
      name="icon-copy1"
      @click="copyInstall"></simple-icon>
    <div :class="['si-copy-tip', state.showCopyTip ? 'show' : '']">已复制</div>
    <pre style="width: 100%;">{{ state.installTxt }}</pre>
  </div>
</template>
<script>
import { reactive } from 'vue';
import SimpleIcon from '/@/components/simple-icon.vue';
import { copyToClipboard } from '/@/utils/index.js'

export default {
  components: {
    SimpleIcon
  },
  setup() {
    const state = reactive({
      showCopyTip: false,
      installTxt: 'npm i @megvii-icons/vue-svg-icons --registry https://npm-registry.megvii-inc.com',
    });

    const copyInstall = () => {
      copyToClipboard(state.installTxt);
      state.showCopyTip = true;
      setTimeout(() => {
        state.showCopyTip = false;
      }, 700);
    }

    return {
      state,
      copyInstall
    }
  }
}
</script>
<style lang="scss">
.si-install-code {
  &:hover {
    .si-install-copy-bar {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
.si-copy-tip {
  position: absolute;
  left: 607px;
  top: -19px;
  font-size: 12px;
  color: rgb(16, 103, 209);
  transform: translateY(-5px);
  opacity: 0;
  &.show {
    animation: fade-down .7s;
  }
}
.si-install-copy-bar {
  position: absolute;
  top: 4px;
  left: 620px;
  color: #777;
  cursor: pointer;
  opacity: 0;
  transition: all .35s;
  transform: translateY(-2px);
  &:hover {
    color: rgb(16, 103, 209);
  }
  &:active {
    transform: scale(1.2)!important;
  }
}
</style>